/* File:      Ora.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FOraOptions, TOraTaskArgument } from "./Ora.Types.js";
import ora, { type Ora as IOra } from "ora";
import type { TTryResult } from "./Promise.Types.js";
import type { TTrySource } from "./Internal/Promise.Types.js";
import { Try } from "./Promise.js";

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

    const Result: TTryResult<Type> = await Try(OutAsyncSource);
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
