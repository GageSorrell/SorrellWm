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

type FDepthStopGap = `${ string }.${ string }.${ string }`;

type FDepthStopGapExclude = "__DepthStopGapExclude__";
export type TGetType<ObjectType, PathType extends TPath<ObjectType>> = any;
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
