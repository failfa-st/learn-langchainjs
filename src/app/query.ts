import chalk from "chalk";
import { LLMChain, StuffDocumentsChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIChat } from "langchain/llms/openai";
import {
	ChatPromptTemplate,
	SystemMessagePromptTemplate,
	MessagesPlaceholder,
	HumanMessagePromptTemplate,
} from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

import { gptModelName, vectoreStoreLangchainRepo } from "../constants.ts";

export async function query(question: string): Promise<any> {
	const chat = new OpenAIChat({ modelName: gptModelName, maxRetries: 0, temperature: 0.2 });

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

	// Get 4 "docs" that are most similar to the "question" out of the "vectorStore"
	const docs = await vectorStore.similaritySearch(question, 8);

	// Create a chain that connects the "chat" with the "chatPrompt"
	const chainLLM = new LLMChain({ llm: chat, prompt: chatPrompt });

	// Create a chain that can combine (stuff) the content of all "docs" into one String
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

	return {
		text: response.text,
		sources: docs.map(doc => doc.metadata.source),
	};
}

export const formatResult = (result: any) => {
	const { text, sources } = result;

	console.log("Text:");
	console.log(
		text
			.split("\n")
			.map((line: string) => {
				if (
					line.startsWith("import") ||
					line.startsWith("const") ||
					line.startsWith("async") ||
					line.startsWith("console")
				) {
					return chalk.green(line);
				}

				if (line.startsWith("}")) {
					return chalk.green(line);
				}

				return line;
			})
			.join("\n")
	);

	console.log("\nSources:");

	sources
		.filter((source, index, _sources) => _sources.indexOf(source) === index)
		.forEach((source: string, index: number) => {
			console.log(`${index + 1}. ${source}`);
		});
};

