/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    FAnyFunction,
    FPathRecord,
    TFlatMapRecordTransformer,
    TMapRecordTransformer,
    TRef } from "./Utility.Types";
import type { FBox, FRecord, TRecord } from "@sorrellwm/windows";
import type { FRejectFunction, TResolveFunction } from "./Functional.Types";
import type { FLogger } from "../../Shared";
import { GetLogger } from "@/Log";
import type { TPath, TGetType } from "./Object.Types";

const Log: FLogger = GetLogger("Utility");

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

export const SetPropertyFromPath = <
    RecordType extends FPathRecord,
    PathType extends TPath<RecordType>
>(
    ObjectRef: TRef<RecordType>,
    Path: PathType,
    Value: TGetType<RecordType, PathType>
): void =>
{
    type FProperty = TGetType<RecordType, PathType>;

    if (Array.isArray(Path))
    {
        throw new Error("SetPropertyFromPath does not support Array-based paths yet.");
    }

    const PathSplit: Array<string> = Path.split(".");

    const Last: string | undefined = PathSplit.pop();
    if (Last === undefined)
    {
        return;
    }

    if (PathSplit.length === 0)
    {
        if (!Array.isArray(Path))
        {
            ((ObjectRef.Ref as TRecord<string, unknown>)[(Path as string)]) = Value;
        }
    }

    const Recurrence = (In: TRef<unknown>): TRef<unknown> | undefined =>
    {
        const NextPropertyNameBase: string | undefined = PathSplit.shift();

        Log("NextPropertyNameBase", NextPropertyNameBase);

        if (NextPropertyNameBase !== undefined)
        {
            const NextPropertyName: string | number = isNaN(parseInt(NextPropertyNameBase))
                ? NextPropertyNameBase
                : parseInt(NextPropertyNameBase);

            Log("NextPropertyName", NextPropertyName);

            const Out: TRef<unknown> = MakeRef<unknown>();
            Out.Ref = (In.Ref as TRecord<string, unknown>)[NextPropertyName] as unknown;
            return Recurrence(Out);
        }
        else
        {
            return In;
        }
    };

    const PropertyRef: TRef<FProperty> = Recurrence(ObjectRef) as TRef<FProperty>;
    const LastTyped: string | number = isNaN(parseInt(Last))
        ? Last
        : parseInt(Last);

    (PropertyRef.Ref as TRecord<string, unknown>)[LastTyped] = Value;
};

export const GetPropertyFromPath = <
    RecordType extends TRecord<string, unknown>,
    PathType extends TPath<RecordType>
>(
    Record: RecordType,
    Path: PathType
): TGetType<RecordType, PathType> =>
{
    if (Array.isArray(Path))
    {
        throw new Error("SetPropertyFromPath does not support Array-based paths yet.");
    }

    const PathSplit: Array<string> = Path.split(".");
    const Recurrence = (In: unknown, Index: number = 0): unknown =>
    {
        const Key: string | number | undefined = isNaN(parseInt(PathSplit[Index] || ""))
            ? PathSplit[Index]
            : parseInt(PathSplit[Index] || "");

        if (Key !== undefined)
        {
            const Next: unknown = (In as TRecord<string, unknown>)[Key];
            if (Index !== PathSplit.length - 1)
            {
                return Recurrence(Next, Index + 1);
            }
            else
            {
                return Next;
            }
        }
        else
        {
            return undefined;
        }
    };

    return Recurrence(Record) as TGetType<RecordType, PathType>;
};

export const MakeRef = <Type>(): TRef<Type> =>
{
    return {
        Ref: undefined
    } as TRef<Type>;
};

export const MapRecord = <KeyType extends PropertyKey, PropertyType, ElementType>(
    In: Record<KeyType, PropertyType>,
    Function: TMapRecordTransformer<KeyType, PropertyType, ElementType>
): Array<ElementType> =>
{
    return Object.keys(In).map((InKey: string, Index: number): ElementType =>
    {
        const Key: KeyType = InKey as KeyType;
        return Function(Key, In[Key], Index);
    });
};

export const FlatMapRecord = <KeyType extends PropertyKey, PropertyType, ElementType>(
    In: Record<KeyType, PropertyType>,
    Function: TFlatMapRecordTransformer<KeyType, PropertyType, ElementType>
): Array<ElementType> =>
{
    return Object.keys(In).flatMap((InKey: string, Index: number): Array<ElementType> =>
    {
        const Key: KeyType = InKey as KeyType;
        const Transform: ElementType | Array<ElementType> = Function(Key, In[Key], Index);
        return Array.isArray(Transform)
            ? Transform
            : [ Transform ];
    });
};
