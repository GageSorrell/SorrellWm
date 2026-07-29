/**
 *
 *
 * @module @sorrell/wm/Test/AppSettings
 *
 * @file      AppSettings.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "../../Source/Main/AppSettings/AppSettings.ts";
import { Effect, Schema } from "effect";
import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
    nativeTheme: { themeSource: "system" }
}));

vi.mock("@sorrell/windows", () => ({
    Keyboard:
    {
        Subscribe: (): void => undefined,
        Unsubscribe: (): void => undefined
    },
    MessageLoop:
    {
        Start: (): void => undefined,
        Stop: (): void => undefined
    },
    VK:
    {
        BROWSER_BACK: 0xA6,
        CONTROL: 0x11,
        D: 0x44,
        D1: 0x31,
        D2: 0x32,
        D3: 0x33,
        D4: 0x34,
        D5: 0x35,
        D6: 0x36,
        D7: 0x37,
        D8: 0x38,
        D9: 0x39,
        END: 0x23,
        ESCAPE: 0x1B,
        F20: 0x83,
        H: 0x48,
        HOME: 0x24,
        J: 0x4A,
        K: 0x4B,
        L: 0x4C,
        MENU: 0x12,
        N: 0x4E,
        RETURN: 0x0D,
        SHIFT: 0x10,
        T: 0x54,
        TAB: 0x09,
        VK: [
            0x09,
            0x0D,
            0x10,
            0x11,
            0x12,
            0x1B,
            0x23,
            0x24,
            0x31,
            0x32,
            0x33,
            0x34,
            0x35,
            0x36,
            0x37,
            0x38,
            0x39,
            0x44,
            0x48,
            0x4A,
            0x4B,
            0x4C,
            0x4E,
            0x54,
            0x83,
            0xA6
        ]
    }
}));

describe("AppSettings schema", () =>
{
    it("supplies current defaults when decoding the legacy settings wrapper", async () =>
    {
        const LegacySettings = {
            Settings: "{\"RunOnStartup\":false}",
            Store:
            {
                AppVersion: "40.6.1",
                TimeLastCheckedUpdate: null
            }
        };
        const Decoded = await Effect.runPromise(
            Schema.decodeUnknownEffect(AppSettings.AppSettings.Schema)(LegacySettings)
        );

        expect(Decoded).toEqual({
            FocusPreviewOpacity: 75,
            Keybinds: [
                {
                    Id: "Activate",
                    Key: 0x83,
                    Modifiers:
                    {
                        Alt: false,
                        Control: false,
                        Shift: false,
                        Super: false
                    }
                },
                {
                    Id: "Back",
                    Key: 0xA6,
                    Modifiers:
                    {
                        Alt: false,
                        Control: false,
                        Shift: false,
                        Super: false
                    }
                },
                {
                    Id: "Cancel",
                    Key: 0x1B,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "Commit",
                    Key: 0x0D,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "FineModifier",
                    Key: 0x12,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "PrimaryModifier",
                    Key: 0x10,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "ResizeModifier",
                    Key: 0x11,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectFirst",
                    Key: 0x24,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectLast",
                    Key: 0x23,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectLeft",
                    Key: 0x44,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor1",
                    Key: 0x31,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor2",
                    Key: 0x32,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor3",
                    Key: 0x33,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor4",
                    Key: 0x34,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor5",
                    Key: 0x35,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor6",
                    Key: 0x36,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor7",
                    Key: 0x37,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor8",
                    Key: 0x38,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectMonitor9",
                    Key: 0x39,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectUp",
                    Key: 0x48,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectDown",
                    Key: 0x54,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "SelectRight",
                    Key: 0x4E,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                },
                {
                    Id: "Toggle",
                    Key: 0x09,
                    Modifiers: { Alt: false, Control: false, Shift: false, Super: false }
                }
            ],
            MoveFineSpeed: 16,
            MoveStepPrimary: 20,
            MoveStepPrimarySpeedFactor: 4,
            MoveStepSecondary: 50,
            MoveStepSecondarySpeedFactor: 4,
            OverlayBackdropIntensity: 50,
            OverlayRoundedCorners: true,
            PerAppSettings: { },
            RunAtStartup: true,
            ShowTitlebarFlyout: true,
            Theme: "System",
            TileExistingWindowsOnStartup: false,
            TiledWindowGap: 8
        });
    });

    it("accepts an explicit titlebar-flyout preference", async () =>
    {
        const Decoded = await DecodeSettings({ ShowTitlebarFlyout: false });

        expect(Decoded.ShowTitlebarFlyout).toBe(false);
    });

    it.each([ 0, 100 ])("accepts a backdrop intensity of %i", async (Intensity: number) =>
    {
        const Decoded = await DecodeSettings({ OverlayBackdropIntensity: Intensity });

        expect(Decoded.OverlayBackdropIntensity).toBe(Intensity);
    });

    it.each([ -1, 50.5, 101 ])("rejects a backdrop intensity of %s", async (Intensity: number) =>
    {
        await expect(DecodeSettings({ OverlayBackdropIntensity: Intensity })).rejects.toBeDefined();
    });

    it("defaults Focus preview opacity to 75%", async () =>
    {
        const Decoded = await DecodeSettings({ });

        expect(Decoded.FocusPreviewOpacity).toBe(75);
    });

    it("does not tile existing windows on startup by default", async () =>
    {
        const Decoded = await DecodeSettings({ });

        expect(Decoded.TileExistingWindowsOnStartup).toBe(false);
    });

    it("defaults the tiled-window gap to 8 pixels", async () =>
    {
        const Decoded = await DecodeSettings({ });

        expect(Decoded.TiledWindowGap).toBe(8);
    });

    it.each([ 0, 16 ])("accepts a tiled-window gap of %i pixels", async (Gap: number) =>
    {
        const Decoded = await DecodeSettings({ TiledWindowGap: Gap });

        expect(Decoded.TiledWindowGap).toBe(Gap);
    });

    it.each([ -1, 8.5 ])("rejects a tiled-window gap of %s pixels", async (Gap: number) =>
    {
        await expect(DecodeSettings({ TiledWindowGap: Gap })).rejects.toBeDefined();
    });

    it("defaults the per-application settings record to empty", async () =>
    {
        const Decoded = await DecodeSettings({ });

        expect(Decoded.PerAppSettings).toEqual({ });
    });

    it("supplies defaults for an executable with no explicit overrides", async () =>
    {
        const ExecutablePath = String.raw`C:\Program Files\Example\Example.exe`;
        const Decoded = await DecodeSettings({
            PerAppSettings: {
                [ ExecutablePath ]: { }
            }
        });

        expect(Decoded.PerAppSettings[ExecutablePath]).toEqual({
            IgnoreModal: true,
            NewWindowBehavior: "FloatCenter"
        });
    });

    it.each([
        "InsertBeforeCurrent",
        "InsertAfterCurrent",
        "FloatCenter",
        "FloatCurrent",
        "RPC"
    ] as const)("accepts the %s new-window behavior", async (
        NewWindowBehavior: AppSettings.NewWindowBehavior
    ) =>
    {
        const ExecutablePath = String.raw`C:\Example.exe`;
        const Decoded = await DecodeSettings({
            PerAppSettings: {
                [ ExecutablePath ]: { NewWindowBehavior }
            }
        });

        expect(Decoded.PerAppSettings[ExecutablePath]?.NewWindowBehavior)
            .toBe(NewWindowBehavior);
    });

    it("accepts an explicit modal-window preference", async () =>
    {
        const ExecutablePath = String.raw`C:\Example.exe`;
        const Decoded = await DecodeSettings({
            PerAppSettings: {
                [ ExecutablePath ]: { IgnoreModal: false }
            }
        });

        expect(Decoded.PerAppSettings[ExecutablePath]?.IgnoreModal).toBe(false);
    });

    it("rejects an unknown new-window behavior", async () =>
    {
        await expect(DecodeSettings({
            PerAppSettings: {
                [ String.raw`C:\Example.exe` ]: {
                    NewWindowBehavior: "TileSomewhere"
                }
            }
        })).rejects.toBeDefined();
    });

    it.each([ 0, 100 ])("accepts a Focus preview opacity of %i", async (Opacity: number) =>
    {
        const Decoded = await DecodeSettings({ FocusPreviewOpacity: Opacity });

        expect(Decoded.FocusPreviewOpacity).toBe(Opacity);
    });

    it.each([ -1, 74.5, 101 ])("rejects a Focus preview opacity of %s", async (Opacity: number) =>
    {
        await expect(DecodeSettings({ FocusPreviewOpacity: Opacity })).rejects.toBeDefined();
    });
});

/** Decode one partial persisted settings value through the application codec. */
const DecodeSettings = (Settings: Record<string, unknown>): Promise<AppSettings.AppSettings> =>
    Effect.runPromise(Schema.decodeUnknownEffect(AppSettings.AppSettings.Schema)(Settings));
