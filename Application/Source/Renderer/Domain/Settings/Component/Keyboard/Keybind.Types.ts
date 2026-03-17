/* File:      Keybind.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TClasses, TUseClasses } from "@/Utility";
import type { FActionKey } from "../../../../../Shared/Settings";
import type { FKeyId } from "../../../../../Shared/Keyboard.Types";
import type { PSettingSegment } from "../SettingSegment.Types";

type FKeybindStylesInternal =
    | "ActiveStyle"
    | "BaseStyle"
    | "ReceptiveStyle"
    | "UnreceptiveStyle";

type FKeybindStyles = Exclude<FKeybindStylesInternal, "BaseStyle">;

export type FUseKeybindStylesInternal = TUseClasses<FKeybindStylesInternal>;

export type FUseKeybindStyles = TClasses<FKeybindStyles>;

export type PActiveEditingMessage =
{
    ActionKeys: Array<FActionKey>;
};

export type PKeybind =
    Pick<PSettingSegment, "Icon" | "Subtitle" | "Title"> &
    {
        ActionKey: FActionKey;
        KeyIds: TArray<FKeyId>;
    };
