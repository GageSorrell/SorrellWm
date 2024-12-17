/* File:      Common.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import Ora, { type Ora as FOra } from "ora";
import type { FCommonPath, TRef, TTaskTuple } from "./Common.Types.js";
import Chalk from "chalk";
import { LogError } from "./Log.js";

export const FormatCode = (Code: string): string =>
{
    return Chalk.bgGray.white(Code);
};

export const DoTasks = async <T>(...Tasks: Array<TTaskTuple<T>>): Promise<void> =>
{
    await Promise.allSettled(Tasks.map(([ Task, Description ]: TTaskTuple<T>): Promise<T> =>
    {
        return DoTask(Task, Description);
    }));
};

export const DoTask = async <T>(Task: (() => Promise<T>), Description: string): Promise<T> =>
{
    const Spinner: FOra = Ora(Description + "...").start();
    const Result: T = await Task();
    Spinner.stopAndPersist({ symbol: "✓", text: Description });
    return Result;
};

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
    const EmptyLine: string = Chalk.bgBlue(" ".repeat(TerminalWidth));
    console.log(
        Chalk.bgBlue.white(
            PaddedText +
            EmptyLine +
            " " + Chalk.bold(ScriptTitle + ": ") + ScriptDescription +
            EmptyLine
        )
    );
};

export const Run = (
    MainFunction: (() => Promise<void>),
    ScriptTitle: string,
    ScriptDescription: string
): void =>
{
    PrintBanner(ScriptTitle, ScriptDescription);
    MainFunction();
};

export const GetMonorepoPath = (): string =>
{
    return import.meta.dirname.split(Path.sep).slice(0, -3).join(Path.sep);
};

export const GetRef = <T>(InitialValue?: T): TRef<T> =>
{
    return {
        Current: InitialValue
    };
};

/**
 * Like `Array#map`, but if the predicate returns `undefined`,
 * then that item will not have a corresponding item in the
 * returned array.
 */
export const MapSome = <T, U>(
    InArray: Array<T> | Readonly<Array<T>>,
    Predicate: (Item: T) => (U | undefined)
): Array<U> =>
{
    return InArray.map(Predicate).filter((Item: U | undefined): boolean => Item !== undefined) as Array<U>;
};

export const GetPath = (CommonPath: FCommonPath): string =>
{
    switch (CommonPath)
    {
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
