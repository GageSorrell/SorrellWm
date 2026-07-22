/**
 *
 *
 * @module @sorrell/wm/Main/HotkeyTest
 *
 * @file      HotkeyTest.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Windows from "@sorrell/windows";
import { Id, IsMatch, Make } from "./Hotkey.js";
import { describe, expect, it, vi } from "vitest";

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
        A: 0x41,
        CONTROL: 0x11,
        F20: 0x83,
        LCONTROL: 0xA2,
        LMENU: 0xA4,
        LSHIFT: 0xA0,
        LWIN: 0x5B,
        MENU: 0x12,
        RCONTROL: 0xA3,
        RMENU: 0xA5,
        RSHIFT: 0xA1,
        RWIN: 0x5C,
        SHIFT: 0x10
    }
}));

describe("Hotkey.IsMatch", () =>
{
    it("matches either side of each requested modifier", () =>
    {
        const Keybind = Make(Id.Toggle, Windows.VK.A, {
            Control: true,
            Shift: true
        });
        const PressedKeys = new Set<Windows.VK.VK>([
            Windows.VK.RCONTROL,
            Windows.VK.LSHIFT,
            Windows.VK.A
        ]);

        expect(IsMatch(Keybind, Windows.VK.A, PressedKeys)).toBe(true);
    });

    it("rejects an unrequested modifier", () =>
    {
        const Keybind = Make(Id.Toggle, Windows.VK.A, { Control: true });
        const PressedKeys = new Set<Windows.VK.VK>([
            Windows.VK.LCONTROL,
            Windows.VK.LMENU,
            Windows.VK.A
        ]);

        expect(IsMatch(Keybind, Windows.VK.A, PressedKeys)).toBe(false);
    });

    it("only matches the keybind trigger", () =>
    {
        const Keybind = Make(Id.Toggle, Windows.VK.A);

        expect(IsMatch(
            Keybind,
            Windows.VK.F20,
            new Set([ Windows.VK.F20 ])
        )).toBe(false);
    });
});
