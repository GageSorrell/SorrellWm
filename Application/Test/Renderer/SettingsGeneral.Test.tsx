/**
 * @module @sorrell/wm/Test/SettingsGeneral
 *
 * @file      SettingsGeneral.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { GeneralSettingsPatch } from "../../Source/Shared/AppSettings.ts";
import { SettingsGeneral } from "../../Source/Renderer/SettingsGeneral.tsx";

describe("SettingsGeneral", () =>
{
    beforeEach(() =>
    {
        vi.mocked(window.sorrell.generalSettings.get).mockResolvedValue({
            IgnoreActivationKeybindInFullscreen: true,
            TileExistingWindowsOnStartup: false,
            TiledResizeBehavior: "PreserveRatios",
            TiledWindowDetachDistance: 128,
            TiledWindowGap: 8
        });
        vi.mocked(window.sorrell.generalSettings.set).mockImplementation(async (
            Patch: GeneralSettingsPatch
        ) => ({
            IgnoreActivationKeybindInFullscreen:
                Patch.IgnoreActivationKeybindInFullscreen ?? true,
            TileExistingWindowsOnStartup: Patch.TileExistingWindowsOnStartup ?? false,
            TiledResizeBehavior:
                Patch.TiledResizeBehavior ?? "PreserveRatios",
            TiledWindowDetachDistance:
                Patch.TiledWindowDetachDistance ?? 128,
            TiledWindowGap: Patch.TiledWindowGap ?? 8
        }));
    });

    it("loads and updates the fullscreen activation preference", async () =>
    {
        render(<SettingsGeneral />);

        const Toggle = await screen.findByRole("switch", {
            name: "Ignore activation keybind in fullscreen"
        });
        expect(Toggle).toBeChecked();

        fireEvent.click(Toggle);

        await waitFor(() => expect(
            window.sorrell.generalSettings.set
        ).toHaveBeenCalledWith({
            IgnoreActivationKeybindInFullscreen: false
        }));
        expect(Toggle).not.toBeChecked();
    });

    it("loads and updates the startup tiling preference", async () =>
    {
        render(<SettingsGeneral />);

        const Toggle = await screen.findByRole("switch", {
            name: "Tile existing windows on startup"
        });
        expect(Toggle).not.toBeChecked();

        fireEvent.click(Toggle);

        await waitFor(() => expect(window.sorrell.generalSettings.set).toHaveBeenCalledWith({
            TileExistingWindowsOnStartup: true
        }));
        expect(Toggle).toBeChecked();
    });

    it("loads and updates the tiled-window gap", async () =>
    {
        render(<SettingsGeneral />);

        const Gap = await screen.findByRole("spinbutton", {
            name: "Tiled window gap"
        });
        expect(Gap).toHaveValue("8");

        fireEvent.change(Gap, { target: { value: "9" } });
        fireEvent.blur(Gap);

        await waitFor(() => expect(window.sorrell.generalSettings.set).toHaveBeenCalledWith({
            TiledWindowGap: 9
        }));
    });

    it("loads and updates the tiled-window detach distance", async () =>
    {
        render(<SettingsGeneral />);

        const Distance = await screen.findByRole("spinbutton", {
            name: "Tiled window detach distance"
        });
        expect(Distance).toHaveValue("128");

        fireEvent.change(Distance, { target: { value: "256" } });
        fireEvent.blur(Distance);

        await waitFor(() => expect(window.sorrell.generalSettings.set).toHaveBeenCalledWith({
            TiledWindowDetachDistance: 256
        }));
    });

    it("loads and updates the initial tiled resize behavior", async () =>
    {
        render(<SettingsGeneral />);

        const Behavior = await screen.findByRole("combobox", {
            name: "Initial tiled resize behavior"
        });
        expect(Behavior).toHaveTextContent("Preserve Other Ratios");

        fireEvent.click(Behavior);
        fireEvent.click(await screen.findByRole("option", {
            name: "Adjacent Window Only"
        }));

        await waitFor(() => expect(window.sorrell.generalSettings.set).toHaveBeenCalledWith({
            TiledResizeBehavior: "AdjacentOnly"
        }));
    });
});
