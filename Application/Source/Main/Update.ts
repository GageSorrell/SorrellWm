/**
 * Checks GitHub Releases for a newer published version of SorrellWm, and downloads and
 * launches its Windows installer.
 *
 * @module @sorrell/wm/Main/Update
 *
 * @file      Update.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { app, shell } from "electron";
import { Readable } from "node:stream";
import type { UpdateStatusDto } from "../Shared/Update.ts";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { mkdtemp } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { tmpdir } from "node:os";

export/** The owner of the public repository whose releases are checked for updates. */
const RepositoryOwner = "GageSorrell" as const;

export/** The name of the public repository whose releases are checked for updates. */
const RepositoryName = "SorrellWm" as const;

export/** The GitHub API endpoint that resolves the latest published release. */
const LatestReleaseApiUrl =
    `https://api.github.com/repos/${ RepositoryOwner }/${ RepositoryName }/releases/latest` as const;

/** A downloadable asset attached to a GitHub release. */
export interface GitHubReleaseAsset
{
    readonly BrowserDownloadUrl: string;
    readonly Name: string;
}

/** The subset of a GitHub release's fields this module needs. */
export interface GitHubRelease
{
    readonly Assets: ReadonlyArray<GitHubReleaseAsset>;
    readonly HtmlUrl: string;
    readonly TagName: string;
}

export/** Parse GitHub's release JSON payload, returning `null` when its shape is unexpected. */
const ParseGitHubRelease = (Payload: unknown): GitHubRelease | null =>
{
    if (typeof Payload !== "object" || Payload === null)
    {
        return null;
    }

    const Candidate = Payload as Record<string, unknown>;

    if (
        typeof Candidate.html_url !== "string"
        || typeof Candidate.tag_name !== "string"
        || !Array.isArray(Candidate.assets)
    )
    {
        return null;
    }

    const Assets: Array<GitHubReleaseAsset> = [ ];

    for (const AssetValue of Candidate.assets)
    {
        if (typeof AssetValue !== "object" || AssetValue === null)
        {
            return null;
        }

        const AssetCandidate = AssetValue as Record<string, unknown>;

        if (
            typeof AssetCandidate.browser_download_url !== "string"
            || typeof AssetCandidate.name !== "string"
        )
        {
            return null;
        }

        Assets.push({
            BrowserDownloadUrl: AssetCandidate.browser_download_url,
            Name: AssetCandidate.name
        });
    }

    return {
        Assets,
        HtmlUrl: Candidate.html_url,
        TagName: Candidate.tag_name
    };
};

export/** Strip a leading `"v"` from a version string, e.g. `"v0.1.0"` to `"0.1.0"`. */
const NormalizeVersion = (Value: string): string => Value.trim().replace(/^v/iu, "");

export/** Compare two dot-separated version strings, treating missing components as `0`. */
const CompareVersions = (Left: string, Right: string): number =>
{
    const LeftParts = NormalizeVersion(Left).split(".").map((Part: string) => Number.parseInt(Part, 10));
    const RightParts = NormalizeVersion(Right).split(".").map((Part: string) => Number.parseInt(Part, 10));
    const Length = Math.max(LeftParts.length, RightParts.length);

    for (let Index = 0; Index < Length; Index += 1)
    {
        const LeftPart = LeftParts[Index] ?? 0;
        const RightPart = RightParts[Index] ?? 0;

        if (LeftPart !== RightPart)
        {
            return LeftPart - RightPart;
        }
    }

    return 0;
};

export/** Determine whether `Latest` is a newer version than `Current`. */
const IsNewerVersion = (Latest: string, Current: string): boolean => CompareVersions(Latest, Current) > 0;

export/** Find the Windows installer asset (a `.exe`) attached to a release, if one exists. */
const FindWindowsInstallerAsset = (Release: GitHubRelease): GitHubReleaseAsset | undefined =>
    Release.Assets.find((Asset: GitHubReleaseAsset) => Asset.Name.toLowerCase().endsWith(".exe"));

export/** Build the renderer-safe update status from a resolved release (or its absence). */
const ToUpdateStatusDto = (
    Release: GitHubRelease | null,
    CurrentVersion: string
): UpdateStatusDto =>
{
    if (Release === null)
    {
        return {
            CurrentVersion,
            IsUpdateAvailable: false,
            LatestVersion: null,
            ReleaseUrl: null
        };
    }

    const LatestVersion = NormalizeVersion(Release.TagName);
    const HasInstaller = FindWindowsInstallerAsset(Release) !== undefined;

    return {
        CurrentVersion,
        IsUpdateAvailable: HasInstaller && IsNewerVersion(LatestVersion, CurrentVersion),
        LatestVersion,
        ReleaseUrl: Release.HtmlUrl
    };
};

/** The download/installer launch failed before an installer process could be started. */
export class UpdateDownloadError extends Error
{
    public override readonly name: string = "UpdateDownloadError";
}

/** The installer downloaded successfully, but Windows could not launch it. */
export class UpdateInstallError extends Error
{
    public override readonly name: string = "UpdateInstallError";
}

/** Injectable Electron/network/filesystem boundaries, so the update flow can be unit tested. */
export interface Dependencies
{
    readonly Fetch: (Input: string, Init?: RequestInit) => Promise<Response>;
    readonly GetCurrentVersion: () => string;
    readonly MakeTempDirectory: () => Promise<string>;
    readonly OpenPath: (Path: string) => Promise<string>;
}

export/** Resolve the latest published release, or `null` when the check fails. */
const FetchLatestRelease = async (
    DependenciesValue: Pick<Dependencies, "Fetch">
): Promise<GitHubRelease | null> =>
{
    try
    {
        const Response = await DependenciesValue.Fetch(LatestReleaseApiUrl, {
            headers: { Accept: "application/vnd.github+json" }
        });

        if (!Response.ok)
        {
            return null;
        }

        return ParseGitHubRelease(await Response.json());
    }
    catch
    {
        return null;
    }
};

export/** Get the current update status by checking GitHub Releases for a newer version. */
const GetUpdateStatus = async (DependenciesValue: Dependencies): Promise<UpdateStatusDto> =>
{
    const Release = await FetchLatestRelease(DependenciesValue);
    return ToUpdateStatusDto(Release, DependenciesValue.GetCurrentVersion());
};

export/** Download the latest Windows installer and launch it, letting Windows elevate as needed. */
const DownloadAndInstallUpdate = async (DependenciesValue: Dependencies): Promise<void> =>
{
    const Release = await FetchLatestRelease(DependenciesValue);

    if (Release === null)
    {
        throw new UpdateDownloadError("Could not retrieve the latest release from GitHub.");
    }

    const Asset = FindWindowsInstallerAsset(Release);

    if (Asset === undefined)
    {
        throw new UpdateDownloadError("The latest release has no Windows installer.");
    }

    let InstallerDirectory: string;

    try
    {
        InstallerDirectory = await DependenciesValue.MakeTempDirectory();
    }
    catch (Cause: unknown)
    {
        throw new UpdateDownloadError("Could not create a temporary directory for the installer.", {
            cause: Cause
        });
    }

    const InstallerPath = join(InstallerDirectory, Asset.Name);

    let DownloadResponse: Response;

    try
    {
        DownloadResponse = await DependenciesValue.Fetch(Asset.BrowserDownloadUrl);
    }
    catch (Cause: unknown)
    {
        throw new UpdateDownloadError("Could not download the update installer.", { cause: Cause });
    }

    if (!DownloadResponse.ok || DownloadResponse.body === null)
    {
        throw new UpdateDownloadError(
            `GitHub returned status ${ DownloadResponse.status } for the installer download.`
        );
    }

    try
    {
        await pipeline(
            Readable.fromWeb(DownloadResponse.body as WebReadableStream<Uint8Array>),
            createWriteStream(InstallerPath)
        );
    }
    catch (Cause: unknown)
    {
        throw new UpdateDownloadError("Could not save the update installer to disk.", { cause: Cause });
    }

    const OpenPathError = await DependenciesValue.OpenPath(InstallerPath);

    if (OpenPathError.length > 0)
    {
        throw new UpdateInstallError(OpenPathError);
    }
};

export/** Live Electron/Node boundaries used by the running application. */
const LiveDependencies: Dependencies = {
    Fetch: (Input: string, Init?: RequestInit): Promise<Response> => fetch(Input, Init),
    GetCurrentVersion: (): string => app.getVersion(),
    MakeTempDirectory: (): Promise<string> => mkdtemp(join(tmpdir(), "SorrellWm-Update-")),
    OpenPath: (Path: string): Promise<string> => shell.openPath(Path)
};
