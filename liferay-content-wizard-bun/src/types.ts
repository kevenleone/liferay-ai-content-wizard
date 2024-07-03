import type { ZodSchema, z } from 'zod';
import type { schema } from './assets/categorization';

export type HookStructure = {
  prompt: any;
  actions: any[];
  afterPromptCalls?: any[];
  beforePromptCalls?: any[];
};

export type PromptInput = z.infer<typeof schema>;

export type PromptPayload<ZSchema = ZodSchema> = {
  instruction: string;
  prompt: string;
  schema: ZSchema;
};
