import * as vscode from 'vscode';

export const getWorkspace = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        return;
    }

   return workspaceFolders[0];
};