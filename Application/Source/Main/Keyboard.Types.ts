/* File:      Keyboard.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FVirtualKey } from "@/Domain/Common/Component/Keyboard/Keyboard.Types";

export type FActivationKeyState =
    | "Down"
    | "Up";

export type FKeyboardEvent =
{
    State: FActivationKeyState;
    VkCode: FVirtualKey;
};
