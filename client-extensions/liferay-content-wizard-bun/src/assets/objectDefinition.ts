import { z } from 'zod';

import type {
  HookContext,
  PromptInput,
  PromptPayload,
  RetrieveFirstItem,
} from '../types';
import { objectDefinitionSchema as schema } from '../schemas';
import Asset from './Asset';

type Schema = z.infer<typeof schema>;
type FieldType = RetrieveFirstItem<Schema['fields']>['type'];

export default class objectDefinition extends Asset {
  constructor(hookContext: HookContext, promptInput: PromptInput) {
    super(hookContext, promptInput, schema);
  }

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
        DBType: field.type,
        businessType: this.getBusinessType(field.type),
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
        system: true,
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
      status: {
        code: 0,
        label: 'approved',
        label_i18n: 'Approved',
      },
      system: false,
      titleObjectFieldName: 'provider',
    });
  }

  getPrompt({
    metadata: { availableLanguages },
    subject,
  }: PromptInput): PromptPayload {
    return {
      instruction:
        'You are a database administrator responsible for managing schemas for your company.',
      prompt: `Create a database structure on the subject of ${subject}. Do not include fields for 'Status', 'Create Date', 'Modified Date', 'Author', or 'ID' available languages: ${availableLanguages.join(
        ', '
      )}`,
      schema,
    };
  }
}
