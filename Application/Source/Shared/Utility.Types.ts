/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type TResolveFunction<T> = (Value: T | PromiseLike<T>) => void;
export type FRejectFunction = (Reason?: unknown) => void;
