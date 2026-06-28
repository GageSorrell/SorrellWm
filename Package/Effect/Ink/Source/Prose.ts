/**
 * Annotate prompts with headers and bodies of text.
 *
 * @module @sorrell/effect-ink/Prose
 *
 * @file      Prose.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Color from "./Color.ts";
import * as Internal from "./Internal/index.ts";
import * as Prompt from "./Prompt.js";
import type * as React from "react";
import type * as Symbol from "./Component/Symbol.tsx";
import { Brand, type Data, type Option } from "effect";
import { Component } from "./index.ts";
import type { Mutable } from "effect/Types";
import { dual } from "effect/Function";

export namespace Text
{
    export type Plain = Brand.Branded<string, "PlainText">;
    export type Rich = Brand.Branded<React.ReactNode, "RichText">;
    export type Markdown = Brand.Branded<string, "Markdown">;

    export const Plain: Brand.Constructor<Plain> = Brand.nominal<Plain>();
    export const Rich: Brand.Constructor<Rich> = Brand.nominal<Rich>();
    export const Markdown: Brand.Constructor<Markdown> = Brand.nominal<Markdown>();

    export type Text =
        | Plain
        | Rich
        | Markdown;
}

interface ProseBase
{
    readonly Text: Text.Text;
}

export type Alert = Data.TaggedEnum<{
    readonly Custom:
        ProseBase &
        {
            readonly Title: Text.Text;
            readonly Symbol: Option.Option<Symbol.Symbol>;
            readonly Body: Text.Text;
            readonly Color?: Color.Color;
        };
    readonly Note: ProseBase;
    readonly Tip: ProseBase;
    readonly Important: ProseBase;
    readonly Warning: ProseBase;
    readonly Caution: ProseBase;
}>;

/* eslint-disable @typescript-eslint/typedef */

export const Alert =
    {
        Caution: Internal.Prose.WithMakeAlert(Internal.Prose.Alert.Caution),
        Custom: Internal.Prose.WithMakeAlert(Internal.Prose.Alert.Custom),
        Important: Internal.Prose.WithMakeAlert(Internal.Prose.Alert.Important),
        Note: Internal.Prose.WithMakeAlert(Internal.Prose.Alert.Note),
        Tip: Internal.Prose.WithMakeAlert(Internal.Prose.Alert.Tip),
        Warning: Internal.Prose.WithMakeAlert(Internal.Prose.Alert.Warning)
    };

/* eslint-enable @typescript-eslint/typedef */

export const Header = (Text: Text.Text): Prompt.Prompt<void> =>
{
    const Out: Mutable<Prompt.Operand.Prose> =
        Internal.Prose.Operand(Internal.Prose.Prose.Header({ Text }), Component.Prose.Header);

    return Out;
};

export const Outro = (Title: Text.Text, Body?: Text.Text): Prompt.Prompt<void> =>
{
    return Internal.Prose.Operand(Internal.Prose.Prose.Outro({
        Title,
        ...(Body !== undefined ? { Body } : { })
    }), (_: unknown) => undefined);
};

export const Banner = (Text: Text.Plain): Prompt.Prompt<void> =>
{
    return Internal.Prose.Operand(
        Internal.Prose.Prose.Header({ Text }),
        (_: unknown) => undefined
    );
};

export const Exposition = (Text: Text.Text): Prompt.Prompt<void> =>
{
    return Internal.Prose.Operand(
        Internal.Prose.Prose.Exposition({ Text }),
        (_: unknown) => undefined
    );
};

export const WithHeader: {
    <A>(HeaderText: Text.Text, Self: Prompt.Prompt<A>): Prompt.Prompt<A>;

    <A>(HeaderText: Text.Text): (Self: Prompt.Prompt<A>) => Prompt.Prompt<A>;
} = dual(2, <A>(HeaderText: Text.Text, Self: Prompt.Prompt<A>): Prompt.Prompt<A> =>
{
    const OutHeader: Prompt.Prompt<void> = Header(HeaderText);
    return Prompt.flatMap(OutHeader, () => Self);
});
