import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('3001'),
    GEMINI_KEY: z.string().optional(),
    OPENAI_KEY: z.string().optional(),
});

export default envSchema.parse(process.env);
