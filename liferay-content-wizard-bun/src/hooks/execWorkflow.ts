import type { z } from 'zod';

import type { schema } from '../assets/categorization';
import type { HookStructure } from '../types';
import type { LangChain } from '../LangChain';

import liferayHeadless from '../services/apis';
import getLiferayInstance from '../services/liferay';

type Props = {
  categorization: z.infer<typeof schema>;
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
      liferay: liferayHeadless(getLiferayInstance()),
      themeDisplay,
    });
  }

  return response;
}
