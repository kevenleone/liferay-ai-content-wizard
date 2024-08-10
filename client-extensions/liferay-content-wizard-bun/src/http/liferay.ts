import Elysia from 'elysia';

import getLiferayInstance from '../services/liferay';
import liferayHeadless from '../services/apis';
import logger from '../utils/logger';
import type { WizardSettingsPayload } from '../utils/types';

export const wizardCredentialsDefault = {
    active: false,
    apiKey: '',
    id: 0,
    imageModel: '',
    model: '',
    provider: '',
    settings: '',
};

export const liferay = new Elysia()
    .state('wizardCredentials', wizardCredentialsDefault)
    .derive(({ headers, store }) => ({
        liferay: liferayHeadless(
            getLiferayInstance(headers.authorization, headers.origin)
        ),
        logger: logger.child(logger.bindings, {
            msgPrefix: crypto.randomUUID() + ' ',
        }),
        themeDisplay: {
            languageId: headers['language-id'],
            scopeGroupId: headers['scope-group-id'],
        },
        wizardCredentials: {
            reset() {
                this.save(wizardCredentialsDefault);
            },
            save(wizardSettings: WizardSettingsPayload) {
                for (const key in wizardSettings) {
                    const typedKey = key as keyof WizardSettingsPayload;

                    (store.wizardCredentials as any)[typedKey] =
                        wizardSettings[typedKey];
                }

                return store.wizardCredentials;
            },
        },
    }));
