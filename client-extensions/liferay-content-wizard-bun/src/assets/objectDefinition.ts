import { z } from 'zod';

import type { HookContext, PromptInput, PromptPayload } from '../types';
import { objectDefinitionSchema as schema } from '../schemas';
import Asset from './Asset';

export default class objectDefinition extends Asset {
  constructor(hookContext: HookContext, promptInput: PromptInput) {
    super(hookContext, promptInput, schema);
  }

async action(objectDefinition: z.infer<typeof schema>) {

    const fields = [];

    for (const field of objectDefinition.fields) {
        fields.push({
            "DBType": "String", //field.type <- coming through as lowercase causing error
            "businessType": "Text",
            "indexed": false,
            "indexedAsKeyword": false,
            "indexedLanguageId": "",
            "label": {
                "en_US": field.name
            },
            "name": field.name,
            "objectFieldSettings": [],
            "readOnly": "false",
            "readOnlyConditionExpression": "",
            "required": false,
            "state": false,
            "system": true,
            "type": "String" //field.type <- coming through as lowercase causing error
        })
    }

    const  objectDefinitionResponse = await this.hookContext.liferay.createObjectDefinition(
      {
          "objectFields": fields,
          "accountEntryRestricted": false,
          "active": true,
          "defaultLanguageId": "en_US",
          "enableCategorization": true,
          "enableComments": true,
          "enableObjectEntryHistory": true,
          "label": {
            "en_US": objectDefinition.name    
          },
          "name": objectDefinition.name.charAt(0).toUpperCase()+objectDefinition.name.substring(1,objectDefinition.name.length),
          "panelCategoryKey": "applications_menu.applications.content",
          "parameterRequired": false,
          "pluralLabel": {
            "en_US": objectDefinition.name
          },
          "portlet": true,
          "scope": "company",
          "status": {
            "code": 0,
            "label": "approved",
            "label_i18n": "Approved"
          },
          "system": false,
          "titleObjectFieldName": "provider"
        }
    );
  }

  getPrompt({ amount, subject }: PromptInput): PromptPayload {
    return {
      instruction:
        'You are a database administrator responsible for managing schemas for your company.',
      prompt: `Create a database structure on the subject of ${subject}. Do not include fields for 'Status', 'Create Date', 'Modified Date', 'Author', or 'ID'. The first character of a name must be a lower case letter`,
      schema,
    };
  }
}