import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const { baseUrl, paths } = compilerOptions;

// Sync object
const config: Config.InitialOptions = {
	verbose: true,
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	modulePaths: [baseUrl],
	moduleNameMapper: pathsToModuleNameMapper(paths),
};

export default config;
