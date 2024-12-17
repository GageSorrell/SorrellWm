/* File:      Key.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FVirtualKey } from "../Keyboard.Types";

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
     *     * `"Left"` or `"Right"` in the case of keys like left shift
     *     * `"Either"` in the case of keys that do not have a side,
     *       but have corresponding key codes that *do* have sides.
     *     * `undefined` for "normal" keys, such as letters and numbers
     */
    Side: FKeySide;
};

export type PKey =
{
    /** Is the key being used to record a combination? */
    Recording?: boolean;
    Value: FVirtualKey;
};
