/**
 * @file      FileSystem.Types.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type FDeletePhase =
    | "Scanning"
    | "Deleting"
    | "Done";

export type FDeleteEntryKind =
    | "File"
    | "Directory"
    | "Other";

export type FDeleteEntry =
    {
        EntryPath: string;
        Kind: FDeleteEntryKind;
        Size: number;
    };

export type FDeleteProgress =
    {
        Phase: FDeletePhase;
        CurrentPath: string | null;
        DiscoveredEntries: number;
        TotalEntries: number;
        DeletedEntries: number;
        TotalBytes: number;
        DeletedBytes: number;
    };

export type FTerminalDeleteProgressRenderer =
    {
        Update: (Progress: FDeleteProgress) => void;
        Error: (ErrorValue: unknown) => void;
    };
