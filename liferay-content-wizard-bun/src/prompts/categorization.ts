import { z } from 'zod';

import type { PromptInput } from '../types';

export const schema = z
  .object({
    amount: z
      .number()
      .describe(
        'How many items are expected from the user to be generated, default is 1'
      ),
    assetType: z
      .enum([
        'accounts',
        'blog',
        'images',
        'news',
        'none',
        'product',
        'users',
        'web content',
        'warehouse',
      ])
      .describe(
        'The user prompt is related to one of these options, if you dont know for sure the best qualified option, you can say "none"'
      ),
    subject: z.string().describe('The prompt subject'),
  })
  .describe('Prompt Description metadata');

export default function getPromptCategorization(
  prompt: string
): PromptInput<typeof schema> {
  return {
    instruction:
      'You will be responsible to categorize the user input and parse the question based on the given schema',
    prompt,
    schema,
  };
}
