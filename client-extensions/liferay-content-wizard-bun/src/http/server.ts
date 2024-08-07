import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';

import { aiGenerate } from './routes/ai/generate';
import { createSetting } from './routes/settings/create-setting';
import { deleteSetting } from './routes/settings/delete-setting';
import { getSettings } from './routes/settings/get-settings';
import env from '../utils/env';
import logger from '../utils/logger';

new Elysia()
  .onError(({ code, error }) => console.log(code, error))
  .use(cors({ allowedHeaders: '*' }))
  .use(aiGenerate)
  .use(createSetting)
  .use(deleteSetting)
  .use(getSettings)
  .listen(env.PORT, () =>
    logger.info(
      `Liferay Content Wizard | Elysia is running on PORT ${env.PORT}`
    )
  );
