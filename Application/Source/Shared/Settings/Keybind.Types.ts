/* File:      Keybind.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TIntegralRange, TStaticArray } from "()/Utility";
import type { FKeyId } from "()/Keyboard.Types";

export type FKeybindDirection =
    | "Left"
    | "Up"
    | "Down"
    | "Right";

export type FKeybindActionLevel =
    | "Primary"
    | "Secondary";

export type FKeySequence = TStaticArray<FKeyId, TIntegralRange<1, 4>>;

export type FKeySequenceSet = Record<TIntegralRange<0, 3>, FKeySequence>;

export type FKeybindActionMiscellaneous =
    | "Peek"
    | "FocusList"
    | "FocusTextInput"
    | "Settings";

export type FKeybinds =
    Record<FKeybindActionLevel, FKeySequenceSet> &
    {
        Direction: Record<FKeybindDirection, FKeySequence>;
        Miscellaneous: Record<FKeybindActionMiscellaneous, FKeySequence>;
    };

export type FActionKey =
    | `${ FKeybindActionLevel }[${ keyof FKeySequenceSet }]`
    | `Direction.${ FKeybindDirection }`
    | `Miscellaneous.${ FKeybindActionMiscellaneous }`;

export type FAction = TStaticArray<FActionKey, TIntegralRange<1, 4>>;
