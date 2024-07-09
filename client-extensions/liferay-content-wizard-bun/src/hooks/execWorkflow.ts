import type { z } from 'zod';

import type { HookStructure } from '../types';
import type { LangChain } from '../LangChain';

import liferayHeadless from '../services/apis';
import getLiferayInstance from '../services/liferay';
import type { categorizationSchema } from '../schemas';

type Props = {
  categorization: z.infer<typeof categorizationSchema>;
  langChain: LangChain;
  hooks: HookStructure;
  themeDisplay: any;
};

export async function execHooks({
  categorization,
  langChain,
  hooks,
  themeDisplay,
}: Props) {
  const response = {
    afterPromptCalls: [] as any[],
    beforePrompt: [] as any[],
    categorization,
    promptResponse: {},
    output: '',
  };

  for (const beforePromptCall of hooks.beforePromptCalls ?? []) {
    console.log('Executing Before Prompt Call', new Date());

    const result = await beforePromptCall();

    response.beforePrompt.push(result);
  }

  response.promptResponse = await langChain.getStructuredContent(
    hooks.prompt(categorization)
  );

  for (const afterPromptCall of hooks.afterPromptCalls ?? []) {
    console.log('Executing Before Prompt Call', new Date());

    const result = await afterPromptCall();

    response.afterPromptCalls = result;
  }

  for (const action of hooks.actions) {
    await action(response.promptResponse, {
      langChain,
      liferay: liferayHeadless(getLiferayInstance()),
      themeDisplay,
    });
  }

  let capitalizedAssetType =
    categorization.assetType.charAt(0).toUpperCase() +
    categorization.assetType.substring(1, categorization.assetType.length);

  if (categorization.amount !== 1) {
    capitalizedAssetType += 's';
  }

  response.output = `${capitalizedAssetType} generated with the following subject "${categorization.subject}"`;

  return response;
}
