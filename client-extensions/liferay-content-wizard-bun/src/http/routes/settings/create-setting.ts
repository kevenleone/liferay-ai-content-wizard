import Elysia from 'elysia';

import { liferay } from '../../liferay';
import type { WizardSettingsPayload } from '../../../utils/types';
import SearchBuilder from '../../../core/SearchBuilder';

export const createSetting = new Elysia()
  .use(liferay)
  .post(
    '/settings',
    async ({ body: _body, liferay, logger, wizardCredentials }) => {
      const body = _body as WizardSettingsPayload;

      logger.info('Saving Settings ' + JSON.stringify(body, null, 2));

      const response = await liferay.postContentWizardSettings(body);

      if (body.active) {
        /**
         * @description retrieve all the settings created
         * and deactivate the ones that are active, expect the one created now
         */
        const settingsPage = await liferay.getContentWizardSettings(
          new URLSearchParams({
            filter: new SearchBuilder()
              .eq('active', true)
              .and()
              .ne('id', response.id)
              .build(),
          })
        );

        for (const item of settingsPage.items) {
          await liferay.patchContentWizardSettings(item.id, { active: false });

          logger.info(
            `Deactivation of ${item.provider.name} Provider with ID: ${item.id}`
          );
        }
      }

      wizardCredentials.save({
        ...body,
        id: response.id,
        imageModel: response.imageModel.name,
        model: response.model.name,
      } as WizardSettingsPayload);
    }
  );
