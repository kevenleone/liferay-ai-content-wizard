import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import type { z } from 'zod';

import assets from './assets';
import { LangChain } from './LangChain';
import env from './env';
import getPromptCategorization, { schema } from './assets/categorization';
import getBlogPrompt from './assets/blog';
import getAccountPrompt from './assets/account';
import getWarehousePrompt from './assets/warehouse';
import execWorkflow, { execHooks } from './hooks/execWorkflow';

const PORT = env.PORT;

new Elysia()
  .use(cors())
  .get('/settings', () => ({
    configured: true,
  }))
  .post(
    '/generate',
    async ({ body }) => {
      const { question } = body;

      const langChain = new LangChain('openai', {
        apiKey: env.OPENAI_KEY,
        modelName: 'gpt-3.5-turbo',
      });

      const categorizationPrompt = await getPromptCategorization(question);

      const categorization = (await langChain.getStructuredContent(
        categorizationPrompt
      )) as z.infer<typeof schema>;

      if (categorization.assetType === 'none') {
        return { message: 'Asset Type invalid' };
      }

      const asset = (assets as any)[categorization.assetType];

      console.log('Here111');

      const response = await execHooks(categorization, asset);
      console.log('Here111222');

      return {
        response,
      };

      // const { subject, amount } = categorization;

      // switch (categorization.assetType) {
      //   case 'blog': {
      //     break;
      //   }
      // }

      // switch (categorization.assetType) {
      //   case 'accounts': {
      //     const accountPrompt = getAccountPrompt({ amount, subject });

      //     structuredResponse = await langChain.getStructuredContent(
      //       accountPrompt
      //     );

      //     break;
      //   }

      //   case 'blog': {
      //     const blogPrompt = getBlogPrompt({
      //       count: categorization.amount,
      //       language: 'English',
      //       subject: categorization.subject,
      //     });

      //     structuredResponse = await langChain.getStructuredContent(blogPrompt);

      //     break;
      //   }

      //   case 'warehouse': {
      //     const warehousePrompt = getWarehousePrompt({
      //       count: categorization.amount,
      //       subject: categorization.subject,
      //     });

      //     structuredResponse = await langChain.getStructuredContent(
      //       warehousePrompt
      //     );

      //     break;
      //   }
      // }

      // return { categorization, structuredResponse };
    },
    {
      body: t.Object({
        question: t.String(),
      }),
    }
  )
  .listen(PORT, () => console.log(`Elysia is running on PORT ${PORT}`));
