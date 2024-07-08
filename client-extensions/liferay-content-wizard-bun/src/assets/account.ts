import { z } from 'zod';

import type {
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
} from '../types';
import { accountSchema } from '../schemas';

async function createAccounts(
  accounts: z.infer<typeof accountSchema>,
  { liferay }: HookContext
) {
  for (const account of accounts) {
    console.log(`Creating Account: ${account.name}`);

    await liferay.postAccount({
      description: account.description,
      externalReferenceCode: `${account.name
        .toUpperCase()
        .replaceAll(' ', '-')}-${new Date().getTime()}`,
      name: account.name,
      type: account.type,
    });
  }
}

const getAccountPrompt = (props: PromptInput): PromptPayload => ({
  instruction:
    'You are an account manager responsible for listing the active acccounts for your company',
  prompt: `Create an array of ${props.amount} business accounts, that provides the subject: ${props.subject}`,
  schema: accountSchema,
});

export default {
  actions: [createAccounts],
  afterPromptCalls: [],
  beforePromptCalls: [],
  prompt: getAccountPrompt,
} as HookStructure;
