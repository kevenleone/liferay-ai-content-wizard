import { z } from 'zod';

import type { HookContext, PromptInput, PromptPayload } from '../types';

import { categorySchema } from '../schemas';
import Asset from './Asset';

export default class CategoryAsset extends Asset<
  z.infer<typeof categorySchema>
> {
  constructor(hookContext: HookContext, promptInput: PromptInput) {
    super(hookContext, promptInput, categorySchema);
  }

  async action(vocabulary: z.infer<typeof categorySchema>) {
    const taxonomyVocabularyResponse =
      await this.hookContext.liferay.createTaxonomyVocabulary(
        this.hookContext.themeDisplay.scopeGroupId,
        {
          name: vocabulary.name,
          name_i18n: vocabulary.name_i18n,
        }
      );

    const taxonomyVocabulary = await taxonomyVocabularyResponse.json<{
      id: number;
    }>();

    console.log('taxonomyVocabulary', taxonomyVocabulary);

    for (const category of vocabulary.categories) {
      const vocabularyCategoryResponse =
        await this.hookContext.liferay.createTaxonomyVocabularyCategory(
          taxonomyVocabulary.id,
          {
            name: category.name,
            name_i18n: category.name_i18n,
          }
        );

      const vocabularyCategory = await vocabularyCategoryResponse.json<{
        id: number;
      }>();

      console.log('vocabularyCategory', vocabularyCategory);

      for (const childCategory of category.childCategories) {
        await this.hookContext.liferay.createTaxonomyCategory(
          vocabularyCategory.id,
          {
            name: childCategory.name,
            name_i18n: childCategory.name_i18n,
            parentTaxonomyCategory: { id: vocabularyCategory.id },
          }
        );
      }
    }
  }

  getPrompt({
    amount,
    subject,
    metadata: { availableLanguages },
  }: PromptInput): PromptPayload {
    return {
      instruction:
        'You are a category manager responsible for listing the categories for your company.',
      prompt: `Create a list of ${amount} categories about ${subject}, available languages: ${availableLanguages.join(
        ', '
      )}`,
      schema: categorySchema,
    };
  }
}
