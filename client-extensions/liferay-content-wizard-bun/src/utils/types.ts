import type { ZodSchema, z } from 'zod';

import type liferayHeadless from '../services/apis';
import type { categorizationSchema } from '../schemas';
import type { LangChain } from '../core/LangChain';

export type PickListEntry = {
    key: string;
    name: string;
};

export type WizardSettingsPayload = {
    active: boolean;
    apiKey: string;
    id?: number;
    imageModel: string;
    model: string;
    provider: string;
    settings: string;
};

export type WizardSetting = {
    active: boolean;
    apiKey: string;
    imageModel: PickListEntry;
    model: PickListEntry;
    provider: PickListEntry;
    settings: string;
};

export type APIResponse<Query = any> = {
    items: Query[];
    lastPage: number;
    page: number;
    pageSize: number;
    totalCount: number;
};

export type HookData<T> = {
    afterPromptCalls: any[];
    beforePrompt: any[];
    categorization: PromptInput;
    promptResponse: T;
};

export type HookStructure = {
    prompt: any;
    actions: any[];
    afterPromptCalls?: any[];
    beforePromptCalls?: any[];
};

export type HookContext = {
    files: any[];
    langChain: LangChain;
    liferay: ReturnType<typeof liferayHeadless>;
    themeDisplay: {
        languageId: string;
        scopeGroupId: string;
    };
};

export type PromptInput = z.infer<typeof categorizationSchema>;

export type PromptPayload<ZSchema = ZodSchema> = {
    instruction: string;
    messages?: any[];
    prompt: string;
    schema: ZSchema;
};

export type RetrieveFirstItem<T extends readonly unknown[]> = T[0];
