/**
 * Utility types and other helpers.
 *
 * @module @sorrell/effect-ink/Utility
 */

/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Brand, type Effect, Option } from "effect";
import { InvalidValue } from "effect/SchemaIssue";
import { InvalidValueError } from "./Internal/Utility.ts";
import type { ReactNode } from "react";

export type MaybeEffect<A, E = never, R = never> =
    | A
    | Effect.Effect<A, E, R>;

export type ReactEffect<E = never, R = never> = MaybeEffect<ReactNode, E, R>;

export type Int = Brand.Branded<number, "Int">;

export const Int: Brand.Constructor<Int> = Brand.make<Int>((Value: number) =>
{
    return Math.trunc(Value) === Value
        ? undefined
        : InvalidValueError(`Expected ${ Value } to be an integer.`, Value);
});

export type Natural = Brand.Branded<number, "Natural">;

export const Natural: Brand.Constructor<Natural> = Brand.make<Natural>((Value: number) =>
{
    if (Math.trunc(Value) !== Value)
    {
        return InvalidValueError(`Expected ${ Value } to be an integer.`, Value);
    }
    else if (Value < 0)
    {
        return InvalidValueError(`Expected ${ Value } to be positive.`, Value);
    }
    else if (Value === 0)
    {
        return InvalidValueError("Zero is not a natural number.");
    }

    return undefined;
});

export type Percentage = Brand.Branded<number, "Percentage">;

export const Percentage: Brand.Constructor<Percentage> = Brand.make<Percentage>((Value: number) =>
{
    let message: string | undefined = undefined;

    if (isNaN(Value))
    {
        message = "Expected value to not be NaN.";
    }
    else if (Value === Infinity)
    {
        message = "Expected value to be finite, but it is Infinity.";
    }
    else if (Value === -Infinity)
    {
        message = "Expected value to be finite, but it is -Infinity.";
    }
    else if (Value < 0)
    {
        message = `Expected ${ Value } to be nonnegative.`;
    }

    if (message !== undefined)
    {
        return new InvalidValue(Option.some(Value), { message });
    }

    return undefined;
});

export type TagKey = "_tag";

export interface Tag<KeyType extends string>
{
    _tag: KeyType;
}

export type Tagged<UntaggedType, KeyType extends string> =
    Untagged<UntaggedType> &
    Tag<KeyType>;

export type Untagged<TaggedType> = Omit<TaggedType, TagKey>;

export const Untagged = <
    TaggedType extends Tagged<RecordLike, KeyType>,
    RecordLike,
    KeyType extends string
>(
    In: TaggedType
): Untagged<TaggedType> =>
{
    const { _tag: _, ...Out } = In;
    return Out;
};

export const Tagged = <
    RecordLike,
    const KeyType extends string
>(
    In: RecordLike,
    Tag: KeyType
): Tagged<RecordLike, typeof Tag> =>
{
    return {
        ...In,
        _tag: Tag
    };
};

export type TagFrom<TaggedType> = TaggedType extends Tagged<unknown, infer KeyType> ? KeyType : never;

export type BodyFrom<TaggedType> =
    TaggedType extends Tagged<infer RecordLike extends object, string>
        ? RecordLike
        : never;

export const MakeTagged = <const TaggedType extends Tagged<unknown, string>>(
    Tag: TagFrom<TaggedType>
): (In: Untagged<TaggedType>) => Tagged<typeof In, typeof Tag> =>
{
    return (In: Untagged<TaggedType>): Tagged<typeof In, typeof Tag> =>
    {
        return {
            ...In,
            _tag: Tag
        };
    };
};
