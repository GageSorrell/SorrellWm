/* File:      Hook.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FUseEffectCallback =
    | (() => void)
    | (() => (() => void));

export type FUseEffectAsyncCallback =
    | ((AbortSignal: AbortSignal) => Promise<void>)
    | (() => Promise<void>);

export type FUseEffectAsyncCleanupFunction =
    | ((AbortSignal: AbortSignal) => void)
    | (() => void);
