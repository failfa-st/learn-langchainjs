import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export async function run() {
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", maxRetries: 0, temperature: 0.2 });

	const template = "What is the color of {thing}?";
	const prompt = new PromptTemplate({
		template,
		inputVariables: ["thing"],
	});

	const chain = new LLMChain({ llm: model, prompt });

	const response = await chain.call({ thing: "mars" });

	console.log(response);
}
