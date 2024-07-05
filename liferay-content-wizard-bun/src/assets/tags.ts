import { z } from 'zod';

import type {
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
} from '../types';

import { tagSchema as schema } from '../schemas';

async function action(
  tags: z.infer<typeof schema>,
  { liferay, themeDisplay }: HookContext
) {
  for (const tag of tags) {
    console.log('Creating the tag', tag);
  }
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
