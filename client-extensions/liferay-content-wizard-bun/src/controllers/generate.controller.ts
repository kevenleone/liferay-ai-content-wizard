import type { z } from 'zod';

import { LangChain } from '../LangChain';
import * as assets from '../assets';
import getPromptCategorization from '../assets/categorization';
import type { categorizationSchema } from '../schemas';
import type Asset from '../assets/Asset';
import liferayHeadless from '../services/apis';
import getLiferayInstance from '../services/liferay';

export default async function generate(body: any) {
  const langChain = new LangChain('google', {
    modelName: 'gemini-1.5-flash-001',
  });

  const { themeDisplay, files } = body;
  const categorizationPrompt = getPromptCategorization(body.question);
  const data = await langChain.getStructuredContent(categorizationPrompt);

  const categorization = data as z.infer<typeof categorizationSchema>;

  if (categorization.assetType === 'none') {
    return { message: 'Asset Type invalid' };
  }

  console.log({ body, categorization });

  const _Asset = (assets as any)[categorization.assetType];

  if (!_Asset) {
    throw new Error('Invalid asset type.');
  }

  const asset: Asset = new _Asset(
    {
      files,
      langChain,
      liferay: liferayHeadless(getLiferayInstance()),
      themeDisplay,
    },
    categorization
  );

  return asset.run();
}
