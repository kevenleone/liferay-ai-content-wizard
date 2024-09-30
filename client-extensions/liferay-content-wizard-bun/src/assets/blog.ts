import { z } from 'zod';

import type {
    PromptInput,
    PromptPayload,
    RetrieveFirstItem,
} from '../utils/types';
import { blogSchema } from '../schemas';
import Asset from './asset';
import responseToBase64 from '../utils/ResponseToBase64';

type BlogsSchema = z.infer<typeof blogSchema>;

export default class BlogAsset extends Asset<BlogsSchema> {
    async createBlog(blog: RetrieveFirstItem<z.infer<typeof blogSchema>>) {
        if (this.hookContext.langChain.imageGenerationEnabled()) {
            const formData = await this.hookContext.langChain.getGeneratedImage(
                blog.pictureDescription
            );

            const blogImage = await this.hookContext.liferay.postBlogImage(
                this.hookContext.themeDisplay.scopeGroupId,
                formData
            );

            const blogImageJson = await (blogImage.json() as any);

            (blog as any).image = { imageId: blogImageJson.id };
        }

        delete (blog as any).pictureDescription;

        await this.hookContext.liferay.postBlog(
            this.hookContext.themeDisplay.scopeGroupId,
            blog
        );
    }

    public async action(blogs: BlogsSchema) {
        await Promise.all(blogs.map((blog) => this.createBlog(blog)));

        const sorted = blogs.sort((a, b) =>
            a.headline.localeCompare(b.headline)
        );
        const fields = sorted.map(({ headline }) => `<li>${headline}</li>`);

        this.data.output =
            blogs.length === 1
                ? `The Blog <b>${blogs.at(0)?.headline}</b> was created.`
                : `The following blogs were created: <ul class="mt-2">${fields.join(
                      ''
                  )}</ul>`;

        this.logger.info(fields, this.data.output);
    }

    async getStructuredContentCustomCall() {
        const files = this.hookContext.files;

        if (files.length) {
            const file = files.at(0);
            const imageResponse = await this.hookContext.liferay.instance.get(
                file.value.replace('/', '')
            );

            const base64 = await responseToBase64(imageResponse);

            const prompt = await this.getPrompt(this.promptInput);

            return this.hookContext.langChain.getImageContext(
                `${prompt.instruction} ${prompt.prompt}`,
                files.map((file) => ({ type: 'base64', content: base64 })),
                blogSchema
            );
        }

        const response =
            await this.hookContext.liferay.getTaxonomyCategoriesRanked(
                this.hookContext.themeDisplay.scopeGroupId
            );

        const {
            data: {
                taxonomyCategoriesRanked: { items: taxonomyCategories = [] },
            },
        } = await response.json<any>();

        const instruction = `You are a blog author and you have a list of TaxonomyCategories: ${JSON.stringify(
            taxonomyCategories
        )} that can be used as reference for taxonomyCategoryIds`;

        return super.getStructuredContentCustomCall({
            ...this.promptInput,
            instruction,
        } as PromptInput & { instruction?: string });
    }

    getPrompt({
        amount,
        instruction,
        subject,
    }: PromptInput & { instruction?: string }): PromptPayload {
        return {
            instruction:
                instruction ||
                'You are a blog author. Do not include Quotes or Double Quotes',
            prompt: `Write ${amount} blogs on the subject of: ${subject}. It is important that each blog article's content is translated into: English`,
            schema: blogSchema,
        };
    }
}
