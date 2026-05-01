/**
 * @file      Object.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TRecord } from "@sorrell/wm-windows";
import { GetPropertyFromPath, SetPropertyFromPath } from "../Utility";

type FKeyType = string | symbol;

export type SUnknownObject =
    | TRecord<FKeyType, unknown>
    | SObject<FKeyType, unknown>;

type TObjectCopyConstructorArgument<
    KeyType extends FKeyType,
    PropertyType
> =
    SObjectClass<KeyType, PropertyType>;

type TObjectPlainConstructorArgument<KeyType extends FKeyType, PropertyType> = TRecord<KeyType, PropertyType>;

type TConstructorArgument<KeyType extends FKeyType, PropertyType> =
    | TObjectPlainConstructorArgument<KeyType, PropertyType>
    | TObjectCopyConstructorArgument<KeyType, PropertyType>;

export type SObject<KeyType extends FKeyType = FKeyType, PropertyType = unknown> =
    SObjectClass<KeyType, PropertyType> &
    TRecord<KeyType, PropertyType>;

export type TMapCallbackArgument<
    KeyType extends FKeyType,
    OldPropertyType,
    NewPropertyType,
    ReturnRecordType extends TRecord<KeyType, NewPropertyType>,
    KeyParameterType extends keyof ReturnRecordType
> =
{
    Key: KeyParameterType;
    Property: KeyParameterType extends KeyType
        ? SObject<KeyType, OldPropertyType>[Extract<KeyParameterType, KeyType>]
        : never;
    Index: number;
    This: SObject<KeyType, OldPropertyType>;
};

export type TMapCallback<
    KeyType extends FKeyType,
    OldPropertyType,
    NewPropertyType = unknown,
    ReturnRecordType extends TRecord<KeyType, NewPropertyType> = TRecord<KeyType, NewPropertyType>
> =
    <KeyParameterType extends keyof ReturnRecordType>(
        Argument: TMapCallbackArgument<KeyType, OldPropertyType, NewPropertyType, ReturnRecordType, KeyParameterType>
    ) => ReturnRecordType[KeyParameterType];

export type TForEachCallbackArgument<
    KeyType extends FKeyType,
    PropertyType,
    KeyParameterType extends KeyType = KeyType
> =
{
    Key: KeyParameterType;
    Property: SObject<KeyType, PropertyType>[KeyParameterType];
    Index: number;
    This: SObject<KeyType, PropertyType>;
};

export type TForEachCallback<KeyType extends FKeyType, PropertyType> =
    <KeyParameterType extends KeyType = KeyType>(
        Callback: TForEachCallbackArgument<KeyType, PropertyType, KeyParameterType>
    ) => void;

export type TMapStructuredCallbackArgument<KeyType extends FKeyType, PropertyType> =
{
    Key: PropertyKey;
    Property: unknown;
    Depth: number;
    Index: number;
    This: SObject<KeyType, PropertyType>;
};

export type TMapStructuredCallback<
    KeyType extends FKeyType,
    OldPropertyType,
    NewPropertyType
> =
    (Argument: TMapStructuredCallbackArgument<KeyType, OldPropertyType>) => NewPropertyType;

// export class SObjectClass<KeyType extends FKeyType = FKeyType, PropertyType = unknown>
class SObjectClass<KeyType extends FKeyType = FKeyType, PropertyType = unknown>
{
    private declare __Record__: Record<KeyType, PropertyType>;
    private __RecordKey__: "__Record__" = "__Record__" as const;

    public constructor(Other: TObjectCopyConstructorArgument<KeyType, PropertyType>);
    /** Accept a plain JavaScript object, duplicate it to construct this. */
    public constructor(PlainObject: TObjectPlainConstructorArgument<KeyType, PropertyType>);
    public constructor(In: TConstructorArgument<KeyType, PropertyType>);
    public constructor(In: TConstructorArgument<KeyType, PropertyType>)
    {
        const InRecord: TRecord<KeyType, PropertyType> =
            In === undefined
                ? { } as TRecord<KeyType, PropertyType>
                : In instanceof SObjectClass
                    ? In.GetPlainCopy()
                    : In;

        const RecordObject =
            Object.assign(
                Object.create(null),
                InRecord
            ) as TRecord<KeyType, PropertyType>;

        Object.defineProperty(
            this,
            this.__RecordKey__,
            {
                value: RecordObject,
                writable: false,
                enumerable: false,
                configurable: true
            }
        );

        const Handler: ProxyHandler<this> =
        {
            get: (Target, Property) =>
            {
                if (Property === this.__RecordKey__)
                {
                    return undefined;
                }

                if (Reflect.has(Target, Property))
                {
                    const Value =
                        Reflect.get(
                            Target,
                            Property,
                            Target
                        );

                    if (typeof Value === "function")
                    {
                        return Value.bind(Target);
                    }

                    return Value;
                }

                return (Target.__Record__ as Record<PropertyKey, PropertyType>)[Property];
            },

            set: (Target, Property, Value) =>
            {
                if (Property === this.__RecordKey__)
                {
                    return false;
                }

                if (Reflect.has(Target, Property))
                {
                    return Reflect.set(
                        Target,
                        Property,
                        Value,
                        Target
                    );
                }

                (Target.__Record__ as Record<PropertyKey, PropertyType>)[Property] =
                    Value as PropertyType;

                return true;
            },

            has: (Target, Property) =>
            {
                if (Property === this.__RecordKey__)
                {
                    return false;
                }

                return Reflect.has(Target, Property)
                    || Object.prototype.hasOwnProperty.call(Target.__Record__, Property);
            },

            deleteProperty: (Target, Property) =>
            {
                if (Property === this.__RecordKey__)
                {
                    return false;
                }

                if (Object.prototype.hasOwnProperty.call(Target.__Record__, Property))
                {
                    return delete (Target.__Record__ as Record<PropertyKey, PropertyType>)[Property];
                }

                if (Object.prototype.hasOwnProperty.call(Target, Property))
                {
                    return Reflect.deleteProperty(Target, Property);
                }

                return true;
            },

            ownKeys: (Target) =>
            {
                return Reflect.ownKeys(Target.__Record__ as object);
            },

            getOwnPropertyDescriptor: (Target, Property) =>
            {
                if (Property === this.__RecordKey__)
                {
                    return undefined;
                }

                if (Object.prototype.hasOwnProperty.call(Target.__Record__, Property))
                {
                    return {
                        value: (Target.__Record__ as Record<PropertyKey, PropertyType>)[Property],
                        writable: true,
                        enumerable: true,
                        configurable: true
                    };
                }

                return Reflect.getOwnPropertyDescriptor(Target, Property);
            },

            defineProperty: (Target, Property, Descriptor) =>
            {
                if (Property === this.__RecordKey__)
                {
                    return false;
                }

                if (Reflect.has(Target, Property))
                {
                    return Reflect.defineProperty(Target, Property, Descriptor);
                }

                if ("get" in Descriptor || "set" in Descriptor)
                {
                    return false;
                }

                Object.defineProperty(
                    Target.__Record__ as object,
                    Property,
                    {
                        value: Descriptor.value as PropertyType,
                        writable: Descriptor.writable ?? true,
                        enumerable: Descriptor.enumerable ?? true,
                        configurable: Descriptor.configurable ?? true
                    }
                );

                return true;
            }
        };

        return new Proxy(this, Handler);
    }

    /**
     * Handled by the `Proxy` object created in the ctor, there should also be:
     * `get` : (Path: PathType) => TGetType<PathType>
     * `set` : (Path: PathType, Value: TGetType<PathType>) => void
     * `has` : (Path: PathType) => boolean
     *
     * As well as properties that allow for `for..in` and `for..of`.
     *
     * Via the `boperator` package, overload,
     *     * `&&` to give the intersection of two records:
     *         * Equality check will be done by checking for strict equality of key names *and*
     *           strict equality of property values.
     *         * `&&=` to remove keys from LHS, rather than producing new SRecord
     *     * `==` to give equality of two `SRecords` via `==` on key names and property values.
     *         * `!=` should also be overloaded; will just negate the result of the `==` overload.
     *     * `||` to merge objects (pure, returns new SRecord) (@Todo decide best strategy for key collisions)
     *     * `||=` to merge objects (adds properties of RHS to LHS)
     *     * `-` for set difference via keys (pure, returns new SRecord)
     *     * `-=` for set difference via keys (not pure, removes keys from LHS)
     *     * `??` allows for LHS to be nullish, and returns RHS iff LHS is nullish
     */

    /** @Returns A copy of the underlying vanilla JavaScript object. */
    public GetPlainCopy(): TRecord<KeyType, PropertyType>
    {
        return { ...this.__Record__ };
    }

    /* eslint-disable @stylistic/max-len */
    /**
     * @Todo Write this.
     * @param Callback
     * @returns
     */
    public Map<NewPropertyType, ReturnValueType extends TRecord<KeyType, NewPropertyType> = TRecord<KeyType, NewPropertyType>>(
        Callback: TMapCallback<KeyType, PropertyType, NewPropertyType, ReturnValueType>
    ): SObject<KeyType, NewPropertyType>
    {
    /* eslint-enable @stylistic/max-len */
        const Out: Partial<TRecord<KeyType, NewPropertyType>> = { };

        const Keys: Array<KeyType> = Object.keys(this.__Record__) as Array<KeyType>;

        type FEntry = [ KeyType, NewPropertyType ];

        const GetProperty = (Key: KeyType, Index: number): FEntry =>
        {
            type FProperty = TMapCallbackArgument<KeyType, PropertyType, NewPropertyType, ReturnValueType, KeyType>["Property"];
            const Property: NewPropertyType = Callback({
                Key,
                Index,
                Property: ((this as any)[Key] as FProperty),
                This: (this as SObject<KeyType, PropertyType>) }
            ) as NewPropertyType;

            return [ Key, Property ];
        };

        const Entries: Array<FEntry> = Keys.map(GetProperty);

        const AssignProperty = ([ Key, Value ]: FEntry): void =>
        {
            Out[Key] = Value;
        };

        Entries.forEach(AssignProperty);

        return new SObjectClass<KeyType, NewPropertyType>(
            Out as TRecord<KeyType, NewPropertyType>
        ) as SObject<KeyType, NewPropertyType>;
    }

    /**
     * @Todo Write this.
     */
    public ForEach(Callback: TForEachCallback<KeyType, PropertyType>): void
    {
        const GetCallbackArgument = ([ Key, Property ]: [ string, unknown ], Index: number): TForEachCallbackArgument<KeyType, PropertyType> =>
        {
            return {
                Key: (Key as KeyType),
                Index,
                Property: (Property as TForEachCallbackArgument<KeyType, PropertyType>["Property"]),
                This: (this as SObject<KeyType, PropertyType>)
            };
        };

        Object.entries(this.__Record__).map(GetCallbackArgument).forEach(Callback);
    }

    private static IsRecord<TestKeyType extends PropertyKey, TestPropertyType>(
        In: unknown
    ): In is TRecord<TestKeyType, TestPropertyType>
    {
        if (typeof In !== "object" || In === null)
        {
            return false;
        }

        if (Array.isArray(In))
        {
            return false;
        }

        const Prototype: unknown = Object.getPrototypeOf(In);

        return Prototype === Object.prototype || Prototype === null;
    }

    /**
     * @Todo Write this.
     * @Returns
     */
    public MapStructured<NewKeyType extends KeyType, NewPropertyType>(
        Callback: TMapStructuredCallback<KeyType, PropertyType, NewPropertyType>
    ): SObject<NewKeyType, NewPropertyType>
    {
        const Out: Partial<TRecord<NewKeyType, NewPropertyType>> = { };

        const Recurrence = (In: unknown, Path: string = "", Depth: number = 0): void =>
        {
            if (SObjectClass.IsRecord(In))
            {
                type FKey = Extract<keyof typeof In, string>;
                const Keys: Array<FKey> = Object.keys(In) as Array<FKey>;

                type FEntry = [ Path: string, Property: NewPropertyType ];

                const GetProperty = (Key: FKey, Index: number): FEntry =>
                {
                    const Property: NewPropertyType = Callback({
                        Key,
                        Depth,
                        Index,
                        Property: (In as any)[Key],
                        This: (this as SObject<KeyType, PropertyType>) }
                    ) as NewPropertyType;

                    const OutPath: string = Path === ""
                        ? Key
                        : `${ Path }.${ Key }`;

                    return [ OutPath, Property ];
                };

                const Entries: Array<FEntry> = Keys.filter(Key => typeof Key === "string").map(GetProperty);

                const AssignProperty = ([ OutPath, Value ]: FEntry): void =>
                {
                    SetPropertyFromPath({ Ref: Out }, OutPath as any, Value as any);
                };

                Entries.forEach(AssignProperty);

                const RecurseOnRecordChildren = ([ OutPath ]: FEntry): void =>
                {
                    const Child: unknown = GetPropertyFromPath({ Ref: Out }, OutPath as any);
                    Recurrence(Child, OutPath, Depth + 1);
                };

                Entries.forEach(RecurseOnRecordChildren);
            }
        };

        Recurrence(this.__Record__);

        return new SObjectClass<NewKeyType, NewPropertyType>(
            Out as TRecord<NewKeyType, NewPropertyType>
        ) as SObject<NewKeyType, NewPropertyType>;
    }
};

export const NewObject = <KeyType extends FKeyType = FKeyType, PropertyType = unknown>(
    In: TConstructorArgument<KeyType, PropertyType>
): SObject<KeyType, PropertyType> =>
{
    return new SObjectClass<KeyType, PropertyType>(In) as SObject<KeyType, PropertyType>;
};

// /** Extends `SObject` but calls `freeze()` and overrides all mutating functions to throw an error. */
// class SConstObject<KeyType extends FKeyType, PropertyType> extends SObjectClass<KeyType, PropertyType>
// {

// };
