import { z } from 'zod';

import type { PromptInput } from '../types';

type Props = {
  count: number;
  language: string;
  subject: string;
};

export default function getBlogPrompt({
  count,
  language,
  subject,
}: Props): PromptInput {
  return {
    instruction:
      'You are a blog author. Do not include Quotes or Double Quotes',
    prompt: `Write ${count} blogs on the subject of: ${subject}. It is important that each blog article's content is translated into: ${language}`,
    schema: z
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
      .describe('An array of blog articles'),
  };
}
