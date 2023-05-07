import { LLMChain, StuffDocumentsChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate,
} from "langchain/prompts";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

import { gptModelName, vectoreStoreLangchainRepo } from "../constants.ts";

/**
 *
 *
 * Alternatives:
 *
 * You could also use ChatVectorDBQAChain instead of doing all of these steps manually
 * but it's not that easy there to use your own SystemMessage
 *
 * Known problems:
 *
 * Using "memory: BufferMemory" is not working right now because of
 * https://github.com/hwchase17/langchainjs/issues/391
 */
export async function run() {
	const chat = new ChatOpenAI({ modelName: gptModelName, temperature: 0.2 });

	const embedding = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		maxRetries: 0,
	});

	// Load the "vectorStore" from a directory.
	// The store is already filled with data (embeddings) from the langchainjs-repository
	// so you can get started without doing anything yourself
	const vectorStore = await HNSWLib.load(vectoreStoreLangchainRepo, embedding);

	// Define the templates for the:
	// - SystemMessage (how the AI interacts with us)
	// - History (the previous user questions & AI answers)
	// - HumanMessage (the question of the user)
	// The template will be used for every interaction with the AI, replacing the variables
	// with the corresponding content:
	// - {context}: The augmented retrieval of data from the vectorstore that is similar to the "question"
	// - {question}: The question of the user
	const chatPrompt = ChatPromptTemplate.fromPromptMessages([
		SystemMessagePromptTemplate.fromTemplate(`
You are a JavaScript developer and know everything about the langchainjs library.
You use the following information to answer questions and if you can't do that, don't make up an answer:

{context}
`),
		new MessagesPlaceholder("history"),
		HumanMessagePromptTemplate.fromTemplate("{question}"),
	]);

	// The chat "history", where each message is either a Human:
	const history = [];

	// The "question" that the user is asking
	const question = `What is langchainjs?`;

	// Get 4 "docs" that are most similar to the "question" out of the "vectorStore"
	const docs = await vectorStore.similaritySearch(question, 4);

	// Create a chain that connects the "chat" with the "chatPrompt"
	const chainLLM = new LLMChain({ llm: chat, prompt: chatPrompt });

	// Create a chain that can combine (= stuff) the content of all "docs" into one String
	// In order to follow the camelCase code convention, the default "inputKey"
	// is renamed from "input_documents" to "inputDocuments"
	const chain = new StuffDocumentsChain({
		llmChain: chainLLM,
		inputKey: "inputDocuments",
	});

	// You could also do loadQAStuffChain(chat, { prompt: chatPrompt });
	// instead of creating chainLLM and chain manually

	// Calls the chain to
	// - combine (= stuff) the "docs" into one String
	// - SystemMessage: puts the combined "docs" into the "context" in "chatPrompt"
	// - HumanMessage: puts the "question" into the "question" in "chatPrompt"
	const response = await chain.call({
		inputDocuments: docs,
		question,
		history,
	});

	console.log(question);
	console.log(response);

	// Add the "question" of the user into the chat "history"
	history.push(new HumanChatMessage(question));
	// Add the "response" of the AI into the chat "history", which we received when we called the "chain"
	history.push(new AIChatMessage(response.text));

	// Another "question2" that the user is asking. It has a reference to the previous question
	// because we are using a chat "history" here
	const question2 = `Can you please transform your previous answer into a list?`;

	// Call the "chain" again, but now we also have a filled "history" as part of the conversation
	// that contains the "question" and the "response" of the previous chat
	const response2 = await chain.call({
		inputDocuments: docs,
		question: question2,
		history,
	});

	console.log(question2);
	console.log(response2);
}
