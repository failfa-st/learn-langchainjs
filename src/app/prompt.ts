/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
import fs from "node:fs/promises";

import inquirer from "inquirer";
import autoComplete from "inquirer-autocomplete-prompt";
import ora from "ora";

import { examplesDirectory, examplesDirectoryRelative } from "../constants.ts";

import { formattedResult, query } from "./query.ts";
import { updateVectorStore } from "./vectorStore.ts";

inquirer.registerPrompt("autocomplete", autoComplete);

export async function prompt() {
	while (true) {
		const action = await mainMenuPrompt();
		await handleAction(action);
	}
}

const mainMenuPrompt = async () => {
	const choices = [
		{ name: "Examples", value: "examples" },
		{ name: "Update VectorStore", value: "update" },
		{ name: "Ask a question about langchainjs", value: "query" },
		{ name: "Exit", value: "exit" },
	];

	const { action } = await inquirer.prompt([
		{
			type: "list",
			name: "action",
			message: "What would you like to do?",
			choices,
		},
	]);

	return action;
};

const examplesMenuPrompt = async () => {
	const choices = [
		...(await getExamples()),
		new inquirer.Separator(),
		{ name: "Back to main menu", value: "back" },
	];

	const { example } = await inquirer.prompt([
		{
			type: "list",
			name: "example",
			message: "Select an example to run:",
			choices,
		},
	]);

	return example;
};

const getExamples = async () => {
	const files = await fs.readdir(examplesDirectory);
	return files.map(file => ({
		name: file,
		value: `${examplesDirectoryRelative}/${file}`,
	}));
};

const queryInputPrompt = async () => {
	while (true) {
		const { action } = await inquirer.prompt([
			{
				type: "input",
				name: "action",
				message: "Question (type 'back' to return to main menu):",
			},
		]);

		if (action.toLowerCase() === "back") {
			return "back";
		}

		const result = await query(action);
		formattedResult(result);
	}
};

const handleAction = async (action: string) => {
	if (action === "examples") {
		while (true) {
			const examplePath = await examplesMenuPrompt();
			if (examplePath === "back") {
				break;
			}

			const { run } = await import(examplePath);

			if (run) {
				await run();
				console.log();
			} else {
				console.log("Example not found or invalid format");
			}
		}

		return;
	}

	switch (action) {
		case "update": {
			const updateSpinner = ora("Updating VectorStore...").start();
			await updateVectorStore(updateSpinner);
			updateSpinner.stop();
			break;
		}

		case "query": {
			await queryInputPrompt();
			break;
		}

		case "exit": {
			console.log("Goodbye!");
			process.exit(0);
			break;
		}

		default:
			console.log("Invalid action");
			break;
	}
};

