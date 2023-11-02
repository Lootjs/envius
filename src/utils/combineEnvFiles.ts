import {type EnvData, parseEnvFile} from "./parseEnvFile";
import {MAX_LENGTH_TO_KEY} from "./constants";

export type ResultData = {
    [key: string]: EnvData & {
        variants: string[]
    }
};

export const isSecretKey = (str: string) => str.length > MAX_LENGTH_TO_KEY;

const collectData = (objects: (EnvData[] | undefined)[]) => {
    const result: ResultData = {};
    for (const obj of objects) {
        if (!obj) {
            break;
        }

        for (const envData of obj) {
            if (!result.hasOwnProperty(envData.key)) {
                result[envData.key] = {
                    ...envData,
                    variants: [envData.value],
                };
            } else {
                if (!result[envData.key].variants.includes(envData.value) && !isSecretKey(envData.value)) {
                    result[envData.key].variants.push(envData.value);
                }

                if (!result[envData.key].comment) {
                    result[envData.key].comment = envData.comment;
                }
            }
        }
    }

    return result;
};


export const combineEnvFiles = (files: string[]) => {
    const parsedEnvData = files.map(parseEnvFile);

    return collectData(parsedEnvData);
};