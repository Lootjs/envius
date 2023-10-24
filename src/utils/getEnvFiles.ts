import * as vscode from 'vscode';
import { getWorkspace } from "./getWorkspace";

export const getEnvFiles = async () => {
    const ws = getWorkspace();
    if (!ws) {
        return [];
    }
    const files = await vscode.workspace.fs.readDirectory(ws.uri);
    const envFiles: string[] = [];
    files.forEach(([file]) => {
        if (file.includes('.env')) {
            envFiles.push(file);
        }
    });

    return envFiles;
};