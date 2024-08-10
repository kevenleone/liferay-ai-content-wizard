import { warehouseSchema as schema } from '../schemas';
import Asset from './asset';
import type { HookContext, PromptInput, PromptPayload } from '../utils/types';

export default class Warehouse extends Asset {
    getWarehousePrompt({ amount, subject }: PromptInput): PromptPayload {
        return {
            instruction:
                'You are a helpful assistant tasked with listing cities, regions, or counties within an area.',
            prompt: `Provide an array of ${amount}, cities, regions, or counties with latitude and longitude within the region of ${subject}`,
            schema,
        };
    }
}
