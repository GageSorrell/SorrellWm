/**
 * @file      Keyboard.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FActionKey } from "../../../../Shared/Settings";

export type CKeyboardSettings =
{
    EditingKeybind: FActionKey | undefined;
    RequestCancel: (In: FActionKey) => boolean;
    RequestEditKeybind: (In: FActionKey) => boolean;
};
