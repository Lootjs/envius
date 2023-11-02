import { isSecretKey, ResultData } from "./combineEnvFiles";

type ConfigType = {
    indent: number;
    state: ResultData;
};

const getVariants = (variants: string[], fallbackType = 'string') => {
    if (variants.find(variant => isSecretKey(variant))) {
        return fallbackType;
    }

    return variants.map(variant => `'${variant}'`).join(' | ');
};

const generateIndent = (indentCount: number) => ' '.repeat(indentCount);

export const generateTypes = ({ indent = 4, state }: ConfigType) => {
    const space = generateIndent(indent);
    let output = '';

    for (const key in state) {
        if (state[key].comment) {
            output += `${space}/**\n${space}* ${state[key].comment}\n${space}*/\n`;
        }

        const type = getVariants(state[key].variants, state[key].type);
        output += `${space}${key}: ${type};\n`;
    }

    return output;
};