/**
 * @module @sorrell/wm/Test/OverlayCommandCatalog
 *
 * @file      OverlayCommandCatalog.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "../Source/Main/Hotkey.js";
import { type OverlayCommandDto, OverlayScreenId } from "../Source/Shared/OverlayCommand.js";
import { describe, expect, it, vi } from "vitest";
import { FromKeybindSettings } from "../Source/Main/OverlayCommandCatalog.js";

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

describe("OverlayCommandCatalog", () =>
{
    it("projects the four primary actions in order and retains customized shortcuts", () =>
    {
        const Screen = FromKeybindSettings(OverlayScreenId.Home, [
            Hotkey.ToSetting(Hotkey.Make(Hotkey.Id.SelectLeft, 0x4C))
        ]);

        expect(Screen.Commands.map((Command: OverlayCommandDto) => ({
            HotkeyId: Command.HotkeyId,
            Id: Command.Id,
            KeyLabel: Command.Shortcut.KeyLabel
        }))).toEqual([
            { HotkeyId: "SelectLeft", Id: "Focus", KeyLabel: "L" },
            { HotkeyId: "SelectUp", Id: "Insert", KeyLabel: "H" },
            { HotkeyId: "SelectDown", Id: "Move", KeyLabel: "T" },
            { HotkeyId: "SelectRight", Id: "Resize", KeyLabel: "N" }
        ]);
    });

    it("projects direction commands for the Focus screen", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.Focus,
            Hotkey.DefaultKeybindSettings
        );

        expect(Screen).toMatchObject({
            CanGoBack: true,
            Id: "Focus"
        });
        expect(Screen.Commands.map((Command: OverlayCommandDto) => Command.Id)).toEqual([
            "FocusMoveLeft",
            "FocusMoveUp",
            "FocusMoveDown",
            "FocusMoveRight"
        ]);
    });
});
