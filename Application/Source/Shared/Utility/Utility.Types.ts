/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type TIsNonNegativeInteger<ArraySize extends number> =
    `${ ArraySize }` extends `-${ string }`
        ? false
        : `${ ArraySize }` extends `${ bigint }`
            ? true
            : false;

type TBuildTuple<
    Length extends number,
    Accumulator extends Array<unknown> = []
> =
    Accumulator["length"] extends Length
        ? Accumulator
        : TBuildTuple<Length, [...Accumulator, unknown]>;

type TIsLessThanOrEqual<
    Left extends number,
    Right extends number
> =
    TBuildTuple<Right> extends [...TBuildTuple<Left>, ...infer _ ]
        ? true
        : false;

type TInclusiveRangeFromTuple<
    CurrentTuple extends Array<unknown>,
    EndValue extends number,
    Result extends number = never
> =
    CurrentTuple["length"] extends EndValue
        ? Result | EndValue
        : TInclusiveRangeFromTuple<
            [...CurrentTuple, unknown],
            EndValue,
            Result | CurrentTuple["length"]
        >;

export type TIntegralRange<
    StartValue extends number,
    EndValue extends number
> =
    number extends StartValue
        ? never
        : number extends EndValue
            ? never
            : TIsNonNegativeInteger<StartValue> extends true
                ? TIsNonNegativeInteger<EndValue> extends true
                    ? TIsLessThanOrEqual<StartValue, EndValue> extends true
                        ? TInclusiveRangeFromTuple<TBuildTuple<StartValue>, EndValue>
                        : never
                    : never
                : never;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type FAnyFunction = (...Arguments: any) => any;

export type TRecord<
    KeyType extends PropertyKey = PropertyKey,
    PropertyType = unknown
> =
    Record<KeyType, PropertyType>;

export type FRecord = TRecord;

export type TRecordNonNullable<RecordType extends FRecord> =
{
    [ Key in keyof RecordType ]: NonNullable<RecordType[Key]>;
};

export type TArrayNonempty<T = unknown> = [ T, ...Array<T> ];

export type TMatrix<T> = Array<Array<T>>;
export type TSafeMatrix<T> = TArrayNonempty<TArrayNonempty<T>>;

export type TExtractFunction<T> =
    T extends { (...Arguments: infer ArgumentVectorType): infer ReturnType }
        ? (...Arguments: ArgumentVectorType) => ReturnType
        : never;

export type TPromiseThenFunction<T = unknown> =
    NonNullable<Parameters<TExtractFunction<Promise<T>["then"]>>[0]>;
export type TPromiseCatchFunction<T = unknown> =
    NonNullable<Parameters<TExtractFunction<Promise<T>["catch"]>>[0]>;

export type FTypeof =
    | "object"
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "function"
    | "symbol"
    | "undefined";
