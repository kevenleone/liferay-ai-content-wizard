import { z } from 'zod';

import type { PromptPayload } from '../types';

type WarehousePromptType = {
  count: number;
  subject: string;
};

export default function getWarehousePrompt({
  count,
  subject,
}: WarehousePromptType): PromptPayload {
  return {
    instruction:
      'You are a helpful assistant tasked with listing cities, regions, or counties within an area.',
    prompt: `Provide an array of ${count}, cities, regions, or counties with latitude and longitude within the region of ${subject}`,
    schema: z
      .array(
        z.object({
          longitute: z.number().describe('Region Longitude'),
          latitude: z.number().describe('Region Latitude'),
          name: z.string().describe('Name of the Region'),
        })
      )
      .describe('an array of cities, regions, or counties within a region.'),
  };
}
