/**
 * @file      Functional.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * A function type with defaults that make defining callback types convenient.
 *
 * @template ArgumentVectorType - The type of the argument or argument vector.
 * If `ArgumentType extends Array<unknown>`, then this will be taken to
 * be the argument vector.  To set the argument vector to be a single,
 * `Array` argument, say `MyArrayType`, set `ArgumentType` to `[ MyArrayType ]`.
 *
 * @template ReturnType - The type returned by this.
 */
export type TFunction<
    ArgumentVectorType extends Array<unknown>,
    ReturnType = void
> =
    (...ArgumentVector: ArgumentVectorType) => ReturnType;

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Any function, which may accept arguments, and may return something. */
export type FFunctionAny = TFunction<Array<any>, any>;

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * A function that accepts an {@link Argument} of a given {@link ArgumentType},
 * and returns `true` or `false`.
 *
 * @template ArgumentType - The type of the argument for which a predicate
 * of this type evaluates.
 */
export type TPredicate<ArgumentType> = (Argument: ArgumentType) => boolean;

