import { z } from 'zod';

import type { PromptInput, PromptPayload } from '../utils/types';
import { accountSchema as schema } from '../schemas';
import Asset from './asset';

export default class Account extends Asset {
    async action(accounts: z.infer<typeof schema>) {
        for (const account of accounts) {
            this.logger.info(`Creating Account: ${account.name}`);

            await this.hookContext.liferay.postAccount({
                description: account.description,
                externalReferenceCode: `${account.name
                    .toUpperCase()
                    .replaceAll(' ', '-')}-${new Date().getTime()}`,
                name: account.name,
                type: account.type,
            });
        }
    }

    getPrompt(props: PromptInput): PromptPayload {
        return {
            instruction:
                'You are a system administrator responsible for creating tags for your company',
            prompt: `Create a list of ${props.amount} accounts, about: ${props.subject}`,
            schema,
        };
    }
}
