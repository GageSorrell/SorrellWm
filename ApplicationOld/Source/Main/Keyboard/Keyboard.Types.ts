/**
 * @file      Keyboard.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { FVirtualKey } from "../../Shared";

export type FActivationKeyState =
    | "Down"
    | "Up";

export type FKeyboardEvent =
{
    State: FActivationKeyState;
    VkCode: FVirtualKey;
};
