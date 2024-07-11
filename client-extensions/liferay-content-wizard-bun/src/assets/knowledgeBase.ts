import { z } from 'zod';

import type { HookContext, PromptInput, PromptPayload } from '../types';
import { knowledgeBaseSchema } from '../schemas';
import Asset from './Asset';

export default class KnowledgeBase extends Asset {
  constructor(hookContext: HookContext, promptInput: PromptInput) {
    super(hookContext, promptInput, knowledgeBaseSchema);
  }

  async action(knowledgeBases: z.infer<typeof knowledgeBaseSchema>) {
    for (const knowledgeBase of knowledgeBases) {
      const knowledgeBaseFolderResponse =
        await this.hookContext.liferay.createKnowledgeBaseFolder(
          this.hookContext.themeDisplay.scopeGroupId,
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
        const knowledgeBaseResponse =
          await this.hookContext.liferay.createKnowledgeBase(
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

    this.data.output = `The following Knowledge Bases were created:`;

    this.data.output += knowledgeBases
      .map(
        (knowledgeBase) =>
          `<ul class="mt-2"><li class="font-weight-bold">${
            knowledgeBase.name
          }</li> <ol>${knowledgeBase.articles
            .map(({ title }) => `<li>${title}</li>`)
            .join('')}</ol></ul>`
      )
      .join('');
  }

  getPrompt({ amount, subject }: PromptInput): PromptPayload {
    return {
      instruction:
        'You are a knowledge base administrator responsible for managing the knowledge base for your company.',
      prompt: `Create a list of ${amount} knowledge base categories and articles on the subject of ${subject}`,
      schema: knowledgeBaseSchema,
    };
  }
}
