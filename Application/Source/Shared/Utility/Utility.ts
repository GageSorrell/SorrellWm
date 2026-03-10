/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FBox, FRecord } from "@sorrellwm/windows";
import type { FRejectFunction, TResolveFunction } from "./Functional.Types";
import type { FAnyFunction } from "./Utility.Types";

type HMonitor = {
    Handle: number;
};

type HWindow = {
    Handle: string;
};

export const GetEmptyMonitor = (): HMonitor =>
{
    return {
        Handle: -1
    };
};

export const GetEmptyWindow = (): HWindow =>
{
    return {
        Handle: ""
    };
};

/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @stylistic/brace-style */
const AsyncFunction: Function = (async function () { }).constructor;

export function IsAsyncFunction(Value: unknown): Value is (...Arguments: TArray<unknown>) => Promise<unknown>
{
    return typeof Value === "function" && Value.constructor === AsyncFunction;
}

export const CallMaybeAsync = async <
    InReturnType,
    InParameters extends Parameters<FAnyFunction>,
    FunctionType extends ((...ArgumentVector: InParameters) => InReturnType)>(
    Function: FunctionType,
    ...ArgumentVector: InParameters
): Promise<InReturnType> =>
{
    if (IsAsyncFunction(Function))
    {
        return await Function(...ArgumentVector);
    }
    else
    {
        return Function(...ArgumentVector);
    }
};

export const ZeroBox: FBox =
{
    Height: 0,
    Width: 0,
    X: 0,
    Y: 0
};

export const ExtractFromRecordArray = <
    KeyType extends PropertyKey = PropertyKey,
    RecordType extends Record<KeyType, unknown> = Record<KeyType, unknown>>(
    Key: KeyType,
    InArray: TArray<RecordType>
): TArray<RecordType[KeyType]> =>
{
    return InArray.map((Record: RecordType): RecordType[KeyType] =>
    {
        return Record[Key];
    });
};

export const GetByKey = <RecordType extends FRecord, KeyType extends keyof RecordType>(
    Key: KeyType
): ((In: RecordType) => RecordType[KeyType]) =>
{
    return (Record: RecordType): RecordType[KeyType] =>
    {
        return Record[Key];
    };
};

export const Delay = async (Duration: number): Promise<void> =>
{
    return new Promise<void>((Resolve: TResolveFunction<void>, _Reject: FRejectFunction): void =>
    {
        setTimeout(Resolve, Duration);
    });
};

export const RetryUntilFulfilled = async <Type>(
    In: (() => Promise<Type>),
    NumTries: number | undefined = undefined,
    DurationToTry: number | undefined = undefined
): Promise<Type | undefined> =>
{
    let StartTime: number | undefined = undefined;

    let LastCompletionTime: number | undefined = undefined;
    let NumAttempts: number = 0;

    const HasExceededLimits = (): boolean =>
    {
        const ExceededNumAttempts: boolean = (NumTries !== undefined)
            ? NumAttempts === NumTries
            : false;

        const AreDurationVariablesInitialized: boolean = (
            DurationToTry !== undefined &&
            LastCompletionTime !== undefined &&
            StartTime !== undefined
        );

        if (StartTime !== undefined && LastCompletionTime !== undefined)
        {
            StartTime = LastCompletionTime;
        }

        const ExceededDurationToTry: boolean = AreDurationVariablesInitialized
            ? ((LastCompletionTime as number) - (StartTime as number)) >= (DurationToTry as number)
            : false;

        return ExceededNumAttempts || ExceededDurationToTry;
    };

    while (HasExceededLimits())
    {
        try
        {
            const Out: Type = await In();
            return Out;
        }
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        catch (_Error: unknown)
        {
            LastCompletionTime = new Date().getTime();
            if (NumTries !== undefined)
            {
                NumAttempts++;
            }
        }
    }

    return undefined;
};
