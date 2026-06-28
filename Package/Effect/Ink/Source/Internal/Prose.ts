/**
 *
 *
 * @module @sorrell/effect-ink/Internal/Prose
 * @internal
 *
 * @file      Prose.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Internal from "./index.ts";
import type * as Prompt from "../Prompt.ts";
import type * as Prose from "../Prose.ts";
import type * as React from "react";
import { Data, flow } from "effect";
import type { Mutable } from "effect/Types";

type _Prose = Data.TaggedEnum<{
    readonly Header: { readonly Text: Prose.Text.Text; };
    readonly Alert: { readonly Alert: Prose.Alert; };
    readonly Element: { readonly Element: React.ReactNode; };
    readonly Exposition: { readonly Text: Prose.Text.Text; };
    readonly Banner: { readonly Text: Prose.Text.Plain; };
    readonly Outro: { readonly Title: Prose.Text.Text; readonly Body?: Prose.Text.Text; };
}>;

/* eslint-disable @typescript-eslint/typedef */

const _Prose = Data.taggedEnum<_Prose>();

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const Operand = (TaggedEnum: _Prose, Component: React.FC<any>): Mutable<Prompt.Operand.Prose> =>
{
    const Out: Mutable<Partial<Prompt.Operand.Prose>> = Internal.Prompt.MakePrototype("Prose");
    Out.Content = TaggedEnum;
    Out.Component = Component;
    return Out as Mutable<Prompt.Operand.Prose>;
};

export const Alert = Data.taggedEnum<Prose.Alert>();

export const MakeAlert = (In: Prose.Alert): Prompt.Prompt<void> =>
{
    return Operand(_Prose.Alert({ Alert: In }), (_: unknown) => undefined);
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const WithMakeAlert = (In: any) => flow(In, MakeAlert);

/* eslint-enable @typescript-eslint/typedef */

export { _Prose as Prose };
