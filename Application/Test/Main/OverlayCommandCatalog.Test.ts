/**
 * @module @sorrell/wm/Test/OverlayCommandCatalog
 *
 * @file      OverlayCommandCatalog.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "../../Source/Main/Input/Hotkey.ts";
import { type OverlayCommandDto, OverlayScreenId } from "../../Source/Shared/OverlayCommand.ts";
import { describe, expect, it, vi } from "vitest";
import { FromKeybindSettings } from "../../Source/Main/Overlay/CommandCatalog.ts";

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

    it("projects the Home secondary command with its application label and shortcut", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.Home,
            Hotkey.DefaultKeybindSettings,
            { },
            { Name: "Visual Studio Code" }
        );

        expect(Screen.SecondaryCommand).toEqual({
            Disabled: false,
            HotkeyId: "Toggle",
            Id: "OpenPerAppSettings",
            Label: "Configure how SorrellWm manages Visual Studio Code windows",
            Shortcut: {
                KeyCode: 0x09,
                KeyLabel: "⭾",
                Modifiers:
                {
                    Alt: false,
                    Control: false,
                    Shift: false,
                    Super: false
                }
            }
        });
        expect(Screen.SecondaryCommand).not.toHaveProperty("Target");
    });

    it("uses an application-oriented fallback when its name is unavailable", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.Home,
            Hotkey.DefaultKeybindSettings,
            { },
            { }
        );

        expect(Screen.SecondaryCommand?.Label).toBe(
            "Configure how SorrellWm manages this application's windows"
        );
    });

    it("projects direction commands for the Focus screen", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.Focus,
            Hotkey.DefaultKeybindSettings,
            {
                FocusMoveLeft: {
                    Icon: "left-icon",
                    Title: "Left App"
                }
            }
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
        expect(Screen.Commands[0]).toMatchObject({
            Disabled: false,
            Target: {
                Icon: "left-icon",
                Title: "Left App"
            }
        });
        expect(Screen.Commands.slice(1).every(
            (Command: OverlayCommandDto) => Command.Disabled
        )).toBe(true);
    });
});
