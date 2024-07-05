import { z } from 'zod';

import type {
  APIResponse,
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
} from '../types';

import { tagSchema as schema } from '../schemas';
import SearchBuilder from '../core/SearchBuilder';

async function action(
  tags: z.infer<typeof schema>,
  { liferay, themeDisplay }: HookContext
) {
  const keywordResponse = await liferay.getKeywords(
    themeDisplay.scopeGroupId,
    new URLSearchParams({
      filter: SearchBuilder.in(
        'name',
        tags.map(({ name }) => name)
      ),
    })
  );

  const keywordPage = await keywordResponse.json<APIResponse>();
  const keywords = keywordPage.items.map(({ name }) => name);

  console.log({ keywords });

  const filteredTags = tags.filter(({ name }) => !keywords.includes(name));

  console.log({ filteredTags });

  await Promise.all(
    filteredTags.map((tag) =>
      liferay.createKeyword(themeDisplay.scopeGroupId, tag.name)
    )
  );
}

const getPrompt = ({ amount, subject }: PromptInput): PromptPayload => {
  return {
    instruction:
      'You are a system administrator responsible for creating tags for your company.',
    prompt: `Create a list of ${amount} tags about ${subject}`,
    schema,
  };
};

export default {
  actions: [action],
  prompt: getPrompt,
} as HookStructure;
