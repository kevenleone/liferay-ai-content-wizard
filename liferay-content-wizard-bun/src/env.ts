import { z } from 'zod';

const envSchema = z.object({
  GEMINI_KEY: z.string(),
  OPENAI_KEY: z.string(),
});

export default envSchema.parse(process.env);
