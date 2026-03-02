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

export type FKeybindActionLevel =
    | "Primary"
    | "Secondary";

export type FKeybindId = TStaticArray<FKeyId, TIntegralRange<1, 4>>;

export type FKeybindActionLevelSet = Record<TIntegralRange<0, 3>, FKeybindId>;

export type TKeybindSet<NumAllowedKeybinds extends TIntegralRange<1, 2> = TIntegralRange<1, 2>> =
    TStaticArray<FKeybindId, NumAllowedKeybinds>;

export type FKeybindActionMiscellaneous =
    | "Peek"
    | "FocusList"
    | "FocusTextInput"
    | "Settings";

export type FKeybinds =
    Record<FKeybindActionLevel, FKeybindActionLevelSet> &
    {
        Direction: Record<FKeybindDirection, FKeybindId>;
        Miscellaneous: Record<FKeybindActionMiscellaneous, FKeybindId>;
    };

export type FKeybindKey =
    | `${ FKeybindActionLevel }[${ keyof FKeybindActionLevelSet }]`
    | `Direction.${ FKeybindDirection }`
    | `Miscellaneous.${ FKeybindActionMiscellaneous }`;

export type FKeybind = TStaticArray<FKeybindKey, TIntegralRange<1, 4>>;
