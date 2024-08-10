import { Elysia } from 'elysia';

import { liferay } from '../../liferay';

export const getSettings = new Elysia()
    .use(liferay)
    .get('/settings', async ({ liferay }) =>
        liferay.getContentWizardSettings()
    );
