/* File:      Npm.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { access, realpath } from "fs/promises";
import { dirname, join } from "path";
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
