/**
 * Annotate prompts with headers and bodies of text.
 *
 * @module @sorrell/effect-ink/Doc
 *
 * @file      Doc.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Color from "./Color.ts";
import * as Internal from "./Internal/index.ts";
import * as Prompt from "./Prompt.ts";
import type * as Symbol from "./Component/Symbol.tsx";
import type * as Text from "./Text.ts";
import type { Data, Option } from "effect";
import { Component } from "./index.ts";
import type { Mutable } from "effect/Types";
import { dual } from "effect/Function";

interface DocBase
{
    readonly Text: Text.Text;
}

export type Alert = Data.TaggedEnum<{
    readonly Custom:
        DocBase &
        {
            readonly Title: Text.Text;
            readonly Symbol: Option.Option<Symbol.Symbol>;
            readonly Body: Text.Text;
            readonly Color?: Color.Color;
        };
    readonly Note: DocBase;
    readonly Tip: DocBase;
    readonly Important: DocBase;
    readonly Warning: DocBase;
    readonly Caution: DocBase;
}>;

/* eslint-disable @typescript-eslint/typedef */

export const Alert =
    {
        Caution: Internal.Doc.WithMakeAlert(Internal.Doc.Alert.Caution),
        Custom: Internal.Doc.WithMakeAlert(Internal.Doc.Alert.Custom),
        Important: Internal.Doc.WithMakeAlert(Internal.Doc.Alert.Important),
        Note: Internal.Doc.WithMakeAlert(Internal.Doc.Alert.Note),
        Tip: Internal.Doc.WithMakeAlert(Internal.Doc.Alert.Tip),
        Warning: Internal.Doc.WithMakeAlert(Internal.Doc.Alert.Warning)
    };

/* eslint-enable @typescript-eslint/typedef */

export const Header = (Text: Text.Text): Prompt.Prompt<void> =>
{
    const Out: Mutable<Prompt.Operand.Doc> =
        Internal.Doc.Operand(Internal.Doc.Doc.Header({ Text }), Component.Doc.Header);

    return Out;
};

export const Outro = (Title: Text.Text, Body?: Text.Text): Prompt.Prompt<void> =>
{
    return Internal.Doc.Operand(Internal.Doc.Doc.Outro({
        Title,
        ...(Body !== undefined ? { Body } : { })
    }), (_: unknown) => undefined);
};

export const Banner = (Text: Text.Plain): Prompt.Prompt<void> =>
{
    return Internal.Doc.Operand(
        Internal.Doc.Doc.Header({ Text }),
        (_: unknown) => undefined
    );
};

export const Exposition = (Text: Text.Text): Prompt.Prompt<void> =>
{
    return Internal.Doc.Operand(
        Internal.Doc.Doc.Exposition({ Text }),
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
