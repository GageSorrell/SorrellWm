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

import * as AppSettings from "../Source/Main/AppSettings/AppSettings.ts";
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
        D: 0x44,
        F20: 0x83,
        H: 0x48,
        J: 0x4A,
        K: 0x4B,
        L: 0x4C,
        N: 0x4E,
        T: 0x54,
        TAB: 0x09,
        VK: [ 0x09, 0x44, 0x48, 0x4A, 0x4B, 0x4C, 0x4E, 0x54, 0x83, 0xA6 ]
    }
}));

describe("AppSettings schema", () =>
{
    it("supplies current defaults when decoding the legacy settings wrapper", async() =>
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
            Schema.decodeUnknownEffect(AppSettings.AppSettings.schema)(LegacySettings)
        );

        expect(Decoded).toEqual({
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
                    Id: "SelectLeft",
                    Key: 0x44,
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
            OverlayBackdropIntensity: 50,
            OverlayRoundedCorners: true,
            RunAtStartup: true,
            ShowTitlebarFlyout: true,
            Theme: "System"
        });
    });

    it("accepts an explicit titlebar-flyout preference", async() =>
    {
        const Decoded = await DecodeSettings({ ShowTitlebarFlyout: false });

        expect(Decoded.ShowTitlebarFlyout).toBe(false);
    });

    it.each([ 0, 100 ])("accepts a backdrop intensity of %i", async(Intensity: number) =>
    {
        const Decoded = await DecodeSettings({ OverlayBackdropIntensity: Intensity });

        expect(Decoded.OverlayBackdropIntensity).toBe(Intensity);
    });

    it.each([ -1, 50.5, 101 ])("rejects a backdrop intensity of %s", async(Intensity: number) =>
    {
        await expect(DecodeSettings({ OverlayBackdropIntensity: Intensity })).rejects.toBeDefined();
    });
});

/** Decode one partial persisted settings value through the application codec. */
const DecodeSettings = (Settings: Record<string, unknown>): Promise<AppSettings.AppSettings> =>
    Effect.runPromise(Schema.decodeUnknownEffect(AppSettings.AppSettings.schema)(Settings));
