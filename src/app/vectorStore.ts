import type { Document } from "langchain/document";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import type { Ora } from "ora";

import {
	TYPE_MARKDOWN,
	TYPE_TYPESCRIPT,
	langchainDocsDirectory,
	langchainLocalRepo,
	langchainLocalRepoDirectory,
	langchainSrcDirectory,
	vectoreStoreLangchainRepo,
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

	// Load all source code
	const docsTs = await loadDocuments(TYPE_TYPESCRIPT);
	spinner.info(`Loaded ${docsTs.length} TypeScript documents`);

	const chunkedDocsTs = await splitDocuments(TYPE_TYPESCRIPT, docsTs);
	spinner.info(`Splitted the TypeScript documents into ${chunkedDocsTs.length} chunks`);

	// Load documentation
	const docsMd = await loadDocuments(TYPE_MARKDOWN);
	spinner.info(`Loaded ${docsMd.length} Markdown documents`);

	const chunkedDocsMd = await splitDocuments(TYPE_MARKDOWN, docsMd);
	spinner.info(`Splitted the Markdown documents into ${chunkedDocsMd.length} chunks`);

	await fillVectorStore([...chunkedDocsTs, ...chunkedDocsMd], spinner);
}

export async function loadDocuments(type: string): Promise<Document<Record<string, any>>[]> {
	let loader = null;

	if (type === TYPE_TYPESCRIPT) {
		loader = new DirectoryLoader(langchainSrcDirectory, {
			".ts": path => new TextLoader(path),
		});
	}

	if (type === TYPE_MARKDOWN) {
		loader = new DirectoryLoader(langchainDocsDirectory, {
			".md": path => new TextLoader(path),
			".mdx": path => new TextLoader(path),
		});
	}

	if (loader === null) return;

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

export async function splitDocuments(type: string, docs: Document<Record<string, any>>[]) {
	let splitter = null;

	if (type === TYPE_TYPESCRIPT) {
		splitter = new JavaScriptTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 0,
		});
	}

	if (type === TYPE_MARKDOWN) {
		splitter = new MarkdownTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 0,
		});
	}

	if (splitter === null) return;

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
	await vectorStore.save(vectoreStoreLangchainRepo);

	spinner.info(`Saved the VectorStore into a local file: ${vectoreStoreLangchainRepo}`);
}

