import { z } from 'zod';

export const accountSchema = z.array(
  z.object({
    type: z
      .enum(['business', 'supplier', 'person'])
      .describe(
        'The type of the account, business is for general public, suppliers are used for people that publishes products, person is a single user account, you can consider "business" value if the user not mention the account type'
      ),
    description: z.string().describe('Business description'),
    name: z.string().describe('Name of the business'),
  })
);

export const blogSchema = z
  .array(
    z.object({
      alternativeHeadline: z
        .string()
        .describe('A headline that is a summary of the blog'),
      articleBody: z.string().describe('The content of the blog article'),
      headline: z.string().describe('The title of the blog article'),
      pictureDescription: z
        .string()
        .describe(
          'A description of an appropriate image for this blog in three sentences.'
        ),
    })
  )
  .describe('An array of blog articles with the articleBody formatted as HTML');

export const categorySchema = z
  .object({
    categories: z
      .array(
        z.object({
          childCategories: z
            .array(
              z.object({
                name: z.string().describe('The name of the child category'),
              })
            )
            .describe('child categories'),
          name: z.string().describe('The name of the category'),
        })
      )
      .describe('An array of categories'),
    vocabularyName: z
      .string()
      .describe('The vocabulary name based on the title with few words.'),
  })
  .describe(
    'Vocabulary structure with the name and a list of categories and their child categories'
  );

export const categorizationSchema = z
  .object({
    amount: z
      .number()
      .describe(
        'The amount of items to be generated, the default value is 1, undetermined is -1'
      ),
    assetType: z
      .enum([
        'account',
        'blog',
        'category',
        'image',
        'knowledgeBase',
        'news',
        'none',
        'product',
        'user',
        'warehouse',
        'web content',
      ])
      .describe(
        `The user prompt is related to one of these options, if you dont know for sure the best qualified option, you can say "none", category can be known as "categories" and "asset categories"`
      ),
    subject: z.string().describe('The prompt subject'),
  })
  .describe('Prompt Description metadata');

export const knowledgeBaseSchema = z
  .array(
    z.object({
      articles: z.array(
        z.object({
          articleBody: z.string().describe('The knowledge base article body'),
          title: z.string().describe('Title of knowledge base article'),
        })
      ),
      name: z.string().describe('Name of the knowledge base category'),
      viewableBy: z
        .enum(['Anyone', 'Members', 'Owner'])
        .describe(
          'The Knowledge Base can be viewed by one of these options, consider anyone if not specified.'
        ),
    })
  )
  .describe('An array of knowledge base categories related to a given topic');
