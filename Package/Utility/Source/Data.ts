/**
 *
 *
 * @module @sorrell/utility/Data
 *
 * @file      Data.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data, Predicate } from "effect";
import type { Cause, Types } from "effect";
import type { Unify } from "effect/Unify";

/**
 * A property key used to nominally identify every member of a tagged enum.
 */
export type PropertyKey = string | symbol;

/**
 * Transforms a record of variant definitions into a discriminated union whose
 * members also carry the supplied nominal `TypeId` property.
 */
export type TaggedEnum<
    A extends Record<string, Record<string, any>> & UntaggedChildren<A>,
    Identifier extends PropertyKey
> = keyof A extends infer Tag
    ? Tag extends keyof A
        ? Types.Simplify<
            { readonly _tag: Tag }
            & { readonly [Key in Identifier]: Identifier }
            & { readonly [Key in keyof A[Tag]]: A[Tag][Key] }
        >
        : never
    : never;

type ChildrenAreTagged<A> = keyof A extends infer Key
    ? Key extends keyof A
        ? "_tag" extends keyof A[Key] ? true : false
        : never
    : never;

type UntaggedChildren<A> = true extends ChildrenAreTagged<A>
    ? "One or more tagged enum members already has a `_tag` property."
    : unknown;

/** Types used by {@link TaggedEnum} and {@link taggedEnum}. */
export declare namespace TaggedEnum
{
    /** The common higher-kinded shape behind generic tagged-enum definitions. */
    export interface GenericDefinition
    {
        readonly taggedEnum: { readonly _tag: string };
        readonly numberOfGenerics: number;
        readonly TypeId: PropertyKey;

        readonly A: unknown;
        readonly B: unknown;
        readonly C: unknown;
        readonly D: unknown;
    }

    /** A generic tagged-enum definition supporting up to four type parameters. */
    export interface WithGenerics<Count extends number, Identifier extends PropertyKey>
        extends GenericDefinition
    {
        readonly taggedEnum: { readonly _tag: string }
            & { readonly [Key in Identifier]: Identifier };
        readonly numberOfGenerics: Count;
        readonly TypeId: Identifier;

        readonly A: unknown;
        readonly B: unknown;
        readonly C: unknown;
        readonly D: unknown;
    }

    /** Applies concrete type arguments to a generic tagged-enum definition. */
    export type Kind<
        Definition extends GenericDefinition,
        A = unknown,
        Second = unknown,
        Third = unknown,
        Fourth = unknown
    > = (Definition & {
        readonly A: A;
        readonly B: Second;
        readonly C: Third;
        readonly D: Fourth;
    })["taggedEnum"];

    /** Infers the nominal key shared by all members of a tagged enum. */
    export type TypeIdOf<A extends { readonly _tag: string }> = Exclude<{
        readonly [Key in keyof A]: Key extends PropertyKey
            ? A extends { readonly [Property in Key]: Key } ? Key : never
            : never;
    }[keyof A], "_tag">;

    /** Constructor arguments for one enum member, excluding its generated properties. */
    export type Args<
        A extends { readonly _tag: string },
        Tag extends A["_tag"],
        Identifier extends PropertyKey = TypeIdOf<A>,
        EnumValue = Extract<A, { readonly _tag: Tag }>
    > = {
        readonly [Key in keyof EnumValue as Key extends "_tag" | Identifier
            ? never
            : Key]: EnumValue[Key];
    } extends infer Result ? Types.VoidIfEmpty<Result> : never;

    /** Extracts a single member from a tagged enum. */
    export type Value<
        A extends { readonly _tag: string },
        Tag extends A["_tag"]
    > = Extract<A, { readonly _tag: Tag }>;

    /** A function which constructs one enum member. */
    export type ConstructorFrom<A, GeneratedKey extends keyof A = never> = (
        Args: Types.VoidIfEmpty<{
            readonly [Key in keyof A as Key extends GeneratedKey ? never : Key]: A[Key];
        }>
    ) => A;

    /** Constructors and matchers returned for a non-generic tagged enum. */
    export type Constructor<
        A extends { readonly _tag: string },
        Identifier extends PropertyKey = TypeIdOf<A>
    > = Types.Simplify<{
        readonly [Tag in A["_tag"]]: ConstructorFrom<
            Extract<A, { readonly _tag: Tag }>,
            Extract<"_tag" | Identifier, keyof Extract<A, { readonly _tag: Tag }>>
        >;
    } & {
        readonly $is: <Tag extends A["_tag"]>(
            Tag: Tag
        ) => (Value: unknown) => Value is Extract<A, { readonly _tag: Tag }>;
        readonly $isA: (Value: unknown) => Value is A;
        readonly $match: {
            <Cases extends {
                readonly [Tag in A["_tag"]]: (
                    Args: Extract<A, { readonly _tag: Tag }>
                ) => any;
            }>(
                Cases: Cases
            ): (Value: A) => Unify<ReturnType<Cases[A["_tag"]]>>;
            <Cases extends {
                readonly [Tag in A["_tag"]]: (
                    Args: Extract<A, { readonly _tag: Tag }>
                ) => any;
            }>(
                Value: A,
                Cases: Cases
            ): Unify<ReturnType<Cases[A["_tag"]]>>;
        };
    }>;

    /** Matchers returned for a generic tagged enum. */
    export interface GenericMatchers<Definition extends GenericDefinition>
    {
        readonly $is: Data.TaggedEnum.GenericMatchers<Definition>["$is"];
        readonly $isA: (Value: unknown) => Value is Kind<Definition>;
        readonly $match: {
            <
                A,
                Second,
                Third,
                Fourth,
                Cases extends {
                    readonly [Tag in Definition["taggedEnum"]["_tag"]]: (
                        Args: Extract<
                            Kind<Definition, A, Second, Third, Fourth>,
                            { readonly _tag: Tag }
                        >
                    ) => any;
                }
            >(
                Cases: Cases
            ): (
                Value: Kind<Definition, A, Second, Third, Fourth>
            ) => Unify<ReturnType<Cases[Definition["taggedEnum"]["_tag"]]>>;
            <
                A,
                Second,
                Third,
                Fourth,
                Cases extends {
                    readonly [Tag in Definition["taggedEnum"]["_tag"]]: (
                        Args: Extract<
                            Kind<Definition, A, Second, Third, Fourth>,
                            { readonly _tag: Tag }
                        >
                    ) => any;
                }
            >(
                Value: Kind<Definition, A, Second, Third, Fourth>,
                Cases: Cases
            ): Unify<ReturnType<Cases[Definition["taggedEnum"]["_tag"]]>>;
        };
    }
}

/** Constructor bundle for a higher-kinded tagged-enum definition. */
type GenericConstructor<Definition extends TaggedEnum.GenericDefinition> = Types.Simplify<{
    readonly [Tag in Definition["taggedEnum"]["_tag"]]: <A, Second, Third, Fourth>(
        Args: TaggedEnum.Args<
            TaggedEnum.Kind<Definition, A, Second, Third, Fourth>,
            Tag
        >
    ) => TaggedEnum.Value<TaggedEnum.Kind<Definition, A, Second, Third, Fourth>, Tag>;
} & TaggedEnum.GenericMatchers<Definition>>;

export/**
       * Creates the same constructors and matchers as `Data.taggedEnum`, adding a
       * nominal TypeId property to each value and a marker-based `$isA` type guard.
       */
const taggedEnum: {
    /** Creates constructors for a higher-kinded tagged enum. */
    <Definition extends TaggedEnum.GenericDefinition>(
        TypeId: Definition["TypeId"]
    ): GenericConstructor<Definition>;
    /** Creates constructors for a concrete tagged enum. */
    <A extends { readonly _tag: string }>(
        TypeId: TaggedEnum.TypeIdOf<A>
    ): TaggedEnum.Constructor<A>;
} = ((TypeIdValue: PropertyKey): unknown =>
{
    const Base = Data.taggedEnum<any>();
    const IsA = Predicate.hasProperty(TypeIdValue);

    return new Proxy(Base, {
        get(Target: object, Property: string | symbol, Receiver: unknown): unknown
        {
            if (Property === "$isA")
            {
                return IsA;
            }

            const Value: unknown = Reflect.get(Target, Property, Receiver);
            if (Property === "$is" || Property === "$match")
            {
                return Value;
            }

            return (Properties: unknown): object => ({
                ...(Value as (Input: unknown) => object)(Properties),
                [TypeIdValue]: TypeIdValue
            });
        }
    });
}) as any;
