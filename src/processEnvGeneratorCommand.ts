import * as vscode from 'vscode';
import { getEnvFiles } from "./utils/getEnvFiles";
import { combineEnvFiles } from "./utils/combineEnvFiles";
import { getWorkspace } from "./utils/getWorkspace";
import { writeFileSync } from 'fs';
import { join as pathJoin } from 'path';

const getVariants = (variants: string[]) => {
	return variants.map(variant => `'${variant}'`).join(' | ');
};

export const processEnvGeneratorCommand = async () => {
	const ws = getWorkspace();
	if (!ws) {
		return [];
	}

	const files = await getEnvFiles();
	const envVars = combineEnvFiles(files);
	let output = 'declare namespace NodeJS {\n' +
		'    export interface ProcessEnv {\n';

	for (const key in envVars) {
		if (envVars[key].comment) {
			output += `    /**\n     * ${envVars[key].comment}\n     */\n`;
		}
		const type = envVars[key].variants.length > 1 ? getVariants(envVars[key].variants) : envVars[key].type;
		output += `    ${key}: ${type};\n\n`;
	}

	output += '    }\n' +
		'}';
	writeFileSync(vscode.Uri.joinPath(ws.uri, 'env.d.ts').fsPath, output);
	// vscode.window.showWarningMessage(`envius.create-process-types triggered`);
};