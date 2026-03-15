/* File:      Hook.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FBox } from "@sorrellwm/windows";
import type { FSimpleCallback } from "../../Shared/Utility";
import type { RefObject } from "react";

export type FUseEffectCallback =
    | (() => void)
    | (() => (() => void));

export type FUseEffectAsyncCallback =
    | ((AbortSignal: AbortSignal) => Promise<void>)
    | (() => Promise<void>);

export type FUseEffectAsyncCleanupFunction =
    | ((AbortSignal: AbortSignal) => void)
    | (() => void);

export type FMakeNavigateFunction = (Route: string) => FSimpleCallback;

export type TUseDomRectReturnValue<Type extends HTMLElement> =
    Readonly<[ Box: FBox, Ref: RefObject<Type | null> ]>;
