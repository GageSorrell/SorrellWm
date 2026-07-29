/**
 * @module @sorrell/wm/Test/OverlayCommandCatalog
 *
 * @file      OverlayCommandCatalog.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "../../Source/Main/Input/Hotkey.ts";
import {
    type OverlayCommandDto,
    OverlayScreenId,
    ResizeMode
} from "../../Source/Shared/OverlayCommand.ts";
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
        CONTROL: 0x11,
        D: 0x44,
        F20: 0x83,
        H: 0x48,
        J: 0x4A,
        K: 0x4B,
        L: 0x4C,
        N: 0x4E,
        MENU: 0x12,
        SHIFT: 0x10,
        T: 0x54,
        TAB: 0x09,
        VK: [
            0x09,
            0x10,
            0x11,
            0x12,
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

describe("OverlayCommandCatalog", () =>
{
    it("projects the four primary actions in order and retains customized shortcuts", () =>
    {
        const Screen = FromKeybindSettings(OverlayScreenId.FloatingHome, [
            Hotkey.ToSetting(Hotkey.Make(Hotkey.Id.SelectLeft, 0x4C))
        ]);

        expect(Screen.Commands.map((Command: OverlayCommandDto) => ({
            HotkeyId: Command.HotkeyId,
            Id: Command.Id,
            KeyLabel: Command.Shortcut.KeyLabel
        }))).toEqual([
            { HotkeyId: "SelectLeft", Id: "Focus", KeyLabel: "L" },
            { HotkeyId: "SelectUp", Id: "Tile", KeyLabel: "H" },
            { HotkeyId: "SelectDown", Id: "Move", KeyLabel: "T" },
            { HotkeyId: "SelectRight", Id: "Resize", KeyLabel: "N" }
        ]);
    });

    it("projects the tiled Home actions with Float on Shift plus SelectUp", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.TiledHome,
            Hotkey.DefaultKeybindSettings
        );

        expect(Screen.CanGoBack).toBe(false);
        expect(Screen.Commands.map((Command: OverlayCommandDto) => ({
            Id: Command.Id,
            KeyLabel: Command.Shortcut.KeyLabel,
            Shift: Command.Shortcut.Modifiers.Shift
        }))).toEqual([
            { Id: "Focus", KeyLabel: "D", Shift: false },
            { Id: "Insert", KeyLabel: "H", Shift: false },
            { Id: "Move", KeyLabel: "T", Shift: false },
            { Id: "Resize", KeyLabel: "N", Shift: false },
            { Id: "Float", KeyLabel: "H", Shift: true }
        ]);
    });

    it("projects the Home secondary command with its application name and shortcut", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.FloatingHome,
            Hotkey.DefaultKeybindSettings,
            { },
            { Name: "Visual Studio Code" }
        );

        expect(Screen.SecondaryCommand).toEqual({
            ApplicationName: "Visual Studio Code",
            Disabled: false,
            HotkeyId: "Toggle",
            Id: "OpenPerAppSettings",
            Shortcut: {
                KeyCode: 0x09,
                KeyLabel: "TAB",
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

    it("omits the application name when it is unavailable", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.FloatingHome,
            Hotkey.DefaultKeybindSettings,
            { },
            { }
        );

        expect(Screen.SecondaryCommand).not.toHaveProperty("ApplicationName");
    });

    it("projects direction commands for the Focus screen", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.FloatingFocus,
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
            Id: "FloatingFocus"
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

    it("projects the Resize screen's edge commands and current Ctrl mode", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.FloatingResize,
            Hotkey.DefaultKeybindSettings,
            { },
            undefined,
            false,
            false,
            20,
            50,
            ResizeMode.Shrink
        );

        expect(Screen.Commands.map((Command: OverlayCommandDto) => Command.Id)).toEqual([
            "ResizeWindowLeft",
            "ResizeWindowUp",
            "ResizeWindowDown",
            "ResizeWindowRight"
        ]);
        expect(Screen).toMatchObject({
            CanGoBack: true,
            Id: "FloatingResize",
            ResizeMode: "Shrink"
        });
        expect(Screen.DistanceToggle).toBeDefined();
    });
});
