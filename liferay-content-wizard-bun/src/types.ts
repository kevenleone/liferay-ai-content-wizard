import type { ZodSchema } from 'zod';

export type PromptInput = {
  instruction: string;
  prompt: string;
  schema: ZodSchema;
};
