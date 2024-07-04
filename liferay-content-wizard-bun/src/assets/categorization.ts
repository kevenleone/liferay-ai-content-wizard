import type { PromptPayload } from '../types';
import { categorizationSchema } from '../schemas';

export default function getPromptCategorization(
  prompt: string
): PromptPayload<typeof categorizationSchema> {
  return {
    instruction:
      'You will be responsible to categorize the user input and parse the question based on the given schema',
    prompt,
    schema: categorizationSchema,
  };
}
