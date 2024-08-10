import { z } from 'zod';

import type { HookContext, PromptInput, PromptPayload } from '../utils/types';
import { organizationSchema } from '../schemas';
import Asset from './asset';

export default class OrganizationAsset extends Asset {
    async action(organizations: z.infer<typeof organizationSchema>) {
        for (const organization of organizations) {
            const organizationResponse =
                await this.hookContext.liferay.createOrganization({
                    name: organization.name,
                });

            const organizationName = await organizationResponse.json<{
                id: number;
            }>();

            this.logger.info('Organization name created', organizationName);

            for (const child of organization.childOrganizations) {
                const organizationResponse =
                    await this.hookContext.liferay.createOrganization({
                        name: child.name,
                        parentOrganization: {
                            id: organizationName.id,
                        },
                    });

                const _organization = await organizationResponse.json();

                this.logger.info('Organization created', _organization);
            }
        }
    }

    getPrompt({ amount, subject }: PromptInput): PromptPayload {
        return {
            instruction:
                'ou are an organization manager responsible for listing the business organizations for your company.',
            prompt: `Create a list of ${amount} expected organizations, child businesses, and departments for a company that provides ${subject}`,
            schema: organizationSchema,
        };
    }
}
