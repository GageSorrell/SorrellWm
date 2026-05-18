/**
 * @file      FileSystem.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Path from "path";
import { progress as CreateProgress, spinner as CreateSpinner, type SpinnerResult } from "@clack/prompts";
import { type Dirent, promises as Fs, type Stats } from "fs";
import type {
    FDeleteEntry,
    FDeleteProgress,
    FTerminalDeleteProgressRenderer
} from "./FileSystem.Internal.Types.js";
import type { FDeleteWithProgressOptions } from "./FileSystem.Types.js";

/**
 * Determines whether a given {@link ErrorValue} represents a missing file error.
 *
 * @param ErrorValue - The value to test.
 *
 * @returns {boolean} Whether the given {@link ErrorValue} is an object representing
 * a missing file error.
 */
export function IsMissingFileError(ErrorValue: unknown): boolean
{
    return (
        typeof ErrorValue === "object" &&
        ErrorValue !== null &&
        "code" in ErrorValue &&
        ErrorValue.code === "ENOENT"
    );
}

/**
 * Build a plan of files to delete, so that the deletion progress
 * can be displayed to the user.
 *
 * @param RootPath - The root path of the files to delete.
 * @param Progress - The {@link FDeleteProgress} object tracking the deletion.
 * @param Options - The options for this deletion.
 *
 * @returns {Promise<Array<FDeleteEntry>>} The entries to delete.
 */
export async function BuildDeletionPlan(
    RootPath: string,
    Progress: FDeleteProgress,
    Options: FDeleteWithProgressOptions
): Promise<Array<FDeleteEntry>>
{
    const Entries: Array<FDeleteEntry> = [ ];

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    async function Visit(CurrentPath: string): Promise<void>
    {
        Options.Signal?.throwIfAborted();

        Progress.Phase = "Scanning";
        Progress.CurrentPath = CurrentPath;
        Options.OnProgress?.({ ...Progress });

        let Stats: Stats;

        try
        {
            Stats = await Fs.lstat(CurrentPath);
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
            const Children: ReadonlyArray<Dirent> = await Fs.readdir(
                CurrentPath,
                { withFileTypes: true }
            );

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
        Options.OnProgress?.({ ...Progress });
    }

    await Visit(RootPath);

    return Entries;
}

export function CreateScanningMessage(Progress: FDeleteProgress): string
{
    return `Scanning... ${ Progress.DiscoveredEntries } entries, ${ FormatBytes(Progress.TotalBytes) } found`;
}

export function CreateDeletingMessage(Progress: FDeleteProgress): string
{
    const Percent: number = Progress.TotalEntries === 0
        ? 100
        : (Progress.DeletedEntries / Progress.TotalEntries) * 100;

    return (
        `Deleting... ${ Progress.DeletedEntries }/${ Progress.TotalEntries } entries ` +
        `(${ Percent.toFixed(1) }%), ` +
        `${ FormatBytes(Progress.DeletedBytes) } / ${ FormatBytes(Progress.TotalBytes) }`
    );
}

export function CreateDoneMessage(Progress: FDeleteProgress): string
{
    return `Deleted ${ Progress.DeletedEntries } entries, ${ FormatBytes(Progress.DeletedBytes) }.`;
}

export function CreateErrorMessage(ErrorValue: unknown): string
{
    if (ErrorValue instanceof Error)
    {
        return `Delete failed: ${ ErrorValue.message }`;
    }

    return "Delete failed.";
}

export function FormatBytes(Bytes: number): string
{
    const Units: Array<string> = [ "B", "KB", "MB", "GB", "TB" ];
    let Value: number = Bytes;
    let UnitIndex: number = 0;

    while (Value >= 1024 && UnitIndex < Units.length - 1)
    {
        Value /= 1024;
        UnitIndex += 1;
    }

    return `${ Value.toFixed(UnitIndex === 0 ? 0 : 1) } ${ Units[UnitIndex] }`;
}

export function CreateTerminalDeleteProgressRenderer(
    Options: FDeleteWithProgressOptions
): FTerminalDeleteProgressRenderer
{
    if (Options.ShouldRenderTerminalProgress === false)
    {
        return {
            Error(): void
            {
                return;
            },
            Update(): void
            {
                return;
            }
        };
    }

    const ScanningSpinner: SpinnerResult = CreateSpinner({ indicator: "timer" });
    let HasStartedScanningSpinner: boolean = false;
    let HasStoppedScanningSpinner: boolean = false;
    let DeletionProgress: ReturnType<typeof CreateProgress> | null = null;
    let LastRenderedDeletedEntries: number = 0;

    return {
        Error(ErrorValue: unknown): void
        {
            const Message: string = CreateErrorMessage(ErrorValue);

            if (DeletionProgress !== null)
            {
                DeletionProgress.error(Message);
                return;
            }

            if (HasStartedScanningSpinner && !HasStoppedScanningSpinner)
            {
                ScanningSpinner.stop(Message);
            }
        },
        Update(Progress: FDeleteProgress): void
        {
            if (Progress.Phase === "Scanning")
            {
                const Message: string = CreateScanningMessage(Progress);

                if (!HasStartedScanningSpinner)
                {
                    ScanningSpinner.start(Message);
                    HasStartedScanningSpinner = true;
                }
                else
                {
                    ScanningSpinner.message(Message);
                }

                return;
            }

            if (!HasStoppedScanningSpinner)
            {
                if (HasStartedScanningSpinner)
                {
                    ScanningSpinner.stop(
                        `Scanned ${ Progress.DiscoveredEntries } entries ` +
                        `(${ FormatBytes(Progress.TotalBytes) }).`
                    );
                }

                HasStoppedScanningSpinner = true;
            }

            if (Progress.Phase === "Deleting")
            {
                if (DeletionProgress === null)
                {
                    DeletionProgress = CreateProgress({
                        max: Math.max(Progress.TotalEntries, 1),
                        style: "block"
                    });

                    DeletionProgress.start(CreateDeletingMessage(Progress));
                }

                const DeletedEntryDelta: number = Progress.DeletedEntries - LastRenderedDeletedEntries;

                if (DeletedEntryDelta > 0)
                {
                    DeletionProgress.advance(DeletedEntryDelta, CreateDeletingMessage(Progress));
                    LastRenderedDeletedEntries = Progress.DeletedEntries;
                }
                else
                {
                    DeletionProgress.message(CreateDeletingMessage(Progress));
                }

                return;
            }

            if (DeletionProgress !== null)
            {
                DeletionProgress.stop(CreateDoneMessage(Progress));
            }
        }
    };
}
