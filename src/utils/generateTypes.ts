import { ResultData } from "./combineEnvFiles";

type ConfigType = {
    indent: number;
    state: ResultData;
};

const getVariants = (variants: string[]) => {
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
        const type = state[key].variants.length > 1 ? getVariants(state[key].variants) : state[key].type;
        output += `${space}${key}: ${type};\n`;
    }

    return output;
};