/* File:      Common.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import chalk from "chalk";
import * as Path from "path";

const PrintBanner = (ScriptTitle: string, ScriptDescription: string): void =>
{
    const TerminalWidth: number = process.stdout.columns;
    const Title: string = "🪟  SorrellWm";
    const Padding: number = Math.max(0, TerminalWidth - Title.length);
    const PaddingLeftNum: number = Math.floor(Padding / 2);
    const PaddingRightNum: number = Math.ceil(Padding / 2);
    const PaddingLeft: string = " ".repeat(PaddingLeftNum);
    const PaddingRight: string = " ".repeat(PaddingRightNum);
    const PaddedText: string = PaddingLeft + Title + PaddingRight;
    const EmptyLine: string = chalk.bgBlue(" ".repeat(TerminalWidth));
    console.log(
        chalk.bgBlue.white(
            PaddedText +
            EmptyLine +
            " " + chalk.bold(ScriptTitle + ": ") + ScriptDescription +
            EmptyLine
        )
    );
};

export const Run = (MainFunction: (() => Promise<void>), ScriptTitle: string, ScriptDescription: string): void =>
{
    PrintBanner(ScriptTitle, ScriptDescription);
    MainFunction();
};

export const GetMonorepoPath = (): string =>
{
    return import.meta.dirname.split(Path.sep).slice(0, -3).join(Path.sep);
};
