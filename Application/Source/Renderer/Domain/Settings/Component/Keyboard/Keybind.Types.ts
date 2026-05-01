/**
 * @file      Keybind.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TClasses, TUseClasses } from "@sorrell/react";
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
