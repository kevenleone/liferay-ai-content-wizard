import { z } from 'zod';

import type { APIResponse, PromptInput, PromptPayload } from '../utils/types';

import { tagSchema as schema } from '../schemas';
import SearchBuilder from '../core/SearchBuilder';
import Asset from './asset';

export default class TagAsset extends Asset {
    async action(tags: z.infer<typeof schema>) {
        const keywordResponse = await this.hookContext.liferay.getKeywords(
            this.hookContext.themeDisplay.scopeGroupId,
            new URLSearchParams({
                filter: SearchBuilder.in(
                    'name',
                    tags.map(({ name }) => name)
                ),
            })
        );

        const keywordPage = await keywordResponse.json<APIResponse>();
        const keywords = keywordPage.items.map(({ name }) => name);

        const filteredTags = tags.filter(
            ({ name }) => !keywords.includes(name.toLowerCase())
        );

        await Promise.all(
            filteredTags.map((tag) =>
                this.hookContext.liferay.createKeyword(
                    this.hookContext.themeDisplay.scopeGroupId,
                    tag.name.toLowerCase()
                )
            )
        );
    }

    getPrompt({ amount, subject }: PromptInput): PromptPayload {
        return {
            instruction:
                'You are a system administrator responsible for creating tags for your company.',
            prompt: `Create a list of ${amount} tags about ${subject}`,
            schema,
        };
    }
}
