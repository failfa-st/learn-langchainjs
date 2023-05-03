import { Tool } from "langchain/tools";

export class LengthChecker extends Tool {
	name = "length_checker";
	description = `A tool that checks the length of a string.
	Input should be a String and the output is the length of the String as a String`;

	/** @ignore */
	async _call(input) {
		return String(String(input).length);
	}
}
