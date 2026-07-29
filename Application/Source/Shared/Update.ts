/**
 * Renderer-safe state describing the latest published GitHub release and the outcome of
 * downloading/launching its installer.
 *
 * @module @sorrell/wm/Shared/Update
 *
 * @file      Update.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** A snapshot of the running version compared against the latest published GitHub release. */
export interface UpdateStatusDto
{
    /** The version of the running application, e.g. `"0.1.0"`. */
    readonly CurrentVersion: string;

    /** Whether a newer version with a Windows installer asset is published. */
    readonly IsUpdateAvailable: boolean;

    /** The latest published version, or `null` when the check failed. */
    readonly LatestVersion: string | null;

    /** The GitHub Releases page for the latest version, or `null` when the check failed. */
    readonly ReleaseUrl: string | null;
}

export/** Determine whether an IPC value is a valid update status snapshot. */
const IsUpdateStatusDto = (Value: unknown): Value is UpdateStatusDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<UpdateStatusDto>;
    return typeof Candidate.CurrentVersion === "string"
        && typeof Candidate.IsUpdateAvailable === "boolean"
        && (Candidate.LatestVersion === null || typeof Candidate.LatestVersion === "string")
        && (Candidate.ReleaseUrl === null || typeof Candidate.ReleaseUrl === "string");
};

/** The outcome of downloading and launching the latest installer. */
export interface UpdateDownloadResultDto
{
    /** Whether the installer downloaded and launched successfully. */
    readonly Success: boolean;
}

export/** Determine whether an IPC value is a valid update download result. */
const IsUpdateDownloadResultDto = (Value: unknown): Value is UpdateDownloadResultDto =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    return typeof (Value as Partial<UpdateDownloadResultDto>).Success === "boolean";
};
