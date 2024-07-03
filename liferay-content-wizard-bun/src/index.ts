import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import type { z } from 'zod';

import { LangChain } from './LangChain';
import env from './env';
import getPromptCategorization, { schema } from './prompts/categorization';
import getBlogPrompt from './prompts/blogPrompt';
import getAccountPrompt from './prompts/accountPrompt';
import getWarehousePrompt from './prompts/warehousePrompt';

const PORT = env.PORT;

new Elysia()
  .use(cors())
  .get('/settings', () => ({
    configured: false,
  }))
  .post(
    '/generate',
    async ({ body }) => {
      const { question } = body;

      const langChain = new LangChain('openai', {
        apiKey: env.OPENAI_KEY,
        modelName: 'gpt-3.5-turbo',
      });

      let structuredResponse;

      const categorizationPrompt = await getPromptCategorization(question);

      const categorization = (await langChain.getStructuredContent(
        categorizationPrompt
      )) as z.infer<typeof schema>;

      const { subject, amount: count } = categorization;

      switch (categorization.assetType) {
        case 'blog': {
          break;
        }
      }

      switch (categorization.assetType) {
        case 'accounts': {
          const accountPrompt = getAccountPrompt({ count, subject });

          structuredResponse = await langChain.getStructuredContent(
            accountPrompt
          );

          break;
        }

        case 'blog': {
          const blogPrompt = getBlogPrompt({
            count: categorization.amount,
            language: 'English',
            subject: categorization.subject,
          });

          structuredResponse = await langChain.getStructuredContent(blogPrompt);

          break;
        }

        case 'warehouse': {
          const warehousePrompt = getWarehousePrompt({
            count: categorization.amount,
            subject: categorization.subject,
          });

          structuredResponse = await langChain.getStructuredContent(
            warehousePrompt
          );

          break;
        }
      }

      return { categorization, structuredResponse };
    },
    {
      body: t.Object({
        question: t.String(),
      }),
    }
  )
  .listen(PORT, () => console.log(`Elysia is running on PORT ${PORT}`));
