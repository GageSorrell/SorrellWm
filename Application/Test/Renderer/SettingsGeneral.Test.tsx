/**
 * Tests general window manager settings controls.
 *
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
            ResizeRecoveryStrategy:
            {
                Threshold: 128,
                _tag: "Continue"
            },
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
            ResizeRecoveryStrategy:
                Patch.ResizeRecoveryStrategy ?? {
                    Threshold: 128,
                    _tag: "Continue"
                },
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
        expect(Gap).toHaveValue("8 px");

        fireEvent.change(Gap, { target: { value: "9" } });
        fireEvent.blur(Gap);

        await waitFor(() => expect(window.sorrell.generalSettings.set).toHaveBeenCalledWith({
            TiledWindowGap: 9
        }));
    });

    it("loads and updates the resize recovery strategy and threshold", async () =>
    {
        render(<SettingsGeneral />);

        const Strategy = await screen.findByRole("combobox", {
            name: "Resize recovery strategy"
        });
        expect(Strategy).toHaveTextContent("Continue with Actual Size");

        const Threshold = screen.getByRole("spinbutton", {
            name: "Resize recovery threshold"
        });
        expect(Threshold).toHaveValue("128 px");

        fireEvent.change(Threshold, { target: { value: "64" } });
        fireEvent.blur(Threshold);

        await waitFor(() => expect(window.sorrell.generalSettings.set).toHaveBeenCalledWith({
            ResizeRecoveryStrategy:
            {
                Threshold: 64,
                _tag: "Continue"
            }
        }));

        fireEvent.click(Strategy);
        fireEvent.click(await screen.findByRole("option", {
            name: "Ignore the Actual Size"
        }));

        await waitFor(() => expect(window.sorrell.generalSettings.set).toHaveBeenCalledWith({
            ResizeRecoveryStrategy:
            {
                Threshold: 64,
                _tag: "Ignore"
            }
        }));

        const UpdatedThreshold = screen.getByRole("spinbutton", {
            name: "Resize recovery threshold"
        });
        fireEvent.change(UpdatedThreshold, { target: { value: "" } });
        fireEvent.blur(UpdatedThreshold);

        await waitFor(() => expect(window.sorrell.generalSettings.set).toHaveBeenCalledWith({
            ResizeRecoveryStrategy:
            {
                Threshold: undefined,
                _tag: "Ignore"
            }
        }));
    });

    it("loads and updates the tiled-window detach distance", async () =>
    {
        render(<SettingsGeneral />);

        const Distance = await screen.findByRole("spinbutton", {
            name: "Tiled window detach distance"
        });
        expect(Distance).toHaveValue("128 px");

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
