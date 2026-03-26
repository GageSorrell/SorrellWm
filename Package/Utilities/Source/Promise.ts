/* File:      Promise.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TAsyncSource } from "./Internal/index.js";
import type { TResult } from "./index.js";

/**
 * Implements "Errors-as-values" for `async` functions and `Promise<DataType>`s.
 *
 * If the `async` function or `Promise<DataType>` returns/resolves, then the `Error`
 * property of the returned object will be `undefined`, and the result of the
 * `async` function or `Promise<DataType>` will reside in the `Data` property of the
 * returned object.
 *
 * Similarly, if the `async` function or `Promise<DataType>` throws, then the `Data`
 * property of the returned object is `undefined`, and the `Error` property is what
 * was thrown to the `catch` block.
 */
export async function TryAsync<DataType>(Source: TAsyncSource<DataType>): Promise<TResult<DataType>>
{
    try
    {
        const Data: DataType =
            typeof Source === "function"
                ? await Source()
                : await Source;

        return {
            Data,
            Error: undefined
        };
    }
    catch (ErrorValue: unknown)
    {
        return {
            Data: undefined,
            Error: ErrorValue
        };
    }
}
