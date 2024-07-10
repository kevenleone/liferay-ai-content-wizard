import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { DallEAPIWrapper } from '@langchain/openai';
import { ZodSchema, z } from 'zod';
import ky from 'ky';
import path from 'path';

import {
  OutputFixingParser,
  StructuredOutputParser,
} from 'langchain/output_parsers';

import type { PromptPayload } from './types';
import env from './env';

type LangChainOptions = {
  apiKey?: string;
  modelName: string;
};

type Provider = 'google' | 'openai';

export class LangChain {
  private llm: ChatOpenAI | ChatVertexAI;
  private provider: Provider;

  constructor(provider: Provider, options: LangChainOptions) {
    const baseOptions = {
      ...options,
      modelName: options.modelName,
      temperature: 0.7,
      verbose: false,
      maxOutputTokens: 4000,
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

    this.provider = provider;
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
    const parserWithFix = OutputFixingParser.fromLLM(this.llm, outputParser);
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
    const parserWithFix = OutputFixingParser.fromLLM(this.llm, outputParser);

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
}
