/**
 * @file      FileSystem.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// @TODO TEMPORARY
/* eslint-disable jsdoc/require-jsdoc */

import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import type { Dirent, Stats } from "node:fs";
import { basename, dirname, extname, join } from "path";
import { type FFileExtension } from "./FileSystem.Types.ts";
import { type FileHandle } from "fs/promises";
import { promises as Fs } from "fs";
import { constants as FsConstants } from "fs";
import os from "os";

/* eslint-disable jsdoc/require-example */

/**
 * Determine whether an object exists at the given {@link Path}.
 *
 * @param Path - The path to check for the existence of an object within the current file system.
 * @returns {Promise<boolean>} Whether there is an object at the given {@link Path}.
 */
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
 * Determine whether the given {@link Extension | file extension} is valid on the current platform.
 *
 * @param Extension - The {@link FFileExtension | file extension} to test.
 * @returns {boolean} Whether the file extension is valid on the current platform.
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
 *
 * @param InPath - The path from which a safe path is derived.
 *
 * @returns {Promise<string>} The path derived from the given {@link InPath | path}
 * at which no object yet exists.
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

/* eslint-disable-next-line @typescript-eslint/typedef */
export const ReservedWindowsFileNames =
    [
        "CON",
        "PRN",
        "AUX",
        "NUL",
        "COM1",
        "COM2",
        "COM3",
        "COM4",
        "COM5",
        "COM6",
        "COM7",
        "COM8",
        "COM9",
        "LPT1",
        "LPT2",
        "LPT3",
        "LPT4",
        "LPT5",
        "LPT6",
        "LPT7",
        "LPT8",
        "LPT9"
    ] as const;

/* eslint-disable no-control-regex */

export/** A regular expression describing the characters that are not permitted in file names. */
const InvalidCharacters: RegExp = /[<>:"/\\|?*\u0000-\u001F]/u;

/* eslint-enable no-control-regex */

/**
 * Determines whether the given {@link FileName} is valid within the given {@link DirectoryPath}.
 *
 * @remarks This *does* attempt to create a file at the desired path.  The file is
 * temporary iff `!PersistNewFile`, and is never created when this function
 * returns `false`.
 *
 * @param DirectoryPath - The path to the directory in which you wish to check.
 * @param FileName - The desired file name.
 * @param PersistNewFile - If specified, whether to keep the otherwise-temporary file
 * created at the desired path.  This defaults to `false`.
 * @param Extension - If provided, the function will only return `true` if
 * `FileName.endsWith(Extension)` *and* the `Extension` is a valid file extension.
 *
 * @returns {Promise<boolean>} Whether a file of the given `FileName` can be created in `DirectoryPath`.
 */
export async function IsValidFileNameOnSystem(
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
): Promise<Array<DeleteEntry>>
{
    const Entries: Array<DeleteEntry> = [ ];

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    async function Visit(CurrentPath: string): Promise<void>
    {
        Options.Signal?.throwIfAborted();

        Progress.Phase = "Scanning";
        Progress.CurrentPath = CurrentPath;
        Options.OnProgress?.(CloneProgress(Progress));

        let Stats: Stats;

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
            const Children: Array<Dirent<string>> = await FileSystem.readdir(CurrentPath, {
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
            const Size: number = Stats.isFile() ? Stats.size : 0;

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
    Options: DeleteWithProgressOptions = { }
): Promise<void>
{
    const Progress: DeleteProgress =
        {
            CurrentPath: null,
            DeletedBytes: 0,
            DeletedEntries: 0,
            DiscoveredEntries: 0,
            Phase: "Scanning",
            TotalBytes: 0,
            TotalEntries: 0
        };

    const Entries: Array<DeleteEntry> = await BuildDeletionPlan(RootPath, Progress, Options);

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

const TsJsExtensions: Set<string> = new Set([
    ".ts",
    ".tsx",
    ".mts",
    ".cts",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs"
]);

export function IsValidFileSubpath(
    DirectoryPath: string,
    FilePath: string
): boolean
{
    if (IsValidDirectoryPath(DirectoryPath) === false)
    {
        return false;
    }

    if (IsValidExtensionlessFilePath(FilePath) === false)
    {
        return false;
    }

    if (Path.isAbsolute(FilePath) === false)
    {
        return true;
    }

    return IsPathContainedUnderDirectory(DirectoryPath, FilePath);
};

const IsValidDirectoryPath = (DirectoryPath: string): boolean =>
{
    if (DirectoryPath.trim() === "")
    {
        return false;
    }

    const NormalizedDirectoryPath: string = Path.normalize(DirectoryPath);
    const DirectoryBaseName: string = Path.basename(NormalizedDirectoryPath);

    return IsValidPathSegment(DirectoryBaseName);
};

const IsValidExtensionlessFilePath = (FilePath: string): boolean =>
{
    if (FilePath.trim() === "")
    {
        return false;
    }

    const NormalizedFilePath: string = Path.normalize(FilePath);

    if (NormalizedFilePath.endsWith(Path.sep))
    {
        return false;
    }

    const FileName: string = Path.basename(NormalizedFilePath);

    if (IsValidFileName(FileName) === false)
    {
        return false;
    }

    const Extension: string = Path.extname(FileName).toLowerCase();

    return TsJsExtensions.has(Extension) === false;
};

export function IsPathContainedUnderDirectory(
    ParentPath: string,
    ChildPath: string
): boolean
{
    const ResolvedParentPath: string = Path.resolve(ParentPath);
    const ResolvedChildPath: string = Path.resolve(ChildPath);

    const RelativePath: string = Path.relative(
        ResolvedParentPath,
        ResolvedChildPath
    );

    if (RelativePath === "")
    {
        return false;
    }

    if (RelativePath === "..")
    {
        return false;
    }

    if (RelativePath.startsWith(`..${Path.sep}`))
    {
        return false;
    }

    return Path.isAbsolute(RelativePath) === false;
};

function IsValidFileName(FileName: string): boolean
{
    if (IsValidPathSegment(FileName) === false)
    {
        return false;
    }

    if (FileName === "." || FileName === "..")
    {
        return false;
    }

    return true;
};

const IsValidPathSegment = (PathSegment: string): boolean =>
{
    if (PathSegment.trim() === "")
    {
        return false;
    }

    /* eslint-disable-next-line no-control-regex */
    if (/[<>:"/\\|?*\x00-\x1F]/u.test(PathSegment))
    {
        return false;
    }

    if (/[. ]$/u.test(PathSegment))
    {
        return false;
    }

    return ReservedWindowsFileNames.every((Reserved: string): boolean =>
    {
        return !PathSegment.includes(Reserved);
    });
};

/* eslint-enable jsdoc/require-example */
