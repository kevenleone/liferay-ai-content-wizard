import { Elysia } from 'elysia';

import { liferay } from '../../liferay';

export const getSetting = new Elysia()
    .use(liferay)
    .get('/settings/:id', ({ liferay, params: { id } }) =>
        liferay.getContentWizardSetting(id)
    );
