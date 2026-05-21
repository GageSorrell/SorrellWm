/**
 * @file      Record.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { FlatMap, Map } from "./Record.ts";
import type { FromPathInternal, PathInternal } from "./Record.Internal.Types.ts";
import type { TMaybeArray } from "../Array/index.ts";

/**
 * Given a {@link RecordType} and a {@link PathType} of the given {@link RecordType},
 * this type evaluates to the type of the property given by the {@link PathType} of
 * the given {@link RecordType}.
 *
 * @template RecordType - The {@link Record} type to which the given {@link PathType}
 * will be applied.
 *
 * @template PathType - The {@link Path} type that describes the property within the
 * given {@link RecordType} whose type to which this will evaluate.
 */
export type FromPath<
    RecordType,
    PathType extends Path<RecordType>
> = FromPathInternal<RecordType, PathType, 3>;

/**
 * Given a {@link RecordType}, this type is the union of `.`-delimited paths to properties
 * with the {@link RecordType}.  Nested properties are supported.
 *
 * @template RecordType - The {@link Record} type to which the given {@link PathType}
 * will be applied.
 */
export type Path<RecordType> = PathInternal<RecordType>;

/**
 * The function that maps a {@link Record} to an {@link Array} via {@link Map}.
 *
 * @template KeyType - The type of the keys of the {@link Record} that is transformed by this.
 * @template PropertyType - The type of the values of the properties in the {@link Record}
 * that is transformed by this.
 * @template ElementType - The type of the elements in the {@link Array} that is returned by this.
 */
export type Mapper<
    KeyType extends PropertyKey,
    PropertyType,
    ElementType
> =
    {
        /**
         * The function that maps a {@link Record} to an {@link Array} via {@link Map}.
         *
         * @param Key - The key of the property that is being mapped.
         * @param Property - The value of the property that is being mapped.
         * @param Index - The index at which this property appears in the {@link Record}
         * that is transformed by this.
         */
        (Key: KeyType, Property: PropertyType, Index: number): ElementType;
    };

/**
 * The function that maps a {@link Record} to an {@link Array} via {@link FlatMap}.
 *
 * @template KeyType - The type of the keys of the {@link Record} that is transformed by this.
 * @template PropertyType - The type of the values of the properties in the {@link Record}
 * that is transformed by this.
 * @template ElementType - The type of the elements in the {@link Array} that is returned by this.
 */
export type FlatMapper<
    KeyType extends PropertyKey,
    PropertyType,
    ElementType
> =
    {
        /**
         * The function that maps a {@link Record} to an {@link Array} via {@link FlatMap}.
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

/**
 * Defines a type that corresponds to {@link RecordLike}, such that every
 * `readonly` modifier is removed, recursively.
 *
 * @template RecordLike - The type to make writeable.
 * @template ShallowOption - Whether the `readonly` modifier should be stripped recursively.
 * If `true` (the default), then only the properties of the given type will have the `readonly`
 * modifier stripped (that is, if any of these properties is a {@link Record} type with `readonly`
 * modifiers, then those will *not* be removed if {@link ShallowOption} is `true`).
 */
export type Mutable<RecordLike, ShallowOption extends boolean = true> =
    ShallowOption extends false
        ? {
            -readonly [ Key in keyof RecordLike ]: RecordLike[Key];
        }
        : ShallowOption extends true
            ? {
                -readonly [ Key in keyof RecordLike ]: Mutable<RecordLike[Key]>;
            }
            : never;

/**
 * Given a {@link RecordLike | record-like type}, this type is the union
 * of the values of all properties in the {@link RecordLike | record-like type}.
 *
 * @template RecordLike - The record-like type from which this type extracts value types.
 */
export type Values<RecordLike> = RecordLike[keyof RecordLike];

/**
 * The element type of the return value of `Object.entries()`.
 *
 * @template RecordLike - The record-like type of the argument of `Object.entries()`.
 * @template KeyType - The subset of keys used by this type.
 */
export type Entry<
    RecordLike,
    KeyType extends keyof RecordLike = keyof RecordLike
> = [ KeyType, RecordLike[KeyType] ];

/** A {@link Record} that is compatible with the path utility types. */
export type Walkable = Record<string | number, unknown>;
