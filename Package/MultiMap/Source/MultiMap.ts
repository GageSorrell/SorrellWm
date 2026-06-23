/**
 * The package's implementation of the multimap data structure.
 *
 * @module @sorrell/multimap/MultiMap
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
import { Equal, Hash, HashMap, HashSet, type MutableHashMap, Option, Result } from "effect";
import { EmptyParameter } from "./Utility.js";
import type { MultiMapBase } from "./MultiMapBase.js";

export/** The type identifier of the {@link MultiMap}. */
const TypeId: unique symbol = Symbol.for("@sorrell/multimap!MultiMap");

/**
 * The type of this module's {@link TypeId:var}.
 */
export type TypeId = typeof TypeId;

const TypeIdHash: number = Hash.hash(Symbol.keyFor(TypeId));

export class MultiMap<KeyType, ValueType> implements MultiMapBase<KeyType, ValueType>
{
    readonly [ TypeId ]: TypeId = TypeId;

    public readonly _tag: string = "MultiMap";

    constructor(
        public readonly Backing: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
    )
    { }

    public [Symbol.iterator](): IterableIterator<readonly [ KeyType, ValueType ]>
    {
        return Entries(this);
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

export type Keys<T> =
    T extends MultiMap<infer KeyType, unknown>
        ? KeyType
        : never;

export type ValueType<T> =
    T extends MultiMap<unknown, infer ValueType>
        ? ValueType
        : never;

export type Entry<T> =
    T extends MultiMap<infer KeyType, infer ValueType>
        ? readonly [ KeyType, ValueType ]
        : never;

export type ValueTypes<T> =
    T extends MultiMap<infer KeyType, infer ValueType>
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

/* eslint-enable @typescript-eslint/no-explicit-any */

function FromBacking<KeyType, ValueType>(
    Backing: MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>
): MultiMap<KeyType, ValueType>;

function FromBacking<KeyType, ValueType>(
    Backing: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
): MultiMap<KeyType, ValueType>;

function FromBacking<KeyType, ValueType>(
    Backing:
        | HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
        | MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>
): MultiMap<KeyType, ValueType>
{
    if (HashMap.isHashMap(Backing))
    {
        return new MultiMap<KeyType, ValueType>(Backing);
    }
    else
    {
        return new MultiMap<KeyType, ValueType>(
            HashMap.filterMap(
                HashMap.fromIterable(Backing),
                (Value: MutableHashSet.MutableHashSet<ValueType>) =>
                    MutableHashSet.size(Value) > 0
                        ? Result.succeed(HashSet.fromIterable(Value))
                        : Result.failVoid
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

function GetValuesUnsafe<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType
): HashSet.HashSet<ValueType>
{
    const Values: Option.Option<HashSet.HashSet<ValueType>> = HashMap.get(Self.Backing, Key);

    return Option.isSome(Values)
        ? Values.value
        : HashSet.empty<ValueType>();
};

const SetValues = <KeyType, ValueType>(
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
        return FromBacking(HashMap.remove(Self.Backing, Key));
    }

    return FromBacking(HashMap.set(Self.Backing, Key, ValueSet));
};

export function AddEntry<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): MultiMap<KeyType, ValueType>;
export function AddEntry<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType
): MultiMap<KeyType, ValueType>;
export function AddEntry<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType | typeof EmptyParameter = EmptyParameter
): MultiMap<KeyType, ValueType>
{
    const CurrentValues: HashSet.HashSet<ValueType> = GetValuesUnsafe(Self, Key);
    const NextValues: HashSet.HashSet<ValueType> = Value !== EmptyParameter
        ? HashSet.add(CurrentValues, Value)
        : CurrentValues;

    return FromBacking(HashMap.set(Self.Backing, Key, NextValues));
};

const removeEntry = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): MultiMap<KeyType, ValueType> =>
{
    return FromBacking(
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
            }
        )
    );
};

export function Empty<KeyType = never, ValueType = never>(): MultiMap<KeyType, ValueType>
{
    return FromBacking(HashMap.empty<KeyType, HashSet.HashSet<ValueType>>());
};

export const FromIterable = <KeyType, ValueType>(
    Entries: Iterable<readonly [ KeyType, ValueType ] | readonly [ KeyType ]>
): MultiMap<KeyType, ValueType> =>
{
    let Result: MultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();

    for (const Entry of Entries)
    {
        if (Entry.length === 2)
        {
            Result = AddEntry(Result, Entry[0], Entry[1]);
        }
        else
        {
            Result = AddEntry(Result, Entry[0]);
        }
    }

    return Result;
};

export const FromHashMap = <KeyType, ValueType>(
    Backing: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
): MultiMap<KeyType, ValueType> =>
{
    return FromBacking(Backing);
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export const Make = <KeyType, ValueType>(
    ...Entries:
        | ReadonlyArray<readonly [ KeyType ]>
        | ReadonlyArray<readonly [ KeyType, ValueType ]>
        | ReadonlyArray<readonly [ KeyType, ValueType ] | readonly [ KeyType ]>
): MultiMap<KeyType, ValueType> =>
{
    return FromIterable(Entries);
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

/* eslint-enable jsdoc/require-param, jsdoc/require-returns, jsdoc/match-description */

export function ToHashMap<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
{
    return Self.Backing;
}

export function* Entries<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
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

export function GroupedEntries<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): IterableIterator<[ KeyType, HashSet.HashSet<ValueType> ]>
{
    return HashMap.entries(Self.Backing);
};

export const Keys = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): IterableIterator<KeyType> =>
{
    return HashMap.keys(Self.Backing);
};

export function* Values<KeyType, ValueType>(
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
): HashSet.HashSet<ValueType> =>
{
    return HashSet.fromIterable(Values(Self));
};

export const ToValues = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): Array<ValueType> =>
{
    return Array.from(Values(Self));
};

export function ToGroupedEntries<KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): Array<[ KeyType, HashSet.HashSet<ValueType>]>
{
    return HashMap.toEntries(Self.Backing);
}

export function size<KeyType, ValueType>(Self: MultiMap<KeyType, ValueType>): number
{
    let Count: number = 0;

    for (const Values of HashMap.values(Self.Backing))
    {
        Count += HashSet.size(Values);
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
    return HashSet.size(GetValuesUnsafe(Self, Key));
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
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType) => HashSet.HashSet<ValueType>;
} = dual(2, GetValuesUnsafe);

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
    return HashSet.has(GetValuesUnsafe(Self, Key), Value);
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
    for (const [ Key, Value ] of Entries(Self))
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
    for (const [ Key, Value ] of Entries(Self))
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
    for (const [ Key, Value ] of Entries(Self))
    {
        if (Predicate(Value, Key))
        {
            return Option.some([ Key, Value ] as const);
        }
    }

    return Option.none();
});

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

    for (const [ Key, Value ] of Entries(Self))
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
} = dual(3, SetValues);

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
} = dual(3, AddEntry);

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
        Result = AddEntry(Result, Key, Value);
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
    return FromBacking(HashMap.remove(Self.Backing, Key));
});

export const RemoveMany: {
    <KeyType, ValueType>(
        Entries: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;
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

export const RemoveManyKeys: {
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
    return FromBacking(HashMap.removeMany(Self.Backing, Keys));
});

export const toggle: {
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Key: KeyType,
        Value: ValueType
    ): MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType, Value: ValueType) => MultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (Value: ValueType) => MultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): MultiMap<KeyType, ValueType> =>
{
    return has(Self, Key, Value)
        ? removeEntry(Self, Key, Value)
        : AddEntry(Self, Key, Value);
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

export const modifyAt: {
    <KeyType, ValueType>(
        Key: KeyType,
        Function: (
            Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
        ) => Option.Option<Iterable<ValueType>>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;
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
    return FromBacking(
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
        })
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
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;

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
    return FromBacking(
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
            })
    );
});

export const Filter: {
    <KeyType, ValueType>(
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): MultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): MultiMap<KeyType, ValueType> =>
{
    let Result: MultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();

    for (const [ Key, Value ] of Entries(Self))
    {
        if (Predicate(Value, Key))
        {
            Result = AddEntry(Result, Key, Value);
        }
    }

    return Result;
});

export const FilterMap: {
    <KeyA, ValueA, KeyB, ValueB>(
        Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [KeyB, ValueB]>
    ): (Self: MultiMap<KeyA, ValueA>) => MultiMap<KeyB, ValueB>;

    <KeyA, ValueA, KeyB, ValueB>(
        Self: MultiMap<KeyA, ValueA>,
        Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [KeyB, ValueB]>
    ): MultiMap<KeyB, ValueB>;
} = dual(2, <KeyA, ValueA, KeyB, ValueB>(
    Self: MultiMap<KeyA, ValueA>,
    Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [ KeyB, ValueB ]>
): MultiMap<KeyB, ValueB> =>
{
    let Result: MultiMap<KeyB, ValueB> = Empty<KeyB, ValueB>();

    for (const [ Key, Value ] of Entries(Self))
    {
        const NextEntry: Option.Option<readonly [ KeyB, ValueB ]> = Function(Value, Key);

        if (Option.isSome(NextEntry))
        {
            Result = AddEntry(Result, NextEntry.value[0], NextEntry.value[1]);
        }
    }

    return Result;
});

export const compact = <KeyType, ValueType>(
    Self: MultiMap<KeyType, Option.Option<ValueType>>
): MultiMap<KeyType, ValueType> =>
{
    return FilterMap(Self, (Value: Option.Option<ValueType>, Key: KeyType) =>
    {
        return Option.isSome(Value)
            ? Option.some([ Key, Value.value ] as const)
            : Option.none();
    });
};

export const map: {
    <KeyType, ValueType, ValueB>(
        Function: (Value: ValueType, Key: KeyType) => ValueB
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueB>;
    <KeyType, ValueType, ValueB>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => ValueB
    ): MultiMap<KeyType, ValueB>;
} = dual(2, <KeyType, ValueType, ValueB>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => ValueB
): MultiMap<KeyType, ValueB> =>
{
    let Result: MultiMap<KeyType, ValueB> = Empty<KeyType, ValueB>();

    for (const [ Key, Value ] of Entries(Self))
    {
        Result = AddEntry(Result, Key, Function(Value, Key));
    }

    return Result;
});

export const mapKeys: {
    <KeyType, ValueType, KeyB>(
        Function: (Key: KeyType, Values: HashSet.HashSet<ValueType>) => KeyB
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyB, ValueType>;

    <KeyType, ValueType, KeyB>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Key: KeyType, Values: HashSet.HashSet<ValueType>) => KeyB
    ): MultiMap<KeyB, ValueType>;
} = dual(2, <KeyType, ValueType, KeyB>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Key: KeyType, Values: HashSet.HashSet<ValueType>) => KeyB
): MultiMap<KeyB, ValueType> =>
{
    let Result: MultiMap<KeyB, ValueType> = Empty<KeyB, ValueType>();

    for (const [ Key, Values ] of GroupedEntries(Self))
    {
        const NextKey: KeyB = Function(Key, Values);

        for (const Value of Values)
        {
            Result = AddEntry(Result, NextKey, Value);
        }
    }

    return Result;
});

export const flatMap: {
    <KeyType, ValueType, KeyB, ValueB>(
        Function: (Value: ValueType, Key: KeyType) => Iterable<readonly [ KeyB, ValueB ]>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyB, ValueB>;
    <KeyType, ValueType, KeyB, ValueB>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => Iterable<readonly [ KeyB, ValueB ]>
    ): MultiMap<KeyB, ValueB>;
} = dual(2, <KeyType, ValueType, KeyB, ValueB>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => Iterable<readonly [ KeyB, ValueB ]>
): MultiMap<KeyB, ValueB> =>
{
    let Result: MultiMap<KeyB, ValueB> = Empty<KeyB, ValueB>();

    for (const [ Key, Value ] of Entries(Self))
    {
        Result = Union(Result, Function(Value, Key));
    }

    return Result;
});

export const FlatMapValues: {
    <KeyType, ValueType, ValueB>(
        Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
    ): (Self: MultiMap<KeyType, ValueType>) => MultiMap<KeyType, ValueB>;
    <KeyType, ValueType, ValueB>(
        Self: MultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
    ): MultiMap<KeyType, ValueB>;
} = dual(2, <KeyType, ValueType, ValueB>(
    Self: MultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
): MultiMap<KeyType, ValueB> =>
{
    let Result: MultiMap<KeyType, ValueB> = Empty<KeyType, ValueB>();

    for (const [ Key, Value ] of Entries(Self))
    {
        for (const NextValueType of Function(Value, Key))
        {
            Result = AddEntry(Result, Key, NextValueType);
        }
    }

    return Result;
});

export const Reduce: {
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

    for (const [ Key, Value ] of Entries(Self))
    {
        Result = Function(Result, Value, Key);
    }

    return Result;
});

export const ForEach: {
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
    for (const [ Key, Value ] of Entries(Self))
    {
        Function(Value, Key);
    }
});

export const Union: {
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
        Result = AddEntry(Result, Key, Value);
    }

    return Result;
});

export const Intersection: {
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
        : FromIterable(That);

    let Result: MultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();

    for (const [ Key, Value ] of Entries(Self))
    {
        if (has(ThatMultiMap, Key, Value))
        {
            Result = AddEntry(Result, Key, Value);
        }
    }

    return Result;
});

export const Difference: {
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

export const IsSubset: {
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
            : FromIterable(That);

    return every(Self, (Value: ValueType, Key: KeyType) => has(ThatMultiMap, Key, Value));
});

export const Partition: {
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
    let Excluded: MultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();
    let Satisfying: MultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();

    for (const [ Key, Value ] of Entries(Self))
    {
        if (Predicate(Value, Key))
        {
            Satisfying = AddEntry(Satisfying, Key, Value);
        }
        else
        {
            Excluded = AddEntry(Excluded, Key, Value);
        }
    }

    return [ Excluded, Satisfying ];
});

export const BeginMutation = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): MultiMap<KeyType, ValueType> =>
{
    return FromBacking(HashMap.beginMutation(Self.Backing));
};

export const EndMutation = <KeyType, ValueType>(
    Self: MultiMap<KeyType, ValueType>
): MultiMap<KeyType, ValueType> =>
{
    return FromBacking(HashMap.endMutation(Self.Backing));
};

export type Backing<MapType> =
    MapType extends MultiMap<infer KeyType, infer ValueType>
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
        : never;

export type ReadonlyEntriesOf<MapType> =
    MapType extends MultiMap<infer KeyType, infer ValueType>
        ? ReadonlyEntries<KeyType, ValueType>
        : never;

export const Mutate: {
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
    const Current: MultiMap<KeyType, ValueType> = BeginMutation(Self);

    Function(Current);

    return EndMutation(Current);
});
