/* File:      Promise.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TExtractFunction } from "./index.js";

export type TResult<DataType, ErrorType = unknown> =
    | {
        Data: DataType;
        Error: undefined;
    }
    | {
        Data: undefined;
        Error: ErrorType;
    };

export type TPromiseThenFunction<ParameterType = unknown, ReturnType = unknown> =
    (Value: ParameterType) => ReturnType;

export type TPromiseCatchFunction<Type = unknown> =
    Parameters<TExtractFunction<Promise<Type>["catch"]>>[0];
