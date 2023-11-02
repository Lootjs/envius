import * as vscode from 'vscode';
import { getWorkspace } from "./getWorkspace";
import { readFileSync } from 'fs';
import {EOL} from "os";
// import { EOL } from 'os';

export type PossibleEnvValueType = 'string' | 'number' | 'boolean';
export type EnvData = {
    type: PossibleEnvValueType;
    key: string;
    value: string;
    comment: string;
};

const determineType = (value: string): string => {
    if (['true', 'false'].includes(value)) {
        return 'boolean';
    }

    if (!isNaN(parseFloat(value)) && isFinite(Number(value))) {
        return 'number';
    }

    return 'string';
};

const parseEnv = (content: string): EnvData[] => {
    // @ts-ignore
    return content
        .split('\n')
        .filter(line => /=/i.test(line))
        .filter(line => !line.startsWith('#'))
        .map(line => {
            let [key, value] = line.split('=');
            let comment;

            if (!key && !value) {
                return;
            }

            [value, comment] = value.split('#');

            key = key.trim();
            value = value.trim().replace(/['"]/g, '');

            return {
                type: determineType(value) as PossibleEnvValueType,
                key,
                value,
                comment: (comment || '').trim(),
            };
        })
        .filter(item => item !== undefined);
};

export const parseEnvFile = (file: string): EnvData[] | undefined => {
    const ws = getWorkspace();
    if (!ws) {
        return;
    }

    try {
        const filePath = vscode.Uri.joinPath(ws.uri, file);
        const content = readFileSync(filePath.fsPath, 'utf8');

        return parseEnv(content);
    } catch (e) {
        console.error(e);
    }
};