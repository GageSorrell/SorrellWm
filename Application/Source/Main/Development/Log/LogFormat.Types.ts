/* File:      LogUtility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TArrayNonempty, TIntegralRange } from "../../../Shared/Utility";

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

export type FLogDepth = TIntegralRange<0, 20>;

export type FPrimitive =
    | string
    | number
    | bigint
    | boolean
    | Function
    | null
    | symbol
    | undefined;

export type FObject = Exclude<NonNullable<object>, Function>;

export type FValue =
    | FPrimitive
    | FObject;

export type FLogStringArray = TArrayNonempty<FLogString>;

export type TContainer<Type = unknown, KeyType extends FPrimitive = FPrimitive> =
    | Record<Extract<KeyType, PropertyKey>, Type>
    | Map<KeyType, Type>
    | Set<Type>
    | Array<Type>;

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

export type TLogBase<Type = FLogValueType> =
{
    Depth: number;
    IsInlined?: boolean;
    Value: Type;
};

export type TLogPrimitive<Type extends FPrimitive = FPrimitive> = TLogBase<Type>;

export type TLogContainer<Type extends TContainer = TContainer> = TLogBase<Type>;

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

export type TLogValue<Type extends FLogValueType = FLogValueType> = TLogBase<Type>;
