import { OpenAI } from "langchain/llms/openai";

export async function run() {
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", maxRetries: 0, temperature: 0.2 });

	const response = await model.call("What is the color of the sun?");

	console.log(response);
}
