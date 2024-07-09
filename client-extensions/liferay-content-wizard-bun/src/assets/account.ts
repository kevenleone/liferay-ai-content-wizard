import { z } from 'zod';

import type { HookContext, PromptInput, PromptPayload } from '../types';
import { accountSchema } from '../schemas';
import Asset from './Asset';

export default class Account extends Asset {
  constructor(hookContext: HookContext, promptInput: PromptInput) {
    super(hookContext, promptInput, accountSchema);
  }

  async createAccounts(
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

  getAccountPrompt(props: PromptInput): PromptPayload {
    return {
      instruction:
        'You are an account manager responsible for listing the active acccounts for your company',
      prompt: `Create an array of ${props.amount} business accounts, that provides the subject: ${props.subject}`,
      schema: accountSchema,
    };
  }
}
