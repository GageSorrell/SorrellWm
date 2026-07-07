/**
 *
 *
 * @module @sorrell/effect-ink/Text
 *
 * @file      Text.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Data from "effect/Data";
import * as Predicate from "effect/Predicate";
import type * as React from "react";

export const TypeIdKey: string = "~sorrell/effect-ink/Prompt";
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Base<ValueType>
{
    readonly [ TypeId ]: TypeId;

    readonly Value: ValueType;
}

export type Text = Data.TaggedEnum<{
    readonly Plain: Base<string>;
    readonly Rich: Base<React.ReactNode>;
    readonly Markdown: Base<string>;
}>;

export type Markdown = Data.TaggedEnum.Value<Text, "Markdown">;
export type Rich = Data.TaggedEnum.Value<Text, "Rich">;
export type Plain = Data.TaggedEnum.Value<Text, "Plain">;

const { $is, $match, ...TextConstructors }: Data.TaggedEnum.Constructor<Text> = Data.taggedEnum<Text>();

export { $is, $match };
export const Rich: Data.TaggedEnum.Constructor<Text>["Rich"] = TextConstructors.Rich;
export const Plain: Data.TaggedEnum.Constructor<Text>["Plain"] = TextConstructors.Plain;
export const Markdown: Data.TaggedEnum.Constructor<Text>["Markdown"] = TextConstructors.Markdown;

export const IsText = (Value: unknown): Value is Text => Predicate.hasProperty(Value, TypeId);
