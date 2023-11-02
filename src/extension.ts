import * as vscode from 'vscode';
import { processEnvGeneratorCommand } from './processEnvGeneratorCommand';
import { processImportMetaEnvGeneratorCommand } from './processImportMetaEnvGeneratorCommand';
import { getWorkspace } from "./utils/getWorkspace";
import { getEnvFiles } from "./utils/getEnvFiles";
import { combineEnvFiles } from "./utils/combineEnvFiles";
import type { ResultData } from "./utils/combineEnvFiles";

let state: ResultData = {};

const getState = async () => {
	return combineEnvFiles(
		await getEnvFiles()
	);
};

export async function activate(context: vscode.ExtensionContext) {
	vscode.window.showWarningMessage(`Found EnviUs`);
	const ws = getWorkspace();
	if (!ws) {
		return;
	}

	state = await getState();
	// console.log(state);
	let commandForProcessEnv = vscode.commands.registerCommand('envius.create-process-types', () => {
		processEnvGeneratorCommand(state);
	});
	let commandForImportMetaEnv = vscode.commands.registerCommand('envius.create-import-meta-types', () => {
		processImportMetaEnvGeneratorCommand(state);
	});

	context.subscriptions.push(commandForProcessEnv, commandForImportMetaEnv);

	let listeners: { watcher: vscode.FileSystemWatcher; path: string }[] = [];

	const configs = await vscode.workspace.findFiles(`**/.env*`);
	const configsWatcher = vscode.workspace.createFileSystemWatcher(
		`**/.env*`,
		false,
		false,
		false
	);

	configsWatcher.onDidCreate((e) => {
		watchEnv(e);
	});

	configsWatcher.onDidChange((e) => {
		watchEnv(e);
	});

	configsWatcher.onDidDelete((e) => {
		watchEnv(e, true);
	});

	const watchEnv = async (e: vscode.Uri, onlyRemove?: boolean) => {
		const existingListener = listeners.find(
			(listener) => listener.path === e.fsPath
		);

		if (existingListener) {
			existingListener.watcher.dispose();
			listeners = listeners.filter((e) => e.path !== existingListener.path);

			if (onlyRemove) {
				return;
			}
		}

		// console.log('hit');
		state = await getState();
		await processImportMetaEnvGeneratorCommand(state);
	};
	
	configs.map(async (e) => watchEnv(e));
}

export function deactivate() {
	state = {};
}
