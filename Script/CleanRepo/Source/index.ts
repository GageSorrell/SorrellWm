/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import * as ChildProcess from "child_process";
import * as FileSystem from "fs/promises";
import * as Path from "path";
import { type Stats } from "fs";

/* eslint-disable no-console */

type FCommandResult =
{
    ExitCode: number;
};

type FChildProcess = ChildProcess.ChildProcess;

function GetGrandfatherDirectoryPathFromModuleDirectory(ModuleDirectoryPath: string): string
{
    const GrandfatherDirectoryPath: string = Path.resolve(ModuleDirectoryPath, "..", "..");
    const FileSystemRootPath: string = Path.parse(GrandfatherDirectoryPath).root;

    if (GrandfatherDirectoryPath === FileSystemRootPath)
    {
        throw new Error(`Refusing to operate on filesystem root: "${ GrandfatherDirectoryPath }"`);
    }

    return GrandfatherDirectoryPath;
}

async function PathExistsAsync(TargetPath: string): Promise<boolean>
{
    try
    {
        await FileSystem.access(TargetPath);
        return true;
    }
    catch
    {
        return false;
    }
}

async function EnsureDirectoryExistsAsync(DirectoryPath: string): Promise<void>
{
    const Exists: boolean = await PathExistsAsync(DirectoryPath);
    if (!Exists)
    {
        throw new Error(`Expected directory does not exist: "${DirectoryPath}"`);
    }

    const Statistics: Stats = await FileSystem.stat(DirectoryPath);
    if (!Statistics.isDirectory())
    {
        throw new Error(`Expected a directory but found something else: "${DirectoryPath}"`);
    }
}

type FDeletionStats =
{
    DeletedNodeModulesCount: number;
    DeletedTsBuildInfoCount: number;
};

async function DeleteArtifactsRecursivelyAsync(RootDirectoryPath: string): Promise<FDeletionStats>
{
    let DeletedNodeModulesCount: number = 0;
    let DeletedTsBuildInfoCount: number = 0;

    async function WalkAsync(CurrentDirectoryPath: string): Promise<void>
    {
        type FDirectoryEntry =
        {
            name: string;
            isDirectory: () => boolean;
            isFile: () => boolean;
            isSymbolicLink: () => boolean;
        };

        let DirectoryEntries: TArray<FDirectoryEntry>;

        try
        {
            DirectoryEntries = await FileSystem.readdir(CurrentDirectoryPath, { withFileTypes: true });
        }
        catch (Error)
        {
            console.warn(`Skipping unreadable directory: "${ CurrentDirectoryPath }"`, Error);
            return;
        }

        for (const DirectoryEntry of DirectoryEntries)
        {
            if (DirectoryEntry.isSymbolicLink())
            {
                continue;
            }

            const EntryPath: string = Path.join(CurrentDirectoryPath, DirectoryEntry.name);

            if (DirectoryEntry.isDirectory())
            {
                if (DirectoryEntry.name === "node_modules")
                {
                    try
                    {
                        console.log(`Deleting "${ EntryPath }..."`);
                        await FileSystem.rm(EntryPath, { force: true, recursive: true });
                        DeletedNodeModulesCount += 1;
                    }
                    catch (Error)
                    {
                        console.error(`Failed to delete directory "${ EntryPath }"`, Error);
                    }

                    continue;
                }

                await WalkAsync(EntryPath);
                continue;
            }

            if (DirectoryEntry.isFile())
            {
                if (DirectoryEntry.name.endsWith(".tsbuildinfo"))
                {
                    try
                    {
                        console.log(`Deleting "${ EntryPath }..."`);
                        await FileSystem.rm(EntryPath, { force: true });
                        DeletedTsBuildInfoCount += 1;
                    }
                    catch (Error)
                    {
                        console.error(`Failed to delete file: "${ EntryPath }"`, Error);
                    }
                }
            }
        }
    }

    await WalkAsync(RootDirectoryPath);

    return { DeletedNodeModulesCount, DeletedTsBuildInfoCount };
}

function RunCommandAsync(
    Command: string,
    Arguments: TArray<string>,
    WorkingDirectoryPath: string
): Promise<FCommandResult>
{
    return new Promise<FCommandResult>(
        (Resolve: ((Result: FCommandResult) => void), Reject: ((Error: unknown) => void)) =>
        {
            const Child: FChildProcess = ChildProcess.spawn(Command, Arguments, {
                cwd: WorkingDirectoryPath,
                shell: true,
                stdio: "inherit"
            });

            Child.on("error", (Error: unknown) =>
            {
                Reject(Error);
            });

            Child.on("close", (ExitCode: number) =>
            {
                Resolve({ ExitCode: ExitCode ?? 0 });
            });
        }
    );
}

async function RunCommandOrThrowAsync(
    Command: string,
    Arguments: TArray<string>,
    WorkingDirectoryPath: string
): Promise<void>
{
    console.log(`\nRunning: ${Command} ${Arguments.join(" ")}\nIn: "${WorkingDirectoryPath}"\n`);

    const Result: FCommandResult = await RunCommandAsync(Command, Arguments, WorkingDirectoryPath);

    if (Result.ExitCode !== 0)
    {
        /* eslint-disable-next-line @stylistic/max-len */
        throw new Error(`Command failed (exit code ${ Result.ExitCode }): ${ Command } ${ Arguments.join(" ") } (cwd: "${ WorkingDirectoryPath }")`);
    }
}

export async function Main(): Promise<void>
{
    const ModuleDirectoryPath: string = Path.resolve(".");

    const GrandfatherDirectoryPath: string =
        GetGrandfatherDirectoryPathFromModuleDirectory(ModuleDirectoryPath);

    const ScriptBuildDirectoryPath: string =
        Path.resolve(ModuleDirectoryPath, "..", "Build");

    const ApplicationWindowsDirectoryPath: string =
        Path.resolve(ModuleDirectoryPath, "..", "..", "Application", "Windows");

    const ApplicationDirectoryPath: string =
        Path.resolve(ModuleDirectoryPath, "..", "..", "Application");

    await EnsureDirectoryExistsAsync(GrandfatherDirectoryPath);
    await EnsureDirectoryExistsAsync(ScriptBuildDirectoryPath);
    await EnsureDirectoryExistsAsync(ApplicationWindowsDirectoryPath);
    await EnsureDirectoryExistsAsync(ApplicationDirectoryPath);

    console.log(`Grandfather directory: "${ GrandfatherDirectoryPath }"`);
    /* eslint-disable-next-line @stylistic/max-len */
    console.log("Deleting all \"node_modules\" directories and \"*.tsbuildinfo\" files under that directory...\n");

    const DeleteResult: FDeletionStats = await DeleteArtifactsRecursivelyAsync(GrandfatherDirectoryPath);

    console.log(`\nDeleted node_modules directories: ${ DeleteResult.DeletedNodeModulesCount }`);
    console.log(`Deleted *.tsbuildinfo files: ${ DeleteResult.DeletedTsBuildInfoCount }\n`);

    // await RunCommandOrThrowAsync("yarn", [ "install" ], GrandfatherDirectoryPath);
    // await RunCommandOrThrowAsync("yarn", [ "run", "build" ], ScriptBuildDirectoryPath);
    // await RunCommandOrThrowAsync("npm", [ "install" ], ApplicationWindowsDirectoryPath);
    // await RunCommandOrThrowAsync("npm", [ "install" ], ApplicationDirectoryPath);
}

Main().catch((Error: unknown) =>
{
    console.error(Error);
    process.exitCode = 1;
});
