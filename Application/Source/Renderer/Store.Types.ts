/* File:      Store.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { StoreApi, UseBoundStore } from "zustand";
import type { FHexColor } from "Windows";

export type GGlobal =
{
    SetThemeColor: (Color: FHexColor) => void;
    ThemeColor: FHexColor;
};

export type GGlobalDefault = Omit<GGlobal, `Set${ string }`>;

export type FStoreFunction = UseBoundStore<StoreApi<GGlobal>>;
