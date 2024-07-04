import { z } from 'zod';

export const accountSchema = z.array(
  z.object({
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
      body: z.string().describe('The content of the blog article'),
      headline: z.string().describe('The title of the blog article'),
      pictureDescription: z
        .string()
        .describe(
          'A description of an appropriate image for this blog in three sentences.'
        ),
    })
  )
  .describe('An array of blog articles');
