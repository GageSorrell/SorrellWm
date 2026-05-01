/**
 * @file      Record.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TPath } from "./Record.Types.ts";

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

/* eslint-disable jsdoc/require-jsdoc */

export type TFromPathInternal<
    RecordType,
    PathType extends TPath<RecordType>,
    DepthType extends FDepth = 3
> =
    DepthType extends FValidDepth
        ? PathType extends `${ infer HeadType }.${ infer RemainingPathType }`
            ? HeadType extends keyof RecordType
                ? RemainingPathType extends keyof RecordType[HeadType]
                    ? TFromPathInternal<
                        RecordType[HeadType],
                        Extract<RemainingPathType, string>,
                        TDepthMinusOne<DepthType>
                    >
                    : never
                : never
            : PathType extends keyof RecordType
                ? RecordType[PathType]
                : never
        : PathType extends keyof RecordType
            ? RecordType[PathType]
            : never;

/* eslint-enable jsdoc/require-jsdoc */

/**
 * @template RecordType - The {@link Record} type from which this path is constructed.
 *
 * @template ParentKey - The use of this parameter--for reasons that I do not
 * understand--prevent an error regarding stack depth when evaluating this type.
 */
export type TPathInternal<
    RecordType,
    ParentKey extends string | undefined = undefined
> =
    | (
        ParentKey extends string
            ? `${ ParentKey }.${ Extract<keyof RecordType, string> }`
            : Extract<keyof RecordType, string>
    )
    | (
        TMapToPath<RecordType>[keyof TMapToPath<RecordType>]
    );

type TGetRecordProperties<RecordType> =
    {
        [
        Key in keyof RecordType as RecordType[Extract<Key, string>] extends Record<PropertyKey, unknown>
            ? Key
            : never
        ]: RecordType[Key];
    };

type TGetRecordKeys<RecordType> = keyof TGetRecordProperties<RecordType>;

type TMapToPath<RecordType> =
    {
        [ Key in Extract<TGetRecordKeys<RecordType>, string> ]:
        `${ Key }.${ TPathInternal<TGetRecordProperties<RecordType>[Key]> }`;
    };
