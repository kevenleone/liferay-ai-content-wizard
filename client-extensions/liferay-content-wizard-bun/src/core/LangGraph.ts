import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import { DynamicStructuredTool } from 'langchain/tools';
import { pull } from 'langchain/hub';
import type { ChatPromptTemplate } from '@langchain/core/prompts';

import { single } from '../schemas';
import env from '../utils/env';

const accountTool = new DynamicStructuredTool({
    description: 'Create accounts based on user input',
    name: 'account-creation',
    schema: single.account,
    func: async (accounts) => {
        console.log(accounts);
    },
});

const blogTool = new DynamicStructuredTool({
    description: 'Create a blog based on user input',
    name: 'blog-creation',
    schema: single.blog,
    func: async (blogs) => {
        console.log(blogs);
    },
});

const llm = new ChatOpenAI({ apiKey: env.OPENAI_KEY, model: 'gpt-4-turbo' });

const tools = [accountTool, blogTool];

const prompt = await pull<ChatPromptTemplate>('hwchase17/openai-tools-agent');

const agent = await createOpenAIToolsAgent({ llm, tools, prompt });

const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
});

await agentExecutor.invoke({
    input: 'Create 5 accounts based on Big Techs',
});
