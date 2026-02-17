/* File:      LogUtility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

export type FLogDepth =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20;

export type FPrimitive =
    | string
    | number
    | bigint
    | boolean
    | Function
    | null
    | symbol
    | undefined;

export type FValue =
    | FPrimitive
    | FObject;

export type FTypeof =
    | "object"
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "function"
    | "symbol"
    | "undefined";

export type TArrayNonempty<T = unknown> = [ T ] | Array<T>;

export type FLogStringArray = TArrayNonempty<FLogString>;

export type TContainer<T = unknown, U extends FPrimitive = FPrimitive> =
    | Record<Extract<U, PropertyKey>, T>
    | Map<U, T>
    | Set<T>
    | Array<T>;

export type FArrayTypeName = "Array";
export type FMapTypeName = "Map";
export type FRecordTypeName = "Record";
export type FSetTypeName = "Set";
export type FKeyValuePairTypeName = "KeyValuePair";
export type FContainerType =
    | FArrayTypeName
    | FMapTypeName
    | FRecordTypeName
    | FKeyValuePairTypeName
    | FSetTypeName;

export type FDelimiterStartString =
    | "{"
    | "<"
    | "[";

export type FDelimiterStopString =
    | "}"
    | ">"
    | "]";

export type FDelimiterString =
    | FDelimiterStartString
    | FDelimiterStopString;

export type FDelimiterPair = [ FDelimiterStartString, FDelimiterStopString ];

export type FDelimiters = Record<FContainerType, FDelimiterPair>;

export type FArray = Array<FLogValueType>;
export type FMap = Map<FPrimitive, unknown>;
export type FRecord = Record<PropertyKey, unknown>;
export type FSet = Set<FLogValueType>;

export type TLogBase<T = FLogValueType> =
{
    Depth: number;
    IsInlined?: boolean;
    Value: T;
};

export type TLogPrimitive<T extends FPrimitive = FPrimitive> = TLogBase<T>;

export type TLogContainer<T extends TContainer = TContainer> = TLogBase<T>;

export type FLogArray = TLogContainer<FArray>;
export type FLogMap = TLogContainer<FMap>;
export type FLogRecord = TLogContainer<FRecord>;
export type FLogSet = TLogContainer<FSet>;

export type FLogString =
    Pick<TLogBase, "Depth"> &
    {
        CheckedForInlining?: boolean;
        String: string;
    };

export type FKeyValuePair =
{
    Depth: number;
    Key: FPrimitive;
    Value: FValue;
};

export type FLogValueType =
    | FValue
    | TContainer;

export type FObject = Exclude<NonNullable<object>, Function>;

export type TLogValue<T extends FLogValueType = FLogValueType> = TLogBase<T>;
