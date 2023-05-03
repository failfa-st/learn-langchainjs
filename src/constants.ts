import path from "node:path";
import process from "node:process";

export const CWD = process.cwd();
export const examplesDirectory = path.join(CWD, "src", "examples");

export const vectorStores = "./data/vectorStores";
export const vectorStoreLangchainSummary = `${vectorStores}/langchainSummary`;

export const langchainSrcDirectory = path.join(CWD, "data", "langchainjs-repo", "langchain", "src");

export const langchainLocalRepo = "langchainjs-repo";
export const langchainLocalRepoDirectory = `./data/${langchainLocalRepo}`;

export const langchainVectorstoreDirectory = `./data/vectorStores/${langchainLocalRepo}`;
