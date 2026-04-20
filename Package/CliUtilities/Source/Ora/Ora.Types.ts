/**
 * @file      Ora.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type ora from "ora";

/** The options object of {@link Ora}. */
export type FOraOptions = Extract<Parameters<typeof ora>[0], object>;

/**
 * The `async` function or `Promise` passed to {@link Ora}.
 *
 * @typeParam Type - The type of the value returned by the task.
 */
export type TOraTaskArgument<Type> =
    | (() => Promise<Type>)
    | Promise<Type>
    | ((SetPersistText: ((In: string) => void)) => Promise<Type>);
