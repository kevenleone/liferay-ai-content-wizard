import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3333'),
  GEMINI_KEY: z.string(),
  OPENAI_KEY: z.string(),
});

export default envSchema.parse(process.env);
