import { config } from "dotenv";
import { OpenAI } from "langchain/llms/openai";

// Load environment variables, especially OPENAI_API_KEY
config();

export async function run() {
	const question = "Can a robot parrot talk?";

	// Create a new instance of the OpenAI model
	// modelName: "gpt-3.5-turbo" - Use the GPT-3.5 Turbo model
	// temperature: 0.2 - Use a low temperature value for less randomness in the output
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.2 });

	// Use the "model" to ask the "question"
	// and store the "response" in a variable
	const response = await model.call(question);

	console.log(response);
}

run();
