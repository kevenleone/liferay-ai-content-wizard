import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { DallEAPIWrapper } from '@langchain/openai';
import { z, ZodSchema } from 'zod';
import ky from 'ky';

import {
    OutputFixingParser,
    StructuredOutputParser,
} from 'langchain/output_parsers';
import type { PromptPayload } from '../utils/types';
import env from '../utils/env';
import type { GoogleAIResponseMimeType } from '@langchain/google-vertexai/types';
import { SYSTEM_INSTRUCTIONS } from '../utils/imageInstructions';

type LangChainOptions = {
    apiKey?: string;
    modelName: string;
    responseMimeType?: GoogleAIResponseMimeType;
	temperature?: number;
    response_format?: {type: string};
};

const providers = ['google', 'openai'] as const;

export type Provider = (typeof providers)[number];

export class LangChain {
    private llm: ChatOpenAI | ChatVertexAI;

    static isProviderAllowed(provider: Provider) {
        return providers.includes(provider);
    }

    constructor(provider: Provider, options: LangChainOptions) {
        const baseOptions = {
            maxOutputTokens: 4000,
            temperature: 0.7,
            verbose: false,
            ...options,
        };

        this.llm =
            provider === 'openai'
                ? new ChatOpenAI(baseOptions)
                : new ChatVertexAI({
                      ...baseOptions,
                      safetySettings: [
                          {
                              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                              threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                          },
                      ],
                  });
    }

    async getImageContext(
        instructions: string,
        images: { content: string; type: 'base64' | 'url' }[],
        zodSchema: ZodSchema
    ) {
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', instructions],
            [
                'human',
                images.map((image) => ({
                    type: 'image_url',
                    image_url:
                        image.type === 'url'
                            ? {
                                  url: image.content,
                                  detail: 'high',
                              }
                            : `data:image/jpeg;base64,${image.content}`,
                })),
            ],
            ['ai', 'Formatting Instructions: {format_instructions}'],
        ]);

        const outputParser = StructuredOutputParser.fromZodSchema(zodSchema);
        const parserWithFix = OutputFixingParser.fromLLM(
            this.llm,
            outputParser
        );
        const chain = prompt.pipe(this.llm).pipe(parserWithFix);

        return chain.invoke({
            format_instructions: outputParser.getFormatInstructions(),
        });
    }

    async getStructuredContent(input: PromptPayload) {
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', '{instructions}'],
            ['user', '{prompt}'],
            ['ai', 'Formatting Instructions: {format_instructions}'],
            [
                'user',
                'The content created needs to be in the HTML format whenever possible, avoid using markdown.',
            ],
        ]);

        const outputParser = StructuredOutputParser.fromZodSchema(input.schema);
        const parserWithFix = OutputFixingParser.fromLLM(
            this.llm,
            outputParser
        );

        const chain = prompt.pipe(this.llm).pipe(parserWithFix);

        return chain.invoke({
            instructions: input.instruction,
            prompt: input.prompt,
            format_instructions: outputParser.getFormatInstructions(),
        });
    }

    async getGeneratedImage(prompt: String) {
        const tool = new DallEAPIWrapper({
            n: 1,
            model: 'dall-e-3',
            size: '1024x1024',
            apiKey: env.OPENAI_KEY,
        });

        const imageURL = await tool.invoke(prompt);
        const response = await ky.get(imageURL);
        const arrayBuffer = await response.arrayBuffer();

        const blob = new Blob([arrayBuffer]);
        const file = new File([blob], `ai-wizard-${new Date().getTime()}.jpg`);

        const formData = new FormData();

        formData.append('file', file);

        return formData;
    }

    async getImageDescription(image: string) {
		const multiModalPrompt = ChatPromptTemplate.fromMessages([
			['system', SYSTEM_INSTRUCTIONS],
			[
				'human',
				[
					{
						text: 'Can you describe the layout of the page specifiying all the web components used and ordering them by row'
					},
					{
						type: 'image_url',
						image_url: '{base64Image}'
					}
				]
			]
		]);
		const outputParser = StructuredOutputParser.fromZodSchema(
			z.object({
				content: z
					.string()
					.describe(
						'Can you describe the layout of the page specifiying all the web components used and ordering them by row'
					)
			})
		);

		const chain = multiModalPrompt.pipe(this.llm);

		const response = await chain.invoke({
			instructions: SYSTEM_INSTRUCTIONS,
			base64Image: image,
			format_instructions: outputParser.getFormatInstructions()
		});

		return response.content;
	}
}
