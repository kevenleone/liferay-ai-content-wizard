import { cors } from '@elysiajs/cors';
import { Elysia, t } from 'elysia';

import env from './env';
import generate from './controllers/generate.controller';

const PORT = env.PORT;

new Elysia()
  .use(cors({allowedHeaders: "*"}))
  .get('/settings', () => ({
    configured: true,
  }))
  .post('/generate', async ({ body }) => generate(body), {
    body: t.Object({
      files: t.Any(),
      themeDisplay: t.Any(),
      question: t.String(),
    }),
  })
  .listen(PORT, () => console.log(`Elysia is running on PORT ${PORT}`));
