import type { ZodSchema, z } from 'zod';
import type { schema } from './assets/categorization';
import type liferayHeadless from './services/apis';

export type HookStructure = {
  prompt: any;
  actions: any[];
  afterPromptCalls?: any[];
  beforePromptCalls?: any[];
};

export type HookContext = {
  liferay: ReturnType<typeof liferayHeadless>;
  themeDisplay: {
    languageId: string;
    scopeGroupId: string;
  };
};

export type HookData<T> = {
  afterPromptCalls: any[];
  beforePrompt: any[];
  categorization: PromptInput;
  promptResponse: T;
};

export type PromptInput = z.infer<typeof schema>;

export type PromptPayload<ZSchema = ZodSchema> = {
  instruction: string;
  prompt: string;
  schema: ZSchema;
};
