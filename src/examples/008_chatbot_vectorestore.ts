import { LLMChain, StuffDocumentsChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate,
} from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

import { gptModelName, vectoreStoreLangchainRepo } from "../constants.ts";

export async function run() {
	const chat = new ChatOpenAI({ modelName: gptModelName, maxRetries: 0, temperature: 0.2 });

	const embedding = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		maxRetries: 0,
	});

	// Load the "vectorStore" from a directory
	const vectorStore = await HNSWLib.load(vectoreStoreLangchainRepo, embedding);

	// Define the templates for the SystemMessage (how the AI interacts with us)
	// & HumanMessage (the way we interact with the AI)
	const chatPrompt = ChatPromptTemplate.fromPromptMessages([
		SystemMessagePromptTemplate.fromTemplate(`
You are a JavaScript developer and know everything about the langchainjs library.
You use the following information to answer questions and if you can't do that, don't make up an answer:

{context}
`),
		new MessagesPlaceholder("history"),
		HumanMessagePromptTemplate.fromTemplate("{question}"),
	]);

	const question = `Please show me a step-by-step code example of getting started with langchain and explain what happens`;

	// Get 4 "docs" that are most similar to the "question" out of the "vectorStore"
	const docs = await vectorStore.similaritySearch(question, 4);

	// Create a chain that connects the "chat" with the "chatPrompt"
	const chainLLM = new LLMChain({ llm: chat, prompt: chatPrompt });

	// Create a chain that can combine (stuff) the content of all "docs" into one String
	// In order to follow the camelCase code convention, the default "inputKey"
	// is renamed from "input_documents" to "inputDocuments"
	const chain = new StuffDocumentsChain({ llmChain: chainLLM, inputKey: "inputDocuments" });

	// You could also do loadQAStuffChain(chat, { prompt: chatPrompt });
	// instead of creating chainLLM and chain manually

	// Calls the chain to
	// - combine (stuff) the "docs" into one String
	// - SystemMessage: puts the combined "docs" into the "context" in "chatPrompt"
	// - HumanMessage: puts the "question" into the "question" in "chatPrompt"
	const response = await chain.call({
		inputDocuments: docs,
		question,
		history: [],
	});

	console.log(response);

	// You could also use ChatVectorDBQAChain instead of doing all of these steps manually
	// but it's not that easy there to use your own SystemMessage

	// This will not work because adding a value into the history is broken for what ever reason
	// Creating a memory manually will also not solve it, it will just fail at a later state
	// because of https://github.com/hwchase17/langchainjs/issues/391
	// const responseB = await chain.call({
	// 	input_documents: docs,
	// 	question: "I get this error: Property embed does not exist on type OpenAI",
	// 	history: [response],
	// });

	// console.log(responseB);
}
