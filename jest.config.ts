import type { Config } from "jest";

const config: Config = {
	rootDir: ".",
	testEnvironment: "node",
	transform: {
		"^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }], // For TypeScript files
		"^.+\\.jsx?$": "babel-jest", // For JavaScript files
	},
};

export default config;
