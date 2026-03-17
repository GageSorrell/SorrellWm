/* File:      Record.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// import type { FRecord } from "@sorrellwm/windows";
// import type { SRecordInternal } from "./Record";

// export type SRecord<KeyType extends string | symbol = string | symbol, PropertyType = unknown> =
//     SRecordInternal<KeyType, PropertyType> &
//     Record<KeyType, PropertyType>;

// export type TEitherRecord<KeyType extends PropertyKey, PropertyType> =
//     | Record<KeyType, PropertyType>
//     | SRecordInternal<Exclude<KeyType, number>, PropertyType>;

// export type TStructuredMap<RecordType extends FRecord, NewType> =
// {
//     [ Key in keyof RecordType ]: RecordType[Key] extends FRecord
//         ? TStructuredMap<RecordType[Key], NewType>
//         : NewType;
// };

// type FPrimitive =
//     | string
//     | number
//     | boolean
//     | bigint
//     | symbol
//     | null
//     | undefined;

// /** Recursively get all keys in a given record type. */
// export type TRecordKeys<RecordType> =
//     RecordType extends FPrimitive | ReadonlyArray<unknown> | ((...Arguments: Array<never>) => unknown)
//         ? never
//         : {
//             [Key in keyof RecordType]-?:
//                 Key | TRecordKeys<RecordType[Key]>
//         }[keyof RecordType];

// export type TStructuredMapCallback<
//     RecordType extends Record<PropertyKey, PropertyType | unknown>,
//     PropertyType,
//     NewType> =
//     | ((Key: TRecordKeys<RecordType>, Property: PropertyType) => NewType);
