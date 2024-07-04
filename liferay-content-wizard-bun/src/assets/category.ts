import { z } from 'zod';

import type {
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
} from '../types';

import { categorySchema } from '../schemas';

async function action(
  vocabulary: z.infer<typeof categorySchema>,
  { liferay, themeDisplay }: HookContext
) {
  const taxonomyVocabularyResponse = await liferay.createTaxonomyVocabulary(
    themeDisplay.scopeGroupId,
    {
      name: vocabulary.vocabularyName,
    }
  );

  const taxonomyVocabulary = await taxonomyVocabularyResponse.json<{
    id: number;
  }>();

  console.log('taxonomyVocabulary', taxonomyVocabulary);

  for (const category of vocabulary.categories) {
    const vocabularyCategoryResponse =
      await liferay.createTaxonomyVocabularyCategory(taxonomyVocabulary.id, {
        name: category.name,
      });

    const vocabularyCategory = await vocabularyCategoryResponse.json<{
      id: number;
    }>();

    console.log('vocabularyCategory', vocabularyCategory);

    for (const childCategory of category.childCategories) {
      await liferay.createTaxonomyCategory(vocabularyCategory.id, {
        name: childCategory.name,
        parentTaxonomyCategory: { id: vocabularyCategory.id },
      });
    }
  }
}

const getPrompt = ({ amount, subject }: PromptInput): PromptPayload => {
  return {
    instruction:
      'You are a category manager responsible for listing the categories for your company.',
    prompt: `Create a list of ${amount} categories about ${subject}`,
    schema: categorySchema,
  };
};

export default {
  actions: [action],
  prompt: getPrompt,
} as HookStructure;
