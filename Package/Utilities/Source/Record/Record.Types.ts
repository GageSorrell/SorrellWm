/**
 * @file      Record.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { FlatMapRecord, MapRecord } from "./Record.ts";
import type { TFromPathInternal, TPathInternal } from "./Record.Internal.Types.ts";
import type { TMaybeArray } from "../Array/index.ts";

/**
 * Given a {@link RecordType} and a {@link PathType} of the given {@link RecordType},
 * this type evaluates to the type of the property given by the {@link PathType} of
 * the given {@link RecordType}.
 *
 * @template RecordType - The {@link Record} type to which the given {@link PathType}
 * will be applied.
 *
 * @template PathType - The {@link TPath} type that describes the property within the
 * given {@link RecordType} whose type to which this will evaluate.
 */
export type TFromPath<
    RecordType,
    PathType extends TPath<RecordType>
> = TFromPathInternal<RecordType, PathType, 3>;

/**
 * Given a {@link RecordType}, this type is the union of `.`-delimited paths to properties
 * with the {@link RecordType}.  Nested properties are supported.
 *
 * @template RecordType - The {@link Record} type to which the given {@link PathType}
 * will be applied.
 */
export type TPath<RecordType> = TPathInternal<RecordType>;

/**
 * A simple wrapper to allow passing primitives to functions by-reference.
 *
 * @template Type - The type of the value wrapped by this.
 */
export type TRef<Type> = { Ref: Type | undefined };

/**
 * The function that maps a {@link Record} to an {@link Array} via {@link MapRecord}.
 *
 * @template KeyType - The type of the keys of the {@link Record} that is transformed by this.
 * @template PropertyType - The type of the values of the properties in the {@link Record}
 * that is transformed by this.
 * @template ElementType - The type of the elements in the {@link Array} that is returned by this.
 */
export type TMapRecordTransformer<
    KeyType extends PropertyKey,
    PropertyType,
    ElementType
> =
    {
        /**
         * The function that maps a {@link Record} to an {@link Array} via {@link MapRecord}.
         *
         * @param Key - The key of the property that is being mapped.
         * @param Property - The value of the property that is being mapped.
         * @param Index - The index at which this property appears in the {@link Record}
         * that is transformed by this.
         */
        (Key: KeyType, Property: PropertyType, Index: number): ElementType;
    };

/**
 * The function that maps a {@link Record} to an {@link Array} via {@link FlatMapRecord}.
 *
 * @template KeyType - The type of the keys of the {@link Record} that is transformed by this.
 * @template PropertyType - The type of the values of the properties in the {@link Record}
 * that is transformed by this.
 * @template ElementType - The type of the elements in the {@link Array} that is returned by this.
 */
export type TFlatMapRecordTransformer<
    KeyType extends PropertyKey,
    PropertyType,
    ElementType
> =
    {
        /**
         * The function that maps a {@link Record} to an {@link Array} via {@link FlatMapRecord}.
         *
         * @param Key - The key of the property that is being mapped.
         * @param Property - The value of the property that is being mapped.
         * @param Index - The index at which this property appears in the {@link Record}
         * that is transformed by this.
         *
         * @returns {TMaybeArray<ElementType>} A single element, or an {@link Array} that resulted
         * from the given property being transformed.
         */
        (
            Key: KeyType,
            Property: PropertyType,
            Index: number
        ): TMaybeArray<ElementType>;
    };
