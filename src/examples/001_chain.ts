import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

/**
 * Use case: Answer a question with variable input from the user
 *
 * Initializes an OpenAI model, defines a template with a variable,
 * creates a prompt using the template, creates an LLMChain with the model
 * and prompt, runs the chain with user data, and logs the response.
 */
export async function run() {
	// Create a new instance of the OpenAI model with these options:
	// - modelName: "gpt-3.5-turbo" - Use the GPT-3.5 Turbo model
	// - temperature: 0.2 - Use a low temperature value for less randomness in the output
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.2 });

	// Define a template that contains the variable "{thing}"
	const template = "What is the color of {thing}?";

	// Create a "prompt" using the "template" and the variable "thing"
	// so that it can be replaced with any content
	// when the "prompt" is used
	const prompt = new PromptTemplate({
		template,
		inputVariables: ["thing"],
	});

	// Create a LLMChain that combines the "model" with the given "prompt"
	const chain = new LLMChain({ llm: model, prompt });

	// Run the chain and provide the data of the user (in this case "thing")
	// which creates this question: "What is the color of mars?"
	// This question is sent to the "model" (in this case OpenAI) and
	// the answer is saved into response
	const response = await chain.call({ thing: "mars" });

	console.log(response);
}
