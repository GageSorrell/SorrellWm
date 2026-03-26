/* File:      Select.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Dirent, Stats } from "fs";
import { confirm, select } from "@inquirer/prompts";
import { extname, relative, resolve } from "path";
import { readdir, stat } from "fs/promises";

type FMenuSelection =
    | {
        Kind: "Parent";
    }
    | {
        Kind: "Directory";
        AbsolutePath: string;
    }
    | {
        Kind: "File";
        AbsolutePath: string;
    };

type TChoice<ValueType> =
    {
        description?: string;
        disabled?: boolean | string;
        name: string;
        value: ValueType;
    };

function IsTypeScriptModuleFile(FileName: string): boolean
{
    const Extension: string = extname(FileName).toLowerCase();
    return Extension === ".ts" || Extension === ".tsx";
}

function GetDisplayDirectory(ProjectRootDirectoryPath: string, CurrentDirectoryPath: string): string
{
    const RelativeDirectoryPath: string = relative(ProjectRootDirectoryPath, CurrentDirectoryPath);
    return RelativeDirectoryPath === "" ? "." : RelativeDirectoryPath;
}

async function ReadMenuChoices(
    ProjectRootDirectoryPath: string,
    CurrentDirectoryPath: string
): Promise<ReadonlyArray<TChoice<FMenuSelection>>>
{
    type FDirectory = Dirent<string>;
    const DirectoryEntries: ReadonlyArray<FDirectory> =
        await readdir(CurrentDirectoryPath, { withFileTypes: true });

    const SortDirectories = (A: FDirectory, B: FDirectory): number =>
    {
        return A.name.localeCompare(
            B.name,
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            });
    };

    const GetDirectoryChoice = (DirectoryEntry: FDirectory): TChoice<FMenuSelection> =>
    {
        const AbsolutePath: string = resolve(CurrentDirectoryPath, DirectoryEntry.name);

        return {
            description: "Open directory",
            name: `${DirectoryEntry.name}/`,
            value: {
                AbsolutePath,
                Kind: "Directory"
            }
        };
    };

    const IsDirectory = (DirectoryEntry: FDirectory): boolean =>
    {
        return DirectoryEntry.isDirectory();
    };

    const DirectoryChoices: Array<TChoice<FMenuSelection>> =
        DirectoryEntries
            .filter(IsDirectory)
            .sort(SortDirectories)
            .map(GetDirectoryChoice);

    const IsModule = (DirectoryEntry: FDirectory): boolean =>
    {
        return (
            DirectoryEntry.isFile() &&
            IsTypeScriptModuleFile(DirectoryEntry.name)
        );
    };

    const GetModuleChoice = (DirectoryEntry: FDirectory): TChoice<FMenuSelection> =>
    {
        const AbsolutePath: string = resolve(CurrentDirectoryPath, DirectoryEntry.name);

        return {
            description: "Select module",
            name: DirectoryEntry.name,
            value: {
                AbsolutePath,
                Kind: "File"
            }
        };
    };

    const FileChoices: Array<TChoice<FMenuSelection>> =
        DirectoryEntries
            .filter(IsModule)
            .sort(SortDirectories)
            .map(GetModuleChoice);

    const Choices: Array<TChoice<FMenuSelection>> = [ ];

    if (CurrentDirectoryPath !== ProjectRootDirectoryPath)
    {
        Choices.push({
            description: "Go to parent directory",
            name: "../",
            value: {
                Kind: "Parent"
            }
        });
    }

    Choices.push(...DirectoryChoices);
    Choices.push(...FileChoices);

    return Choices;
}

export async function PromptModule(
    ProjectRootDirectoryPathArgument: string
): Promise<string>
{
    const ProjectRootDirectoryPath: string = resolve(ProjectRootDirectoryPathArgument);
    const ProjectRootDirectoryStats: Stats = await stat(ProjectRootDirectoryPath);

    if (!ProjectRootDirectoryStats.isDirectory())
    {
        throw new Error(`The path "${ProjectRootDirectoryPath}" is not a directory.`);
    }

    let CurrentDirectoryPath: string = ProjectRootDirectoryPath;

    while (true)
    {
        const Choices: ReadonlyArray<TChoice<FMenuSelection>> = await ReadMenuChoices(
            ProjectRootDirectoryPath,
            CurrentDirectoryPath
        );

        if (Choices.length === 0)
        {
            throw new Error(
                `No subdirectories or TypeScript modules were found under "${ProjectRootDirectoryPath}".`
            );
        }

        const DisplayDirectory: string = GetDisplayDirectory(
            ProjectRootDirectoryPath,
            CurrentDirectoryPath
        );

        const Selection: FMenuSelection = await select<FMenuSelection>({
            choices: Choices,
            message: `Select a TypeScript module (${ DisplayDirectory })`
        });

        switch (Selection.Kind)
        {
            case "Parent":
                CurrentDirectoryPath = resolve(CurrentDirectoryPath, "..");
                break;
            case "Directory":
                CurrentDirectoryPath = Selection.AbsolutePath;
                break;
            case "File":
            {
                const RelativeModulePath: string = relative(
                    ProjectRootDirectoryPath,
                    Selection.AbsolutePath
                );

                const Confirmed: boolean = await confirm({
                    message: `Use "${RelativeModulePath}"?`
                });

                if (Confirmed)
                {
                    return Selection.AbsolutePath;
                }

                break;
            }
        }
    }
}
