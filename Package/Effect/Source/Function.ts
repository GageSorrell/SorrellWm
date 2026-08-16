/**
 * Extended forms of exports from effect's `Function` module.
 *
 * @module @sorrell/effect/Function
 *
 * @file      Function.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * from "effect/Function";

/**
 * A function with side effects, with no argument vector by default.
 *
 * @category Function
 * @since 1.0.0
 */
export interface Thunk<Args extends ReadonlyArray<unknown> = readonly [ ]>
{
    (...Args: Args): void;
}

/**
 * An async function with side effects, with no argument vector by default.
 *
 * @category Function
 * @since 1.0.0
 */
export interface AsyncThunk<Args extends ReadonlyArray<unknown> = readonly [ ]>
{
    (...Args: Args): Promise<void>;
}

export/**
       * Run a parameter-less function, discarding the return value.
       *
       * @category Function
       * @since 1.2.0
       */
const AsVoid = (In: () => any): Thunk => () => void In();
