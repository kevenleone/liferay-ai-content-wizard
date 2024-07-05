import { z } from 'zod';

import type {
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
} from '../types';
import { wikiSchema as schema } from '../schemas';

async function action(
  wiki: z.infer<typeof schema>,
  { liferay, themeDisplay }: HookContext
) {
  const wikiNodeResponse = await liferay.createWikiNode(
    themeDisplay.scopeGroupId,
    {
      name: wiki.name,
      viewableBy: wiki.viewableBy,
    }
  );

  const wikiNode = await wikiNodeResponse.json<{
    id: number;
  }>();

  for (const wikiPage of wiki.wikiPages) {
    console.log('HEreee... 1111');

    const wikiPageResponse = await liferay.createWikiPage(wikiNode.id, {
      content: `<p>${wikiPage.pageBody}</p>`,
      encodingFormat: 'text/html',
      headline: wikiPage.title,
      viewableBy: wiki.viewableBy,
    });

    console.log('HEreee...');

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

      await liferay.createChildWikiPage(_wikiPage.id, {
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

const getPrompt = ({ amount, subject }: PromptInput): PromptPayload => ({
  instruction:
    'You are a wiki administrator responsible for managing the wiki for your company.',
  prompt: `Create a list of ${amount} wiki category pages and child articles on the subject of ${subject}`,
  schema,
});

export default {
  actions: [action],
  prompt: getPrompt,
} as HookStructure;
