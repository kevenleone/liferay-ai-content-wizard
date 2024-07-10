import { z } from 'zod';

import type {
  HookContext,
  PromptInput,
  PromptPayload,
  RetrieveFirstItem,
} from '../types';
import { blogSchema, categorizationSchema } from '../schemas';
import Asset from './Asset';
import responseToBase64 from '../utils/ResponseToBase64';

type BlogsSchema = z.infer<typeof blogSchema>;

export default class BlogAsset extends Asset<BlogsSchema> {
  constructor(
    hookContext: HookContext,
    categorization: z.infer<typeof categorizationSchema>
  ) {
    super(hookContext, categorization, blogSchema);
  }

  async createBlog(blog: RetrieveFirstItem<z.infer<typeof blogSchema>>) {
    const formData = await this.hookContext.langChain.getGeneratedImage(
      blog.pictureDescription
    );

    delete (blog as any).pictureDescription;

    const blogImage = await this.hookContext.liferay.postBlogImage(
      this.hookContext.themeDisplay.scopeGroupId,
      formData
    );

    const blogImageJson = await (blogImage.json() as any);

    await this.hookContext.liferay.postBlog(
      this.hookContext.themeDisplay.scopeGroupId,
      {
        ...blog,
        image: { imageId: blogImageJson.id },
      }
    );
  }

  public async action(blogs: BlogsSchema) {
    await Promise.all(blogs.map((blog) => this.createBlog(blog)));
  }

  async getStructuredContentCustomCall() {
    const files = this.hookContext.files;

    if (files.length) {
      const file = files.at(0);
      const imageResponse = await this.hookContext.liferay.instance.get(
        file.value.replace('/', '')
      );

      const base64 = await responseToBase64(imageResponse);

      const prompt = await this.getPrompt(this.categorization);

      return this.hookContext.langChain.getImageContext(
        `${prompt.instruction} ${prompt.prompt}`,
        files.map((file) => ({ type: 'base64', content: base64 })),
        this.schema
      );
    }

    return super.getStructuredContentCustomCall(this.categorization);
  }

  getPrompt({ amount, subject }: PromptInput): PromptPayload {
    return {
      instruction:
        'You are a blog author. Do not include Quotes or Double Quotes',
      prompt: `Write ${amount} blogs on the subject of: ${subject}. It is important that each blog article's content is translated into: English`,
      schema: blogSchema,
    };
  }
}
