/* File:      Keybind.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TIntegralRange, TStaticArray } from "../../Shared/Utility";
import type { FKeyId } from "../../Shared/Keyboard.Types";

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

type TRecurrence<Type> = Type extends Record<PropertyKey, Record<PropertyKey, unknown>>
    ? {
        [ Key in keyof Type ]: TRecurrence<Type[Key]>;
    }
    : Type extends Record<PropertyKey, unknown>
        ? {
            [ Key in keyof Type ]: string;
        }
        : string;

export type FKeybindDisplayNames = TRecurrence<FKeybinds>;

export type FActionKey =
    | `${ FKeybindActionLevel }[${ keyof FKeySequenceSet }]`
    | `Direction.${ FKeybindDirection }`
    | `Miscellaneous.${ FKeybindActionMiscellaneous }`;

export type FAction = TStaticArray<FActionKey, TIntegralRange<1, 4>>;
