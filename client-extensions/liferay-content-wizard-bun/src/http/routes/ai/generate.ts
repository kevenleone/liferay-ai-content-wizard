import type { z } from 'zod';
import { Elysia, t } from 'elysia';

import { LangChain, type Provider } from '../../../core/LangChain';
import { liferay } from '../../liferay';
import * as assets from '../../../assets';
import getCategorizationPrompt from '../../../assets/categorization';
import type { categorizationSchema } from '../../../schemas';
import type Asset from '../../../assets/asset';
import SearchBuilder from '../../../core/SearchBuilder';
import { createJSON } from '../../../utils/addPage';



export const aiGenerate = new Elysia().use(liferay).post(
    '/ai/generate',
    async ({
        body: { files, question },
        liferay,
        logger,
        store,
        themeDisplay,
        wizardCredentials: { save: saveWizardCredentials },
    }) => {
        let { wizardCredentials } = store;

        if (!wizardCredentials.model) {
            const settingsResponse = await liferay.getContentWizardSettings(
                new URLSearchParams({
                    filter: SearchBuilder.eq('active', true),
                })
            );

            const [item] = settingsResponse.items;

            if (!item) {
                logger.error('Credentials not found');

                return {
                    output: 'Credentials not found',
                };
            }

            wizardCredentials = saveWizardCredentials({
                active: item.active,
                apiKey: item.apiKey,
                id: item.id,
                imageModel: item.imageModel.name,
                model: item.model.name,
                provider: item.provider.key,
                settings: item.settings,
            });
        }

        const provider = wizardCredentials.provider as Provider;

        if (!LangChain.isProviderAllowed(provider)) {
            return {
                output: `Sorry, the provider ${JSON.stringify(
                    provider
                )} is not allowed.`,
            };
        }

        const langChain = new LangChain(provider, {
            modelName: wizardCredentials.model,
            apiKey: wizardCredentials.apiKey,
        });

        const categorization = (await langChain.getStructuredContent(
            getCategorizationPrompt(question)
        )) as z.infer<typeof categorizationSchema>;

        if (categorization.assetType === 'page') {
            return generateLayout("");
        }

        if (categorization.assetType === 'none') {
            logger.error('Invalid asset type.');

            return { output: 'Sorry, I did not understand that request.' };
        }

        logger.info(JSON.stringify(categorization, null, 2));

        const _Asset = (assets as any)[categorization.assetType];

        if (!_Asset) {
            logger.error('Invalid asset type.');

            return { output: 'Asset Type is invalid.' };
        }

        const asset: Asset = new _Asset(
            {
                logger,
                files,
                langChain,
                liferay,
                themeDisplay,
            },
            logger,
            categorization
        );

        return asset.run();
    },
    {
        body: t.Object({
            files: t.Any(),
            question: t.String(),
        }),
    }
);

async function generateLayout(image: string) {
	const langChain = new LangChain('google', {
		modelName: 'gemini-1.5-pro-001',
		temperature: 0,
		responseMimeType: 'application/json'
	});

	const content = await langChain.getImageDescription(image);

	await createJSON(content);

	return {output: 'Page generated!'};
}
