import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";

import { LengthChecker } from "./tools/lengthChecker.ts";

export async function run() {
	const model = new OpenAI({ modelName: "gpt-3.5-turbo", maxRetries: 0, temperature: 0.2 });

	const tools = [new LengthChecker()];

	// https://js.langchain.com/docs/modules/agents/executor/
	const agentExecutor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: "zero-shot-react-description",
		verbose: true,
	});

	const response = await agentExecutor.call({
		input: `How long is this sentence: "This is the way"`,
	});

	console.log(response);
}
