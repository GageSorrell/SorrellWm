/**
 * @file      Async.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { AbstractMethodCallError, type TNullable } from "../Miscellaneous/Utility.Types.js";
import type {
    TOnFulfilled,
    TOnRejected,
    TPromiseCtorArgument,
    TTryResult,
    TTrySource
} from "./Async.Types.js";
import type { TFunction } from "../Functional/Functional.Types.js";

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
 * @template DataType - The type of the data that the `async` function or `Promise<DataType>`.
 * @param Source - The `async` function or `Promise` to evaluate.
 *
 * @returns {TTryResult<DataType>} A {@link TTryResult} containing either the result
 * ({@link TTryResult.Data}) or error {@link TTryResult.Error}.
 *
 * @example
 * // With an `async` function,
 * async function GetName(): Promise<string> { ... }
 * // Or, with a `Promise`,
 * const GetName: Promise<string> = new Promise<string>(...);
 *
 * // For both of the above cases, `Try` behaves the same:
 * const { Data: Name, Error: NameError } = await Try(GetName);
 * // If `GetName` returned,
 * // `typeof Name` <- `"string"`
 * // `typeof NameError` <- `"undefined"`
 * // If `GetName` threw,
 * // `typeof Name` <- `"undefined"`
 * // `NameError !== undefined` <- `true` (Unless `GetName` threw `undefined`).
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
 * @template ArgumentElementType - The type of the given {@link Elements}.
 * @template ReturnElementType - The type of the `Array` returned by this.
 *
 * @param Elements - The `Array` that will be transformed.
 * @param Mapper - The function that maps each {@link ArgumentElementType}
 * to a {@link ReturnElementType}.
 *
 * @returns {Array<ReturnElementType>} An `Array` of {@link ReturnElementType}.
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

/**
 * An abstract implementation of {@link PromiseLike}.  This exists only to maintain the
 * project's naming convention.
 */
export abstract class TPromiseLike<ResolveType> implements PromiseLike<ResolveType>
{
    public then<ResultType = ResolveType, RejectType = never>(
        _OnFulfilled?: TOnFulfilled<ResolveType, ResultType>,
        _OnRejected?: TOnRejected<RejectType>
    ): TPromiseLike<ResultType | RejectType>
    {
        throw new AbstractMethodCallError("TPromiseLike");
    }
}

/**
 * The {@link TypeError} that is thrown by the constructor of {@link TPromise}
 * iff it receives an argument that is not a {@link TPromiseCtorArgument}.
 * It does not provide any additional information (in particular, it does not
 * add any properties, and it does not set any properties inherited from
 * {@link TypeError}).
 *
 * @note While the argument type of {@link TPromise}'s constructor is checked at runtime,
 * the type checker should prevent the error described by this from happening.
 */
export class FPromiseInstantiationError extends TypeError
{
    public constructor()
    {
        super();
    }
}

/**
 * A `then`-able wrapper of {@link Promise}.
 *
 * @template ResolveType - The type to which this resolves, if it does resolve.
 */
export class TPromise<ResolveType> extends TPromiseLike<ResolveType> implements PromiseLike<ResolveType>
{
    public constructor(Argument: TPromiseCtorArgument<ResolveType>)
    {
        super();
        if (typeof Argument === "function")
        {
            this.Underlying = new Promise<ResolveType>(Argument);
        }
        else
        {
            if (Argument instanceof TPromise)
            {
                this.Underlying = Argument.Raw();
            }
            else if (Argument instanceof Promise)
            {
                this.Underlying = Argument;
            }
        }

        throw new FPromiseInstantiationError();
    }

    private readonly Underlying: Promise<ResolveType>;

    /**
     * This class's extension of {@link Promise!then}.
     *
     * @template ResultType - The type to which the value underlying the {@link TPromise} returned by this
     * will resolve, if the {@link TPromise} resolves.
     *
     * @template RejectType - The type to which the value underlying the {@link TPromise} returned by this
     * will reject, if the {@link TPromise} rejects.
     *
     * @param OnFulfilled - The callback that is called when the underlying {@link Promise} resolves,
     * if it resolves.
     *
     * @param OnRejected - The callback that is called when the underlying {@link Promise} rejects,
     * if it rejects.
     *
     * @returns {TPromise<ResultType | RejectType>} A new {@link TPromise} of the result of the
     * given callbacks.
     *
     * @example
     * ```typescript
     * const Example: TPromise<string> = new TPromise<string>((Resolve, Reject) =>
     * {
     *     if (Math.random() < 0.5)
     *     {
     *         Resolve("Success");
     *     }
     *     else
     *     {
     *         Reject("Error");
     *     }
     * });
     *
     * Example.then(
     *     (Value: string): void =>
     *     {
     *         // `Value` <- `"Success"`
     *     },
     *     (Reason: unknown): void =>
     *     {
     *         // `Reason` <- `"Error"`
     *     }
     * );
     * ```
     */
    public Then<ResultType = ResolveType, RejectType = never>(
        OnFulfilled: TOnFulfilled<ResolveType, ResultType>,
        OnRejected?: TOnRejected<RejectType>
    ): TPromise<ResultType | RejectType>
    {
        return new TPromise<ResultType | RejectType>(this.Underlying.then(OnFulfilled, OnRejected));
    }

    public override then<ResultType = ResolveType, RejectType = never>(
        OnFulfilled?: TOnFulfilled<ResolveType, ResultType>,
        OnRejected?: TOnRejected<RejectType>
    ): TPromise<ResultType | RejectType>
    {
        return new TPromise<ResultType | RejectType>(this.Underlying.then(OnFulfilled, OnRejected));
    }

    public Catch<ResultType = never>(
        OnRejected?: TNullable<TOnRejected<ResolveType>>
    ): TPromiseLike<ResolveType | ResultType>
    {
        return new TPromise<ResolveType | ResultType>(
            this.Underlying.catch(OnRejected)
        );
    }

    public Finally(OnFinally?: TNullable<TFunction>): TPromise<ResolveType>
    {
        return new TPromise(this.Underlying.finally(OnFinally));
    }

    public static Resolve<ResolveType>(
        Value: ResolveType | PromiseLike<ResolveType>
    ): TPromise<Awaited<ResolveType>>
    {
        return new TPromise(Promise.resolve(Value));
    }

    public static Reject<ResolveType = unknown>(Reason?: unknown): TPromise<ResolveType>
    {
        return new TPromise(Promise.reject<ResolveType>(Reason));
    }

    public Raw(): Promise<ResolveType>
    {
        return this.Underlying;
    }
};
