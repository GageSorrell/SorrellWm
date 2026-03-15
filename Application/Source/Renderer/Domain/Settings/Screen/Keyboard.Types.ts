/* File:      Keyboard.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FActionKey } from "Source/Shared/Settings";

export type CKeyboardSettings =
{
    EditingKeybind: FActionKey | undefined;
    RequestCancel: (In: FActionKey) => boolean;
    RequestEditKeybind: (In: FActionKey) => boolean;
};
