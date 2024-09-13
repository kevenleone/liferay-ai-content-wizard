import { z } from 'zod';

import type {
    HookContext,
    PromptInput,
    PromptPayload,
    RetrieveFirstItem,
} from '../utils/types';
import { objectDefinitionSchema as schema } from '../schemas';
import Asset from './asset';

type Schema = z.infer<typeof schema>;
type FieldType = RetrieveFirstItem<Schema['fields']>['type'];

export default class objectDefinition extends Asset {
    private getBusinessType(type: FieldType) {
        if (type === 'String') {
            return 'Text';
        }

        if (type === 'BigDecimal') {
            return 'PrecisionDecimal';
        }

        return type;
    }

    async action(objectDefinition: z.infer<typeof schema>) {
        await this.hookContext.liferay.createObjectDefinition({
            objectFields: objectDefinition.fields.map((field) => ({
                businessType: this.getBusinessType(field.type),
                DBType: field.type,
                indexed: false,
                indexedAsKeyword: false,
                indexedLanguageId: '',
                label: field.label,
                name: field.name,
                objectFieldSettings: [],
                readOnly: 'false',
                readOnlyConditionExpression: '',
                required: field.required,
                state: false,
                system: false,
                type: field.type,
                ...(field.type === 'DateTime' && {
                    objectFieldSettings: [
                        {
                            name: 'timeStorage',
                            value: 'convertToUTC',
                        },
                    ],
                }),
            })),
            accountEntryRestricted: false,
            active: true,
            defaultLanguageId: 'en_US',
            enableCategorization: true,
            enableComments: true,
            enableObjectEntryHistory: true,
            label: {
                en_US: objectDefinition.name,
            },
            name: objectDefinition.name,
            panelCategoryKey: 'applications_menu.applications.content',
            parameterRequired: false,
            pluralLabel: {
                en_US: objectDefinition.name,
            },
            portlet: true,
            scope: objectDefinition.scope,
            status: { label_i18n: 'Draft', code: 2, label: 'draft' },
            system: false,
            titleObjectFieldName: 'provider',
        });

        const sortedFields = objectDefinition.fields.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        const fields = sortedFields.map(
            (field) =>
                `<li><b>${field.label['en-US'] || field.name}</b> (${
                    field.type
                })</li>`
        );

        this.data.output = `Object Definition <b>${
            objectDefinition.name
        }</b> created as <b>Draft</b> with the following fields: 
    <ul class="mt-2">
    ${fields.join('')}
    </ul>`;
    }

    getPrompt({
        metadata: { availableLanguages },
        subject,
    }: PromptInput): PromptPayload {
        return {
            instruction:
                'You are a database administrator responsible for managing schemas for your company.',
            prompt: `Create a database structure on the subject of ${subject}. Do not include fields for 'Status', 'Create Date', 'Modified Date', 'Author', or 'ID'. Available languages are ${availableLanguages.join(
                ', '
            )}`,
            schema,
        };
    }
}
