/* File:      Action.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FVirtualKey } from "@/Domain/Common/Component/Keyboard/Keyboard.Types";

/** This is more functionality than frontend, so this should probably be moved somewhere else. */
export type FAction =
    | "Move";

export type FKeyCombination =
{
    Callback: () => void;
    Name: string;
    Keys: Array<FVirtualKey>;
};

export type PAction =
{
    Name: string;
    Keys: Array<FVirtualKey>;
    OnSelect: () => void;
};
