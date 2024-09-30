import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';

import { aiGenerate } from './routes/ai/generate';
import { saveSetting } from './routes/settings/save-setting';
import { deleteSetting } from './routes/settings/delete-setting';
import { getSetting } from './routes/settings/get-setting';
import { getSettings } from './routes/settings/get-settings';
import { getSettingsStatus } from './routes/settings/get-settings-status';
import env from '../utils/env';
import logger from '../utils/logger';

new Elysia()
    .onError(({ code, error }) => console.log(code, error))
    .use(cors({ allowedHeaders: '*' }))
    .use(aiGenerate)
    .use(deleteSetting)
    .use(getSetting)
    .use(getSettings)
    .use(getSettingsStatus)
    .use(saveSetting)
    .get('/ready', () => 'Server running')
    .listen(env.PORT, () =>
        logger.info(
            `Liferay Content Wizard | Elysia is running on PORT ${env.PORT}`
        )
    );
