/* File:      Promise.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TAsyncSource } from "./Internal/index.js";
import type { TResult } from "./index.js";

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
