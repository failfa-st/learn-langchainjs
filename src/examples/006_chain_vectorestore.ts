import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

import { vectorStoreLangchainSummary } from "../constants.ts";

/**
 * Combining a vector store with a chain
 *
 * @example
 *
 * Question: What is langchainjs?
 *
 * Answer:
 * LangChain is a framework designed to enable applications that work with language models,
 * providing modular abstractions for the necessary components
 */
export async function run() {
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", maxRetries: 0, temperature: 0.2 });

	const embedding = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		maxRetries: 0,
	});

	// Load the vector store from a directory
	const vectorStore = await HNSWLib.load(vectorStoreLangchainSummary, embedding);

	const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
		// Provide 4 results from the vectorStore that are the most similar
		// to the provided query
		k: 4,

		// Provide the documents from the vectorStore that where found
		// with the provided query
		returnSourceDocuments: true,
	});
	chain.verbose = true;

	const response = await chain.call({
		query: `What is langchainjs?`,
	});

	console.log(response);
}
