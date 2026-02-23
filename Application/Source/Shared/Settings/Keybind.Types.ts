/* File:      Keybind.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TIntegralRange, TStaticArray } from "!/Utility";
import type { FKeyId } from "!/Keyboard.Types";

export type FKeybindDirection =
    | "Left"
    | "Up"
    | "Down"
    | "Right";

export type FKeybindAction =
    | "Up"
    | "Down"
    | "Left"
    | "Right"
    | "Primary_00";

export type FKeybindActionLevelSet = Record<TIntegralRange<0, 3>, TKeybindSet>;

export type FKeybindActionLevel =
    | "Primary"
    | "Secondary";

export type FKeybind = TStaticArray<FKeyId, TIntegralRange<1, 4>>;

export type TKeybindSet<NumAllowedKeybinds extends TIntegralRange<1, 2> = TIntegralRange<1, 2>> =
    TStaticArray<FKeybind, NumAllowedKeybinds>;

export type FKeybindActionMiscellaneous =
    | "Peek"
    | "FocusList"
    | "FocusTextInput"
    | "Settings";

export type FKeybinds =
    Record<FKeybindActionLevel, FKeybindActionLevelSet> &
    {
        Direction: Record<FKeybindDirection, TKeybindSet<1>>;
        Miscellaneous: Record<FKeybindActionMiscellaneous, TKeybindSet>;
    };

export type FKeybindKey =
    | `${ FKeybindActionLevel }[${ keyof FKeybindActionLevelSet }]`
    | `Direction.${ FKeybindDirection }`
    | `Miscellaneous.${ FKeybindActionMiscellaneous }`;
