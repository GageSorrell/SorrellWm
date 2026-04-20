/**
 * @file      Promise.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TExtractFunction } from "../Functional/index.js";

/**
 * @typeParam DataType - The {@link Data} type of this.
 *
 * @property Data - The data returned by the corresponding `async` function or `Promise<DataType>`,
 * iff it resolved successfully.  Otherwise, it is `undefined`.
 *
 * @property Error - The error thrown by the corresponding `async` function or `Promise<DataType>`.
 * This is `undefined` iff the corresponding `async` function or `Promise<DataType>` resolved successfully.
 */
export type TTryResult<DataType> =
    | {
        Data: DataType;
        Error: undefined;
    }
    | {
        Data: undefined;
        Error: unknown | undefined;
    };

/**
 * An `async` function or `Promise` of the given {@link DataType}.
 * This is the type of the argument of {@link Try}.
 *
 * @typeParam DataType - The type of the data that the `async` function or `Promise<DataType>`.
 */
export type TTrySource<DataType> =
    | Promise<DataType>
    | (() => DataType)
    | (() => Promise<DataType>);

/**
 * The type of the function passed to the `then` method of a `Promise`.
 *
 * @typeParam ParameterType - The type of the parameter passed to the function.
 * @typeParam ReturnType - The type of the value returned by the function.
 */
export type TPromiseThenFunction<
    ParameterType = unknown,
    ReturnType = unknown
> =
    (Value: ParameterType) => ReturnType;

/**
 * The type of the function passed to the `catch` method of a `Promise`.
 *
 * @typeParam Type - The type of the value returned by the `catch` function.
 */
export type TPromiseCatchFunction<Type = unknown> =
    Parameters<TExtractFunction<Promise<Type>["catch"]>>[0];
