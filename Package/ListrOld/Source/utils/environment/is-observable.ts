/**
 * @file      is-observable.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ObservableLike } from "@interfaces/index.js";

/**
 * Tests to see if the object is an RxJS {@link Observable}
 */
export function isObservable<T>(obj: unknown): obj is ObservableLike<T>
{
    return !!obj && typeof obj === "object" && "subscribe" in obj && typeof obj.subscribe === "function";
}
