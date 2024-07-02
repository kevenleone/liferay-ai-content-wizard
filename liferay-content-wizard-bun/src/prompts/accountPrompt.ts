import { z } from 'zod';

import type { PromptInput } from '../types';

type AccountPromptType = {
  count: number;
  subject: string;
};

export default function getAccountPrompt({
  count,
  subject,
}: AccountPromptType): PromptInput {
  return {
    instruction:
      'You are an account manager responsible for listing the active acccounts for your company',
    prompt: `Create an array of ${count} business accounts, that provides the subject: ${subject}`,
    schema: z.array(
      z.object({
        description: z.string().describe('Business description'),
        name: z.string().describe('Name of the business'),
      })
    ),
  };
}
