import type { Document } from "langchain/document";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import type { Ora } from "ora";

import {
	langchainLocalRepo,
	langchainLocalRepoDirectory,
	langchainSrcDirectory,
	langchainVectorstoreDirectory,
} from "../constants.ts";
import { JavaScriptTextSplitter } from "../examples/text-splitter/JavaScriptTextSplitter.ts";
import { clonePublicRepo } from "./repository.ts";

export async function updateVectorStore(spinner: Ora) {
	// Get the latest version of the langchainjs repo
	const message = await clonePublicRepo(
		"https://github.com/hwchase17/langchainjs",
		langchainLocalRepoDirectory
	);
	spinner.info(message);

	const docs = await loadDocuments();
	spinner.info(`Loaded ${docs.length} documents`);

	const chunkedDocs = await splitDocuments(docs);
	spinner.info(`Splitted the documents into ${chunkedDocs.length} chunks`);

	await fillVectorStore(chunkedDocs, spinner);
}

export async function loadDocuments(): Promise<Document<Record<string, any>>[]> {
	const loader = new DirectoryLoader(langchainSrcDirectory, {
		".ts": path => new TextLoader(path),
	});
	const docs = await loader.load();

	// Fix the source for each document to point to GitHub instead of local
	docs.map(doc => {
		const { source } = doc.metadata;

		const localPath = source.split(langchainLocalRepo)[1].replaceAll("\\", "/");
		const newSource = `https://github.com/hwchase17/langchainjs/tree/main${localPath}`;

		doc.metadata.source = newSource;

		return doc;
	});

	return docs;
}

export async function splitDocuments(docs: Document<Record<string, any>>[]) {
	const splitter = new JavaScriptTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 0,
	});

	const chunkedDocs = await splitter.splitDocuments(docs);

	return chunkedDocs;
}

export async function fillVectorStore(docs: Document<Record<string, any>>[], spinner: Ora) {
	const embedding = new OpenAIEmbeddings({
		modelName: "text-embedding-ada-002",
		maxRetries: 0,
	});

	spinner.info("Convert docs into embeddings and save them into the VectorStore");
	const vectorStore = await HNSWLib.fromDocuments(docs, embedding);

	// Save the vector store index into a directory
	await vectorStore.save(langchainVectorstoreDirectory);

	spinner.info(`Saved the VectorStore into a local file: ${langchainVectorstoreDirectory}`);
}

