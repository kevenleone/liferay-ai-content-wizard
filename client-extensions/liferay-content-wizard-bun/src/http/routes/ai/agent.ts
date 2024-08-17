// import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { Elysia } from 'elysia';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import { DynamicStructuredTool } from 'langchain/tools';
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from '@langchain/core/prompts';

import { AIMessage, HumanMessage } from '@langchain/core/messages';

import { liferay } from '../../liferay';
import { single } from '../../../schemas';
import env from '../../../utils/env';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { OpenAIEmbeddings } from '@langchain/openai';
// import { MemoryVectorStore } from 'langchain/vectorstores/memory';
// import { createRetrievalChain } from 'langchain/chains/retrieval';

const accountTool = new DynamicStructuredTool({
    description: 'Create accounts based on user input',
    name: 'account-creation',
    schema: single.account,
    func: async (accounts) => {
        console.log(accounts);
    },
});

const blogTool = new DynamicStructuredTool({
    description:
        'Create a blog based on user input, the only thing you need to know to create the blog is the subject.',
    name: 'blog-creation',
    schema: single.blog,
    func: async (blogs) => {
        console.log(blogs);
    },
});

const llm = new ChatOpenAI({ apiKey: env.OPENAI_KEY, model: 'gpt-4-turbo' });

const tools = [accountTool, blogTool];

const prompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        `You are a helpful assistant called Alloy and you an expert content creator for Liferay Portal assets. 
        
        Your task is to generate content based on the user input, you have access to the following tools:
        {tools}

        Reminder to ALWAYS respond a single action. Use tools if necessary. 
        Respond directly if appropriate`,
    ],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
]);

const chatHistory: (HumanMessage | AIMessage)[] = [];

const agent = await createOpenAIToolsAgent({ llm, tools, prompt });

const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: false,
});

// const loader = new CheerioWebBaseLoader(
//     'https://liferay.dev/blogs/-/blogs/virtual-instance-in-liferay'
// );

// const docs = await loader.load();

// const spliter = new RecursiveCharacterTextSplitter({
//     chunkSize: 200,
//     chunkOverlap: 20,
// });

// const splitDocs = await spliter.splitDocuments(docs);

// const embeddings = new OpenAIEmbeddings();

// const vectorStore = await MemoryVectorStore.fromDocuments(
//     splitDocs,
//     embeddings
// );

// const retrievalChain = await createRetrievalChain({
//     combineDocsChain: chain,
//     retriever,
// });

// const retriever = vectorStore.asRetriever({ k: 5 });

// console.log(splitDocs.length);

export const aiAgent = new Elysia()
    .use(liferay)
    .post('/ai/agent', async ({ body: { question } }) => {
        const response = await agentExecutor.invoke({
            chat_history: chatHistory,
            tools: 'blog-creation, account-creation',
            input: question,
        });

        chatHistory.push(new HumanMessage(question));
        chatHistory.push(new AIMessage(response.output));

        console.log({ response });

        return {
            output: response.output,
        };
    });
