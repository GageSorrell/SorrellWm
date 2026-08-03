/**
 * Tests renderer-safe overlay commands projected from configured hotkeys.
 *
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

    it("appends Tile All with Commit only when it is available", () =>
    {
        const Hidden = FromKeybindSettings(
            OverlayScreenId.FloatingHome,
            Hotkey.DefaultKeybindSettings
        );
        const Visible = FromKeybindSettings(
            OverlayScreenId.FloatingHome,
            Hotkey.DefaultKeybindSettings,
            { },
            undefined,
            false,
            false,
            20,
            50,
            ResizeMode.Grow,
            false,
            { },
            true
        );

        expect(Hidden.Commands.some((Command: OverlayCommandDto) =>
            Command.Id === "TileAll")).toBe(false);
        expect(Visible.Commands.at(-1)).toMatchObject({
            HotkeyId: "Commit",
            Id: "TileAll",
            Shortcut: { KeyLabel: "RETURN" }
        });
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

    it("projects tiled Insert directions and floating-window selection", () =>
    {
        const Direction = FromKeybindSettings(
            OverlayScreenId.TiledInsertDirection,
            Hotkey.DefaultKeybindSettings
        );
        const Picker = FromKeybindSettings(
            OverlayScreenId.TiledInsertWindow,
            Hotkey.DefaultKeybindSettings,
            { },
            undefined,
            false,
            false,
            20,
            50,
            ResizeMode.Grow,
            false,
            { },
            false,
            new Set(),
            false,
            [ ],
            "PreserveRatios",
            [
                {
                    Active: true,
                    Target: { Icon: "first-icon", Title: "First App" }
                },
                {
                    Active: false,
                    Target: { Icon: undefined, Title: "Second App" }
                }
            ]
        );

        expect(Direction.Commands.map(
            (Command: OverlayCommandDto) => Command.Id
        )).toEqual([
            "ChooseInsertLeft",
            "ChooseInsertUp",
            "ChooseInsertDown",
            "ChooseInsertRight"
        ]);
        expect(Picker.Commands.map((Command: OverlayCommandDto) => ({
            Control: Command.Shortcut.Modifiers.Control,
            Id: Command.Id,
            KeyLabel: Command.Shortcut.KeyLabel
        }))).toEqual([
            { Control: false, Id: "SelectInsertWindowUp", KeyLabel: "H" },
            { Control: false, Id: "SelectInsertWindowDown", KeyLabel: "T" },
            { Control: false, Id: "CommitInsertWindow", KeyLabel: "RETURN" },
            { Control: false, Id: "OpenInsertTarget", KeyLabel: "TAB" },
            {
                Control: true,
                Id: "OpenInsertTargetForNextWindow",
                KeyLabel: "TAB"
            }
        ]);
        expect(Picker.InsertWindows).toEqual([
            {
                Active: true,
                Target: { Icon: "first-icon", Title: "First App" }
            },
            {
                Active: false,
                Target: { Icon: undefined, Title: "Second App" }
            }
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

    it("adds the Ctrl plus SelectUp parent-panel command to tiled Focus", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.TiledFocus,
            Hotkey.DefaultKeybindSettings,
            {
                FocusMoveFirst: {
                    Icon: undefined,
                    Title: "First App"
                },
                FocusMoveLast: {
                    Icon: undefined,
                    Title: "Last App"
                },
                FocusMoveParent: {
                    Icon: undefined,
                    Title: "Vertical panel"
                },
                FocusMoveRoot: {
                    Icon: undefined,
                    Title: "Horizontal panel"
                }
            }
        );

        expect(Screen.Commands.map((Command: OverlayCommandDto) => Command.Id)).toEqual([
            "FocusMoveLeft",
            "FocusMoveUp",
            "FocusMoveDown",
            "FocusMoveRight",
            "FocusMoveParent",
            "FocusMoveFirst",
            "FocusMoveLast",
            "FocusMoveRoot"
        ]);
        expect(Screen.Commands[4]).toMatchObject({
            Disabled: false,
            Shortcut: {
                KeyLabel: "H",
                Modifiers: { Control: true }
            },
            Target: { Title: "Vertical panel" }
        });
        expect(Screen.Commands[5]).toMatchObject({
            Disabled: false,
            Shortcut: {
                KeyLabel: "HOME",
                Modifiers: { Control: false }
            },
            Target: { Title: "First App" }
        });
        expect(Screen.Commands[6]).toMatchObject({
            Disabled: false,
            Shortcut: { KeyLabel: "END" },
            Target: { Title: "Last App" }
        });
        expect(Screen.Commands[7]).toMatchObject({
            Disabled: false,
            Shortcut: {
                KeyLabel: "HOME",
                Modifiers: { Control: true }
            },
            Target: { Title: "Horizontal panel" }
        });
    });

    it("projects tiled Move commands, availability, and panel-entry state", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.TiledMove,
            Hotkey.DefaultKeybindSettings,
            { },
            undefined,
            false,
            false,
            20,
            50,
            ResizeMode.Grow,
            false,
            { },
            false,
            new Set([ "MoveWindowLeft", "MoveWindowIntoPanel" ]),
            true
        );

        expect(Screen.IsTiledMovePanelTargeted).toBe(true);
        expect(Screen.Commands.map((Command: OverlayCommandDto) => Command.Id)).toEqual([
            "MoveWindowLeft",
            "MoveWindowUp",
            "MoveWindowDown",
            "MoveWindowRight",
            "MoveWindowParent",
            "MoveWindowFirst",
            "MoveWindowLast",
            "MoveWindowIntoPanel"
        ]);
        expect(Screen.Commands[0]).toMatchObject({ Disabled: true });
        expect(Screen.Commands[4]).toMatchObject({
            Shortcut: {
                KeyLabel: "H",
                Modifiers: { Control: true }
            }
        });
        expect(Screen.Commands[5]?.Shortcut.KeyLabel).toBe("HOME");
        expect(Screen.Commands[6]?.Shortcut.KeyLabel).toBe("END");
        expect(Screen.Commands[7]).toMatchObject({
            Disabled: true,
            Shortcut: { KeyLabel: "RETURN" }
        });
    });

    it("projects only discovered monitor commands with their numeric shortcuts", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.TiledFocus,
            Hotkey.DefaultKeybindSettings,
            { },
            undefined,
            false,
            false,
            20,
            50,
            ResizeMode.Grow,
            true,
            {
                FocusMonitor2: {
                    Disabled: true,
                    Target: {
                        Icon: undefined,
                        Title: "Display 2: Projector"
                    }
                },
                FocusMonitor3: {
                    Disabled: false,
                    Target: {
                        Icon: undefined,
                        Title: "Display 3: Desk"
                    }
                }
            }
        );

        expect(Screen.IsRootPanelFocused).toBe(true);
        expect(Screen.Commands.some((Command: OverlayCommandDto) =>
            Command.Id.startsWith("FocusMonitor"))).toBe(false);
        expect(Screen.MonitorCommands).toMatchObject([
            {
                Disabled: true,
                Id: "FocusMonitor2",
                Shortcut: { KeyLabel: "2" },
                Target: { Title: "Display 2: Projector" }
            },
            {
                Disabled: false,
                Id: "FocusMonitor3",
                Shortcut: { KeyLabel: "3" },
                Target: { Title: "Display 3: Desk" }
            }
        ]);
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

    it("projects the tiled Resize behavior toggle and its initial mode", () =>
    {
        const Screen = FromKeybindSettings(
            OverlayScreenId.TiledResize,
            Hotkey.DefaultKeybindSettings
        );

        expect(Screen.Commands.map((Command: OverlayCommandDto) => Command.Id)).toEqual([
            "ResizeWindowLeft",
            "ResizeWindowUp",
            "ResizeWindowDown",
            "ResizeWindowRight",
            "ToggleTiledResizeBehavior"
        ]);
        expect(Screen).toMatchObject({
            Id: "TiledResize",
            ResizeMode: "Grow",
            TiledResizeBehavior: "PreserveRatios"
        });
        expect(Screen.DistanceToggle).toBeDefined();
    });
});
