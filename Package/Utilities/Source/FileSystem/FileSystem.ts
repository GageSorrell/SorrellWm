/**
 * @file      FileSystem.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { basename, dirname, extname, join } from "path";
import { type FFileExtension } from "./FileSystem.Types.ts";
import { type FileHandle } from "fs/promises";
import { promises as Fs } from "fs";
import { constants as FsConstants } from "fs";
import os from "os";

async function PathExists(Path: string): Promise<boolean>
{
    try
    {
        await Fs.access(Path, FsConstants.F_OK);
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
 * @remarks This *does* attempt to create a file at the desired path.  The file is
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
        const ThisFileHandle: FileHandle = await Fs.open(FilePath, "wx");
        await ThisFileHandle.close();
        if (!PersistNewFile)
        {
            await Fs.unlink(FilePath);
        }
        return true;
    }
    catch
    {
        return false;
    }
}

/**
 * Write a text file to a given {@link Path} having contents {@link Contents}.
 *
 * @param Path - The path of the file that will be written.
 * @param Contents - The text contents of the file to write.
 *
 * @returns {Promise<void>} A {@link Promise} that resolves when the call to {@link Fs.writeFile} resolves.
 *
 * @example
 * ```typescript
 * import { WriteTextFile } from "@sorrell/utilities/fs";
 * import { resolve } from "path";
 *
 * const MyReadMe: string = "# ReadMe\n\nThis package accomplishes...\n";
 * const MyReadMePath: string = resolve(".");
 *
 * await WriteTextFile(MyReadMePath, MyReadMe);
 * ```
 */
export async function WriteTextFile(Path: string, Contents: string): Promise<void>
{
    await Fs.writeFile(Path, Contents, { encoding: "utf-8" });
}

import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import * as Readline from "node:readline";

type DeletePhase = "Scanning" | "Deleting" | "Done";

type DeleteEntryKind = "File" | "Directory" | "Other";

type DeleteEntry = {
    EntryPath: string;
    Kind: DeleteEntryKind;
    Size: number;
};

type DeleteProgress = {
    Phase: DeletePhase;
    CurrentPath: string | null;
    DiscoveredEntries: number;
    TotalEntries: number;
    DeletedEntries: number;
    TotalBytes: number;
    DeletedBytes: number;
};

type DeleteWithProgressOptions = {
    OnProgress?: (Progress: DeleteProgress) => void;
    Signal?: AbortSignal;
};

function IsMissingFileError(ErrorValue: unknown): boolean
{
    return (
        typeof ErrorValue === "object" &&
        ErrorValue !== null &&
        "code" in ErrorValue &&
        ErrorValue.code === "ENOENT"
    );
}

function CloneProgress(Progress: DeleteProgress): DeleteProgress
{
    return { ...Progress };
}

async function BuildDeletionPlan(
    RootPath: string,
    Progress: DeleteProgress,
    Options: DeleteWithProgressOptions
): Promise<DeleteEntry[]>
{
    const Entries: DeleteEntry[] = [];

    async function Visit(CurrentPath: string): Promise<void>
    {
        Options.Signal?.throwIfAborted();

        Progress.Phase = "Scanning";
        Progress.CurrentPath = CurrentPath;
        Options.OnProgress?.(CloneProgress(Progress));

        let Stats;

        try
        {
            Stats = await FileSystem.lstat(CurrentPath);
        }
        catch (ErrorValue)
        {
            if (IsMissingFileError(ErrorValue))
            {
                return;
            }

            throw ErrorValue;
        }

        if (Stats.isDirectory())
        {
            const Children = await FileSystem.readdir(CurrentPath, {
                withFileTypes: true
            });

            for (const Child of Children)
            {
                await Visit(Path.join(CurrentPath, Child.name));
            }

            Entries.push({
                EntryPath: CurrentPath,
                Kind: "Directory",
                Size: 0
            });
        }
        else
        {
            const Size = Stats.isFile() ? Stats.size : 0;

            Entries.push({
                EntryPath: CurrentPath,
                Kind: Stats.isFile() ? "File" : "Other",
                Size
            });

            Progress.TotalBytes += Size;
        }

        Progress.DiscoveredEntries = Entries.length;
        Options.OnProgress?.(CloneProgress(Progress));
    }

    await Visit(RootPath);

    return Entries;
}

export async function DeleteWithProgress(
    RootPath: string,
    Options: DeleteWithProgressOptions = {}
): Promise<void>
{
    const Progress: DeleteProgress = {
        Phase: "Scanning",
        CurrentPath: null,
        DiscoveredEntries: 0,
        TotalEntries: 0,
        DeletedEntries: 0,
        TotalBytes: 0,
        DeletedBytes: 0
    };

    const Entries = await BuildDeletionPlan(RootPath, Progress, Options);

    Progress.Phase = "Deleting";
    Progress.TotalEntries = Entries.length;
    Progress.CurrentPath = null;
    Options.OnProgress?.(CloneProgress(Progress));

    for (const Entry of Entries)
    {
        Options.Signal?.throwIfAborted();

        Progress.CurrentPath = Entry.EntryPath;
        Options.OnProgress?.(CloneProgress(Progress));

        try
        {
            if (Entry.Kind === "Directory")
            {
                await FileSystem.rmdir(Entry.EntryPath);
            }
            else
            {
                await FileSystem.unlink(Entry.EntryPath);
            }
        }
        catch (ErrorValue)
        {
            if (!IsMissingFileError(ErrorValue))
            {
                throw ErrorValue;
            }
        }

        Progress.DeletedEntries += 1;
        Progress.DeletedBytes += Entry.Size;

        Options.OnProgress?.(CloneProgress(Progress));
    }

    Progress.Phase = "Done";
    Progress.CurrentPath = null;
    Options.OnProgress?.(CloneProgress(Progress));
}

function FormatBytes(Bytes: number): string
{
    const Units = ["B", "KB", "MB", "GB", "TB"];
    let Value = Bytes;
    let UnitIndex = 0;

    while (Value >= 1024 && UnitIndex < Units.length - 1)
    {
        Value /= 1024;
        UnitIndex += 1;
    }

    return `${Value.toFixed(UnitIndex === 0 ? 0 : 1)} ${Units[UnitIndex]}`;
}
