import chalk from "chalk";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

import { langchainVectorstoreDirectory } from "../constants.ts";

export async function query(question: string): Promise<any> {
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", maxRetries: 0, temperature: 0.2 });

	const embedding = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		maxRetries: 0,
	});

	// Load the vector store from a directory
	const vectorStore = await HNSWLib.load(langchainVectorstoreDirectory, embedding);

	const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
		// Provide 4 results from the vectorStore that are the most similar
		// to the provided query
		k: 4,

		// Provide the documents from the vectorStore that where found
		// with the provided query
		returnSourceDocuments: true,
	});

	const prompt = `
        LANGCHAINJS QUESTION: "${question}"
        ALWAYS return CODE EXAMPLES if possible
    `;

	const response = await chain.call({
		query: prompt,
	});

	return {
		text: response.text,
		sources: response.sourceDocuments.map(doc => doc.metadata.source),
	};
}

export const formattedResult = (result: any) => {
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
	sources.forEach((source: string, index: number) => {
		console.log(`${index + 1}. ${source}`);
	});
};

