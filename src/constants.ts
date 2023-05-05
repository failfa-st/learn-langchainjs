import path from "node:path";
import process from "node:process";

export const gptModelName = process.env.OPENAI_GPT_MODEL || "gpt-3.5-turbo";

export const CWD = process.cwd();
export const examplesDirectory = path.join(CWD, "src", "examples");
export const examplesDirectoryRelative = "../examples";

export const langchainSrcDirectory = path.join(CWD, "data", "langchainjs-repo", "langchain", "src");
export const langchainDocsDirectory = path.join(CWD, "data", "langchainjs-repo", "docs", "docs");

export const langchainLocalRepo = "langchainjs-repo";
export const langchainLocalRepoDirectory = `./data/${langchainLocalRepo}`;

export const vectorStores = "./data/vectorStores";
export const vectorStoreLangchainSummary = `${vectorStores}/langchainSummary`;
export const vectoreStoreLangchainRepo = `./data/vectorStores/${langchainLocalRepo}`;

export const TYPE_TYPESCRIPT = "ts";
export const TYPE_MARKDOWN = "md";
