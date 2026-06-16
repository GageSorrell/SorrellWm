/**
 * The package's implementation of the multimap data structure.
 *
 * @module @sorrell/multimap/MultiMap
 * @internal
 */

/**
 * @file      MultiMap.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

// @TODO TEMPORARY
// eslint-disable-next-line @stylistic/max-len
/* eslint-disable jsdoc/check-access, jsdoc/check-alignment, jsdoc/check-indentation, jsdoc/check-line-alignment, jsdoc/check-param-names, jsdoc/check-property-names, jsdoc/check-syntax, jsdoc/check-tag-names, jsdoc/check-template-names, jsdoc/check-types, jsdoc/check-values, jsdoc/convert-to-jsdoc-comments, jsdoc/empty-tags, jsdoc/escape-inline-tags, jsdoc/implements-on-classes, jsdoc/imports-as-dependencies, jsdoc/informative-docs, jsdoc/lines-before-block, jsdoc/match-description, jsdoc/match-name, jsdoc/multiline-blocks, jsdoc/no-bad-blocks, jsdoc/no-blank-block-descriptions, jsdoc/no-blank-blocks, jsdoc/no-defaults, jsdoc/no-missing-syntax, jsdoc/no-multi-asterisks, jsdoc/no-restricted-syntax, jsdoc/no-types, jsdoc/no-undefined-types, jsdoc/prefer-import-tag, jsdoc/reject-any-type, jsdoc/reject-function-type, jsdoc/require-asterisk-prefix, jsdoc/require-description, jsdoc/require-description-complete-sentence, jsdoc/require-example, jsdoc/require-file-overview, jsdoc/require-hyphen-before-param-description, jsdoc/require-jsdoc, jsdoc/require-next-description, jsdoc/require-next-type, jsdoc/require-param, jsdoc/require-param-description, jsdoc/require-param-name, jsdoc/require-param-type, jsdoc/require-property, jsdoc/require-property-description, jsdoc/require-property-name, jsdoc/require-property-type, jsdoc/require-rejects, jsdoc/require-returns, jsdoc/require-returns-check, jsdoc/require-returns-description, jsdoc/require-returns-type, jsdoc/require-tags, jsdoc/require-template, jsdoc/require-template-description, jsdoc/require-throws, jsdoc/require-throws-description, jsdoc/require-throws-type, jsdoc/require-yields, jsdoc/require-yields-check, jsdoc/require-yields-description, jsdoc/require-yields-type, jsdoc/sort-tags, jsdoc/tag-lines, jsdoc/text-escaping, jsdoc/ts-method-signature-style, jsdoc/ts-no-empty-object-type, jsdoc/ts-no-unnecessary-template-expression, jsdoc/ts-prefer-function-type, jsdoc/type-formatting, jsdoc/valid-types */

import * as MutableHashSet from "effect/MutableHashSet";
import { Equal, Hash, HashMap, HashSet, MutableHashMap, Option, type Pipeable } from "effect";

export/** The type identifier of the {@link MultiMap}. */
const TypeId: unique symbol = Symbol.for("@sorrell/multimap!MultiMap");

export/** The type identifier of the {@link MutableMultiMap}. */
const MutableTypeId: unique symbol = Symbol.for("@sorrell/multimap!MutableMultiMap");

/**
 * The type of this module's {@link TypeId:var}.
 */
export type TypeId = typeof TypeId;

/**
 * The type of this module's {@link MutableTypeId:var}.
 */
export type MutableTypeId = typeof MutableTypeId;

const TypeIdHash: number = Hash.hash(Symbol.keyFor(TypeId));

abstract class MultiMapper<in out KeyType, in out ValueType>
implements Iterable<readonly [ KeyType, ValueType ]>, Equal.Equal, Hash.Hash, Pipeable.Pipeable
{
    /* eslint-disable @typescript-eslint/no-explicit-any */

    readonly Backing: any;

    public [Symbol.iterator](): IterableIterator<readonly [ KeyType, ValueType ]>
    {
        return entries(this as any);
    }

    /* eslint-enable @typescript-eslint/no-explicit-any */

    [Equal.symbol](That: Equal.Equal): boolean
    {
        return IsMultiMap(That) && Equal.equals(this.Backing, That.Backing);
    }

    [Hash.symbol](): number
    {
        return Hash.combine(TypeIdHash, Hash.hash(this.Backing));
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */

    public pipe(...Functions: Array<(Value: any) => any>): unknown
    {
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        let Value: unknown = this;

        for (const FunctionElement of Functions)
        {
            Value = FunctionElement(Value);
        }

        return Value;
    }

    /* eslint-enable @typescript-eslint/no-explicit-any */

    public toString(): string
    {
        return `MultiMap(${ JSON.stringify(Entries(this)) })`;
    }

    public toJSON(): unknown
    {
        return {
            _tag: "MultiMap",
            values: Entries(this)
        };
    }
}

export class MultiMap<KeyType, ValueType> extends MultiMapper<KeyType, ValueType>
{
    readonly [ TypeId ]: TypeId = TypeId;

    public readonly _tag: string = "MultiMap";

    constructor(
        override readonly Backing: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
    )
    {
        super();
    }
}

export type KeyType<T> =
    T extends MultiMapper<infer KeyType, infer _ValueType>
        ? KeyType
        : never;

export type ValueType<T> =
    T extends MultiMapper<infer _KeyType, infer ValueType>
        ? ValueType
        : never;

export type Entry<T> =
    T extends MultiMapper<infer KeyType, infer ValueType>
        ? readonly [ KeyType, ValueType ]
        : never;

export type ValueTypes<T> =
    T extends MultiMapper<infer KeyType, infer ValueType>
        ? HashMap.HashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>
        : never;

/* eslint-disable @typescript-eslint/no-explicit-any */

const dual = (
    Arity: number,
    Body: (...Arguments: Array<any>) => any
): ((...Arguments: Array<any>) => any) =>
{
    return (...Arguments: Array<any>) =>
    {
        if (Arguments.length >= Arity)
        {
            return Body(...Arguments);
        }

        return (Self: any) => Body(Self, ...Arguments);
    };
};

export type AnyMultiMap<KeyType = any, ValueType = any> =
    | MultiMapper<KeyType, ValueType>
    | MultiMap<KeyType, ValueType>
    | MutableMultiMap<KeyType, ValueType>;

/* eslint-enable @typescript-eslint/no-explicit-any */

function fromBacking<KeyType, ValueType>(
    Backing:
        | HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
        | MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>,
    IsMutable: false
): MultiMap<KeyType, ValueType>;

function fromBacking<KeyType, ValueType>(
    Backing:
        | HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
        | HashMap.HashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>
        | MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>,
    IsMutable: true
): MutableMultiMap<KeyType, ValueType>;

function fromBacking<KeyType, ValueType>(
    Backing:
        | HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
        | HashMap.HashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>
        | MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>,
    IsMutable: boolean
): AnyMultiMap<KeyType, ValueType>
{
    function FilterValues(Values: HashSet.HashSet<ValueType>): boolean
    {
        return !HashSet.isEmpty(Values);
    }

    if (IsMutable)
    {
        const Immutable: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>> =
            HashMap.empty<KeyType, HashSet.HashSet<ValueType>>();

        type MutableBacking = MutableHashMap.MutableHashMap<
            KeyType,
            MutableHashSet.MutableHashSet<ValueType>
        >;

        if (HashMap.isHashMap(Backing))
        {
            const BackingCast: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>> =
                Backing as HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>;

            HashMap.forEach(
                BackingCast,
                (Value: HashSet.HashSet<ValueType>, Key: KeyType) =>
                {
                    HashMap.set(Immutable, Key, HashSet.fromIterable(Value));
                });

            return new MutableMultiMap(
                HashMap.filter(
                    Immutable,
                    FilterValues
                ));
        }
        else
        {
            const BackingCast: MutableBacking = Backing as MutableBacking;

            MutableHashMap.forEach(
                BackingCast,
                (Value: MutableHashSet.MutableHashSet<ValueType>, Key: KeyType) =>
                {
                    HashMap.set(Immutable, Key, HashSet.fromIterable(Value));
                });

            return new MutableMultiMap(
                HashMap.filter(
                    Immutable,
                    FilterValues
                ));
        }
    }
    else
    {
        type ImmutableBacking = HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>;
        const BackingCast: ImmutableBacking = Backing as ImmutableBacking;
        return new MultiMap(
            HashMap.filter(
                BackingCast,
                FilterValues
            )
        );
    }
}

function toValueSet<ValueType>(
    Values: Iterable<ValueType>
): HashSet.HashSet<ValueType>;
function toValueSet<ValueType>(
    Values: Iterable<ValueType>
): MutableHashSet.MutableHashSet<ValueType>;
function toValueSet<ValueType>(
    Values: Iterable<ValueType>
): MutableHashSet.MutableHashSet<ValueType> | HashSet.HashSet<ValueType>
{
    return HashSet.isHashSet(Values)
        ? Values
        : HashSet.fromIterable(Values);
}

function getValuesUnsafe<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType
): HashSet.HashSet<ValueType>;
function getValuesUnsafe<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType
): MutableHashSet.MutableHashSet<ValueType>;
function getValuesUnsafe<KeyType, ValueType>(
    Self:
        | MutableMultiMap<KeyType, ValueType>
        | MultiMap<KeyType, ValueType>,
    Key: KeyType
): (
    | HashSet.HashSet<ValueType>
    | MutableHashSet.MutableHashSet<ValueType>
)
{
    if (HashMap.isHashMap(Self.Backing))
    {
        const Values: Option.Option<HashSet.HashSet<ValueType>> = HashMap.get(Self.Backing, Key);

        return Option.isSome(Values)
            ? Values.value
            : HashSet.empty<ValueType>();
    }
    else
    {
        const Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>> =
            MutableHashMap.get(Self.Backing, Key);

        return Option.isSome(Values)
            ? Values.value
            : MutableHashSet.empty<ValueType>();
    }
};

const setValues = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Values: Iterable<ValueType> | Option.None<ValueType>
): MultiMap<KeyType, ValueType> =>
{
    const ValueSet: HashSet.HashSet<ValueType> = Option.isOption(Values) && Option.isNone(Values)
        ? HashSet.empty()
        : toValueSet(Values);

    if (HashSet.isEmpty(ValueSet))
    {
        return fromBacking(HashMap.remove(Self.Backing, Key), false);
    }

    return fromBacking(HashMap.set(Self.Backing, Key, ValueSet), false);
};

const EmptyParameter: unique symbol = Symbol.for("@sorrell/multimap!MultiMap!EmptyParameter");

const addEntry = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType | typeof EmptyParameter = EmptyParameter
): MultiMap<KeyType, ValueType> =>
{
    const CurrentValues: HashSet.HashSet<ValueType> = getValuesUnsafe(Self, Key);
    const NextValues: HashSet.HashSet<ValueType> = Value !== EmptyParameter
        ? HashSet.add(CurrentValues, Value)
        : CurrentValues;

    return fromBacking(HashMap.set(Self.Backing, Key, NextValues), false);
};

const removeEntry = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): MultiMap<KeyType, ValueType> =>
{
    return fromBacking(
        HashMap.modifyAt(
            Self.Backing,
            Key,
            (CurrentValues: Option.Option<HashSet.HashSet<ValueType>>) =>
            {
                if (Option.isNone(CurrentValues))
                {
                    return Option.none();
                }

                const NextValues: HashSet.HashSet<ValueType> = HashSet.remove(CurrentValues.value, Value);

                return HashSet.isEmpty(NextValues)
                    ? Option.none()
                    : Option.some(NextValues);
            }),
        false
    );
};

export function empty<KeyType = never, ValueType = never>(): MultiMap<KeyType, ValueType>
{
    return fromBacking(HashMap.empty<KeyType, HashSet.HashSet<ValueType>>(), false);
};

export const fromIterable = <KeyType, ValueType>(
    Entries: Iterable<readonly [ KeyType, ValueType ] | readonly [ KeyType ]>
): MultiMap<KeyType, ValueType> =>
{
    let Result: MultiMap<KeyType, ValueType> = empty<KeyType, ValueType>();

    for (const Entry of Entries)
    {
        if (Entry.length === 2)
        {
            Result = addEntry(Result, Entry[0], Entry[1]);
        }
        else
        {
            Result = addEntry(Result, Entry[0]);
        }
    }

    return Result;
};

export const fromHashMap = <KeyType, ValueType>(
    Backing: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
): MultiMap<KeyType, ValueType> =>
{
    return fromBacking(Backing, false);
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export const make = <KeyType, ValueType>(
    ...Entries:
        | ReadonlyArray<readonly [ KeyType ]>
        | ReadonlyArray<readonly [ KeyType, ValueType ]>
        | ReadonlyArray<readonly [ KeyType, ValueType ] | readonly [ KeyType ]>
): MultiMap<KeyType, ValueType> =>
{
    return fromIterable(Entries);
};

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * The type guard for {@link MultiMap | MultiMaps}.
 *
 * @template KeyType - The type of the keys of the {@link MultiMap} that
 * corresponds to the given {@link Value}, if one exists.
 *
 * @template ValueType - The type of the values of the {@link MultiMap} that
 * corresponds to the given {@link Value}, if one exists.
 *
 * @param Value - The value against which this guards.
 *
 * @see {@link IsMultiMap:UnknownOverload} There exists a non-generic overload of this function
 * whose parameter type is `unknown`.
 *
 * @returns {Value is MultiMap<KeyType, Value>} Whether the given {@link Value}
 * is a {@link MultiMap} (in particular, of the given {@link KeyType} and {@link Value}).
 *
 * {@label GenericOverload}
 */
export function IsMultiMap<KeyType, Value>(
    Value: Iterable<readonly [ KeyType, Value ]>
): Value is MultiMap<KeyType, Value>;

/**
 * The type guard for {@link MultiMap | MultiMaps}.
 *
 * @param Value - The value against which this guards.
 *
 * @see {@link IsMultiMap:GenericOverload} There exists a generic overload of this function
 * which tests for a given key type and value type.
 *
 * @returns {Value is MultiMap<unknown, unknown>} Whether the given {@link Value}
 * is a {@link MultiMap}.
 *
 * {@label UnknownOverload}
 */
export function IsMultiMap(Value: unknown): Value is MultiMap<unknown, unknown>;

/* eslint-disable jsdoc/require-param, jsdoc/require-returns, jsdoc/match-description */

/** {@inheritDoc isMultiMap:UnknownOverload } */
export function IsMultiMap(Value: unknown): Value is MultiMap<unknown, unknown>
{
    return typeof Value === "object" && Value !== null && TypeId in Value;
}

/**
 * The type guard for {@link MutableMultiMap | MutableMultiMaps}.
 *
 * @template KeyType - The type of the keys of the {@link MutableMultiMap} that
 * corresponds to the given {@link Value}, if one exists.
 *
 * @template ValueType - The type of the values of the {@link MutableMultiMap} that
 * corresponds to the given {@link Value}, if one exists.
 *
 * @param Value - The value against which this guards.
 *
 * @see {@link IsMutableMultiMap:UnknownOverload} There exists a non-generic overload of this function
 * whose parameter type is `unknown`.
 *
 * @returns {Value is MutableMultiMap<KeyType, Value>} Whether the given {@link Value}
 * is a {@link MutableMultiMap} (in particular, of the given {@link KeyType} and {@link Value}).
 *
 * {@label MutableGenericOverload}
 */
export function IsMutableMultiMap<KeyType, Value>(
    Value: Iterable<readonly [ KeyType, Value ]>
): Value is MutableMultiMap<KeyType, Value>;

/**
 * The type guard for {@link MutableMultiMap | MutableMultiMaps}.
 *
 * @param Value - The value against which this guards.
 *
 * @see {@link IsMutableMultiMap:GenericOverload} There exists a generic overload of this function
 * which tests for a given key type and value type.
 *
 * @returns {Value is MutableMultiMap<unknown, unknown>} Whether the given {@link Value}
 * is a {@link MutableMultiMap}.
 *
 * {@label MutableUnknownOverload}
 */
export function IsMutableMultiMap(Value: unknown): Value is MutableMultiMap<unknown, unknown>;

/* eslint-disable jsdoc/require-param, jsdoc/require-returns, jsdoc/match-description */

/** {@inheritDoc isMutableMultiMap:MutableUnknownOverload } */
export function IsMutableMultiMap(Value: unknown): Value is MutableMultiMap<unknown, unknown>
{
    return typeof Value === "object" && Value !== null && TypeId in Value;
}

/* eslint-enable jsdoc/require-param, jsdoc/require-returns, jsdoc/match-description */

export function toHashMap<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): Backing<MutableMultiMap<KeyType, ValueType>>;
export function toHashMap<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): Backing<MultiMap<KeyType, ValueType>>;
export function toHashMap<KeyType, ValueType>(
    Self: MultiMapper<KeyType, ValueType>
): Backing<MultiMapper<KeyType, ValueType>>;
export function toHashMap<KeyType, ValueType>(
    Self:
        | MultiMapper<KeyType, ValueType>
        | MultiMap<KeyType, ValueType>
        | MutableMultiMap<KeyType, ValueType>
): Backing<typeof Self>
{
    return Self.Backing;
}

export function* entries<KeyType, ValueType>(
    Self:
        | MutableMultiMap<KeyType, ValueType>
        | MultiMap<KeyType, ValueType>
): IterableIterator<readonly [ KeyType, ValueType ]>
{
    for (const [ Key, Values ] of Self.Backing)
    {
        for (const Value of Values)
        {
            yield [ Key, Value ] as const;
        }
    }
}

export function groupedEntries<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): IterableIterator<[ KeyType, HashSet.HashSet<ValueType> ]>;
export function groupedEntries<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): IterableIterator<[ KeyType, HashSet.HashSet<ValueType> ]>;
export function groupedEntries<KeyType, ValueType>(
    Self:
        | MultiMap<KeyType, ValueType>
        | MutableMultiMap<KeyType, ValueType>
): (
    | IterableIterator<[ KeyType, HashSet.HashSet<ValueType> ]>
)
{
    if (HashMap.isHashMap(Self.Backing))
    {
        return HashMap.entries(Self.Backing);
    }
    else
    {
        const Out: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>> = HashMap.empty();

        MutableHashMap.forEach(
            Self.Backing as MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>,
            (Value: MutableHashSet.MutableHashSet<ValueType>, Key: KeyType) =>
            {
                HashMap.set(Out, Key, HashSet.fromIterable(Value));
            });

        return HashMap.entries(Out);
    }
};

export const keys = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): IterableIterator<KeyType> =>
{
    return HashMap.keys(Self.Backing);
};

export function* values<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): IterableIterator<ValueType>
{
    for (const Values of HashMap.values(Self.Backing))
    {
        for (const Value of Values)
        {
            yield Value;
        }
    }
}

export const KeySet = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): HashSet.HashSet<KeyType> =>
{
    return HashSet.fromIterable(HashMap.keys(Self.Backing));
};

export const ValueSet = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): MutableHashSet.MutableHashSet<ValueType> =>
{
    return MutableHashSet.fromIterable(values(Self));
};

export function Entries<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): Array<readonly [ KeyType, ValueType ]>;
export function Entries<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): Array<readonly [ KeyType, ValueType ]>;
export function Entries<KeyType, ValueType>(
    Self: MultiMapper<KeyType, ValueType>
): Array<readonly [ KeyType, ValueType ]>;
export function Entries<KeyType, ValueType>(
    Self:
        | MultiMapper<KeyType, ValueType>
        | MultiMap<KeyType, ValueType>
        | MutableMultiMap<KeyType, ValueType>
): Array<readonly [ KeyType, ValueType ]>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return Array.from(entries(Self as any));
};

export const toValues = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): Array<ValueType> =>
{
    return Array.from(values(Self));
};

export function toGroupedEntries<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): Array<[ KeyType, HashSet.HashSet<ValueType>]>;
export function toGroupedEntries<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): Array<[ KeyType, MutableHashSet.MutableHashSet<ValueType>]>;
export function toGroupedEntries<KeyType, ValueType>(
    Self:
        | MultiMap<KeyType, ValueType>
        | MutableMultiMap<KeyType, ValueType>
): (
    | Array<[ KeyType, HashSet.HashSet<ValueType>]>
    | Array<[ KeyType, MutableHashSet.MutableHashSet<ValueType>]>
)
{
    if (HashMap.isHashMap(Self.Backing))
    {
        return HashMap.toEntries(Self.Backing);
    }
    else if (MutableHashMap.isMutableHashMap(Self.Backing))
    {
        return HashMap.toEntries(HashMap.fromIterable(Self.Backing));
    }
    else
    {
        throw new Error(
            "toGroupedEntries was given a multimap whose underlying entries were not a " +
            "HashMap or MutableHashMap."
        );
    }
};

export function size<KeyType, ValueType>(Self: MultiMap<KeyType, ValueType>): number;
export function size<KeyType, ValueType>(Self: MutableMultiMap<KeyType, ValueType>): number;
export function size<KeyType, ValueType>(
    Self:
        | MutableMultiMap<KeyType, ValueType>
        | MultiMap<KeyType, ValueType>
): number
{
    let Count: number = 0;

    if (HashMap.isHashMap(Self.Backing))
    {
        for (const Values of HashMap.values(Self.Backing))
        {
            Count += HashSet.size(Values);
        }
    }
    else
    {
        for (const Values of MutableHashMap.values(Self.Backing))
        {
            Count += MutableHashSet.size(Values);
        }
    }

    return Count;
};

export const keySize = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): number =>
{
    return HashMap.size(Self.Backing);
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export const valueSize: {
    <KeyType, ValueType>(Self: MultiMap<KeyType, ValueType>, Key: KeyType): number;

    <KeyType, ValueType>(Self: MultiMap<KeyType, ValueType>): (Key: KeyType) => number;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType
): number =>
{
    return HashSet.size(getValuesUnsafe(Self, Key));
});

export const isEmpty = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): boolean =>
{
    return HashMap.isEmpty(Self.Backing);
};

export const get: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType
    ): Option.Option<HashSet.HashSet<ValueType>>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType) => Option.Option<HashSet.HashSet<ValueType>>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType
): Option.Option<HashSet.HashSet<ValueType>> =>
{
    return HashMap.get(Self.Backing, Key);
});

/* eslint-enable @typescript-eslint/no-explicit-any */

export const getHash: {
    <KeyType>(
        Key: KeyType,
        KeyHash: number
    ): <ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ) => Option.Option<HashSet.HashSet<ValueType>>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        KeyHash: number
    ): Option.Option<HashSet.HashSet<ValueType>>;
} = dual(3, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    KeyHash: number
): Option.Option<HashSet.HashSet<ValueType>> =>
{
    return HashMap.getHash(Self.Backing, Key, KeyHash);
});

/* eslint-disable @typescript-eslint/no-explicit-any */

export const getValues: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType
    ): HashSet.HashSet<ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType
    ): MutableHashSet.MutableHashSet<ValueType>;
} = dual(2, getValuesUnsafe) as any;

export const unsafeGet: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType
    ): HashSet.HashSet<ValueType>;

    <KeyType, ValueType>(Self: MultiMap<KeyType, ValueType>):
    (Key: KeyType) => HashSet.HashSet<ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType
): HashSet.HashSet<ValueType> =>
{
    return HashMap.getUnsafe(Self.Backing, Key);
});

export const hasKey: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType
    ): boolean;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType) => boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType
): boolean =>
{
    return HashMap.has(Self.Backing, Key);
});

export const hasKeyTypeHash: {
    <KeyType>(Key: KeyType, KeyHash: number): <ValueType>(Self: MultiMap<KeyType, ValueType>) => boolean;

    <KeyType, ValueType>(Self: MultiMap<KeyType, ValueType>, Key: KeyType, KeyTypeHash: number): boolean;
} = dual(3, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    KeyHash: number
): boolean =>
{
    return HashMap.hasHash(Self.Backing, Key, KeyHash);
});

export const has: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        Value: ValueType
    ): boolean;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType, Value: ValueType) => boolean;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (Value: ValueType) => boolean;
} = dual(3, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): boolean =>
{
    return HashSet.has(getValuesUnsafe(Self, Key), Value);
});

export const hasValue: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Value: ValueType
    ): boolean;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Value: ValueType) => boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Value: ValueType
): boolean =>
{
    for (const Values of HashMap.values(Self.Backing))
    {
        if (HashSet.has(Values, Value))
        {
            return true;
        }
    }

    return false;
});

export const hasBy: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): boolean;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Predicate: (Value: ValueType, Key: KeyType) => boolean) => boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): boolean =>
{
    for (const [ Key, Value ] of entries(Self))
    {
        if (Predicate(Value, Key))
        {
            return true;
        }
    }

    return false;
});

export const every: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): boolean;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Predicate: (Value: ValueType, Key: KeyType) => boolean) => boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): boolean =>
{
    for (const [ Key, Value ] of entries(Self))
    {
        if (!Predicate(Value, Key))
        {
            return false;
        }
    }

    return true;
});

export const some: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): boolean;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Predicate: (Value: ValueType, Key: KeyType) => boolean) => boolean;
} = hasBy;

export const findFirst: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): Option.Option<readonly [ KeyType, ValueType ]>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ) => Option.Option<readonly [ KeyType, ValueType ]>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): Option.Option<readonly [ KeyType, ValueType ]> =>
{
    for (const [ Key, Value ] of entries(Self))
    {
        if (Predicate(Value, Key))
        {
            return Option.some([ Key, Value ] as const);
        }
    }

    return Option.none();
}) as any;

export const countBy: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): number;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Predicate: (Value: ValueType, Key: KeyType) => boolean) => number;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): number =>
{
    let Count: number = 0;

    for (const [ Key, Value ] of entries(Self))
    {
        if (Predicate(Value, Key))
        {
            Count += 1;
        }
    }

    return Count;
});

export const set: {
    <KeyType, ValueType>(
        Key: KeyType,
        Values: Iterable<ValueType> | Option.None<ValueType>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType, Values: | Iterable<ValueType> | Option.None<ValueType>) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        Values:
            | Iterable<ValueType>
            | Option.None<ValueType>
    ): MultiMap<KeyType, ValueType>;
} = dual(3, setValues);

export const add: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        Value: ValueType
    ): MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType
    ): (Value: ValueType) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (Value: ValueType) => MultiMap<KeyType, ValueType>;
} = dual(3, addEntry);

export const addAll: {
    <KeyType, ValueType>(
        Key: KeyType,
        Values: Iterable<ValueType>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        Values: Iterable<ValueType>
    ): MultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Values: Iterable<ValueType>
): MultiMap<KeyType, ValueType> =>
{
    let Result: MultiMap<KeyType, ValueType> = Self;

    for (const Value of Values)
    {
        Result = addEntry(Result, Key, Value);
    }

    return Result;
});

export const remove: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        Value: ValueType
    ): MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType
    ): (Value: ValueType) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (Value: ValueType) => MultiMap<KeyType, ValueType>;
} = dual(3, removeEntry);

export const removeKey: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType
    ): MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(Key: KeyType): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType
): MultiMap<KeyType, ValueType> =>
{
    return fromBacking(HashMap.remove(Self.Backing, Key), false);
});

export const removeMany: {
    <KeyType, ValueType>(
        Entries: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMapper<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Entries: Iterable<readonly [ KeyType, ValueType ]>
    ): MultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Entries: Iterable<readonly [ KeyType, ValueType ]>
): MultiMap<KeyType, ValueType> =>
{
    let Result: MultiMap<KeyType, ValueType> = Self;

    for (const [ Key, Value ] of Entries)
    {
        Result = removeEntry(Result, Key, Value);
    }

    return Result;
});

export const removeManyKeys: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Keys: Iterable<KeyType>
    ): MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Keys: Iterable<KeyType>) => MultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Keys: Iterable<KeyType>
): MultiMap<KeyType, ValueType> =>
{
    return fromBacking(HashMap.removeMany(Self.Backing, Keys), false);
});

export const toggle: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        ValueType: ValueType
    ): MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType, ValueType: ValueType) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (ValueType: ValueType) => MultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    ValueType: ValueType
): MultiMap<KeyType, ValueType> =>
{
    return has(Self, Key, ValueType)
        ? removeEntry(Self, Key, ValueType)
        : addEntry(Self, Key, ValueType);
});

/* eslint-enable @typescript-eslint/no-explicit-any */

export const modify: {
    <KeyType, ValueType>(
        Key: KeyType,
        Function: (Values: MutableHashSet.MutableHashSet<ValueType>) => Iterable<ValueType>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        Function: (Values: MutableHashSet.MutableHashSet<ValueType>) => Iterable<ValueType>
    ): MultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Function: (
        Values: MutableHashSet.MutableHashSet<ValueType>
    ) => Iterable<ValueType>
): MultiMap<KeyType, ValueType> =>
{
    return modifyAt(Self, Key, (CurrentValues: Option.Option<MutableHashSet.MutableHashSet<ValueType>>) =>
    {
        if (Option.isNone(CurrentValues))
        {
            return Option.none();
        }

        return Option.some(toValueSet(Function(CurrentValues.value)));
    });
});

export const modifyAt
: {
    <KeyType, ValueType>(
        Key: KeyType,
        Function: (
            Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
        ) => Option.Option<Iterable<ValueType>>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMapper<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        Function: (
            Value: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
        ) => Option.Option<Iterable<ValueType>>
    ): MultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Function: (
        Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
    ) => Option.Option<Iterable<ValueType>>
): MultiMap<KeyType, ValueType> =>
{
    return fromBacking(
        HashMap.modifyAt(Self.Backing, Key, (CurrentValues: Option.Option<HashSet.HashSet<ValueType>>) =>
        {
            if (Option.isSome(CurrentValues))
            {
                const NextValues: Option.Option<Iterable<ValueType>> =
                    Function(Option.some(MutableHashSet.fromIterable(Option.getOrUndefined(CurrentValues)!)));

                if (Option.isNone(NextValues))
                {
                    return Option.none();
                }

                const ValueSet: HashSet.HashSet<ValueType> = toValueSet(NextValues.value);

                return HashSet.isEmpty(ValueSet)
                    ? Option.none()
                    : Option.some(ValueSet);
            }
            else
            {
                return Option.none();
            }
        }),
        false
    );
});

export const modifyHash
: {
    <KeyType, ValueType>(
        Key: KeyType,
        KeyTypeHash: number,
        Function: (
            Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
        ) => Option.Option<Iterable<ValueType>>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMapper<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        KeyTypeHash: number,
        Function: (
            Value: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
        ) => Option.Option<Iterable<ValueType>>
    ): MultiMap<KeyType, ValueType>;
} = dual(4, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    KeyHash: number,
    Function: (
        Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
    ) => Option.Option<Iterable<ValueType>>
): MultiMap<KeyType, ValueType> =>
{
    return fromBacking(
        HashMap.modifyHash(
            Self.Backing,
            Key,
            KeyHash,
            (CurrentValues: Option.Option<HashSet.HashSet<ValueType>>) =>
            {
                if (Option.isSome(CurrentValues))
                {
                    const NextValues: Option.Option<Iterable<ValueType>> =
                        Function(Option.some(MutableHashSet.fromIterable(CurrentValues.value)));

                    if (Option.isNone(NextValues))
                    {
                        return Option.none();
                    }

                    const ValueSet: HashSet.HashSet<ValueType> = toValueSet(NextValues.value);

                    return HashSet.isEmpty(ValueSet)
                        ? Option.none()
                        : Option.some(ValueSet);
                }
                else
                {
                    return Option.none();
                }
            }),
        false
    );
});

export const filter: {
    <KeyType, ValueType>(
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMapper<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): MultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): MultiMap<KeyType, ValueType> =>
{
    let Result: MultiMap<KeyType, ValueType> = empty<KeyType, ValueType>();

    for (const [ Key, Value ] of entries(Self))
    {
        if (Predicate(Value, Key))
        {
            Result = addEntry(Result, Key, Value);
        }
    }

    return Result;
});

export const filterMap
: {
    <KeyA, ValueA, KeyB, ValueB>(
        Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [KeyB, ValueB]>
    ): (Self: MultiMap<KeyA, ValueA>) => MultiMapper<KeyB, ValueB>;

    <KeyA, ValueA, KeyB, ValueB>(
        Self: MultiMap<KeyA, ValueA>,
        Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [KeyB, ValueB]>
    ): MultiMap<KeyB, ValueB>;
} = dual(2, <KeyA, ValueA, KeyB, ValueB>(
    Self: MultiMap<KeyA, ValueA>,
    Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [ KeyB, ValueB ]>
): MultiMap<KeyB, ValueB> =>
{
    let Result: MultiMap<KeyB, ValueB> = empty<KeyB, ValueB>();

    for (const [ Key, Value ] of entries(Self))
    {
        const NextEntry: Option.Option<readonly [ KeyB, ValueB ]> = Function(Value, Key);

        if (Option.isSome(NextEntry))
        {
            Result = addEntry(Result, NextEntry.value[0], NextEntry.value[1]);
        }
    }

    return Result;
});

export const compact = <KeyType, ValueType>(
    Self: MultiMap<KeyType, Option.Option<ValueType>>
): MultiMap<KeyType, ValueType> =>
{
    return filterMap(Self, (Value: Option.Option<ValueType>, Key: KeyType) =>
    {
        return Option.isSome(Value)
            ? Option.some([ Key, Value.value ] as const)
            : Option.none();
    });
};

export const map: {
    <KeyType, ValueType, ValueB>(
        Function: (Value: ValueType, Key: KeyType) => ValueB
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMapper<KeyType, ValueB>;
    <KeyType, ValueType, ValueB>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => ValueB
    ): MultiMap<KeyType, ValueB>;
} = dual(2, <KeyType, ValueType, ValueB>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => ValueB
): MultiMap<KeyType, ValueB> =>
{
    let Result: MultiMap<KeyType, ValueB> = empty<KeyType, ValueB>();

    for (const [ Key, Value ] of entries(Self))
    {
        Result = addEntry(Result, Key, Function(Value, Key));
    }

    return Result;
});

export const mapKeys: {
    <KeyType, ValueType, KeyB>(
        Function: (Key: KeyType, Values: HashSet.HashSet<ValueType>) => KeyB
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMapper<KeyB, ValueType>;

    <KeyType, ValueType, KeyB>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Key: KeyType, Values: HashSet.HashSet<ValueType>) => KeyB
    ): MultiMap<KeyB, ValueType>;
} = dual(2, <KeyType, ValueType, KeyB>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Key: KeyType, Values: HashSet.HashSet<ValueType>) => KeyB
): MultiMap<KeyB, ValueType> =>
{
    let Result: MultiMap<KeyB, ValueType> = empty<KeyB, ValueType>();

    for (const [ Key, Values ] of groupedEntries(Self))
    {
        const NextKey: KeyB = Function(Key, Values);

        for (const Value of Values)
        {
            Result = addEntry(Result, NextKey, Value);
        }
    }

    return Result;
});

export const flatMap: {
    <KeyType, ValueType, KeyB, ValueB>(
        Function: (Value: ValueType, Key: KeyType) => Iterable<readonly [ KeyB, ValueB ]>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMapper<KeyB, ValueB>;
    <KeyType, ValueType, KeyB, ValueB>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => Iterable<readonly [ KeyB, ValueB ]>
    ): MultiMap<KeyB, ValueB>;
} = dual(2, <KeyType, ValueType, KeyB, ValueB>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => Iterable<readonly [ KeyB, ValueB ]>
): MultiMap<KeyB, ValueB> =>
{
    let Result: MultiMap<KeyB, ValueB> = empty<KeyB, ValueB>();

    for (const [ Key, Value ] of entries(Self))
    {
        Result = union(Result, Function(Value, Key));
    }

    return Result;
});

export const flatMapValues: {
    <KeyType, ValueType, ValueB>(
        Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMapper<KeyType, ValueB>;
    <KeyType, ValueType, ValueB>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
    ): MultiMap<KeyType, ValueB>;
} = dual(2, <KeyType, ValueType, ValueB>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
): MultiMap<KeyType, ValueB> =>
{
    let Result: MultiMap<KeyType, ValueB> = empty<KeyType, ValueB>();

    for (const [ Key, Value ] of entries(Self))
    {
        for (const NextValueType of Function(Value, Key))
        {
            Result = addEntry(Result, Key, NextValueType);
        }
    }

    return Result;
});

export const reduce: {
    <KeyType, ValueType, Accumulator>(
        Initial: Accumulator,
        Function: (Accumulator: Accumulator, ValueType: ValueType, Key: KeyType) => Accumulator
    ): (Self: MultiMap<KeyType, ValueType>) => Accumulator;
    <KeyType, ValueType, Accumulator>(
        Self: MultiMap<KeyType, ValueType>,
        Initial: Accumulator,
        Function: (Accumulator: Accumulator, ValueType: ValueType, Key: KeyType) => Accumulator
    ): Accumulator;
} = dual(3, <KeyType, ValueType, Accumulator>(
    Self: MultiMap<KeyType, ValueType>,
    Initial: Accumulator,
    Function: (Accumulator: Accumulator, ValueType: ValueType, Key: KeyType) => Accumulator
): Accumulator =>
{
    let Result: Accumulator = Initial;

    for (const [ Key, Value ] of entries(Self))
    {
        Result = Function(Result, Value, Key);
    }

    return Result;
});

export const forEach: {
    <KeyType, ValueType>(
        Function: (Value: ValueType, Key: KeyType) => void
    ): (Self: MultiMap<KeyType, ValueType>) => void;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => void
    ): void;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => void
): void =>
{
    for (const [ Key, Value ] of entries(Self))
    {
        Function(Value, Key);
    }
});

export const union: {
    <KeyB, ValueB>(
        That: Iterable<readonly [KeyB, ValueB]>
    ): <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ) => MultiMap<KeyType | KeyB, ValueType | ValueB>;
    <KeyType, ValueType, KeyB, ValueB>(
        Self: MultiMap<KeyType, ValueType>,
        That: Iterable<readonly [KeyB, ValueB]>
    ): MultiMap<KeyType | KeyB, ValueType | ValueB>;
} = dual(2, <KeyType, ValueType, KeyB, ValueB>(
    Self: MultiMap<KeyType, ValueType>,
    That: Iterable<readonly [KeyB, ValueB]>
): MultiMap<KeyType | KeyB, ValueType | ValueB> =>
{
    let Result: MultiMap<KeyType | KeyB, ValueType | ValueB> =
        Self as MultiMap<KeyType | KeyB, ValueType | ValueB>;

    for (const [ Key, Value ] of That)
    {
        Result = addEntry(Result, Key, Value);
    }

    return Result;
});

export const intersection: {
    <KeyType, ValueType>(
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): MultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    That: Iterable<readonly [ KeyType, ValueType ]>
): MultiMap<KeyType, ValueType> =>
{
    const ThatMultiMap: MultiMap<KeyType, ValueType> = IsMultiMap(That)
        ? That
        : fromIterable(That);

    let Result: MultiMap<KeyType, ValueType> = empty<KeyType, ValueType>();

    for (const [ Key, Value ] of entries(Self))
    {
        if (has(ThatMultiMap, Key, Value))
        {
            Result = addEntry(Result, Key, Value);
        }
    }

    return Result;
});

export const difference: {
    <KeyType, ValueType>(
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): MultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    That: Iterable<readonly [ KeyType, ValueType ]>
): MultiMap<KeyType, ValueType> =>
{
    let Result: MultiMap<KeyType, ValueType> = Self;

    for (const [ Key, Value ] of That)
    {
        Result = removeEntry(Result, Key, Value);
    }

    return Result;
});

export const isSubset: {
    <KeyType, ValueType>(
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MultiMap<KeyType, ValueType>) => boolean;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    That: Iterable<readonly [ KeyType, ValueType ]>
): boolean =>
{
    const ThatMultiMap: MultiMap<KeyType, ValueType> =
        IsMultiMap(That)
            ? That
            : fromIterable(That);

    return every(Self, (Value: ValueType, Key: KeyType) => has(ThatMultiMap, Key, Value));
});

export const partition: {
    <KeyType, ValueType>(
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): (Self: MultiMap<KeyType, ValueType>) => [
        excluded: MultiMap<KeyType, ValueType>,
        satisfying: MultiMap<KeyType, ValueType>
    ];
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): [
        excluded: MultiMap<KeyType, ValueType>,
        satisfying: MultiMap<KeyType, ValueType>
    ];
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): [ excluded: MultiMap<KeyType, ValueType>, satisfying: MultiMap<KeyType, ValueType> ] =>
{
    let Excluded: MultiMap<KeyType, ValueType> = empty<KeyType, ValueType>();
    let Satisfying: MultiMap<KeyType, ValueType> = empty<KeyType, ValueType>();

    for (const [ Key, Value ] of entries(Self))
    {
        if (Predicate(Value, Key))
        {
            Satisfying = addEntry(Satisfying, Key, Value);
        }
        else
        {
            Excluded = addEntry(Excluded, Key, Value);
        }
    }

    return [ Excluded, Satisfying ];
});

export const beginMutation = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): MultiMap<KeyType, ValueType> =>
{
    return fromBacking(HashMap.beginMutation(Self.Backing), false);
};

export const endMutation = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): MultiMap<KeyType, ValueType> =>
{
    return fromBacking(HashMap.endMutation(Self.Backing), false);
};

/**
 * The `interface` corresponding to the {@link MultiMap}.
 *
 * @template KeyType - The type of this map's keys.
 * @template ValueType - The type of this map's values.
 */
export interface MutableMultiMapper<in out KeyType, in out ValueType> extends MultiMapper<KeyType, ValueType>
{
    readonly [ MutableTypeId ]: MutableTypeId;

    readonly Backing:
        | HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
        | MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>

    add(Key: KeyType, ValueType: ValueType): void;

    addAll(Key: KeyType, Values: Iterable<ValueType>):void;

    set(Key: KeyType, Values: Iterable<ValueType>):void;

    remove(Key: KeyType, ValueType: ValueType):void;

    removeKey(Key: KeyType): void;

    toggle(Key: KeyType, ValueType: ValueType):void;

    snapshot(): MultiMapper<KeyType, ValueType>;
}

export type Backing<MapType extends AnyMultiMap> =
    MapType extends MultiMap<infer KeyType, infer ValueType>
        ? HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
        : MapType extends MutableMultiMapper<infer KeyType, infer ValueType>
            ? MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>
            : MapType extends MultiMapper<infer KeyType, infer ValueType>
                ? HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
                : never;

export type Entries<
    KeyType,
    ValueType,
    SetType extends
        | HashSet.HashSet<ValueType>
        | MutableHashSet.MutableHashSet<ValueType> = HashSet.HashSet<ValueType>
> = [ KeyType, SetType ];

export type ReadonlyEntries<
    KeyType,
    ValueType,
    SetType extends
        | HashSet.HashSet<ValueType>
        | MutableHashSet.MutableHashSet<ValueType> = HashSet.HashSet<ValueType>
> = readonly [ KeyType, SetType ];

export type EntriesOf<MapType> =
    MapType extends MultiMap<infer KeyType, infer ValueType>
        ? Entries<KeyType, ValueType>
        : MapType extends MutableMultiMapper<infer KeyType, infer ValueType>
            ? Entries<KeyType, ValueType, MutableHashSet.MutableHashSet<ValueType>>
            : MapType extends MultiMapper<infer KeyType, infer ValueType>
                ? Entries<KeyType, ValueType>
                : never;

export type ReadonlyEntriesOf<MapType> =
    MapType extends MultiMap<infer KeyType, infer ValueType>
        ? ReadonlyEntries<KeyType, ValueType>
        : MapType extends MutableMultiMapper<infer KeyType, infer ValueType>
            ? ReadonlyEntries<KeyType, ValueType, MutableHashSet.MutableHashSet<ValueType>>
            : MapType extends MultiMapper<infer KeyType, infer ValueType>
                ? ReadonlyEntries<KeyType, ValueType>
                : never;

export class MutableMultiMap<in out KeyType, in out ValueType> extends
    MultiMapper<KeyType, ValueType> implements MutableMultiMapper<KeyType, ValueType>
{
    public readonly [ MutableTypeId ]: MutableTypeId = MutableTypeId;

    public readonly _tag: string = "MutableMultiMap";

    public override readonly Backing: MutableHashMap.MutableHashMap<
        KeyType,
        MutableHashSet.MutableHashSet<ValueType>
    >;

    constructor(
        InBacking:
            | MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>
            | HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
    )
    {
        super();
        this.Backing = HashMap.isHashMap(InBacking)
            ? MutableHashMap.make(...HashMap.entries(InBacking))
            : MutableHashMap.isMutableHashMap(InBacking)
                ? InBacking
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                : undefined as any;
    }

    readonly add = (_Key: KeyType, _Value: ValueType): void => { };

    readonly addAll = (_Key: KeyType, _Values: Iterable<ValueType>): void => { };

    readonly set = (_Key: KeyType, _Values: Iterable<ValueType>): void => { };

    readonly remove = (_Key: KeyType, _Value: ValueType): void => { };

    readonly removeKey = (_Key: KeyType): void => { };

    readonly toggle = (_Key: KeyType, _Value: ValueType): void => { };

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    readonly snapshot = (): MultiMapper<KeyType, ValueType> => undefined as any;
}

export const mutate: {
    <KeyType, ValueType>(
        Function: (Mutable: MultiMap<KeyType, ValueType>) => void
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Mutable: MultiMap<KeyType, ValueType>) => void
    ): MultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Mutable: MultiMap<KeyType, ValueType>) => void
): MultiMap<KeyType, ValueType> =>
{
    const Current: MultiMap<KeyType, ValueType> = beginMutation(Self);

    Function(Current);

    return endMutation(Current);
});
