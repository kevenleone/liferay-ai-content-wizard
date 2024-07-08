import { z } from 'zod';

import type {
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
} from '../types';
import { knowledgeBaseSchema } from '../schemas';

async function action(
  knowledgeBases: z.infer<typeof knowledgeBaseSchema>,
  { liferay, themeDisplay }: HookContext
) {
  for (const knowledgeBase of knowledgeBases) {
    const knowledgeBaseFolderResponse = await liferay.createKnowledgeBaseFolder(
      themeDisplay.scopeGroupId,
      {
        name: knowledgeBase.name,
        viewableBy: knowledgeBase.viewableBy,
      }
    );

    const knowledgeBaseFolder = await knowledgeBaseFolderResponse.json<{
      id: number;
    }>();

    console.log('Knowledge Base folder created', knowledgeBaseFolder);

    for (const article of knowledgeBase.articles) {
      const knowledgeBaseResponse = await liferay.createKnowledgeBase(
        knowledgeBaseFolder.id,
        {
          ...article,
          viewableBy: knowledgeBase.viewableBy,
        }
      );

      const _knowledgeBase = await knowledgeBaseResponse.json();

      console.log('Knowledge Base created', _knowledgeBase);
    }
  }
}

const getPrompt = ({ amount, subject }: PromptInput): PromptPayload => ({
  instruction:
    'You are a knowledge base administrator responsible for managing the knowledge base for your company.',
  prompt: `Create a list of ${amount} knowledge base categories and articles on the subject of ${subject}`,
  schema: knowledgeBaseSchema,
});

export default {
  actions: [action],
  prompt: getPrompt,
} as HookStructure;
