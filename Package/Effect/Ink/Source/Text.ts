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

import type * as React from "react";
import type { TerminalRendererOptions } from "marked-terminal";

export const TypeIdKey: string = "~sorrell/effect-ink/Prompt";
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Base<in out TagType extends string, in out ValueType>
{
    readonly [ TypeId ]: TypeId;

    readonly _tag: TagType;

    readonly Value: ValueType;
}

export interface Plain extends Base<"Plain", string> { }

export interface Rich extends Base<"Rich", React.ReactNode> { }

export type RenderOptions = TerminalRendererOptions;

export interface Markdown extends Base<"Markdown", string>
{
    readonly RenderOptions: RenderOptions;
}

export const Plain = (Value: string): Plain =>
{
    return {
        [ TypeId ]: TypeId,
        _tag: "Plain",

        Value
    } as const;
};

export const Rich = (Value: React.ReactNode): Rich =>
{
    return {
        [ TypeId ]: TypeId,
        _tag: "Rich",

        Value
    } as const;
};

export const Markdown = (Value: string, Options?: RenderOptions): Plain =>
{
    return {
        [ TypeId ]: TypeId,
        _tag: "Plain",

        ...(Options !== undefined ? { Options } : { }),

        Value
    } as const;
};

export type Text =
    | Plain
    | Rich
    | Markdown;
