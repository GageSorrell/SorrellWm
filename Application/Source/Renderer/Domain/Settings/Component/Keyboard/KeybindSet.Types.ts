/* File:      KeybindSet.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FActionKey } from "Source/Shared/Settings";
import type { FKeyId } from "Source/Shared/Keyboard.Types";
import type { PSettingSegment } from "../SettingSegment.Types";

export type PKeybind =
    Pick<PSettingSegment, "Icon" | "Subtitle" | "Title"> &
    {
        ActionKeys: TArray<FActionKey>;
        KeyIds: TArray<FKeyId>;
    };
