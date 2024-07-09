import { z } from 'zod';

import type {
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
  RetrieveFirstItem,
} from '../types';
import { blogSchema } from '../schemas';

async function createBlog(
  blog: RetrieveFirstItem<z.infer<typeof blogSchema>>,
  { langChain, liferay, themeDisplay }: HookContext
) {
  const formData = await langChain.getGeneratedImage(blog.pictureDescription);

  delete (blog as any).pictureDescription;

  const blogImage = await liferay.postBlogImage(
    themeDisplay.scopeGroupId,
    formData
  );
  const blogImageJson = await (blogImage.json() as any);

  await liferay.postBlog(themeDisplay.scopeGroupId, {
    ...blog,
    image: { imageId: blogImageJson.id },
  });
}

async function action(blogs: z.infer<typeof blogSchema>, options: HookContext) {
  await Promise.all(blogs.map((blog) => createBlog(blog, options)));
}

const getBlogPrompt = ({ amount, subject }: PromptInput): PromptPayload => ({
  instruction: 'You are a blog author. Do not include Quotes or Double Quotes',
  prompt: `Write ${amount} blogs on the subject of: ${subject}. It is important that each blog article's content is translated into: English`,
  schema: blogSchema,
});

export default {
  actions: [action],
  prompt: getBlogPrompt,
} as HookStructure;
