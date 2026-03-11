/* File:      KeybindDialog.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FActionKey } from "Source/Shared/Settings";
import type { FKeyId } from "Source/Shared/Keyboard.Types";
import type { PKeybind } from "./KeybindSet.Types";
import type { THandler } from "@/Utility";

export type PKeybindContainer =
    Omit<PKeybind, "ActionKeys" | "KeyIds"> &
    {
        ActionKey: FActionKey;
        KeyId: FKeyId;
        OnOpenChange: THandler<boolean>;
        OpenDialog: boolean;
    };
