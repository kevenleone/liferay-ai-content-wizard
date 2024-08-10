import { Elysia } from 'elysia';

import { liferay } from '../../liferay';
import { LangChain, type Provider } from '../../../core/LangChain';

export const getSettingsStatus = new Elysia()
    .use(liferay)
    .get('/settings/status', async ({ liferay }) => {
        const settingsResponse = await liferay.getContentWizardSettings();
        const activeSetting = settingsResponse.items.find(
            ({ active }) => active
        );

        if (!activeSetting) {
            return {
                active: false,
            };
        }

        return {
            active: true,
            provider: LangChain.isProviderAllowed(
                activeSetting.provider.name as Provider
            ),
        };
    });
