import { defaults } from "jest-config";

const jestConfig = {
	...defaults,
	transform: {
		"^.+\\.(t|j)sx?$": [
			"@swc/jest"
		],
	},
	transformIgnorePatterns: ["/node_modules/(?!(nanoid)/)"],
	extensionsToTreatAsEsm: [".ts"],
};

export default jestConfig;
