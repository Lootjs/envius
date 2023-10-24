import * as vscode from 'vscode';
import  { processEnvGeneratorCommand } from './processEnvGeneratorCommand';

export function activate(context: vscode.ExtensionContext) {

	console.log('activate');
	vscode.window.showWarningMessage(`Found EnviUs`);
	let commandForProcessEnv = vscode.commands.registerCommand('envius.create-process-types', processEnvGeneratorCommand);

	context.subscriptions.push(commandForProcessEnv);
}

export function deactivate() {}
