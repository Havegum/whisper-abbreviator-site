const tools = import.meta.glob(['./*.ts', '!./*.test.ts', '!./index.ts'], {
  eager: true,
  import: 'default',
}) as Record<string, Function>;

import type { ChatCompletionCreateParams } from 'openai/resources';

export interface Function {
  schema: ChatCompletionCreateParams.Function;
  run: (input: object) => object | Promise<object>;
  requiresPermission: boolean;
  disabled?: boolean;
}

export default Object.values(tools).filter(tool => tool.disabled !== true);
