/**
 * Similar to {@link DeepTaggedEnum:type}, but for enum values that share a common shape, thus allowing
 * for convenience functions that are even more convenient than those generated via the
 * {@link \@sorrell/effect-ink/Internal/DeepTaggedEnum} module.
 *
 * @module @sorrell/effect-ink/Internal/FixedTaggedEnum
 * @internal
 *
 * @file      FixedTaggedEnum.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Function from "effect/Function";
import * as Predicate from "effect/Predicate";
import type * as Types from "effect/Types";
import type * as Unify from "effect/Unify";
import type { Data } from "effect";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { DeepTaggedEnum } from "./DeepTaggedEnum.ts";

export const FixedTaggedEnumId: unique symbol =
    Symbol.for("~sorrell/effect-ink/Internal/FixedTaggedEnum");

export type FixedTaggedEnumId = typeof FixedTaggedEnumId;

export type FixedTaggedEnum<
    TypeId extends string,
    A extends Record<string, unknown>
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
> =
    keyof A extends infer TagType ? TagType extends keyof A ? Types.Simplify<{
        readonly [ FixedTaggedEnumId ]: TypeId;
        readonly _tag: TagType;
        readonly Value: A[TagType];
    }>
        : never : never;

export interface Any
{
    readonly [ FixedTaggedEnumId ]: string;
    readonly _tag: string;
    readonly Value: unknown;
};

export type TypeIdFrom<EnumType extends Any> = EnumType[typeof FixedTaggedEnumId];

export type Tags<EnumType extends Any> = Extract<EnumType["_tag"], string>;

export type Constructor<EnumType extends Any> = Types.Simplify<
{
    readonly [ TagType in Tags<EnumType> ]: (Value: Argument<EnumType, TagType>) => Value<EnumType, TagType>;
} &
{
    readonly $IsExact: <const TagType extends Tags<EnumType>>(
        Tag: TagType, In: unknown
    ) => In is Argument<EnumType, TagType>;

    readonly $Is: Predicate.Refinement<unknown, EnumType>;

    readonly $Match:
    {
        <Cases extends {
            readonly [ Tag in EnumType["_tag"] ]: (
                Args: Extract<EnumType, { readonly _tag: Tag; }>
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            ) => any;
        }
        >(Cases: Cases): (Value: EnumType) => Unify.Unify<ReturnType<Cases[EnumType["_tag"]]>>;

        <Cases extends {
            readonly [ TagType in EnumType["_tag"] ]:
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (Args: Extract<EnumType, { readonly _tag: TagType; }>) => any;
        }>(Value: EnumType, Cases: Cases): Unify.Unify<ReturnType<Cases[EnumType["_tag"]]>>;
    }
}>;

export type Value<EnumType extends Any, TagType extends Tags<EnumType>> =
    Data.TaggedEnum.Value<EnumType, TagType>;

export type Argument<EnumType extends Any, TagType extends Tags<EnumType>> =
    Value<EnumType, TagType>["Value"];

export type Arguments<EnumType extends Any> = Argument<EnumType, Extract<EnumType["_tag"], string>>;

function TaggedMatch<
    A extends Any,
    Cases extends {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        readonly [ K in A["_tag"] ]: (Args: Extract<A, { readonly _tag: K; }>) => any;
    }
>(Self: A, Cases: Cases): ReturnType<Cases[A["_tag"]]>;
function TaggedMatch<
    A extends Any,
    Cases extends {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        readonly [ K in A["_tag"] ]: (Args: Extract<A, { readonly _tag: K; }>) => any;
    }
>(Cases: Cases): (Value: A) => ReturnType<Cases[A["_tag"]]>;
function TaggedMatch<
    A extends Any,
    Cases extends {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        readonly [ K in A["_tag"] ]: (Args: Extract<A, { readonly _tag: K }>) => any;
    }
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
>(): any
{
    /* eslint-disable prefer-rest-params */

    if (arguments.length === 1)
    {
        const cases: Cases = arguments[0] as Cases;
        return function(Value: A): ReturnType<Cases[A["_tag"]]>
        {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            return cases[Value._tag as A["_tag"]](Value as any);
        };
    }

    const Value: A = arguments[0] as A;
    const Cases: Cases = arguments[1] as Cases;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return Cases[Value._tag as A["_tag"]](Value as any);

    /* eslint-enable prefer-rest-params */
}

export const FixedTaggedEnum = <EnumType extends Any>(TypeId: TypeIdFrom<EnumType>): Constructor<EnumType> =>
    new Proxy(
        { },
        {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            get(_target: { }, tag: string, _receiver: any)
            {
                if (tag === "$IsExact")
                {
                    return Function.dual(2, <const TagType extends Extract<EnumType["_tag"], string>>(
                        Tag: TagType, In: unknown
                    ): In is Argument<EnumType, TagType> =>
                    {
                        return Predicate.hasProperty(In, "_tag") && In._tag === Tag;
                    });
                }
                else if (tag === "$Is")
                {
                    return Predicate.hasProperty(FixedTaggedEnumId);
                }
                else if (tag === "$Match")
                {
                    return TaggedMatch;
                }
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                return (Props: any) => ({ ...Props, [ FixedTaggedEnumId ]: TypeId, _tag: tag });
            }
        }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ) as any;

