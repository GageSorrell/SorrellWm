/* File:      LogUtility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

export type FLogDepth =
{
    Depth: number;
};

export type TLogPrimitive<T = unknown> =
    FLogDepth &
    {
        Value: T;
    };

export type FLogString =
    FLogDepth &
    {
        String: string;
    };

export type FContainerType =
    | "Record"
    | "Array"
    | "Set"
    | "Map";

export type FLogObjectType =
    | FContainerType
    | "null";

type TLogContainerBase<T extends FContainerType> =
{
    Type: T;
    // Values: unknown;
};

export type TLogArray<T = unknown> =
    TLogContainerBase<"Array"> &
    TLogPrimitive<Array<T>>;
    // {
    //     Values: Array<TLogPrimitive<T>>;
    // };

export type TLogSet<T = unknown> =
    TLogContainerBase<"Set"> &
    TLogPrimitive<Set<T>>;
    // {
    //     Values: Array<TLogPrimitive<T>>;
    // };

export type TLogTuple<T extends PropertyKey = PropertyKey, U = unknown> =
{
    Key: T;
    Value: U;
};

export type TLogRecord<T extends PropertyKey = PropertyKey, U = unknown> =
    TLogContainerBase<"Record"> &
    TLogPrimitive<Record<T, U>>;
    // {
    //     Type: "Record";
    //     Values: Array<TLogTuple<T, U>>;
    // };

export type TLogMap<T extends PropertyKey = PropertyKey, U = unknown> =
    TLogContainerBase<"Map"> &
    TLogPrimitive<Map<T, U>>;
    // {
    //     Values: Array<TLogTuple<T, U>>;
    // };

export type TLogContainer<T = unknown, U extends PropertyKey = PropertyKey> =
    | TLogArray<T>
    | TLogSet<T>
    | TLogMap<U, T>
    | TLogRecord<U, T>;

export type TLogValue<T = unknown> =
    | TLogPrimitive<T>
    | TLogContainer;

export const IsLogContainer = (In: unknown): In is TLogContainer =>
{
    return (
        typeof In === "object" &&
        In !== null &&
        "Depth" in In &&
        "Type" in In &&
        "Values" in In
    );
};

export type TLogUnion<T = unknown> = TLogPrimitive<T> | FLogString;

export type TValueFormatterProperty<TypeName extends string, Type> =
{
    [ Key in TypeName ]: (In: Type, Depth: number) => string;
};

export type FTypeofReturnValue =
    | "object"
    | "bigint"
    | "number"
    | "string"
    | "boolean"
    | "symbol"
    | "undefined"
    | "function";

export type TLogFormatFunction<T> = (In: TLogPrimitive<T>) => FLogString;
// export type TLogObjectFormatFunction<T> = (In: TLogPrimitive<T>) => FLogString | Array<FLogString>;

export type FPrimitive =
    | string
    | number
    | bigint
    | boolean
    | symbol
    | null
    | undefined;

export type FValueFormatter =
{
    // object: TLogObjectFormatFunction<object>;

    bigint: TLogFormatFunction<bigint>;
    boolean: TLogFormatFunction<boolean>;
    function: TLogFormatFunction<Function>;
    number: TLogFormatFunction<number>;
    object: TLogFormatFunction<object>;
    string: TLogFormatFunction<string>;
    symbol: TLogFormatFunction<symbol>;
    undefined: TLogFormatFunction<undefined>;
};
