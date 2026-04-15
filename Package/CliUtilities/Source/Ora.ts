/* File:      Ora.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FOraOptions, TOraTaskArgument } from "./Ora.Types.js";
import { type TTryResult, type TTrySource, Try as TryAsync } from "@sorrell/utilities";
import ora, { type Ora as IOra } from "ora";

/**
 * Creates and starts an `Ora` instance with the given {@link Argument}.
 *
 * @param Argument - The options object.
 *
 * @returns An `Ora` instance with the specified options.
 */
export function Ora(Argument: FOraOptions): IOra
{
    const DefaultOptions: FOraOptions =
        {
            hideCursor: true
        };

    const EnforcedOptions: FOraOptions =
        {
            spinner: "point"
        };

    const Options: FOraOptions =
        {
            ...DefaultOptions,
            ...Argument,
            ...EnforcedOptions
        };

    return ora(Options).start();
}

/**
 * @deprecated Use {@link DoTask} instead.
 *
 * Executes an `async` function or `Promise` with a progress indicator.
 *
 * @typeParam Type - The type of the data to which the given {@link AsyncSource} resolves.
 *
 * @param AsyncSource - The `async` function or `Promise` whose state is conveyed
 * by the returned instance of `Ora`.
 * @param TaskDescription - The text to display in the `Ora` instance while the
 * {@link AsyncSource} is pending.
 *
 * @returns The result of the {@link AsyncSource}, as a {@link TTryResult}.
 */
export async function OraTask<Type>(
    AsyncSource: TOraTaskArgument<Type>,
    TaskDescription: string
): Promise<TTryResult<Type>>
{
    const ThisOra: IOra = Ora({ text: TaskDescription });
    let PersistText: string | undefined = undefined;

    const SetPersistText = (In: string): void =>
    {
        PersistText = In;
    };

    const OutAsyncSource: TTrySource<Type> = typeof AsyncSource === "function"
        ? (AsyncSource.length > 0)
            ? (): Promise<Type> => AsyncSource(SetPersistText)
            : (AsyncSource as (() => Promise<Type>))
        : AsyncSource;

    const Result: TTryResult<Type> = await TryAsync(OutAsyncSource);
    if (Result.Error === undefined)
    {
        if (PersistText !== undefined)
        {
            ThisOra.succeed(PersistText);
        }
        else
        {
            ThisOra.succeed();
        }
    }
    else
    {
        if (PersistText !== undefined)
        {
            ThisOra.fail(PersistText);
            console.error(Result.Error);
        }
        else
        {
            ThisOra.fail();
            console.error(Result.Error);
        }
    }

    return Result;
}
