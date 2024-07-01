import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { StructuredOutputParser } from 'langchain/output_parsers';

import env from './env';
import getBlogPrompt from './prompts/blogPrompt';
import getAccountPrompt from './prompts/accountPrompt';
import type { PromptInput } from './types';

type LangChainOptions = {
  apiKey?: string;
  modelName: string;
};

class LangChain {
  llm: ChatOpenAI | ChatVertexAI;
  provider: string;

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

  async getStructuredContent(input: PromptInput) {
    const prompt = ChatPromptTemplate.fromTemplate(`
        {instructions}
        Formatting Instructions: {format_instructions}
        {prompt}
    `);

    const outputParser = StructuredOutputParser.fromZodSchema(input.schema);

    const chain = prompt.pipe(this.llm).pipe(outputParser);

    return chain.invoke({
      instructions: input.instruction,
      prompt: input.prompt,
      format_instructions: outputParser.getFormatInstructions(),
    });
  }
}

const langChain = new LangChain('openai', {
  apiKey: env.OPENAI_KEY,
  modelName: 'gpt-3.5-turbo',
});

// const langChain = new LangChain('vertexai', {
//   modelName: 'gemini-1.5-flash-001',
// });

const blogPrompt = await getBlogPrompt({
  count: 3,
  language: 'English',
  subject: 'Best dog breeds for childrens',
});

const accountPrompt = getAccountPrompt({
  count: 10,
  topic: 'Top World Companies',
});

console.log(await langChain.getStructuredContent(accountPrompt));

// console.log(await langChain.getStructuredContent(blogPrompt));
