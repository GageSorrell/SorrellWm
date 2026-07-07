/**
 *
 *
 * @module @sorrell/effect-ink/Internal/Doc
 * @internal
 *
 * @file      Doc.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Doc from "../Doc.ts";
import * as Internal from "./index.ts";
import type * as Prompt from "../Prompt.ts";
import type * as React from "react";
import type * as Text from "../Text.ts";
import { Data, flow } from "effect";
import type { Mutable } from "effect/Types";

type _Doc = Data.TaggedEnum<{
    readonly Header: { readonly Text: Text.Text; };
    readonly Alert: { readonly Alert: Doc.Alert; };
    readonly Element: { readonly Element: React.ReactNode; };
    readonly Exposition: { readonly Text: Text.Text; };
    readonly Banner: { readonly Text: Text.Plain; };
    readonly Outro: { readonly Title: Text.Text; readonly Body?: Text.Text; };
}>;

/* eslint-disable @typescript-eslint/typedef */

const _Doc = Data.taggedEnum<_Doc>();

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const Operand = (TaggedEnum: _Doc, Component: React.FC<any>): Mutable<Prompt.Operand.Doc> =>
{
    const Out: Mutable<Partial<Prompt.Operand.Doc>> = Internal.Prompt.MakePrototype("Doc");
    Out.Content = TaggedEnum;
    Out.Component = Component;
    return Out as Mutable<Prompt.Operand.Doc>;
};

export const Alert = Data.taggedEnum<Doc.Alert>();

export const MakeAlert = (In: Doc.Alert): Prompt.Prompt<void> =>
{
    return Operand(_Doc.Alert({ Alert: In }), (_: unknown) => undefined);
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const WithMakeAlert = (In: any) => flow(In, MakeAlert);

/* eslint-enable @typescript-eslint/typedef */

export { _Doc as Doc };
