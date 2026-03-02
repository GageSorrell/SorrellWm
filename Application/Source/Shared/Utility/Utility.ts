/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FAnyFunction } from "./Utility.Types";
import type { FBox } from "@sorrellwm/windows";

// import type { HMonitor, HWindow } from "@sorrellwm/windows";

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

export function IsAsyncFunction(Value: unknown): Value is (...Arguments: Array<unknown>) => Promise<unknown>
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
    InArray: Array<RecordType>
): Array<RecordType[KeyType]> =>
{
    return InArray.map((Record: RecordType): RecordType[KeyType] =>
    {
        return Record[Key];
    });
};
