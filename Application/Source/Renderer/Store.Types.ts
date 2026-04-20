/**
 * @file      Store.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { StoreApi, UseBoundStore } from "zustand";
import type { FHexColor } from "@sorrellwm/windows";

type TUnget<Type extends string> = Type extends `Set${ infer R }`
    ? R
    : never;

type TMakeBasicStore<Type extends Record<string, unknown>> =
    Type &
    {
        [ Key in `Set${ Extract<keyof Type, string> }` ]: (Input: Type[TUnget<Key>]) => void;
    };

export type GGlobalData =
{
    ThemeColor: FHexColor;
};

export type GGlobal = TMakeBasicStore<GGlobalData>;

export type GGlobalDefault = Omit<GGlobal, `Set${ string }`>;

export type FStoreFunction = UseBoundStore<StoreApi<GGlobal>>;
