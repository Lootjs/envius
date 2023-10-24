import * as vscode from 'vscode';
import  { processEnvGeneratorCommand } from './processEnvGeneratorCommand';
import  { processImportMetaEnvGeneratorCommand } from './processImportMetaEnvGeneratorCommand';
import type { ResultData } from "./utils/combineEnvFiles";
import {getWorkspace} from "./utils/getWorkspace";
import {getEnvFiles} from "./utils/getEnvFiles";
import {combineEnvFiles} from "./utils/combineEnvFiles";

let state: ResultData = {};

export async function activate(context: vscode.ExtensionContext) {
	const ws = getWorkspace();
	if (!ws) {
		return;
	}

	const files = await getEnvFiles();
	state = combineEnvFiles(files);
	console.log(state);
	vscode.window.showWarningMessage(`Found EnviUs`);
	let commandForProcessEnv = vscode.commands.registerCommand('envius.create-process-types', () => {
		processEnvGeneratorCommand(state);
	});
	let commandForImportMetaEnv = vscode.commands.registerCommand('envius.create-import-meta-types', () => {
		processImportMetaEnvGeneratorCommand(state);
	});

	context.subscriptions.push(commandForProcessEnv);
}

export function deactivate() {
	state = {};
}
