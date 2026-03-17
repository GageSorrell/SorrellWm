/* File:      Object.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TRecord } from "@sorrellwm/windows";

type FKeyType = string | symbol;

export type SUnknownObject =
    | TRecord<FKeyType, unknown>
    | SObject<FKeyType, unknown>;

type TObjectCopyConstructorArgument<
    NewKeyType extends FKeyType,
    NewPropertyType,
    OldKeyType extends NewKeyType = NewKeyType,
    OldPropertyType extends NewPropertyType = NewPropertyType
> =
    SObjectClass<OldKeyType, OldPropertyType>;

type TObjectPlainConstructorArgument<
    NewKeyType extends FKeyType,
    NewPropertyType,
    OldKeyType extends NewKeyType = NewKeyType,
    OldPropertyType extends NewPropertyType = NewPropertyType
> =
    TRecord<OldKeyType, OldPropertyType>;

type TConstructorArgument<
    NewKeyType extends FKeyType,
    NewPropertyType,
    OldKeyType extends NewKeyType = NewKeyType,
    OldPropertyType extends NewPropertyType = NewPropertyType
> =
    | TObjectPlainConstructorArgument<NewKeyType, NewPropertyType, OldKeyType, OldPropertyType>
    | TObjectCopyConstructorArgument<NewKeyType, NewPropertyType, OldKeyType, OldPropertyType>;

export type SObject<
    KeyType extends FKeyType,
    PropertyType
> =
    SObjectClass<KeyType, PropertyType> &
    TRecord<KeyType, PropertyType>;

export type TMapCallbackArgument<
    KeyType extends FKeyType,
    OldPropertyType,
    KeyParameterType extends KeyType = KeyType
> =
{
    Key: KeyParameterType;
    Property: SObject<KeyType, OldPropertyType>[KeyParameterType];
    Index: number;
    This: SObject<KeyType, OldPropertyType>;
};

export type TMapCallback<
    KeyType extends FKeyType,
    OldPropertyType,
    NewPropertyType = unknown,
    ReturnRecordType extends TRecord<KeyType, NewPropertyType> = SObject<KeyType, NewPropertyType>
> =
    <KeyParameterType extends KeyType>(
        Argument: TMapCallbackArgument<KeyType, OldPropertyType, KeyParameterType>
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

export type TMapStructuredCallbackArgument<
    KeyType extends FKeyType,
    OldPropertyType,
    KeyParameterType extends KeyType = KeyType
> =
{
    Key: KeyParameterType;
    Property: SObject<KeyType, OldPropertyType>[KeyParameterType];
    Index: number;
    This: SObject<KeyType, OldPropertyType>;
};

export type TMapStructuredCallback<
    KeyType extends FKeyType,
    OldPropertyType,
    NewPropertyType = unknown,
    ReturnValueType extends TRecord<KeyType, NewPropertyType> = SObject<KeyType, NewPropertyType>
> =
    <KeyParameterType extends KeyType>(
        Argument: TMapCallbackArgument<KeyType, OldPropertyType, KeyParameterType>
    ) => ReturnValueType;

export class SObjectClass<KeyType extends FKeyType = FKeyType, PropertyType = unknown>
{
    public constructor(Other: TObjectCopyConstructorArgument<KeyType, PropertyType>);
    /** Accept a plain JavaScript object, duplicate it to construct this. */
    public constructor(PlainObject: TObjectPlainConstructorArgument<KeyType, PropertyType>);
    public constructor(In: TConstructorArgument<KeyType, PropertyType>)
    {

    }

    /**
     * Handled by the `Proxy` object created in the ctor, there should also be:
     * `get` : (Path: PathType) => TTypeFromPath<PathType>
     * `set` : (Path: PathType, Value: TTypeFromPath<PathType>) => void
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

    // /** @Returns A copy of the underlying vanilla JavaScript object. */
    // public GetPlainCopy(): Record<KeyType, PropertyType>
    // {

    // }

    /* eslint-disable @stylistic/max-len */
    /**
     * @Todo Write this.
     * @param Callback
     * @returns
     */
    // public Map<NewPropertyType, ReturnValueType extends TRecord<KeyType, NewPropertyType> = TRecord<KeyType, NewPropertyType>>(
    //     Callback: TMapCallback<KeyType, PropertyType, NewPropertyType, ReturnValueType>
    // ): SObject<KeyType, NewPropertyType>
    // {
    // /* eslint-enable @stylistic/max-len */
    //     return { } as SObject<KeyType, NewPropertyType>;
    // }

    /**
     * @Todo Write this.
     */
    // public ForEach(Callback: TForEachCallback<KeyType, PropertyType>): void
    // {
    //     return;
    // }

    /* eslint-disable @stylistic/max-len */
    /**
     * @Todo Write this.
     * @Returns
     */
    // public MapStructured<NewPropertyType, ReturnValueType extends TRecord<KeyType, NewPropertyType> = TRecord<KeyType, NewPropertyType>>(
    //     Callback: TMapCallback<KeyType, PropertyType, NewPropertyType, ReturnValueType>
    // ): SObject<KeyType, NewPropertyType>
    // {
    // /* eslint-enable @stylistic/max-len */

    //     return { } as SObject<KeyType, NewPropertyType>;
    // }

    // private GetProperty<PathType extends TPath<SObject<KeyType, PropertyType>>>(
    //     Path: PathType
    // ): TTypeFromPath<SObject<KeyType, PropertyType>, PathType>
    // {
    //     // return as TTypeFromPath<SObject<KeyType, PropertyType>, PathType>;
    // }
};

// const Foo: SObjectClass<string, string> = new SObjectClass<string, string>();
// const Bar: SObjectClass = new SObjectClass();

// const _Baz: number = Foo * Bar;

// /** Extends `SObject` but calls `freeze()` and overrides all mutating functions to throw an error. */
// class SConstObject<KeyType extends FKeyType, PropertyType> extends SObjectClass<KeyType, PropertyType>
// {

// };
