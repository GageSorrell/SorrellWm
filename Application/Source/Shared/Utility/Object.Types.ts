/* File:      Object.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FRecord } from "@sorrellwm/windows";

type TGetRecordProperties<ObjectType> =
{
    [
        Key in keyof ObjectType as ObjectType[Extract<Key, string>] extends FRecord
            ? Key
            : never
    ]: ObjectType[Key];
};

type TGetRecordKeys<ObjectType> = keyof TGetRecordProperties<ObjectType>;

type TMapToPath<ObjectType> =
{
    [ Key in Extract<TGetRecordKeys<ObjectType>, string> ]: `${ Key }.${ TPathInternal<TGetRecordProperties<ObjectType>[Key]> }`;
};

/**
 * @Param ParentKey - The use of this parameter--for reasons that I do not
 *                    understand--prevent an error regarding stack depth
 *                    when evaluating this type.
 */
type TPathInternal<ObjectType, ParentKey extends string | undefined = undefined> =
    | (
        ParentKey extends string
            ? `${ ParentKey }.${ Extract<keyof ObjectType, string> }`
            : Extract<keyof ObjectType, string>
    )
    | (
        TMapToPath<ObjectType>[keyof TMapToPath<ObjectType>]
    );

export type TPath<ObjectType> = TPathInternal<ObjectType>;

type FDepthMap =
{
    3: 2;
    2: 1;
    1: 0;
};

type FDepth = keyof FDepthMap | 0;
type FValidDepth = keyof FDepthMap;

type TDepthMinusOne<DepthType extends FDepth> = DepthType extends FValidDepth
    ? FDepthMap[DepthType]
    : 0;

export type TGetType<ObjectType, PathType extends TPath<ObjectType>, DepthType extends FDepth = 3> =
    DepthType extends FValidDepth
        ? PathType extends `${ infer HeadType }.${ infer RemainingPathType }`
            ? HeadType extends keyof ObjectType
                ? RemainingPathType extends keyof ObjectType[HeadType]
                    ? TGetType<ObjectType[HeadType], Extract<RemainingPathType, string>, TDepthMinusOne<DepthType>>
                    : never
                : never
            : PathType extends keyof ObjectType
                ? ObjectType[PathType]
                : never
        : PathType extends keyof ObjectType
            ? ObjectType[PathType]
            : never;


// export type

// export type TGetType<ObjectType, PathType extends TPath<ObjectType>> = any;
// export type TGetType<ObjectType, PathType extends TPath<ObjectType>> =
//     Exclude<
//         PathType extends FDepthStopGap
//             ? FDepthStopGapExclude
//             : PathType extends `${ infer HeadType }.${ infer RemainingPathType }`
//                 ? HeadType extends keyof ObjectType
//                     ? RemainingPathType extends TPath<ObjectType[HeadType]>
//                         ? TGetType<ObjectType[HeadType], RemainingPathType>
//                         : never
//                     : never
//                 : PathType extends keyof ObjectType
//                     ? ObjectType[PathType]
//                     : never,
//         FDepthStopGapExclude
//     >;

type FTestType =
{
    Foo:
    {
        Bar: number;
    };
    Baz: string;
    ArrayProp: Array<boolean>;
};

const TestPath: TPath<FTestType> = "ArrayProp";
// const TestType: TGetType<FTestType, "ArrayProp"> | "Nah" = "Nah";
