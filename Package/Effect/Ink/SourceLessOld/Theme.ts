/**
 * Themes for customizing the appearance of prompts.
 *
 * @module @sorrell/effect-ink/Theme
 */

/**
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context } from "effect";
import type { Utility } from "./Internal/index.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Theme";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Color
{
    _tag: "Color";

    Accent: string;
    Primary: string;
    Secondary: string;
}

export interface InkTheme
{
    readonly _tag: "InkTheme";

    readonly Color: Color;
}

export const DefaultColor: Readonly<Color> =
    {
        _tag: "Color",

        Accent: "#FF0011",
        Primary: "#0077FF",
        Secondary: "0FCC44"
    } as const;

export const Color = (In: Partial<Utility.Untagged<Color>>): Color =>
{
    return {
        ...DefaultColor,
        ...In
    };
};

export const DefaultInkTheme: Readonly<InkTheme> =
    {
        _tag: "InkTheme",

        Color: DefaultColor
    } as const;

export const InkTheme = (In: Partial<Utility.Untagged<InkTheme>>): InkTheme =>
{
    return {
        ...DefaultInkTheme,
        ...In
    };
};

export const Theme: Context.Reference<InkTheme> = Context.Reference<InkTheme>(
    TypeIdKey,
    { defaultValue: () => DefaultInkTheme }
);

export type Theme = typeof Theme["Service"];
