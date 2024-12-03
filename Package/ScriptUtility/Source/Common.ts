/* File:      Common.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import chalk from "chalk";

export const Run = (MainFunction: (() => Promise<void>), ScriptTitle: string, Description: string): void =>
{
    const TerminalWidth: number = process.stdout.columns;
    const Title: string = "🪟  SorrellWm";
    const Padding: number = Math.max(0, TerminalWidth - Title.length);
    const PaddingLeftNum: number = Math.floor(Padding / 2);
    const PaddingRightNum: number = Math.ceil(Padding / 2);
    const PaddingLeft: string = " ".repeat(PaddingLeftNum);
    const PaddingRight: string = " ".repeat(PaddingRightNum);
    const PaddedText: string = PaddingLeft + Title + PaddingRight;
    console.log(chalk.bgBlue.white(PaddedText));
    console.log("Foo");

    MainFunction();
};
