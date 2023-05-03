import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { ChainTool } from "langchain/tools";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

import { vectorStoreLangchainSummary } from "../constants.ts";

/**
 * Combining a vector store with an agent that is using a chain as a tool
 *
 * Difference to 006_chain_vectorstore.ts?
 * The agent tries to iterate over the result, asking itself questions about the result,
 * trying to find a even more accurate answer.
 *
 * @example
 *
 * Question: What is langchainjs?
 *
 * Answer:
 * LangChain is a framework designed to enable applications that work with language models,
 * providing modular abstractions for the necessary components.
 * It enables the development of applications that utilize language models,
 * regardless of whether they are using the rest of the LangChain framework or not.
 * However, specific examples of applications that can be developed using langchainjs
 * are not readily available.
 *
 */
export async function run() {
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", maxRetries: 0, temperature: 0.2 });

	const embedding = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		maxRetries: 0,
	});

	// Load the vector store from a directory
	const vectorStore = await HNSWLib.load(vectorStoreLangchainSummary, embedding);

	const chain = VectorDBQAChain.fromLLM(model, vectorStore);

	const qaTool = new ChainTool({
		name: "langchain-qa",
		description: "Answer questions related to langchain",
		chain,
	});

	const tools = [qaTool];

	const agentExecutor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: "zero-shot-react-description",
		verbose: true,
	});

	const response = await agentExecutor.call({
		input: `What is langchainjs?`,
	});

	console.log(response);
}
