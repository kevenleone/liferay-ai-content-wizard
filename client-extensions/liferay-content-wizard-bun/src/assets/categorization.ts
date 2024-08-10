import type { PromptPayload } from '../utils/types';
import { categorizationSchema } from '../schemas';

export default function getCategorizationPrompt(
    prompt: string
): PromptPayload<typeof categorizationSchema> {
    return {
        instruction:
            'You will be responsible to categorize the user input and parse the question based on the given schema, analyze correctly the amount of items the user wants to create',
        prompt,
        schema: categorizationSchema,
    };
}
