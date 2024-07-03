import type { z } from 'zod';

import type { schema } from '../assets/categorization';
import type { HookStructure } from '../types';

export async function execHooks(
  categorization: z.infer<typeof schema>,
  hooks: HookStructure
) {
  const response = {
    afterPromptCalls: [] as any[],
    beforePrompt: [] as any[],
    categorization,
    promptResponse: {},
  };

  console.log('Executing hooks', new Date());

  for (const beforePromptCall of hooks.beforePromptCalls ?? []) {
    const result = await beforePromptCall();

    response.beforePrompt.push(result);
  }

  response.promptResponse = await hooks.prompt(categorization);

  for (const afterPromptCall of hooks.afterPromptCalls ?? []) {
    const result = await afterPromptCall();

    response.afterPromptCalls = result;
  }

  console.log('Here...');

  for (const action of hooks.actions) {
    await action(response);
  }

  return response;
}

export default async function execWorkflow(
  categorization: z.infer<typeof schema>,
  ...actions: any[]
) {
  let response = categorization as any;

  for (const action of actions) {
    response = await action(response);
  }

  return response;
}
