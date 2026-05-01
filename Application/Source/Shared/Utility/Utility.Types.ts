/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TNonemptyArray } from "@sorrell/utilities/array";

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
    ObjectNameType extends string | undefined = undefined
> =
    ObjectNameType extends string
        ? `${ ObjectNameType }${ TRecordPathPart<keyof RecordType, RecordType> }`
        : TRecordPathPart<keyof RecordType, RecordType> extends `.${ infer OutType }`
            ? OutType
            : never;

export type FColor = `#${ string }`;

export type TRef<Type> = { Ref: Type | undefined };

export type TMapRecordTransformer<
    KeyType extends PropertyKey,
    PropertyType, ElementType
> =
    {
        (Key: KeyType, Property: PropertyType, Index: number): ElementType;
    };

export type TFlatMapRecordTransformer<
    KeyType extends PropertyKey,
    PropertyType,
    ElementType
> =
    {
        (
            Key: KeyType,
            Property: PropertyType,
            Index: number
        ): ElementType | Array<ElementType>;
    };
