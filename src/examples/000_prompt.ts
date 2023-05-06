import { OpenAI } from "langchain/llms/openai";

export async function run() {
	// Create a new instance of the OpenAI model with specified options
	// modelName: "gpt-3.5-turbo" - Use the GPT-3.5 Turbo model
	// temperature: 0.2 - Use a low temperature value for less randomness in the output
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.2 });

	// Call the "model" with the input "What is the color of the sun?"
	// and store the response in the "response" variable
	const response = await model.call("What is the color of the sun?");

	console.log(response);
}
