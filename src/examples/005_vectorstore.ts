import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

import { vectorStoreLangchainSummary } from "../constants.ts";

/**
 * We are using HNSWLib here, as this is an InMemory vector store that
 * can run locally without the need to start anything. It also can be saved
 * into a file, which makes it very nice to use.
 *
 * https://js.langchain.com/docs/modules/indexes/vector_stores
 */
export async function run() {
	// The embedding to convert text into vector data
	const embedding = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		maxRetries: 0,
	});

	// Input data (introduction text from LangChain)
	const data = `
	LangChain is a framework for developing applications powered by language models. We believe that the most powerful and differentiated applications will not only call out to a language model via an api, but will also:

	Be data-aware: connect a language model to other sources of data
	Be agentic: Allow a language model to interact with its environment
	As such, the LangChain framework is designed with the objective in mind to enable those types of applications.
	
	There are two main value props the LangChain framework provides:
	
	Components: LangChain provides modular abstractions for the components neccessary to work with language models. LangChain also has collections of implementations for all these abstractions. The components are designed to be easy to use, regardless of whether you are using the rest of the LangChain framework or not.
	Use-Case Specific Chains: Chains can be thought of as assembling these components in particular ways in order to best accomplish a particular use case. These are intended to be a higher level interface through which people can easily get started with a specific use case. These chains are also designed to be customizable.
	Accordingly, we split the following documentation into those two value props. In this documentation, we go over components and use cases at high level and in a language-agnostic way. For language-specific ways of using these components and tackling these use cases, please see the language-specific sections linked at the top of the page.
	`;

	const splitter = new RecursiveCharacterTextSplitter({
		// Every document consists of 100 characters
		chunkSize: 100,
		// The overlap between each generated document
		chunkOverlap: 20,
	});

	// Split data and create the documents
	const documents = await splitter.createDocuments([data]);

	// Convert documents into vector data using embedding and put those
	// into the vector store
	const vectorStore = await HNSWLib.fromDocuments(documents, embedding);

	// Save the vector store index into a directory
	await vectorStore.save(vectorStoreLangchainSummary);

	// Load the vector store from a directory
	// INFO: embedding is needed here as this will create a new VectorStore
	// and embedding is required for that
	const loadedVectorStore = await HNSWLib.load(vectorStoreLangchainSummary, embedding);

	// Find the 3 most similar documents in the store
	const result = await loadedVectorStore.similaritySearch("LangChain", 3);

	console.log(result);
}
