/**
 * @file      FileSystem.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    BuildDeletionPlan,
    CreateTerminalDeleteProgressRenderer,
    IsMissingFileError
} from "./FileSystem.Internal.js";
import type {
    FDeleteEntry,
    FDeleteProgress,
    FTerminalDeleteProgressRenderer
} from "./FileSystem.Internal.Types.js";
import type { FDeleteWithProgressOptions } from "./FileSystem.Types.js";
import { promises as Fs } from "fs";

/* eslint-disable jsdoc/require-example */

/**
 * Recursively delete a given {@link RootPath}, and display the progress in
 * the terminal.
 *
 * @param RootPath - The path to recursively delete.
 * @param Options - The {@link FDeleteWithProgressOptions} object specifying
 * options for this deletion.
 *
 * @returns {Promise<void>} The {@link Promise} that is fulfilled upon the deletion
 * of the given {@link RootPath}.
 */
export async function DeleteWithProgress(
    RootPath: string,
    Options: FDeleteWithProgressOptions = { }
): Promise<void>
{
    const TerminalProgressRenderer: FTerminalDeleteProgressRenderer =
        CreateTerminalDeleteProgressRenderer(Options);

    const ProgressOptions: FDeleteWithProgressOptions =
        {
            ...Options,
            OnProgress(Progress: FDeleteProgress): void
            {
                TerminalProgressRenderer.Update(Progress);
                Options.OnProgress?.({ ...Progress });
            }
        };

    const Progress: FDeleteProgress =
        {
            CurrentPath: null,
            DeletedBytes: 0,
            DeletedEntries: 0,
            DiscoveredEntries: 0,
            Phase: "Scanning",
            TotalBytes: 0,
            TotalEntries: 0
        };

    try
    {
        const Entries: Array<FDeleteEntry> = await BuildDeletionPlan(RootPath, Progress, ProgressOptions);

        Progress.Phase = "Deleting";
        Progress.TotalEntries = Entries.length;
        Progress.CurrentPath = null;
        ProgressOptions.OnProgress?.({ ...Progress });

        for (const Entry of Entries)
        {
            ProgressOptions.Signal?.throwIfAborted();

            Progress.CurrentPath = Entry.EntryPath;
            ProgressOptions.OnProgress?.({ ...Progress });

            try
            {
                if (Entry.Kind === "Directory")
                {
                    await Fs.rmdir(Entry.EntryPath);
                }
                else
                {
                    await Fs.unlink(Entry.EntryPath);
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

            ProgressOptions.OnProgress?.({ ...Progress });
        }

        Progress.Phase = "Done";
        Progress.CurrentPath = null;
        ProgressOptions.OnProgress?.({ ...Progress });
    }
    catch (ErrorValue)
    {
        TerminalProgressRenderer.Error(ErrorValue);
        throw ErrorValue;
    }
}

/* eslint-enable jsdoc/require-example */
