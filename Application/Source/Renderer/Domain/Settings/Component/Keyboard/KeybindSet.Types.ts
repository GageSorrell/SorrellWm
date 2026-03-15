/* File:      KeybindSet.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FKeyId } from "../../../../../Shared/Keyboard.Types";
import type { PKeybind } from "./Keybind.Types";

export type PKeybindContainer =
    Omit<PKeybind, "KeyIds" | "Subtitle" | "Title"> &
    {
        Caption?: string;
        KeyIds: FKeyId | Array<FKeyId> | undefined;
    };

export type FKeybindPair = Pick<PKeybindContainer, "ActionKey" | "Caption" | "KeyIds">;

export type PKeybindSet =
    Omit<PKeybind, "ActionKey" | "KeyIds"> &
    {
        Keybinds: Array<FKeybindPair>;
    };
