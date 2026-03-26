/* File:      Npm.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { access, realpath } from "fs/promises";
import { basename, dirname, extname, join } from "path";
import { constants as FsConstants } from "fs";
import Process from "process";

export async function GetPackageRootDirectory(): Promise<string>
{
    let CurrentDirectory: string = await realpath(Process.cwd());

    while (true)
    {
        const PackageJsonPath: string = join(CurrentDirectory, "package.json");

        try
        {
            await access(PackageJsonPath, FsConstants.F_OK);
            return CurrentDirectory;
        }
        catch { /* Empty */ }

        const ParentDirectory: string = dirname(CurrentDirectory);

        if (ParentDirectory === CurrentDirectory)
        {
            throw new Error(
                `Could not find a Node.js project root above "${ Process.cwd() }".`
            );
        }

        CurrentDirectory = ParentDirectory;
    }
}

async function PathExists(Path: string): Promise<boolean>
{
    try
    {
        await access(Path, FsConstants.F_OK);
        return true;
    }
    catch
    {
        return false;
    }
}

/**
 * Given a path at which we wish to create a new file, check if a file at that
 * path already exists, and if so, then append `(${ number })` before the file
 * extension, consistent with the Windows Explorer handles conflicting file
 * names when pasting files.
 */
export async function GetSafeNewPath(InPath: string): Promise<string>
{
    const DirectoryPath: string = dirname(InPath);
    const Extension: string = extname(InPath);
    const FileName: string = basename(InPath);
    const BaseFileName: string =
        Extension === ""
            ? FileName
            : basename(InPath, Extension);

    let CandidatePath: string = InPath;
    let Index: number = 1;

    while (await PathExists(CandidatePath))
    {
        const CandidateFileName: string = `${BaseFileName} (${Index})${Extension}`;
        CandidatePath = join(DirectoryPath, CandidateFileName);
        Index++;
    }

    return CandidatePath;
}
