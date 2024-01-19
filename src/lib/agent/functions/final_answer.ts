import type { Function } from '.';
export default <Function>{
  schema: {
    name: 'final_answer',
    description:
      'This function is used to provide the final answer to the original query. When calling this function, do not include supplementary text other than as arguments for this function call.',
    parameters: {
      type: 'object',
      properties: {
        answer: {
          type: 'string',
          description:
            'The final answer to the original question. All text must be written in Norwegian.',
        },
      },
    },
  },

  run(input: object): object {
    return input;
  },

  requiresPermission: false,
};
