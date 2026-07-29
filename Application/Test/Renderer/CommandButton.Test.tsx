/**
 * @module @sorrell/wm/Renderer/CommandButtonTest
 *
 * @file      CommandButton.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { GetShortcutParts } from "../../Source/Renderer/CommandButton.tsx";
import type { ShortcutDto } from "../../Source/Shared/Hotkey.ts";

const Shortcut = (KeyLabel: string): ShortcutDto => ({
    KeyCode: 0x12,
    KeyLabel,
    Modifiers: {
        Alt: false,
        Control: false,
        Shift: false,
        Super: false
    }
});

describe("CommandButton.GetShortcutParts", () =>
{
    it.each([ "MENU", "LMENU", "RMENU" ])(
        "presents the modifier-only %s key as Alt",
        (KeyLabel: string) =>
        {
            expect(GetShortcutParts(Shortcut(KeyLabel))).toEqual([ "Alt" ]);
        }
    );
});
