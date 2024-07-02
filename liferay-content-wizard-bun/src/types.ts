import type { ZodSchema } from 'zod';

export type PromptInput<ZSchema = ZodSchema> = {
  instruction: string;
  prompt: string;
  schema: ZSchema;
};
