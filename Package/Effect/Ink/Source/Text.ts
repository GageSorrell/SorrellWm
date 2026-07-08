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

import * as Internal from "./Internal/index.ts";
import type * as React from "react";
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */
// @ts-ignore
import type { FixedTaggedEnumId } from "./Internal/FixedTaggedEnum.ts";
/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */

export const TypeIdKey: "~sorrell/effect-ink/Text" = "~sorrell/effect-ink/Text" as const;
export type TypeIdKey = typeof TypeIdKey;
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

/* eslint-disable-next-line @typescript-eslint/typedef */
const TextEnumId = "~sorrell/effect-ink/Text!Text" as const;
type TextEnumId = typeof TextEnumId;
export type Text = Internal.FixedTaggedEnum.FixedTaggedEnum<
    TextEnumId,
    {
        readonly Plain: string;
        readonly Rich: React.ReactNode;
        readonly Markdown: string;
    }
>;

export type Markdown = Internal.FixedTaggedEnum.Value<Text, "Markdown">;
export type Rich = Internal.FixedTaggedEnum.Value<Text, "Rich">;
export type Plain = Internal.FixedTaggedEnum.Value<Text, "Plain">;

export const { $Is, $IsExact, $Match, Markdown, Plain, Rich } =
    Internal.FixedTaggedEnum.FixedTaggedEnum<Text>(TextEnumId);
