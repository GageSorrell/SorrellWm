/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TNonemptyArray } from "@sorrell/utilities/array";
import type { TIsNonNegativeInteger } from "@sorrell/utilities/math";

type TBuildTuple<
    Length extends number,
    Accumulator extends TArray<unknown> = [ ]
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
    CurrentTuple extends TArray<unknown>,
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

export type TMatrix<Type> = TArray<TArray<Type>>;
export type TSafeMatrix<Type> = TNonemptyArray<TNonemptyArray<Type>>;

export type FPathKey = number | string;
export type FPathRecord = Record<FPathKey, unknown>;

type TRecordProperty<KeyType extends FPathKey> = `.${ KeyType }`;

type TRecordPathPart<PropertyKeyType extends keyof ParentType, ParentType extends FPathRecord> =
    PropertyKeyType extends FPathKey
        ? ParentType[PropertyKeyType] extends FPathRecord
            /* eslint-disable-next-line @stylistic/max-len */
            ? `${ TRecordProperty<PropertyKeyType> }${ TRecordPathPart<keyof ParentType[PropertyKeyType], ParentType[PropertyKeyType]> }`
            : `${ TRecordProperty<PropertyKeyType> }`
        : never;

export type TObjectPath<
    RecordType extends Record<string, unknown>,
    ObjectNameType extends string | undefined = undefined> =
        ObjectNameType extends string
            ? `${ ObjectNameType }${ TRecordPathPart<keyof RecordType, RecordType> }`
            : TRecordPathPart<keyof RecordType, RecordType> extends `.${ infer OutType }`
                ? OutType
                : never;

type FStringNumMap =
{
    "0": 0;
    "1": 1;
    "2": 2;
    "3": 3;
    "4": 4;
    "5": 5;
    "6": 6;
    "7": 7;
    "8": 8;
    "9": 9;
};

type TStringToNum<Type> = Type extends keyof FStringNumMap
    ? FStringNumMap[Type]
    : Type;

// /* eslint-disable @stylistic/max-len */
// export type TTypeFromPath<
//     PathType extends string,
//     Type extends FPathRecord> =
//     PathType extends `${ infer KeyTypeOne }.${ infer KeyTypeTwo }.${ infer KeyTypeThree }.${ infer KeyTypeFour }.${ infer KeyTypeFive }`
//         // ? KeyTypeOne extends `${ Exclude<keyof Type, symbol> }`
//         //     ? KeyTypeTwo extends `${ Exclude<keyof Type[KeyTypeOne], symbol> }`
//         //         ? KeyTypeTwo extends keyof Type[KeyTypeOne]
//         //             ? KeyTypeThree extends `${ Exclude<keyof Type[KeyTypeOne][KeyTypeTwo], symbol> }`
//         ? TStringToNum<KeyTypeOne> extends keyof Type
//             ? TStringToNum<KeyTypeTwo> extends keyof Type[TStringToNum<KeyTypeOne>]
//                 ? TStringToNum<KeyTypeThree> extends keyof Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>]
//                     ? TStringToNum<KeyTypeFour> extends keyof Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>][TStringToNum<KeyTypeThree>]
//                         ? TStringToNum<KeyTypeFive> extends keyof Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>][TStringToNum<KeyTypeThree>][TStringToNum<KeyTypeFour>]
//                             ? Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>][TStringToNum<KeyTypeThree>][TStringToNum<KeyTypeFour>][TStringToNum<KeyTypeFive>]
//                             : never
//                         : never
//                     : never
//                 : never
//             : never
//         : PathType extends `${ infer KeyTypeOne }.${ infer KeyTypeTwo }.${ infer KeyTypeThree }.${ infer KeyTypeFour }`
//             ? TStringToNum<KeyTypeOne> extends keyof Type
//                 ? TStringToNum<KeyTypeTwo> extends keyof Type[TStringToNum<KeyTypeOne>]
//                     ? TStringToNum<KeyTypeTwo> extends keyof Type[TStringToNum<KeyTypeOne>]
//                         ? TStringToNum<KeyTypeThree> extends keyof Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>]
//                             ? TStringToNum<KeyTypeFour> extends keyof Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>][TStringToNum<KeyTypeThree>]
//                                 ? Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>][TStringToNum<KeyTypeThree>][TStringToNum<KeyTypeFour>]
//                                 : never
//                             : never
//                         : never
//                     : never
//                 : never
//             : PathType extends `${ infer KeyTypeOne }.${ infer KeyTypeTwo }.${ infer KeyTypeThree }`
//                 ? TStringToNum<KeyTypeOne> extends keyof Type
//                     ? TStringToNum<KeyTypeTwo> extends keyof Type[TStringToNum<KeyTypeOne>]
//                         ? TStringToNum<KeyTypeTwo> extends keyof Type[TStringToNum<KeyTypeOne>]
//                             ? TStringToNum<KeyTypeThree> extends keyof Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>]
//                                 ? Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>][TStringToNum<KeyTypeThree>]
//                                 : never
//                             : never
//                         : never
//                     : never
//                 : PathType extends `${ infer KeyTypeOne }.${ infer KeyTypeTwo }`
//                     ? TStringToNum<KeyTypeOne> extends keyof Type
//                         ? TStringToNum<KeyTypeTwo> extends keyof Type[TStringToNum<KeyTypeOne>]
//                             ? Type[TStringToNum<KeyTypeOne>][TStringToNum<KeyTypeTwo>]
//                             : never
//                         : never
//                     : PathType extends keyof Type
//                         ? Type[PathType]
//                         : never;
// /* eslint-enable @stylistic/max-len */

export type FColor = `#${ string }`;

export type TRef<Type> = { Ref: Type | undefined };

export type TMapRecordTransformer<KeyType extends PropertyKey, PropertyType, ElementType> =
    (Key: KeyType, Property: PropertyType, Index: number) => ElementType;

export type TFlatMapRecordTransformer<KeyType extends PropertyKey, PropertyType, ElementType> =
    (Key: KeyType, Property: PropertyType, Index: number) => ElementType | Array<ElementType>;
