import { z } from 'zod';

import type { HookContext, PromptInput, PromptPayload } from '../types';
import { wikiSchema as schema } from '../schemas';
import Asset from './Asset';

export default class Wiki extends Asset {
  constructor(hookContext: HookContext, promptInput: PromptInput) {
    super(hookContext, promptInput, schema);
  }

  async action(wiki: z.infer<typeof schema>) {
    const wikiNodeResponse = await this.hookContext.liferay.createWikiNode(
      this.hookContext.themeDisplay.scopeGroupId,
      {
        name: wiki.name,
        viewableBy: wiki.viewableBy,
      }
    );

    const wikiNode = await wikiNodeResponse.json<{
      id: number;
    }>();

    for (const wikiPage of wiki.wikiPages) {
      const wikiPageResponse = await this.hookContext.liferay.createWikiPage(
        wikiNode.id,
        {
          content: `<p>${wikiPage.pageBody}</p>`,
          encodingFormat: 'text/html',
          headline: wikiPage.title,
          viewableBy: wiki.viewableBy,
        }
      );

      const _wikiPage = await wikiPageResponse.json<{ id: number }>();

      for (const childArticle of wikiPage.childArticles) {
        console.log({
          content: `<p>${childArticle.articleBody}</p>`,
          encondingFormat: 'text/html',
          headline: childArticle.title,
          parentWikiPageId: _wikiPage.id,
          viewableBy: wiki.viewableBy,
          wikiNodeId: wikiNode.id,
        });

        await this.hookContext.liferay.createChildWikiPage(_wikiPage.id, {
          content: `<p>${childArticle.articleBody}</p>`,
          encodingFormat: 'text/html',
          headline: childArticle.title,
          parentWikiPageId: _wikiPage.id,
          viewableBy: wiki.viewableBy,
          wikiNodeId: wikiNode.id,
        });
      }

      console.log('Wiki created', wiki.wikiPages);
    }
  }

  getPrompt({ amount, subject }: PromptInput): PromptPayload {
    return {
      instruction:
        'You are a wiki administrator responsible for managing the wiki for your company.',
      prompt: `Create a list of ${amount} wiki category pages and child articles on the subject of ${subject}`,
      schema,
    };
  }
}
