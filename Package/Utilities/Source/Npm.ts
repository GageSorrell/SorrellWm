/* File:      Npm.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { access, realpath } from "fs/promises";
import { dirname, join, resolve } from "path";
import { constants as FsConstants } from "fs";
import type { IPackageJson } from "package-json-type";
import Process from "process";

export async function GetPackageJson(Path?: string): Promise<IPackageJson>
{
    const Root: string = await GetPackageRootDirectory(Path);

    return JSON.parse(resolve(Root, "package.json")) as IPackageJson;
}

/**
 * Get the root directory of the Node.js project in which the
 * current working directory resides.
 *
 * @param Path - *(Optional)* The given path from which to look for a root directory.
 *
 * @throws `Error` iff the current working directory is not within a Node.js project.
 *
 * @returns The path of the root directory of the Node.js project in which the
 * current working directory resides.
 */
export async function GetPackageRootDirectory(Path?: string): Promise<string>
{
    let CurrentDirectory: string = await realpath(Path || Process.cwd());

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
