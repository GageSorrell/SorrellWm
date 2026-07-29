/**
 * @module @sorrell/wm/Test/Update
 *
 * @file      Update.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    CompareVersions,
    type Dependencies,
    DownloadAndInstallUpdate,
    FindWindowsInstallerAsset,
    GetUpdateStatus,
    type GitHubRelease,
    IsNewerVersion,
    NormalizeVersion,
    ParseGitHubRelease,
    ToUpdateStatusDto,
    UpdateDownloadError,
    UpdateInstallError
} from "../../Source/Main/Update.ts";
import { describe, expect, it, vi } from "vitest";
import { join } from "node:path";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";

const MakeTestTempDirectory = (): Promise<string> =>
    mkdtemp(join(tmpdir(), "sorrellwm-update-test-"));

vi.mock("electron", () =>
{
    const Electron = {
        app: { getVersion: (): string => "0.1.0" },
        shell: { openPath: (): Promise<string> => Promise.resolve("") }
    };

    return { ...Electron, default: Electron };
});

const Release: GitHubRelease = {
    Assets: [
        { BrowserDownloadUrl: "https://example.test/SorrellWm-0.2.0.exe", Name: "SorrellWm-0.2.0.exe" }
    ],
    HtmlUrl: "https://github.com/GageSorrell/SorrellWm/releases/tag/v0.2.0",
    TagName: "v0.2.0"
};

const ReleasePayload = {
    assets: [
        {
            browser_download_url: "https://example.test/SorrellWm-0.2.0.exe",
            name: "SorrellWm-0.2.0.exe"
        }
    ],
    html_url: "https://github.com/GageSorrell/SorrellWm/releases/tag/v0.2.0",
    tag_name: "v0.2.0"
};

describe("Update", () =>
{
    it("normalizes a leading \"v\" off a version string", () =>
    {
        expect(NormalizeVersion("v0.2.0")).toBe("0.2.0");
        expect(NormalizeVersion("0.2.0")).toBe("0.2.0");
        expect(NormalizeVersion(" V1.0.0 ")).toBe("1.0.0");
    });

    it("compares versions component-wise, treating missing components as zero", () =>
    {
        expect(CompareVersions("0.2.0", "0.1.0")).toBeGreaterThan(0);
        expect(CompareVersions("0.1.0", "0.2.0")).toBeLessThan(0);
        expect(CompareVersions("0.1.0", "0.1.0")).toBe(0);
        expect(CompareVersions("0.1", "0.1.0")).toBe(0);
        expect(CompareVersions("1.0.0", "0.9.9")).toBeGreaterThan(0);
    });

    it("determines whether a version is newer than the current version", () =>
    {
        expect(IsNewerVersion("0.2.0", "0.1.0")).toBe(true);
        expect(IsNewerVersion("0.1.0", "0.1.0")).toBe(false);
        expect(IsNewerVersion("0.1.0", "0.2.0")).toBe(false);
    });

    it("parses a well-formed GitHub release payload", () =>
    {
        expect(ParseGitHubRelease(ReleasePayload)).toEqual(Release);
    });

    it("rejects release payloads with an unexpected shape", () =>
    {
        expect(ParseGitHubRelease(null)).toBeNull();
        expect(ParseGitHubRelease({ })).toBeNull();
        expect(ParseGitHubRelease({ ...ReleasePayload, assets: [ { name: "Missing url" } ] })).toBeNull();
    });

    it("finds the Windows installer asset case-insensitively", () =>
    {
        expect(FindWindowsInstallerAsset(Release)).toEqual(Release.Assets[0]);
        expect(FindWindowsInstallerAsset({ ...Release, Assets: [ ] })).toBeUndefined();
    });

    it("reports an update as available only when a newer version has an installer", () =>
    {
        expect(ToUpdateStatusDto(Release, "0.1.0")).toEqual({
            CurrentVersion: "0.1.0",
            IsUpdateAvailable: true,
            LatestVersion: "0.2.0",
            ReleaseUrl: Release.HtmlUrl
        });
        expect(ToUpdateStatusDto(Release, "0.2.0").IsUpdateAvailable).toBe(false);
        expect(ToUpdateStatusDto({ ...Release, Assets: [ ] }, "0.1.0").IsUpdateAvailable).toBe(false);
        expect(ToUpdateStatusDto(null, "0.1.0")).toEqual({
            CurrentVersion: "0.1.0",
            IsUpdateAvailable: false,
            LatestVersion: null,
            ReleaseUrl: null
        });
    });

    it("reports an update status by fetching the latest release", async () =>
    {
        const DependenciesValue: Dependencies = {
            Fetch: (): Promise<Response> => Promise.resolve(
                new Response(JSON.stringify(ReleasePayload), { status: 200 })
            ),
            GetCurrentVersion: (): string => "0.1.0",
            MakeTempDirectory: (): Promise<string> => Promise.reject(new Error("Not used")),
            OpenPath: (): Promise<string> => Promise.reject(new Error("Not used"))
        };

        await expect(GetUpdateStatus(DependenciesValue)).resolves.toEqual({
            CurrentVersion: "0.1.0",
            IsUpdateAvailable: true,
            LatestVersion: "0.2.0",
            ReleaseUrl: Release.HtmlUrl
        });
    });

    it("falls back to \"no update\" when the release check fails", async () =>
    {
        const DependenciesValue: Dependencies = {
            Fetch: (): Promise<Response> => Promise.reject(new Error("network down")),
            GetCurrentVersion: (): string => "0.1.0",
            MakeTempDirectory: (): Promise<string> => Promise.reject(new Error("Not used")),
            OpenPath: (): Promise<string> => Promise.reject(new Error("Not used"))
        };

        await expect(GetUpdateStatus(DependenciesValue)).resolves.toEqual({
            CurrentVersion: "0.1.0",
            IsUpdateAvailable: false,
            LatestVersion: null,
            ReleaseUrl: null
        });
    });

    it("downloads and launches the installer", async () =>
    {
        const OpenPath = vi.fn(() => Promise.resolve(""));
        const DependenciesValue: Dependencies = {
            Fetch: (Input: string): Promise<Response> => Promise.resolve(
                Input.startsWith("https://api.github.com")
                    ? new Response(JSON.stringify(ReleasePayload), { status: 200 })
                    : new Response("fake installer bytes", { status: 200 })
            ),
            GetCurrentVersion: (): string => "0.1.0",
            MakeTempDirectory: MakeTestTempDirectory,
            OpenPath
        };

        await expect(DownloadAndInstallUpdate(DependenciesValue)).resolves.toBeUndefined();
        expect(OpenPath).toHaveBeenCalledWith(expect.stringContaining("SorrellWm-0.2.0.exe"));
    });

    it("fails with UpdateDownloadError when the release cannot be resolved", async () =>
    {
        const DependenciesValue: Dependencies = {
            Fetch: (): Promise<Response> => Promise.reject(new Error("network down")),
            GetCurrentVersion: (): string => "0.1.0",
            MakeTempDirectory: (): Promise<string> => Promise.reject(new Error("Not used")),
            OpenPath: (): Promise<string> => Promise.reject(new Error("Not used"))
        };

        await expect(DownloadAndInstallUpdate(DependenciesValue)).rejects.toBeInstanceOf(UpdateDownloadError);
    });

    it("fails with UpdateDownloadError when the release has no Windows installer", async () =>
    {
        const DependenciesValue: Dependencies = {
            Fetch: (): Promise<Response> => Promise.resolve(
                new Response(JSON.stringify({ ...ReleasePayload, assets: [ ] }), { status: 200 })
            ),
            GetCurrentVersion: (): string => "0.1.0",
            MakeTempDirectory: (): Promise<string> => Promise.reject(new Error("Not used")),
            OpenPath: (): Promise<string> => Promise.reject(new Error("Not used"))
        };

        await expect(DownloadAndInstallUpdate(DependenciesValue)).rejects.toBeInstanceOf(UpdateDownloadError);
    });

    it("fails with UpdateInstallError when Windows cannot launch the installer", async () =>
    {
        const DependenciesValue: Dependencies = {
            Fetch: (Input: string): Promise<Response> => Promise.resolve(
                Input.startsWith("https://api.github.com")
                    ? new Response(JSON.stringify(ReleasePayload), { status: 200 })
                    : new Response("fake installer bytes", { status: 200 })
            ),
            GetCurrentVersion: (): string => "0.1.0",
            MakeTempDirectory: MakeTestTempDirectory,
            OpenPath: (): Promise<string> => Promise.resolve("Windows refused to launch the installer.")
        };

        await expect(DownloadAndInstallUpdate(DependenciesValue)).rejects.toBeInstanceOf(UpdateInstallError);
    });
});
