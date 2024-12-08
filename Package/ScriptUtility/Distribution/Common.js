/* File:      Common.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
import * as Path from "path";
import Ora from "ora";
import Chalk from "chalk";
import { LogError } from "./Log.js";
export const FormatCode = (Code) => {
    return Chalk.bgGray.white(Code);
};
export const DoTasks = async (...Tasks) => {
    await Promise.all(Tasks.map(([Task, Description]) => {
        return DoTask(Task, Description);
    }));
};
export const DoTask = async (Task, Description) => {
    const Spinner = Ora(Description + "...").start();
    const Result = await Task();
    Spinner.stopAndPersist({ symbol: "✓", text: Description });
    return Result;
};
const PrintBanner = (ScriptTitle, ScriptDescription) => {
    const TerminalWidth = process.stdout.columns;
    const Title = "🪟  SorrellWm";
    const Padding = Math.max(0, TerminalWidth - Title.length);
    const PaddingLeftNum = Math.floor(Padding / 2);
    const PaddingRightNum = Math.ceil(Padding / 2);
    const PaddingLeft = " ".repeat(PaddingLeftNum);
    const PaddingRight = " ".repeat(PaddingRightNum);
    const PaddedText = PaddingLeft + Title + PaddingRight;
    const EmptyLine = Chalk.bgBlue(" ".repeat(TerminalWidth));
    console.log(Chalk.bgBlue.white(PaddedText +
        EmptyLine +
        " " + Chalk.bold(ScriptTitle + ": ") + ScriptDescription +
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
/**
 * Like `Array#map`, but if the predicate returns `undefined`,
 * then that item will not have a corresponding item in the
 * returned array.
 */
export const MapSome = (InArray, Predicate) => {
    return InArray.map(Predicate).filter((Item) => Item !== undefined);
};
export const GetPath = (CommonPath) => {
    switch (CommonPath) {
        case "Configuration":
            return Path.resolve(GetMonorepoPath(), "Configuration");
        case "Main":
            return Path.resolve(GetMonorepoPath(), "Application", "Source", "Main");
        case "Source":
            return Path.resolve(GetMonorepoPath(), "Application", "Source");
        case "Package":
            return Path.resolve(GetMonorepoPath(), "Package");
        case "Renderer":
            return Path.resolve(GetMonorepoPath(), "Application", "Source", "Renderer");
        case "Script":
            return Path.resolve(GetMonorepoPath(), "Script");
        case "Windows":
            return Path.resolve(GetMonorepoPath(), "Application", "Windows");
        default:
            LogError("The function `GetPath` was called, but the argument was not of type `FCommonPath`.");
            return "";
    }
};
//# sourceMappingURL=Common.js.map