import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";

// Custom tool that returns the length of a given string
import { LengthChecker } from "./tools/lengthChecker.ts";

/**
 * Use case: Answer a question by using an Agent with a tool
 *
 * Initializes an agent executor with a specific model and tool,
 * then processes an input to obtain a response using the appropriate tool.
 */
export async function run() {
	// Create a new instance of the OpenAI model with these options:
	// - modelName: "gpt-3.5-turbo" - Use the GPT-3.5 Turbo model
	// - temperature: 0.2 - Use a low temperature value for less randomness in the output
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.2 });

	// Create an array of tools to be used by the agent,
	// in this case, just a LengthChecker tool.
	const tools = [new LengthChecker()];

	// Initialize the agent executor with the specified "tools" and "model".
	const agentExecutor = await initializeAgentExecutorWithOptions(tools, model, {
		// The "agentType" is set to "zero-shot-react-description", which means the agent
		// will try to understand the input and use the appropriate tool to answer the question.
		agentType: "zero-shot-react-description",

		// Enable additional logging for debugging purposes
		verbose: true,
	});

	// The agent will send the "input" + the "tools" to the "model" and will ask,
	// what it should use to find the answer for the "input". The "model" will reason that
	// the "LengthChecker" should be used, which the agent is then using.
	// The result is saved into "response" and should be the length of the sentence "This is the way"
	const response = await agentExecutor.call({
		input: `How long is this sentence: "This is the way"`,
	});

	console.log(response);
}
