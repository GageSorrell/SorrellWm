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
