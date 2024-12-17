/* File:      Store.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { StoreApi, UseBoundStore } from "zustand";
import type { FHexColor } from "@sorrellwm/windows";
import type { FKeyCombination } from "./Action/Action.Types";

type TUnget<T extends string> = T extends `Set${ infer R }`
    ? R
    : never;

type TMakeBasicStore<T extends Record<string, unknown>> =
    T &
    {
        [ Key in `Set${ Extract<keyof T, string> }` ]: (Input: T[TUnget<Key>]) => void;
    };

export type GGlobalData =
{
    KeyCombinations: Array<FKeyCombination>;
    ThemeColor: FHexColor;
};

export type GGlobal = TMakeBasicStore<GGlobalData>;

export type GGlobalDefault = Omit<GGlobal, `Set${ string }`>;

export type FStoreFunction = UseBoundStore<StoreApi<GGlobal>>;
