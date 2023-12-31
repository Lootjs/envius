import * as vscode from 'vscode';
import { ResultData } from "./utils/combineEnvFiles";
import { getWorkspace } from "./utils/getWorkspace";
import { writeFileSync } from 'fs';
import { generateTypes } from "./utils/generateTypes";

export const processEnvGeneratorCommand = async (envVars: ResultData) => {
	const ws = getWorkspace();
	if (!ws) {
		return [];
	}

	let output = 'declare namespace NodeJS {\n' +
		'  export interface ProcessEnv {\n';

	output += generateTypes({ indent: 4, state: envVars });

	output += '  }\n' +
		'}';

	writeFileSync(vscode.Uri.joinPath(ws.uri, 'env.d.ts').fsPath, output);
};