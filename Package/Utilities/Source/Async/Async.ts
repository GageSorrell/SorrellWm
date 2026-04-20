/**
 * @file      Async.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TTryResult, TTrySource } from "./Async.Types.js";

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
 *
 * @typeParam DataType - The type of the data that the `async` function or `Promise<DataType>`.
 * @param Source - The `async` function or `Promise` to evaluate.
 */
export async function Try<DataType>(Source: TTrySource<DataType>): Promise<TTryResult<DataType>>
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

/**
 * A cleaner way of using `Array.prototype.map` with an `async` function.
 *
 * @typeParam ArgumentElementType - The type of the given {@link Elements}.
 * @typeParam ReturnElementType - The type of the `Array` returned by this.
 *
 * @param Elements - The `Array` that will be transformed.
 * @param Mapper - The function that maps each {@link ArgumentElementType}
 * to a {@link ReturnElementType}.
 *
 * @returns An `Array` of {@link ReturnElementType}.
 *
 * @example
 * In an `async` function,
 * ```typescript
 * const ArgumentElements: Array<ArgumentElementType> = [ ... ];
 * const ToReturnElement = async (Element: ArgumentElementType): Promise<ReturnElementType> => ...;
 * const ReturnElements: Array<ReturnElementType> = await Map(ArgumentElements, ToReturnElement);
 * ```
 */
export async function Map<ArgumentElementType, ReturnElementType>(
    Elements: Array<ArgumentElementType>,
    Mapper: ((Element: ArgumentElementType) => Promise<ReturnElementType>)
): Promise<Array<ReturnElementType>>
{
    const MapperWrapped = async (Element: ArgumentElementType): Promise<ReturnElementType> =>
    {
        return Mapper(Element);
    };

    const Out: Array<Promise<ReturnElementType>> = Elements.map(MapperWrapped);

    return await Promise.all(Out);
}
