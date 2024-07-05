import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatVertexAI } from '@langchain/google-vertexai';
import {
  OutputFixingParser,
  StructuredOutputParser,
} from 'langchain/output_parsers';

import type { PromptPayload } from './types';

type LangChainOptions = {
  apiKey?: string;
  modelName: string;
};

export class LangChain {
  private llm: ChatOpenAI | ChatVertexAI;

  constructor(provider: 'openai' | 'vertexai', options: LangChainOptions) {
    const baseOptions = {
      ...options,
      modelName: options.modelName,
      temperature: 0.7,
      verbose: false,
      maxOutputTokens: 2048,
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
}
