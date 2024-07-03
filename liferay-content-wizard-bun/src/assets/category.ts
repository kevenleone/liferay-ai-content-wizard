import { z } from 'zod';

type CategoryPromptType = {
  count: number;
  description: string;
  childCategoryCount: number;
};

export default function categoryPrompt({
  count,
  description,
  childCategoryCount,
}: CategoryPromptType) {
  return {
    context: 'Generate a Content based on the data provided by the user',
    prompt: `You are a category manager responsible for listing the categories for your company. Create an array with ${count} categories, that provides the: ${description} with ${childCategoryCount} child categories related to this topic`,
    schema: z
      .array(
        z.object({
          childCategories: z.array(
            z.object({
              name: z.string().describe('The name of the child category'),
            })
          ),
          name: z.string().describe('The name of the category'),
        })
      )
      .describe('An array of categories'),
  };
}
