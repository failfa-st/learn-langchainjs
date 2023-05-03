import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate,
	MessagesPlaceholder,
} from "langchain/prompts";

export async function run() {
	const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo", maxRetries: 0, temperature: 0.2 });

	const chatPrompt = ChatPromptTemplate.fromPromptMessages([
		SystemMessagePromptTemplate.fromTemplate("You are a JavaScript developer."),
		new MessagesPlaceholder("history"),
		HumanMessagePromptTemplate.fromTemplate("{input}"),
	]);

	const chain = new ConversationChain({
		memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
		prompt: chatPrompt,
		llm: chat,
		verbose: true,
	});

	const response1 = await chain.call({
		input: "Create an HelloWorld function",
	});

	console.log(response1);

	const response2 = await chain.call({
		input: "Please extend the code to make the text configurable",
	});

	console.log(response2);
}
