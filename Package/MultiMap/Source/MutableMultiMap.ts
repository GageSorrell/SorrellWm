/**
 * The package's implementation of the mutable multimap data structure.
 *
 * @module @sorrell/multimap/MutableMultiMap
 */

/**
 * @file      MutableMultiMap.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Equal,
    Hash,
    HashMap,
    HashSet,
    Iterable,
    MutableHashMap,
    MutableHashSet,
    Option
} from "effect";
import { dual, flow } from "effect/Function";
import { EmptyParameter } from "./Utility.js";
import type { MultiMapBase } from "./MultiMapBase.js";

/* eslint-disable @typescript-eslint/naming-convention */

// @TODO TEMPORARY
// eslint-disable-next-line @stylistic/max-len
/* eslint-disable jsdoc/check-access, jsdoc/check-alignment, jsdoc/check-indentation, jsdoc/check-line-alignment, jsdoc/check-param-names, jsdoc/check-property-names, jsdoc/check-syntax, jsdoc/check-tag-names, jsdoc/check-template-names, jsdoc/check-types, jsdoc/check-values, jsdoc/convert-to-jsdoc-comments, jsdoc/empty-tags, jsdoc/escape-inline-tags, jsdoc/implements-on-classes, jsdoc/imports-as-dependencies, jsdoc/informative-docs, jsdoc/lines-before-block, jsdoc/match-description, jsdoc/match-name, jsdoc/multiline-blocks, jsdoc/no-bad-blocks, jsdoc/no-blank-block-descriptions, jsdoc/no-blank-blocks, jsdoc/no-defaults, jsdoc/no-missing-syntax, jsdoc/no-multi-asterisks, jsdoc/no-restricted-syntax, jsdoc/no-types, jsdoc/no-undefined-types, jsdoc/prefer-import-tag, jsdoc/reject-any-type, jsdoc/reject-function-type, jsdoc/require-asterisk-prefix, jsdoc/require-description, jsdoc/require-description-complete-sentence, jsdoc/require-example, jsdoc/require-file-overview, jsdoc/require-hyphen-before-param-description, jsdoc/require-jsdoc, jsdoc/require-next-description, jsdoc/require-next-type, jsdoc/require-param, jsdoc/require-param-description, jsdoc/require-param-name, jsdoc/require-param-type, jsdoc/require-property, jsdoc/require-property-description, jsdoc/require-property-name, jsdoc/require-property-type, jsdoc/require-rejects, jsdoc/require-returns, jsdoc/require-returns-check, jsdoc/require-returns-description, jsdoc/require-returns-type, jsdoc/require-tags, jsdoc/require-template, jsdoc/require-template-description, jsdoc/require-throws, jsdoc/require-throws-description, jsdoc/require-throws-type, jsdoc/require-yields, jsdoc/require-yields-check, jsdoc/require-yields-description, jsdoc/require-yields-type, jsdoc/sort-tags, jsdoc/tag-lines, jsdoc/text-escaping, jsdoc/ts-method-signature-style, jsdoc/ts-no-empty-object-type, jsdoc/ts-no-unnecessary-template-expression, jsdoc/ts-prefer-function-type, jsdoc/type-formatting, jsdoc/valid-types */

export/** The type identifier of the {@link MutableMultiMap}. */
const TypeId: unique symbol = Symbol.for("@sorrell/multimap!MutableMultiMap");

const TypeIdHash: number = Hash.hash(Symbol.keyFor(TypeId));

/**
 * The type of this module's {@link TypeId:var}.
 */
export type TypeId = typeof TypeId;

export/**
       * The type guard for {@link MutableMultiMap | MutableMultiMaps}.
       *
       * @param Value - The value against which this guards.
       *
       * @see {@link IsMutableMultiMap:GenericOverload} There exists a generic overload of this function
       * which tests for a given key type and value type.
       *
       * @returns {Value is MutableMultiMap<unknown, unknown>} Whether the given {@link Value}
       * is a {@link MutableMultiMap}.
       */
const IsMutableMultiMap =
    <KeyType = never, ValueType = never>(Value: unknown): Value is MutableMultiMap<KeyType, ValueType> =>
    {
        return typeof Value === "object" && Value !== null && Value instanceof MutableMultiMap;
    };

export function ToHashMap<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
{
    let Out: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>> = HashMap.empty();

    Self.Backing.backing.forEach((Value: MutableHashSet.MutableHashSet<ValueType>, Key: KeyType) =>
    {
        Out = HashMap.set(Out, Key, HashSet.fromIterable(Value));
    });

    return Out;
}

export const FromHashMap = <KeyType, ValueType>(
    In: HashMap.HashMap<KeyType, HashSet.HashSet<ValueType>>
): MutableMultiMap<KeyType, ValueType> =>
{
    const Entries: Array<[ KeyType, ValueType ]> = [ ];

    Iterable.forEach(HashMap.entries(In),
        ([ Key, Value ]: readonly [ KeyType, HashSet.HashSet<ValueType> ]) =>
        {
            Iterable.forEach(Value, (Element: ValueType) => Entries.push([ Key, Element ]));
        }
    );

    return Make<KeyType, ValueType>(...Entries);
};

export class MutableMultiMap<in out KeyType, in out ValueType>
implements MultiMapBase<KeyType, ValueType>
{
    public readonly [ TypeId ]: TypeId = TypeId;

    public readonly _tag: string = "MutableMultiMap";

    constructor(
        public readonly Backing:
        MutableHashMap.MutableHashMap<KeyType, MutableHashSet.MutableHashSet<ValueType>>
    )
    { }

    public [Symbol.iterator](): IterableIterator<readonly [ KeyType, ValueType ]>
    {
        return Entries(this);
    }

    /* eslint-enable @typescript-eslint/no-explicit-any */

    [Equal.symbol](That: Equal.Equal): boolean
    {
        return IsMutableMultiMap(That) && Equal.equals(this.Backing, That.Backing);
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

export const Make = <KeyType, ValueType>(
    ...Entries:
        | ReadonlyArray<readonly [ KeyType ]>
        | ReadonlyArray<readonly [ KeyType, ValueType ]>
        | ReadonlyArray<readonly [ KeyType, ValueType ] | readonly [ KeyType ]>
): MutableMultiMap<KeyType, ValueType> =>
{
    return FromIterable(Entries);
};

export const FromIterable = <KeyType, ValueType>(
    Entries: Iterable<readonly [ KeyType, ValueType ] | readonly [ KeyType ]>
): MutableMultiMap<KeyType, ValueType> =>
{
    const Result: MutableMultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();

    for (const Entry of Entries)
    {
        if (Entry.length === 2)
        {
            Add(Result, Entry[0], Entry[1]);
        }
        else
        {
            Add(Result, Entry[0]);
        }
    }

    return Result;
};

export const Empty = <KeyType = never, ValueType = never>(): MutableMultiMap<KeyType, ValueType> =>
{
    return new MutableMultiMap<KeyType, ValueType>(MutableHashMap.empty());
};

// public add(Key: KeyType, Value: ValueType): void
// {

// }

// public addAll(Key: KeyType, Values: Iterable<ValueType>): void
// {

// }

// public set(Key: KeyType, Values: Iterable<ValueType>): void
// {

// }

// public remove(Key: KeyType, Value: ValueType): void
// {

// }

// public removeKey(Key: KeyType): void
// {

// };

// public toggle(Key: KeyType, Value: ValueType): void
// {
//     return this.has(Self, Key, ValueType)
//         ? this.removeEntry(Self, Key, ValueType)
//         : this.addEntry(Self, Key, ValueType);
// };

// public readonly snapshot = (): MutableMultiMap<KeyType, ValueType> =>
// {
//     return fromIterable(Array.from(this.Backing).flatMap(([ Key, Value ]) =>
//         Array.from(Value).map((Element) => [ Key, Element ])));
// };

export function* Entries<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
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
    Self: MutableMultiMap<KeyType, ValueType>
): IterableIterator<[ KeyType, MutableHashSet.MutableHashSet<ValueType> ]>
{
    return HashMap.entries(HashMap.fromIterable(Self.Backing));
};

export const Keys = <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): Iterable<KeyType> =>
{
    return MutableHashMap.keys(Self.Backing);
};

export function* Values<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): IterableIterator<ValueType>
{
    for (const Values of MutableHashMap.values(Self.Backing))
    {
        for (const Value of Values)
        {
            yield Value;
        }
    }
}

export const KeySet = <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): HashSet.HashSet<KeyType> =>
{
    return HashSet.fromIterable(MutableHashMap.keys(Self.Backing));
};

export const ValueSet = <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): MutableHashSet.MutableHashSet<ValueType> =>
{
    return MutableHashSet.fromIterable(Values(Self));
};

export const ToValues = <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): Array<ValueType> =>
{
    return Array.from(Values(Self));
};

export function ToGroupedEntries<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): Array<[ KeyType, MutableHashSet.MutableHashSet<ValueType>]>
{
    return HashMap.toEntries(HashMap.fromIterable(Self.Backing));
};

export function size<KeyType, ValueType>(Self: MutableMultiMap<KeyType, ValueType>): number
{
    let Count: number = 0;

    for (const Values of MutableHashMap.values(Self.Backing))
    {
        Count += MutableHashSet.size(Values);
    }

    return Count;
};

export const keySize = <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): number =>
{
    return MutableHashMap.size(Self.Backing);
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export const valueSize: {
    <KeyType, ValueType>(Self: MutableMultiMap<KeyType, ValueType>, Key: KeyType): number;

    <KeyType, ValueType>(Self: MutableMultiMap<KeyType, ValueType>): (Key: KeyType) => number;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType
): number =>
{
    return MutableHashSet.size(GetValuesUnsafe(Self, Key));
});

export const IsEmpty = <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>
): boolean =>
{
    return MutableHashMap.isEmpty(Self.Backing);
};

export const get: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType
    ): Option.Option<MutableHashSet.MutableHashSet<ValueType>>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType) => Option.Option<MutableHashSet.MutableHashSet<ValueType>>;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType
): Option.Option<MutableHashSet.MutableHashSet<ValueType>> =>
{
    return MutableHashMap.get(Self.Backing, Key);
});

/* eslint-enable @typescript-eslint/no-explicit-any */

function GetValuesUnsafe<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType
): MutableHashSet.MutableHashSet<ValueType>
{
    const Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>> =
        MutableHashMap.get(Self.Backing, Key);

    return Option.isSome(Values)
        ? Values.value
        : MutableHashSet.empty<ValueType>();
}

export function AddEntry<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): MutableMultiMap<KeyType, ValueType>;
export function AddEntry<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType | typeof EmptyParameter = EmptyParameter
): MutableMultiMap<KeyType, ValueType>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return AddEntryBase<KeyType, ValueType>(Self, Key, Value as any);
}

function AddEntryBase<KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): MutableMultiMap<KeyType, ValueType>
{
    if (Value !== EmptyParameter)
    {
        MutableHashMap.modify(
            Self.Backing,
            Key,
            (Values: MutableHashSet.MutableHashSet<ValueType>) => MutableHashSet.add(Values, Value)
        );
    }
    else
    {
        MutableHashMap.set(Self.Backing, MutableHashSet.empty());
    }

    return Self;
}

export const Add: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType,
        Value: ValueType
    ): MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType
    ): (Value: ValueType) => MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (Value: ValueType) => MutableMultiMap<KeyType, ValueType>;
} = dual(3, AddEntry);

export const AddAll: {
    <KeyType, ValueType>(
        Key: KeyType,
        Values: Iterable<ValueType>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType,
        Values: Iterable<ValueType>
    ): MutableMultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Values: Iterable<ValueType>
): MutableMultiMap<KeyType, ValueType> =>
{
    let Result: MutableMultiMap<KeyType, ValueType> = Self;

    for (const Value of Values)
    {
        Result = AddEntryBase(Result, Key, Value);
    }

    return Result;
});

const RemoveEntry = <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): MutableMultiMap<KeyType, ValueType> =>
{
    MutableHashMap.modifyAt(
        Self.Backing,
        Key,
        (CurrentValues: Option.Option<MutableHashSet.MutableHashSet<ValueType>>) =>
        {
            if (Option.isNone(CurrentValues))
            {
                return Option.none();
            }

            const NextValues: MutableHashSet.MutableHashSet<ValueType> =
                MutableHashSet.remove(CurrentValues.value, Value);

            return MutableHashSet.size(NextValues) === 0
                ? Option.none()
                : Option.some(NextValues);
        }
    );

    return Self;
};

export const remove: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType,
        Value: ValueType
    ): MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType
    ): (Value: ValueType) => MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (Value: ValueType) => MutableMultiMap<KeyType, ValueType>;
} = dual(3, RemoveEntry);

export const RemoveKey: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType
    ): MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Key: KeyType
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType
): MutableMultiMap<KeyType, ValueType> =>
{
    MutableHashMap.remove(Self.Backing, Key);

    return Self;
});

export const RemoveMany: {
    <KeyType, ValueType>(
        Entries: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Entries: Iterable<readonly [ KeyType, ValueType ]>
    ): MutableMultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Entries: Iterable<readonly [ KeyType, ValueType ]>
): MutableMultiMap<KeyType, ValueType> =>
{
    let Result: MutableMultiMap<KeyType, ValueType> = Self;

    for (const [ Key, Value ] of Entries)
    {
        Result = RemoveEntry(Result, Key, Value);
    }

    return Result;
});

export const RemoveManyKeys: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Keys: Iterable<KeyType>
    ): MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Keys: Iterable<KeyType>) => MutableMultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Keys: Iterable<KeyType>
): MutableMultiMap<KeyType, ValueType> =>
{
    Iterable.forEach(Keys, (Key: KeyType) =>
    {
        MutableHashMap.remove(Key);
    });

    return Self;
});

export const Toggle: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType,
        ValueType: ValueType
    ): MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType, ValueType: ValueType) => MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (ValueType: ValueType) => MutableMultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): MutableMultiMap<KeyType, ValueType> =>
{
    return Has(Self, Key, Value)
        ? RemoveEntry(Self, Key, Value)
        : AddEntryBase(Self, Key, Value);
});

export const Has: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType,
        Value: ValueType
    ): boolean;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType, Value: ValueType) => boolean;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType) => (Value: ValueType) => boolean;
} = dual(3, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Value: ValueType
): boolean =>
{
    return MutableHashSet.has(GetValuesUnsafe(Self, Key), Value);
});

/* eslint-enable @typescript-eslint/no-explicit-any */

export const HasKey: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType
    ): boolean;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType) => boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType
): boolean =>
{
    return MutableHashMap.has(Self.Backing, Key);
});

export const HasValue: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Value: ValueType
    ): boolean;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Value: ValueType) => boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Value: ValueType
): boolean =>
{
    for (const Values of MutableHashMap.values(Self.Backing))
    {
        if (MutableHashSet.has(Values, Value))
        {
            return true;
        }
    }

    return false;
});

export const hasBy: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): boolean;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Predicate: (Value: ValueType, Key: KeyType) => boolean) => boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
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

export const Every: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): boolean;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Predicate: (Value: ValueType, Key: KeyType) => boolean) => boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
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
        Self: MutableMultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): boolean;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Predicate: (Value: ValueType, Key: KeyType) => boolean) => boolean;
} = hasBy;

export const FindFirst: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): Option.Option<readonly [ KeyType, ValueType ]>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ) => Option.Option<readonly [ KeyType, ValueType ]>;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
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

export const CountBy: {
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): number;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Predicate: (Value: ValueType, Key: KeyType) => boolean) => number;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
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

function ToValueSet<ValueType>(
    Values: Iterable<ValueType>
): MutableHashSet.MutableHashSet<ValueType>
{
    return MutableHashSet.fromIterable(Values);
}

const SetValues = <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Values: Iterable<ValueType> | Option.None<ValueType>
): MutableMultiMap<KeyType, ValueType> =>
{
    const ValueSet: MutableHashSet.MutableHashSet<ValueType> =
        Option.isOption(Values) && Option.isNone(Values)
            ? MutableHashSet.empty()
            : ToValueSet(Values);

    if (MutableHashSet.size(ValueSet) === 0)
    {
        MutableHashMap.remove(Self.Backing, Key);
        return Self;
    }

    MutableHashMap.set(Self.Backing, Key, ValueSet);

    return Self;
};

export const Set: {
    <KeyType, ValueType>(
        Key: KeyType,
        Values: Iterable<ValueType> | Option.None<ValueType>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ): (Key: KeyType, Values: | Iterable<ValueType> | Option.None<ValueType>) =>
    MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType,
        Values:
            | Iterable<ValueType>
            | Option.None<ValueType>
    ): MutableMultiMap<KeyType, ValueType>;
} = dual(3, SetValues);

export const Modify: {
    <KeyType, ValueType>(
        Key: KeyType,
        Function: (Values: MutableHashSet.MutableHashSet<ValueType>) => Iterable<ValueType>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType,
        Function: (Values: MutableHashSet.MutableHashSet<ValueType>) => Iterable<ValueType>
    ): MutableMultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Function: (
        Values: MutableHashSet.MutableHashSet<ValueType>
    ) => Iterable<ValueType>
): MutableMultiMap<KeyType, ValueType> =>
{
    return ModifyAt(Self, Key, Option.match({
        onNone: Option.none,
        onSome: flow(Function, MutableHashSet.fromIterable, Option.some)
    }));
});

export const ModifyAt: {
    <KeyType, ValueType>(
        Key: KeyType,
        Function: (
            Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
        ) => Option.Option<Iterable<ValueType>>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Key: KeyType,
        Function: (
            Value: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
        ) => Option.Option<Iterable<ValueType>>
    ): MutableMultiMap<KeyType, ValueType>;
} = dual(3, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Key: KeyType,
    Function: (
        Values: Option.Option<MutableHashSet.MutableHashSet<ValueType>>
    ) => Option.Option<Iterable<ValueType>>
): MutableMultiMap<KeyType, ValueType> =>
{
    MutableHashMap.modifyAt(Self.Backing, Key,
        (CurrentValues: Option.Option<MutableHashSet.MutableHashSet<ValueType>>) =>
        {
            if (Option.isSome(CurrentValues))
            {
                const NextValues: Option.Option<Iterable<ValueType>> = Function(CurrentValues);

                return Option.match(NextValues, {
                    onNone: () => Option.none(),
                    onSome: (Value: Iterable<ValueType>) =>
                        Option.some(MutableHashSet.fromIterable(Value))
                });
            }
            else
            {
                return Option.none();
            }
        }
    );

    return Self;
});

export const Filter: {
    <KeyType, ValueType>(
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): MutableMultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): MutableMultiMap<KeyType, ValueType> =>
{
    let Result: MutableMultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();

    for (const [ Key, Value ] of Entries(Self))
    {
        if (Predicate(Value, Key))
        {
            Result = AddEntry(Result, Key, Value);
        }
    }

    return Result;
});

export const filterMap
: {
    <KeyA, ValueA, KeyB, ValueB>(
        Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [KeyB, ValueB]>
    ): (Self: MutableMultiMap<KeyA, ValueA>) => MutableMultiMap<KeyB, ValueB>;

    <KeyA, ValueA, KeyB, ValueB>(
        Self: MutableMultiMap<KeyA, ValueA>,
        Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [KeyB, ValueB]>
    ): MutableMultiMap<KeyB, ValueB>;
} = dual(2, <KeyA, ValueA, KeyB, ValueB>(
    Self: MutableMultiMap<KeyA, ValueA>,
    Function: (Value: ValueA, Key: KeyA) => Option.Option<readonly [ KeyB, ValueB ]>
): MutableMultiMap<KeyB, ValueB> =>
{
    let Result: MutableMultiMap<KeyB, ValueB> = Empty<KeyB, ValueB>();

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
    Self: MutableMultiMap<KeyType, Option.Option<ValueType>>
): MutableMultiMap<KeyType, ValueType> =>
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
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueB>;
    <KeyType, ValueType, ValueB>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => ValueB
    ): MutableMultiMap<KeyType, ValueB>;
} = dual(2, <KeyType, ValueType, ValueB>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => ValueB
): MutableMultiMap<KeyType, ValueB> =>
{
    let Result: MutableMultiMap<KeyType, ValueB> = Empty<KeyType, ValueB>();

    for (const [ Key, Value ] of Entries(Self))
    {
        Result = AddEntry(Result, Key, Function(Value, Key));
    }

    return Result;
});

export const mapKeys: {
    <KeyType, ValueType, KeyB>(
        Function: (Key: KeyType, Values: MutableHashSet.MutableHashSet<ValueType>) => KeyB
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyB, ValueType>;

    <KeyType, ValueType, KeyB>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Function: (Key: KeyType, Values: MutableHashSet.MutableHashSet<ValueType>) => KeyB
    ): MutableMultiMap<KeyB, ValueType>;
} = dual(2, <KeyType, ValueType, KeyB>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Function: (Key: KeyType, Values: MutableHashSet.MutableHashSet<ValueType>) => KeyB
): MutableMultiMap<KeyB, ValueType> =>
{
    let Result: MutableMultiMap<KeyB, ValueType> = Empty<KeyB, ValueType>();

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
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyB, ValueB>;
    <KeyType, ValueType, KeyB, ValueB>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => Iterable<readonly [ KeyB, ValueB ]>
    ): MutableMultiMap<KeyB, ValueB>;
} = dual(2, <KeyType, ValueType, KeyB, ValueB>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => Iterable<readonly [ KeyB, ValueB ]>
): MutableMultiMap<KeyB, ValueB> =>
{
    let Result: MutableMultiMap<KeyB, ValueB> = Empty<KeyB, ValueB>();

    for (const [ Key, Value ] of Entries(Self))
    {
        Result = union(Result, Function(Value, Key));
    }

    return Result;
});

export const flatMapValues: {
    <KeyType, ValueType, ValueB>(
        Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueB>;
    <KeyType, ValueType, ValueB>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
    ): MutableMultiMap<KeyType, ValueB>;
} = dual(2, <KeyType, ValueType, ValueB>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => Iterable<ValueB>
): MutableMultiMap<KeyType, ValueB> =>
{
    let Result: MutableMultiMap<KeyType, ValueB> = Empty<KeyType, ValueB>();

    for (const [ Key, Value ] of Entries(Self))
    {
        for (const NextValueType of Function(Value, Key))
        {
            Result = AddEntry(Result, Key, NextValueType);
        }
    }

    return Result;
});

export const reduce: {
    <KeyType, ValueType, Accumulator>(
        Initial: Accumulator,
        Function: (Accumulator: Accumulator, ValueType: ValueType, Key: KeyType) => Accumulator
    ): (Self: MutableMultiMap<KeyType, ValueType>) => Accumulator;
    <KeyType, ValueType, Accumulator>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Initial: Accumulator,
        Function: (Accumulator: Accumulator, ValueType: ValueType, Key: KeyType) => Accumulator
    ): Accumulator;
} = dual(3, <KeyType, ValueType, Accumulator>(
    Self: MutableMultiMap<KeyType, ValueType>,
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

export const forEach: {
    <KeyType, ValueType>(
        Function: (Value: ValueType, Key: KeyType) => void
    ): (Self: MutableMultiMap<KeyType, ValueType>) => void;
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Function: (Value: ValueType, Key: KeyType) => void
    ): void;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Function: (Value: ValueType, Key: KeyType) => void
): void =>
{
    for (const [ Key, Value ] of Entries(Self))
    {
        Function(Value, Key);
    }
});

export const union: {
    <KeyB, ValueB>(
        That: Iterable<readonly [KeyB, ValueB]>
    ): <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>
    ) => MutableMultiMap<KeyType | KeyB, ValueType | ValueB>;
    <KeyType, ValueType, KeyB, ValueB>(
        Self: MutableMultiMap<KeyType, ValueType>,
        That: Iterable<readonly [KeyB, ValueB]>
    ): MutableMultiMap<KeyType | KeyB, ValueType | ValueB>;
} = dual(2, <KeyType, ValueType, KeyB, ValueB>(
    Self: MutableMultiMap<KeyType, ValueType>,
    That: Iterable<readonly [KeyB, ValueB]>
): MutableMultiMap<KeyType | KeyB, ValueType | ValueB> =>
{
    const Result: MutableMultiMap<KeyType | KeyB, ValueType | ValueB> =
        Self as MutableMultiMap<KeyType | KeyB, ValueType | ValueB>;

    for (const [ Key, Value ] of That)
    {
        AddEntry(Result, Key, Value);
    }

    return Result;
});

export const intersection: {
    <KeyType, ValueType>(
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): MutableMultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    That: Iterable<readonly [ KeyType, ValueType ]>
): MutableMultiMap<KeyType, ValueType> =>
{
    const ThatMutableMultiMap: MutableMultiMap<KeyType, ValueType> =
        IsMutableMultiMap<KeyType, ValueType>(That)
            ? That
            : FromIterable(That);

    const Result: MutableMultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();

    for (const [ Key, Value ] of Entries(Self))
    {
        if (Has(ThatMutableMultiMap, Key, Value))
        {
            AddEntry(Result, Key, Value);
        }
    }

    return Result;
});

export const difference: {
    <KeyType, ValueType>(
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => MutableMultiMap<KeyType, ValueType>;

    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): MutableMultiMap<KeyType, ValueType>;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    That: Iterable<readonly [ KeyType, ValueType ]>
): MutableMultiMap<KeyType, ValueType> =>
{
    for (const [ Key, Value ] of That)
    {
        RemoveEntry(Self, Key, Value);
    }

    return Self;
});

export const isSubset: {
    <KeyType, ValueType>(
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): (Self: MutableMultiMap<KeyType, ValueType>) => boolean;
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        That: Iterable<readonly [ KeyType, ValueType ]>
    ): boolean;
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    That: Iterable<readonly [ KeyType, ValueType ]>
): boolean =>
{
    const ThatMutableMultiMap: MutableMultiMap<KeyType, ValueType> =
        IsMutableMultiMap<KeyType, ValueType>(That)
            ? That
            : FromIterable(That);

    return Every(Self, (Value: ValueType, Key: KeyType) => Has(ThatMutableMultiMap, Key, Value));
});

export const Partition: {
    <KeyType, ValueType>(
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): (Self: MutableMultiMap<KeyType, ValueType>) => [
        Excluded: MutableMultiMap<KeyType, ValueType>,
        Satisfying: MutableMultiMap<KeyType, ValueType>
    ];
    <KeyType, ValueType>(
        Self: MutableMultiMap<KeyType, ValueType>,
        Predicate: (Value: ValueType, Key: KeyType) => boolean
    ): [
        Excluded: MutableMultiMap<KeyType, ValueType>,
        Satisfying: MutableMultiMap<KeyType, ValueType>
    ];
} = dual(2, <KeyType, ValueType>(
    Self: MutableMultiMap<KeyType, ValueType>,
    Predicate: (Value: ValueType, Key: KeyType) => boolean
): [ Excluded: MutableMultiMap<KeyType, ValueType>, Satisfying: MutableMultiMap<KeyType, ValueType> ] =>
{
    const Excluded: MutableMultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();
    const Satisfying: MutableMultiMap<KeyType, ValueType> = Empty<KeyType, ValueType>();

    for (const [ Key, Value ] of Entries(Self))
    {
        if (Predicate(Value, Key))
        {
            AddEntry(Satisfying, Key, Value);
        }
        else
        {
            AddEntry(Excluded, Key, Value);
        }
    }

    return [ Excluded, Satisfying ];
});
