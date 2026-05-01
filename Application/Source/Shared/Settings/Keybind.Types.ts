/**
 * @file      Keybind.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FKeyId } from "../../Shared/Keyboard.Types";
import type { TIntegralRange } from "@sorrell/utilities/math";
import type { TStaticArray } from "@sorrell/utilities/array";
import type { TRecurrence } from "./Keybind.Internal.Types";

/**
 * Some keybinds have directions, which is one of four basic directions in $\mathbf{R}^2$.
 */
export type FKeybindDirection =
    | "Left"
    | "Up"
    | "Down"
    | "Right";

/**
 * Some keybinds have "levels", which groups sets of keybinds, such that each set
 * is identified by its "level", which can be thought of as the *importance* of
 * the actions that can be performed by that set of keybinds.
 */
export type FKeybindActionLevel =
    | "Primary"
    | "Secondary";

/**
 * A finite sequence of zero to three {@link FKeyId | keys}.
 */
export type FKeySequenceSet = Record<TIntegralRange<0, 3>, Array<FKeyId>>;

/**
 * These are the miscellaneous actions that have assignable keybinds.
 */
export type FKeybindActionMiscellaneous =
    | "Peek"
    | "FocusList"
    | "FocusTextInput"
    | "Settings";

/**
 * This {@link Record} describes all actions that can be performed
 * in `SorrellWm` with the keyboard, and the keyboard keys (or sequence
 * of keyboard keys) that must be pressed to perform that action via the
 * keyboard.
 */
export type FKeybinds =
    Record<FKeybindActionLevel, FKeySequenceSet> &
    {
        Activate: Array<FKeyId>;
        Cancel: Array<FKeyId>;
        Direction: Record<FKeybindDirection, Array<FKeyId>>;
        Miscellaneous: Record<FKeybindActionMiscellaneous, Array<FKeyId>>;
    };

/**
 * The user-facing names of the keybind actions available to the user in `SorrellWm`.
 */
export type FKeybindDisplayNames = TRecurrence<FKeybinds>;

/**
 * These are the `.`-delimited `string`s that uniquely identify every
 * assignable action that can be performed via the keyboard in `SorrellWm`.
 */
export type FActionKey =
    | `${ FKeybindActionLevel }[${ keyof FKeySequenceSet }]`
    | `Direction.${ FKeybindDirection }`
    | `Miscellaneous.${ FKeybindActionMiscellaneous }`
    | "Activate"
    | "Cancel";

/**
 * An {@link FAction} is
 */
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
