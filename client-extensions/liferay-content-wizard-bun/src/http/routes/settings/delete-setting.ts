import { Elysia } from 'elysia';

import { liferay } from '../../liferay';

export const deleteSetting = new Elysia()
    .use(liferay)
    .delete(
        '/settings/:id',
        async ({ liferay, logger, params, store, wizardCredentials }) => {
            const id = Number(params.id);
            const response = await liferay.deleteContentWizardSetting(id);

            if (!response.ok) {
                return;
            }

            logger.info(`Setting ${id} deleted`);

            if (id === store.wizardCredentials.id) {
                logger.info('Cleaning up credential stored');

                wizardCredentials.reset();
            }
        }
    );
