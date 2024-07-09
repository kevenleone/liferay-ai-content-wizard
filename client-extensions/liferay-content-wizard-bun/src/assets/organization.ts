import { z } from 'zod';

import type {
  HookContext,
  HookStructure,
  PromptInput,
  PromptPayload,
} from '../types';
import { organizationSchema } from '../schemas';

async function action(
  organizations: z.infer<typeof organizationSchema>,
  { liferay, themeDisplay }: HookContext
) {
  for (const organization of organizations) {
    const organizationResponse = await liferay.createOrganization({
      name: organization.name,
    });

    const organizationName = await organizationResponse.json<{
      id: number;
    }>();

    console.log('Organization name created', organizationName);

    for (const child of organization.childOrganizations) {
      const organizationResponse = await liferay.createOrganization({
        name: child.name,
        parentOrganization: {
          id: organizationName.id,
        },
      });

      const _organization = await organizationResponse.json();

      console.log('Organization created', _organization);
    }
  }
}

const getPrompt = ({ amount, subject }: PromptInput): PromptPayload => ({
  instruction:
    'ou are an organization manager responsible for listing the business organizations for your company.',
  prompt: `Create a list of ${amount} expected organizations, child businesses, and departments for a company that provides ${subject}`,
  schema: organizationSchema,
});

export default {
  actions: [action],
  prompt: getPrompt,
} as HookStructure;
