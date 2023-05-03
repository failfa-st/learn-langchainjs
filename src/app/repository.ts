import type { SimpleGit } from "simple-git";
import { simpleGit } from "simple-git";

export async function clonePublicRepo(repoUrl: string, destinationFolder: string): Promise<string> {
	try {
		// Check if the repo URL is valid
		if (!/^https:\/\/github\.com\/[^\/]+\/[^\/]+(\.git)?$/.test(repoUrl)) {
			throw new Error("Invalid GitHub repository URL");
		}

		// Ensure destination folder is provided
		if (!destinationFolder) {
			throw new Error("Destination folder is required");
		}

		// Initialize the simple-git instance
		const git: SimpleGit = simpleGit();

		// Clone the public repository
		await git.clone(repoUrl, destinationFolder);

		return `Successfully cloned ${repoUrl} into ${destinationFolder}`;
	} catch (error) {
		if (error.message.includes("already exists and is not an empty directory")) {
			return `repo is already checked out at ${destinationFolder}, consider deleting it if you want to have the latest version`;
		}

		return `Error cloning repository: ${error.message}`;
	}
}

