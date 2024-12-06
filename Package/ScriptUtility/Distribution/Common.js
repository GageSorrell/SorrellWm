/* File:      Common.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
import chalk from "chalk";
import * as Path from "path";
const PrintBanner = (ScriptTitle, ScriptDescription) => {
    const TerminalWidth = process.stdout.columns;
    const Title = "🪟  SorrellWm";
    const Padding = Math.max(0, TerminalWidth - Title.length);
    const PaddingLeftNum = Math.floor(Padding / 2);
    const PaddingRightNum = Math.ceil(Padding / 2);
    const PaddingLeft = " ".repeat(PaddingLeftNum);
    const PaddingRight = " ".repeat(PaddingRightNum);
    const PaddedText = PaddingLeft + Title + PaddingRight;
    const EmptyLine = chalk.bgBlue(" ".repeat(TerminalWidth));
    console.log(chalk.bgBlue.white(PaddedText +
        EmptyLine +
        " " + chalk.bold(ScriptTitle + ": ") + ScriptDescription +
        EmptyLine));
};
export const Run = (MainFunction, ScriptTitle, ScriptDescription) => {
    PrintBanner(ScriptTitle, ScriptDescription);
    MainFunction();
};
export const GetMonorepoPath = () => {
    return import.meta.dirname.split(Path.sep).slice(0, -3).join(Path.sep);
};
export const GetRef = (InitialValue) => {
    return {
        Current: InitialValue
    };
};
//# sourceMappingURL=Common.js.map