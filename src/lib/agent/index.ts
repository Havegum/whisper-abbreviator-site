import type { WebSocket } from 'ws';
import functions, { type Function } from './functions';
export { functions };
import { nanoid } from 'nanoid';
import format from 'string-template';

import { OPENAI_API_KEY } from '$env/static/private';
import { encode } from 'gpt-3-encoder';
import systemPrompt from './prompts/system.txt?raw';
import functionDeniedPrompt from './prompts/function-denied.txt?raw';
import questionPromptTemplate from './prompts/prefix.txt?raw';
import formatReminderPrompt from './prompts/format-reminder.txt?raw';
import OpenAI from 'openai';

import { CommandType, type CommandPayload } from './types';
import type { ChatCompletionChunk } from 'openai/resources';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { from, lastValueFrom, scan, tap } from 'rxjs';
import { addRecursively } from './utils';

export type AgentMessage =
  | ChatCompletionChunk
  | { id: string; content: ChatCompletionMessageParam };

/**
 * # Agent
 * This is an agent that will be used for AI tasks.
 * It is modeled like an Reason + Act agent.
 *
 * It will take some input, send it to a large language
 * model, which will decide what to do next.
 *
 * Based on what tools it has available, it may
 * decide to use one of them, then go back to the
 * language model to decide what to do next.
 *
 * It will continue this process until it has
 * decided on a final answer.
 */
class Agent {
  private mustThink: boolean = true;
  private questionTemplate: string;
  private functions: Function[];
  private openai: OpenAI;
  private messages: ChatCompletionMessageParam[];
  private socket: WebSocket;

  constructor(functions: Function[], socket: WebSocket) {
    this.functions = functions;
    this.socket = socket;
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    this.messages = [];

    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: systemPrompt,
    };

    this.pushMessage(systemMessage);

    this.send({
      id: nanoid(),
      content: systemMessage,
    });

    this.send({
      id: nanoid(),
      content: {
        role: 'function-manifest',
        content: functions.map(fn => ({
          name: fn.schema.name,
          description: fn.schema.description,
        })),
      },
    });

    this.questionTemplate = questionPromptTemplate;
  }

  private send(message: AgentMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify(message), err =>
        err ? reject(err) : resolve(),
      );
    });
  }

  private pushMessage(message: ChatCompletionMessageParam): void {
    this.messages.push(message);
  }

  public async run(command: string, payload: unknown): Promise<void> {
    switch (command) {
      case 'think':
        return this.initiateThink(payload as string);
      case 'permission':
        return;
      default:
        console.log(`Unknown command ${command}`);
    }
  }

  public async initiateThink(question: string): Promise<void> {
    const prompt = this.formatQuestion(question);

    const promptMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: prompt,
    };
    this.pushMessage(promptMessage);
    this.send({ id: nanoid(), content: promptMessage });

    await this.think();
  }

  private getPrunedMessages() {
    console.log(
      'tokens:',
      encode(
        this.messages
          .filter(d => d.role !== 'function')
          .map(message => message.content)
          .join('\n\n'),
      ).length,
    );

    return this.messages;
  }

  public async think(): Promise<void> {
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      messages: this.getPrunedMessages(),
      functions: this.functions.map(fn => fn.schema),
      function_call: this.mustThink ? 'none' : 'auto',
      stream: true,
    });

    const message = await lastValueFrom(
      from(stream).pipe(
        tap(part => this.send(part)),
        scan((acc: ChatCompletionChunk | null, next) => {
          if (acc === null) {
            return next;
          } else {
            acc.choices = addRecursively(acc.choices, next.choices);
            return acc;
          }
        }, null),
      ),
    );

    if (message === null) {
      throw new Error('Unexpected null message');
    }

    const choice = message.choices[0].delta as ChatCompletionMessageParam;
    if (choice.function_call !== undefined) {
      await this.handleFunctionCall(message.id, choice.function_call);
    } else {
      this.pushMessage(choice);
      this.mustThink = false;
      await this.think();
    }
  }

  private async requestPermission(
    id: string,
    functionCall: ChatCompletionMessageParam.FunctionCall,
  ): Promise<boolean> {
    this.send({
      id,
      choices: [{ update: { function_call: { permission: 'pending', id } } }],
    });

    const socket = this.socket;
    const permission: boolean = await new Promise(resolve => {
      function waitForPermissionResponse(message: string) {
        const data = JSON.parse(message);

        if (data.type === CommandType.Permission) {
          const p = data.payload as CommandPayload[CommandType.Permission];
          if (p.id === id) {
            resolve(p.granted);
            socket.off('message', waitForPermissionResponse);
          }
        }
      }

      socket.on('message', waitForPermissionResponse);
    });

    if (!permission) {
      // If permission is denied, first push the function call to the messages, and through the API.
      this.pushMessage({
        role: 'function',
        name: functionCall.name,
        content: '<Permission denied>',
      });

      this.send({
        id,
        choices: [{ update: { function_call: { permission: 'denied', id } } }],
      });

      // ... then add a message explaining that the function was denied.
      const deniedMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: functionDeniedPrompt,
      };
      this.pushMessage(deniedMessage);
      this.send({
        id: nanoid(),
        content: deniedMessage,
      });
    } else {
      this.send({
        id,
        choices: [{ update: { function_call: { permission: 'granted', id } } }],
      });
    }

    return permission;
  }

  private async handleFunctionCall(
    id: string,
    functionCall: ChatCompletionMessageParam.FunctionCall,
  ): Promise<void> {
    const fn = this.functions.find(fn => fn.schema.name === functionCall.name);

    if (fn === undefined) {
      throw new Error(`Unknown function ${functionCall.name}`);
    }

    this.pushMessage({
      role: 'assistant',
      function_call: functionCall,
      content: null,
    });

    const permission = fn.requiresPermission
      ? await this.requestPermission(id, functionCall)
      : true;

    if (permission) {
      const id = nanoid();
      this.send({
        id,
        // @ts-expect-error
        choices: [{ delta: { role: 'function', name: functionCall.name } }],
      });

      const args = JSON.parse(functionCall.arguments);
      const result = await fn.run(args);

      this.send({
        id,
        // @ts-expect-error
        choices: [{ update: { content: result }, finish_reason: 'stop' }],
      });

      this.pushMessage({
        role: 'function',
        name: functionCall.name,
        content: JSON.stringify(result),
      });

      this.mustThink = true;

      if (functionCall.name !== 'final_answer') {
        const formatReminderMessage: ChatCompletionMessageParam = {
          role: 'user',
          content: formatReminderPrompt,
        };
        this.pushMessage(formatReminderMessage);

        this.send({
          id: nanoid(),
          content: formatReminderMessage,
        });
      }
    }

    if (functionCall.name !== 'final_answer' || !permission) {
      await this.think();
    }
  }

  private formatQuestion(question: string): string {
    return format(this.questionTemplate, { question });
  }
}

export default Agent;
