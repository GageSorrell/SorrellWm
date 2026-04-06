/* File:      Provider.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ReactiveEventContext } from "./Provider.Types";

export type PromiseCache = Record<string, Promise<unknown>>;

export type PromiseCacheFactory = (
    Channel: string,
    Request: unknown
) => Promise<unknown>;

export type ReactiveEventContextInternal =
    ReactiveEventContext &
    {
        PutCachedPromise: (
            Events: Record<string, unknown>,
            PromiseFactory: PromiseCacheFactory
        ) => Promise<unknown>;
    };
