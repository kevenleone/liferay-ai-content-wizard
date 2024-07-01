import { z } from 'zod';

import type { PromptInput } from '../types';

type AccountPromptType = {
  count: number;
  topic: string;
};

export default function getAccountPrompt({
  count,
  topic,
}: AccountPromptType): PromptInput {
  return {
    instruction:
      'You are an account manager responsible for listing the active acccounts for your company',
    prompt: `Create an array of ${count} business accounts, that provides the subject: ${topic}`,
    schema: z.array(
      z.object({
        description: z.string().describe('Business description'),
        name: z.string().describe('Name of the business'),
      })
    ),
  };
}
