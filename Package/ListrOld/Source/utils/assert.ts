/**
 * @file      assert.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

type AssertArgument<T> =
    T extends (...ArgumentVector: Array<unknown>) => unknown
        ? Parameters<T>
        : never;

type AssertReturnType<T> =
    T extends (...ArgumentVector: Array<unknown>) => infer Out
        ? Out
        : T;
/**
 * This function asserts the given value as a function or itself.
 * If the value itself is a function it will evaluate it with the passed in arguments,
 * elsewise it will directly return itself.
 * @param functionOrSelf
 * @param {...any} args
 * @example
 */
export function assertFunctionOrSelf<T>(
    functionOrSelf: T,
    ...args: Array<unknown>
): AssertReturnType<T>
{
    function IsFunction(In: unknown): In is (...ArgumentVector: Array<unknown>) => unknown
    {
        return typeof In === "function";
    }

    if (IsFunction(functionOrSelf))
    {
        return functionOrSelf(...args) as AssertReturnType<T>;
    }
    else
    {
        return functionOrSelf as AssertReturnType<T>;
    }
}
