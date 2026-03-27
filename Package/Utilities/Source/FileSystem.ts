/* File:      FileSystem.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type FileHandle, access, open, unlink } from "fs/promises";
import { basename, dirname, extname, join } from "path";
import { type FFileExtension } from "./index.js";
import { constants as FsConstants } from "fs";
import os from "os";

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
 * @param Extension - The file extension that you wish to test.
 * @returns Whether the file extension is valid on the current platform.
 */
export function IsSupportedFileExtension(Extension: FFileExtension): boolean
{
    let NormalizedExtension: string = Extension.slice(1);

    if (NormalizedExtension.startsWith("."))
    {
        NormalizedExtension = NormalizedExtension.slice(1);
    }

    if (NormalizedExtension.length === 0)
    {
        return false;
    }

    if (
        NormalizedExtension.includes("/")
        || NormalizedExtension.includes("\\")
        || NormalizedExtension.includes("\0")
    )
    {
        return false;
    }

    if (os.platform() === "win32")
    {
        /* eslint-disable-next-line no-control-regex */
        const HasIllegalCharacters: boolean = /[<>:"/\\|?*\x00-\x1F]/u.test(NormalizedExtension);
        if (HasIllegalCharacters)
        {
            return false;
        }

        if (/[ .]$/u.test(NormalizedExtension))
        {
            return false;
        }
    }

    return true;
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

/**
 * @param DirectoryPath - The path to the directory in which you wish to check.
 * @param FileName - The desired file name.
 * @param PersistNewFile - *(Optional)* Whether to keep the otherwise-temporary
 *                         file created at the desired path.
 * @param Extension - *(Optional)* If provided, the function will only return `true`
 *                    if `FileName.endsWith(Extension)` *and* the `Extension` is a valid
 *                    file extension.
 * @returns Whether a file of the given `FileName` can be created in `DirectoryPath`.
 *
 * @note This *does* attempt to create a file at the desired path.  The file is
 *       temporary iff `!PersistNewFile`, and is never created when this function
 *       returns `false`.
 */
export async function IsValidFileName(
    DirectoryPath: string,
    FileName: string,
    PersistNewFile: boolean = false,
    Extension: FFileExtension | undefined = undefined
): Promise<boolean>
{
    const ExtensionSafe: FFileExtension | null | "" = Extension !== undefined
        ? (Extension.startsWith(".") && IsSupportedFileExtension(Extension))
            ? Extension
            : null
        : "";

    const IsExtensionImproper: boolean = (
        ExtensionSafe === null ||
        ExtensionSafe === "." ||
        !FileName.endsWith(ExtensionSafe)
    );

    if (IsExtensionImproper)
    {
        return false;
    }

    const FilePath: string = join(DirectoryPath, FileName);

    try
    {
        const ThisFileHandle: FileHandle = await open(FilePath, "wx");
        await ThisFileHandle.close();
        if (!PersistNewFile)
        {
            await unlink(FilePath);
        }
        return true;
    }
    catch
    {
        return false;
    }
}
