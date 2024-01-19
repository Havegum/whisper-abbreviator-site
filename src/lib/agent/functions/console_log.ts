import type { Function } from '.';
export default <Function>{
  schema: {
    name: 'console_log',
    description: 'RESTRICTED FUNCTION. DO NOT USE UNLESS EXPLICITLY TOLD',
    parameters: {
      type: 'object',
      properties: {
        string_to_log: {
          type: 'string',
          description:
            'The string to log. A partial response, or current best quess – you may reuse your response from the Thought action here. Whatever you input must be true and honest answer that represents your current thoughts about answering this question.',
        },
      },
    },
  },
  run(input: { string_to_log: string }): object {
    console.log(`[console.log]: ${input.string_to_log}`);
    return input;
  },
  requiresPermission: false,
  disabled: true,
};
