/**
 * @file      Record.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    FlatMapper,
    FromPath,
    Mapper,
    Path,
    Walkable
} from "./Record.Types.ts";
import type { Ref } from "../Miscellaneous/Utility.Types.ts";

// @TODO Write example for `SetPropertyFromPath`.
/* eslint-disable jsdoc/require-example */

/**
 * Set a value within a given {@link InRecord | Record} at a given {@link Path} to be a given
 * {@link Value}.
 *
 * @param InRecord - The {@link Record} that holds the value with path {@link Path} to be retrieved
 * by this function.
 * @param Path - The {@link PathType} that describes the property to be retrieved by this.
 * @param Value - The value to be set at the given {@link Path} of the given {@link InRecord | Record}.
 *
 * @throws {Error} An {@link Error} iff the given {@link Path} is an {@link Array}, rather than a
 * `.`-delimited `string`.
 */
export function SetPropertyFromPath<
    RecordType extends Walkable,
    PathType extends Path<RecordType>
>(
    InRecord: RecordType,
    Path: PathType,
    Value: FromPath<RecordType, PathType>
): void
{
    type FProperty = FromPath<RecordType, PathType>;

    if (Array.isArray(Path))
    {
        throw new Error("SetPropertyFromPath does not support Array-based paths yet.");
    }

    const PathSplit: Array<string> = Path.split(".");

    const Last: string | undefined = PathSplit.pop();
    if (Last === undefined)
    {
        return;
    }

    if (PathSplit.length === 0)
    {
        if (!Array.isArray(Path))
        {
            ((InRecord.Ref as Record<string, unknown>)[(Path as string)]) = Value;
        }
    }

    const Recurrence = (In: unknown): unknown | undefined =>
    {
        const NextPropertyNameBase: string | undefined = PathSplit.shift();

        if (NextPropertyNameBase !== undefined)
        {
            const NextPropertyName: string | number = isNaN(parseInt(NextPropertyNameBase))
                ? NextPropertyNameBase
                : parseInt(NextPropertyNameBase);

            const Out: unknown = (In as Record<string, unknown>)[NextPropertyName] as unknown;
            return Recurrence(Out);
        }
        else
        {
            return In;
        }
    };

    const PropertyRef: Ref<FProperty> = Recurrence(InRecord) as Ref<FProperty>;
    const LastTyped: string | number = isNaN(parseInt(Last))
        ? Last
        : parseInt(Last);

    (PropertyRef.Ref as Record<string, unknown>)[LastTyped] = Value;
};

/* eslint-enable jsdoc/require-example */

// @TODO Write example for `GetPropertyFromPath`.
/* eslint-disable jsdoc/require-example */

/**
 * Get a value within a given {@link InRecord | Record} at a given {@link Path}.
 *
 * @param InRecord - The {@link Record} that holds the value with path {@link Path} to be retrieved
 * by this function.
 * @param Path - The {@link PathType} that describes the property to be retrieved by this.
 *
 * @throws {Error} An {@link Error} iff the given {@link Path} is an {@link Array}, rather than a
 * `.`-delimited `string`.
 *
 * @returns {FromPath<RecordType, PathType>} The value in the {@link InRecord} at the given {@link Path}.
 */
export function GetPropertyFromPath<
    RecordType extends Record<string, unknown>,
    PathType extends Path<RecordType>
>(
    InRecord: RecordType,
    Path: PathType
): FromPath<RecordType, PathType>
{
    if (Array.isArray(Path))
    {
        throw new Error("GetPropertyFromPath does not support Array-based paths yet.");
    }

    const PathSplit: Array<string> = Path.split(".");
    const Recurrence = (In: unknown, Index: number = 0): unknown =>
    {
        const Key: string | number | undefined = isNaN(parseInt(PathSplit[Index] || ""))
            ? PathSplit[Index]
            : parseInt(PathSplit[Index] || "");

        if (Key !== undefined)
        {
            const Next: unknown = (In as Record<string, unknown>)[Key];
            if (Index !== PathSplit.length - 1)
            {
                return Recurrence(Next, Index + 1);
            }
            else
            {
                return Next;
            }
        }
        else
        {
            return undefined;
        }
    };

    return Recurrence(InRecord) as FromPath<RecordType, PathType>;
};

/* eslint-enable jsdoc/require-example */

/**
 * Creates a {@link Ref} of a given {@link Type}.  Useful for passing
 * primitives to functions by-reference.
 *
 * @template Type - The type of the value wrapped by the returned {@link Ref}.
 *
 * @returns {Ref<Type>} A {@link Ref} of the given {@link Type}.
 */
export function MakeRef<Type>(): Ref<Type>
{
    return {
        Ref: undefined
    } as Ref<Type>;
};

// @TODO Write example for `MapRecord`.
/* eslint-disable jsdoc/require-example */

/**
 * Maps a {@link Record} to an {@link Array}.
 *
 * @param InRecord - The {@link Record} over which this function maps.
 * @param InFunction - The {@link FlatMapTransformer | transformer} that maps
 * the record to an {@link Array}.
 *
 * @returns {Array<ElementType>} An {@link Array} of elements, mapped from the given {@link InRecord}.
 */
export function Map<
    KeyType extends PropertyKey,
    PropertyType,
    ElementType
>(
    InRecord: Record<KeyType, PropertyType>,
    InFunction: Mapper<KeyType, PropertyType, ElementType>
): Array<ElementType>
{
    return Object.keys(InRecord).map((InKey: string, Index: number): ElementType =>
    {
        const Key: KeyType = InKey as KeyType;
        return InFunction(Key, InRecord[Key], Index);
    });
};

/* eslint-enable jsdoc/require-example */

// @TODO Write example for `FlatMap`.
/* eslint-disable jsdoc/require-example */

/**
 * Maps a {@link Record} to an {@link Array}.
 *
 * @param InRecord - The {@link Record} over which this function maps.
 * @param InFunction - The {@link FlatMapTransformer | transformer} that maps
 * the record to an {@link Array}.
 *
 * @returns {Array<ElementType>} An {@link Array} of elements, mapped from the given {@link InRecord}.
 */
export function FlatMap<
    KeyType extends PropertyKey,
    PropertyType,
    ElementType
>(
    InRecord: Record<KeyType, PropertyType>,
    InFunction: FlatMapper<KeyType, PropertyType, ElementType>
): Array<ElementType>
{
    return Object.keys(InRecord).flatMap((InKey: string, Index: number): Array<ElementType> =>
    {
        const Key: KeyType = InKey as KeyType;
        const Transform: ElementType | Array<ElementType> = InFunction(Key, InRecord[Key], Index);
        return Array.isArray(Transform)
            ? Transform
            : [ Transform ];
    });
}

/* eslint-enable jsdoc/require-example */
