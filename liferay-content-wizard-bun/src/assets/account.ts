import { z } from 'zod';

import type { HookStructure, PromptInput, PromptPayload } from '../types';

const schema = z.array(
  z.object({
    description: z.string().describe('Business description'),
    name: z.string().describe('Name of the business'),
  })
);

type Schema = z.infer<typeof schema>;

function createAccounts(accounts: Schema) {
  console.log({ accounts });
  for (const account of accounts) {
    console.log(`Creating Account: ${account.name}`);
  }
}

export default function getAccountPrompt({
  amount,
  subject,
}: PromptInput): PromptPayload {
  console.log('Here...', amount, subject);
  return {
    instruction:
      'You are an account manager responsible for listing the active acccounts for your company',
    prompt: `Create an array of ${amount} business accounts, that provides the subject: ${subject}`,
    schema,
  };
}

export const accountAsset: HookStructure = {
  prompt: getAccountPrompt,
  actions: [createAccounts],
  afterPromptCalls: [getAccountPrompt],
  beforePromptCalls: [],
};
