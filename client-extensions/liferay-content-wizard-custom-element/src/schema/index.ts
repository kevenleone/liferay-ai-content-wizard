import { z } from 'zod';

export const contentWizardSettings = z.object({
  active: z.boolean(),
  apiKey: z.string().min(3),
  description: z.string(),
  id: z.number().optional(),
  imageModel: z.string().min(1),
  model: z.string().min(1),
  provider: z.string().min(1),
});