/**
 * @module @sorrell/wm/Test/SettingsHome
 *
 * @file      SettingsHome.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SettingsHome } from "../../Source/Renderer/SettingsHome.tsx";

describe("SettingsHome", () =>
{
    it("shows the current version with no button when already up to date", async () =>
    {
        vi.mocked(window.sorrell.update.getStatus).mockResolvedValue({
            CurrentVersion: "0.1.0",
            IsUpdateAvailable: false,
            LatestVersion: null,
            ReleaseUrl: null
        });

        render(<SettingsHome />);

        await screen.findByText("SorrellWm v0.1.0");
        expect(screen.getByText("You're up to date.")).toBeInTheDocument();
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("shows a download button when a newer version is available", async () =>
    {
        vi.mocked(window.sorrell.update.getStatus).mockResolvedValue({
            CurrentVersion: "0.1.0",
            IsUpdateAvailable: true,
            LatestVersion: "0.2.0",
            ReleaseUrl: "https://github.com/GageSorrell/SorrellWm/releases/tag/v0.2.0"
        });

        render(<SettingsHome />);

        const DownloadButton = await screen.findByRole("button", { name: "Download v0.2.0" });
        expect(DownloadButton).toBeEnabled();

        vi.mocked(window.sorrell.update.downloadAndInstall).mockResolvedValue({ Success: true });
        fireEvent.click(DownloadButton);

        await waitFor(() => expect(
            window.sorrell.update.downloadAndInstall
        ).toHaveBeenCalled());
    });

    it("re-enables the download button after a failed download", async () =>
    {
        vi.mocked(window.sorrell.update.getStatus).mockResolvedValue({
            CurrentVersion: "0.1.0",
            IsUpdateAvailable: true,
            LatestVersion: "0.2.0",
            ReleaseUrl: "https://github.com/GageSorrell/SorrellWm/releases/tag/v0.2.0"
        });
        vi.mocked(window.sorrell.update.downloadAndInstall).mockResolvedValue({ Success: false });

        render(<SettingsHome />);

        const DownloadButton = await screen.findByRole("button", { name: "Download v0.2.0" });
        fireEvent.click(DownloadButton);

        await waitFor(() => expect(
            screen.getByRole("button", { name: "Download v0.2.0" })
        ).toBeEnabled());
    });
});
