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

import * as AppSettings from "../Source/Main/AppSettings.js";
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
        F20: 0x83,
        VK: [ 0x83 ]
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
                }
            ],
            OverlayRoundedCorners: true,
            RunAtStartup: true,
            Theme: "System"
        });
    });
});
