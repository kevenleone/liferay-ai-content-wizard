import type { z } from 'zod';

import * as assets from '../assets';
import { LangChain } from '../LangChain';
import getPromptCategorization, { schema } from '../assets/categorization';
import { execHooks } from '../hooks/execWorkflow';

export default async function generate(body: any) {
  const langChain = new LangChain('vertexai', {
    modelName: 'gemini-1.5-flash-001',
  });

  const themeDisplay = body.themeDisplay;

  const categorizationPrompt = getPromptCategorization(body.question);
  const data = await langChain.getStructuredContent(categorizationPrompt);

  const categorization = data as z.infer<typeof schema>;

  console.info({ categorization });

  if (categorization.assetType === 'none') {
    return { message: 'Asset Type invalid' };
  }

  const hooks = (assets as any)[categorization.assetType];

  if (!hooks) {
    throw new Error('Invalid asset type.');
  }

  const response = await execHooks({
    categorization,
    hooks,
    langChain,
    themeDisplay,
  });

  return response;
}
