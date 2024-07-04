import { z } from 'zod';

import type {
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
} from '../types';
import { blogSchema } from '../schemas';

async function createBlog(
  blogs: z.infer<typeof blogSchema>,
  { liferay, themeDisplay }: HookContext
) {
  for (const blog of blogs) {
    console.log('Creating blog', blog);

    try {
      delete (blog as any).pictureDescription;

      await liferay.postBlog(themeDisplay.scopeGroupId, blog);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

const getBlogPrompt = ({ amount, subject }: PromptInput): PromptPayload => ({
  instruction: 'You are a blog author. Do not include Quotes or Double Quotes',
  prompt: `Write ${amount} blogs on the subject of: ${subject}. It is important that each blog article's content is translated into: English`,
  schema: blogSchema,
});

export default {
  actions: [createBlog],
  prompt: getBlogPrompt,
} as HookStructure;
