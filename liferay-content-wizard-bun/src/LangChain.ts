import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { StructuredOutputParser } from 'langchain/output_parsers';

import env from './env';
import getBlogPrompt from './assets/blog';
import getAccountPrompt from './assets/account';
import type { PromptPayload } from './types';
import type { z } from 'zod';

type LangChainOptions = {
  apiKey?: string;
  modelName: string;
};

export class LangChain {
  private llm: ChatOpenAI | ChatVertexAI;
  private provider: string;

  constructor(provider: 'openai' | 'vertexai', options: LangChainOptions) {
    const baseOptions = {
      ...options,
      modelName: options.modelName,
      temperature: 0.7,
      verbose: false,
    };

    this.llm =
      provider === 'openai'
        ? new ChatOpenAI(baseOptions)
        : new ChatVertexAI(baseOptions);

    this.provider = provider;
  }

  async getStructuredContent(input: PromptPayload) {
    // const prompt = ChatPromptTemplate.fromTemplate(`
    //     {instructions}
    //     Formatting Instructions: {format_instructions}
    //     {prompt}
    // `);

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', '{instructions}'],
      ['user', '{prompt}'],
      ['ai', 'Formatting Instructions: {format_instructions}'],
    ]);

    const outputParser = StructuredOutputParser.fromZodSchema(input.schema);

    const chain = prompt.pipe(this.llm).pipe(outputParser);

    const generalInstructions =
      'Use the following properties as references, in case of found the "PLACEHOLDER_" properties. The instructions may expect some of the following inputs: {siteId: 1113, siteName: "Liferay Portal"} \n';

    return chain.invoke({
      instructions: generalInstructions + input.instruction,
      prompt: input.prompt,
      format_instructions: outputParser.getFormatInstructions(),
    });
  }
}

// const langChain = new LangChain('openai', {
//   apiKey: env.OPENAI_KEY,
//   modelName: 'gpt-3.5-turbo',
// });

// const langChain = new LangChain('vertexai', {
//   modelName: 'gemini-1.5-flash-001',
// });

// const blogPrompt = await getBlogPrompt({
//   count: 3,
//   language: 'English',
//   subject: 'Best dog breeds for childrens',
// });

// const accountPrompt = getAccountPrompt({
//   count: 10,
//   topic: 'Big techs',
// });

// console.log(await langChain.getStructuredContent(blogPrompt));
