/**
 * @file      Keybind.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FKeyId } from "../../Shared/Keyboard.Types";
import type { TIntegralRange } from "@sorrell/utilities/math";
import type { TStaticArray } from "@sorrell/utilities/array";

export type FKeybindDirection =
    | "Left"
    | "Up"
    | "Down"
    | "Right";

export type FKeybindActionLevel =
    | "Primary"
    | "Secondary";

export type FKeySequenceSet = Record<TIntegralRange<0, 3>, Array<FKeyId>>;

export type FKeybindActionMiscellaneous =
    | "Peek"
    | "FocusList"
    | "FocusTextInput"
    | "Settings";

export type FKeybinds =
    Record<FKeybindActionLevel, FKeySequenceSet> &
    {
        Activate: Array<FKeyId>;
        Cancel: Array<FKeyId>;
        Direction: Record<FKeybindDirection, Array<FKeyId>>;
        Miscellaneous: Record<FKeybindActionMiscellaneous, Array<FKeyId>>;
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
    | `Miscellaneous.${ FKeybindActionMiscellaneous }`
    | "Activate"
    | "Cancel";

export type FAction = TStaticArray<FActionKey, TIntegralRange<1, 4>>;

export type FKeySide =
    | "L"
    | "R"
    | "Either"
    | undefined;

export type FKey =
    {
        /** Text to display on the key, or a symbol that is rendered in the center of the key. */
        Display: string;

        /**
         * An additional descriptor, shown in the corner.
         * Should be `undefined` whenever `Side` is defined.
         */
        Modifier: undefined | string;

        /**
         * The "side" of the key is:
         *
         * - `"Left"` or `"Right"` in the case of keys like left shift
         * - `"Either"` in the case of keys that do not have a side,
         *   but have corresponding key codes that *do* have sides.
         * - `undefined` for "normal" keys, such as letters and numbers
         */
        Side: FKeySide;
    };
