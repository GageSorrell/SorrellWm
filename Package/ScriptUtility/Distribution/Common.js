/* File:      Common.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
import chalk from "chalk";
export const Run = (MainFunction, ScriptTitle, Description) => {
    const TerminalWidth = process.stdout.columns;
    const Title = "🪟 SorrellWm";
    const Padding = Math.max(0, TerminalWidth - Title.length);
    const PaddingLeftNum = Math.floor(Padding / 2);
    const PaddingRightNum = Math.ceil(Padding / 2);
    const PaddingLeft = " ".repeat(PaddingLeftNum);
    const PaddingRight = " ".repeat(PaddingRightNum);
    const PaddedText = PaddingLeft + Title + PaddingRight;
    console.log(chalk.bgBlue.white(PaddedText));
    console.log("Foo");
    MainFunction();
};
//# sourceMappingURL=Common.js.map