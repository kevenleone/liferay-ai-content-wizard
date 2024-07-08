import type { ZodSchema, z } from 'zod';
import type liferayHeadless from './services/apis';
import type { categorizationSchema } from './schemas';

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

export type PromptInput = z.infer<typeof categorizationSchema>;

export type PromptPayload<ZSchema = ZodSchema> = {
  instruction: string;
  prompt: string;
  schema: ZSchema;
};

export type APIResponse<Query = any> = {
  items: Query[];
  lastPage: number;
  page: number;
  pageSize: number;
  totalCount: number;
};
