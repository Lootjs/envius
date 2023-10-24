import * as vscode from 'vscode';
import { ResultData } from "./utils/combineEnvFiles";
import { getWorkspace } from "./utils/getWorkspace";
import { writeFileSync } from 'fs';
import {generateTypes} from "./utils/generateTypes";


export const processImportMetaEnvGeneratorCommand = async (envVars: ResultData) => {
	const ws = getWorkspace();
	if (!ws) {
		return [];
	}

	let output = '/// <reference types="vite/client" />\n\n' +
		'interface ImportMeta {\n' +
		'  env: {\n';

	output += generateTypes({ indent: 4, state: envVars });


	output += '  }\n' +
		'}';

	writeFileSync(vscode.Uri.joinPath(ws.uri, 'env.d.ts').fsPath, output);
};