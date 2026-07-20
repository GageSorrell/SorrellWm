/**
 *
 *
 * @module @sorrell/effect-ink/Component/Symbol
 *
 * @file      Symbol.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Arr from "effect/Array";
import * as Brand from "effect/Brand";
import * as CliBoxes from "cli-boxes";
import * as Ink from "ink";
import type * as React from "react";
import { Option, Predicate, pipe } from "effect";
import type { Make } from "./Primitive/Branded.tsx";
import { Theme } from "./index.js";

export const TypeId: "@sorrell/effect-ink/Component/Symbol" = "@sorrell/effect-ink/Component/Symbol" as const;

type _Symbol = Brand.Branded<string, "Symbol">;
// const _Symbol: Brand.Constructor<_Symbol> =
//     Brand.make<_Symbol>((Value: string): boolean => Value.length === 1);
const _Symbol: Brand.Constructor<_Symbol> =
    Brand.make<_Symbol>((Value: string): boolean => Value.length === 1);

export interface Props extends Make<Ink.TextProps>
{
    readonly Symbol: _Symbol;
}

export const Component = (Props: Props): _Symbol | React.ReactNode =>
{
    const { Symbol, ...Tail } = Props;

    return <Ink.Text { ...(Tail as Ink.TextProps) }>{ Symbol }</Ink.Text>;
};

export type BoxTokenLeaf = Brand.Branded<symbol, "Box">;

const EmptyThemeSpecifier: "^" = "^" as const;
const ThemePartDelimiter: "%" = "%" as const;

const BoxTokenLeaf: {
    (Style: Option.Option<keyof CliBoxes.Boxes>, A: "Left" | "Right"): BoxToken;

    (Style: Option.Option<keyof CliBoxes.Boxes>, A: "Top" | "Bottom", B: "Left" | "Right"): BoxToken;
} = (
    Style: Option.Option<keyof CliBoxes.Boxes>,
    A: "Top" | "Bottom" | "Left" | "Right",
    B?: "Left" | "Right"
): BoxToken =>
{
    const Stub: string = pipe(
        [ ThemePartDelimiter, Style.valueOrUndefined ?? EmptyThemeSpecifier, ThemePartDelimiter, A, B ],
        Arr.filter(Predicate.isNotUndefined),
        Arr.join("!")
    );

    return Brand.nominal<BoxTokenLeaf>()(Symbol.for(`${ TypeId }!Box!${ Stub }`)) as BoxToken;
};

const GetTheme = (In: BoxTokenLeaf): Option.Option<keyof CliBoxes.Boxes> =>
{
    const Key: string = Symbol.keyFor(In)!;
    const StartIndex: number = Key.indexOf(ThemePartDelimiter);
    const EndIndex: number = Key.lastIndexOf(ThemePartDelimiter);
    const ThemePart: keyof CliBoxes.Boxes | typeof EmptyThemeSpecifier =
        Key.slice(StartIndex + 1, EndIndex) as keyof CliBoxes.Boxes | typeof EmptyThemeSpecifier;

    return ThemePart === EmptyThemeSpecifier
        ? Option.none()
        : Option.some(ThemePart);
};
export type BoxTokenSides =
    {
        readonly Left: BoxToken;
        readonly Right: BoxToken;
    };

export type BoxTokenBox =
    BoxTokenSides &
    {
        readonly Bottom: BoxTokenSides;
        readonly Top: BoxTokenSides;
    };

export type BoxToken =
    | BoxTokenBox
    | BoxTokenSides
    | BoxTokenLeaf;

const MakeBoxBranch = (Style: Option.Option<keyof CliBoxes.Boxes>): BoxTokenBox =>
{
    return {
        Left: BoxTokenLeaf(Style, "Left"),
        Right: BoxTokenLeaf(Style, "Right"),

        Bottom:
        {
            _tag: "Bottom",

            Left: BoxTokenLeaf(Style, "Bottom", "Left"),
            Right: BoxTokenLeaf(Style, "Bottom", "Right")
        },
        Top:
        {
            _tag: "Top",

            Left: BoxTokenLeaf(Style, "Top", "Left"),
            Right: BoxTokenLeaf(Style, "Top", "Right")
        }
    } as unknown as BoxTokenBox;
};

export const BoxToken = (Style?: keyof CliBoxes.Boxes) =>
    Style === undefined
        ? MakeBoxBranch(Option.none())
        : MakeBoxBranch(Option.some(Style));

const GetBoxStylePropKey = (Token: BoxTokenLeaf | BoxTokenSides): keyof CliBoxes.BoxStyle =>
{
    if (Predicate.isSymbol(Token))
    {
        const Key: string = Symbol.keyFor(Token)!;

        const IsLeft: boolean = Key.includes("Left");
        const IsTop: boolean = Key.includes("Top");
        const IsBottom: boolean = Key.includes("Bottom");

        if (IsLeft && IsTop)
        {
            return "topLeft";
        }
        else if (IsLeft && IsBottom)
        {
            return "bottomLeft";
        }
        if (!IsLeft && IsTop)
        {
            return "topRight";
        }
        else // !IsLeft && IsBottom
        {
            return "bottomRight";
        }
    }
    else
    {
        const Key: string = Symbol.keyFor(Token.Left as unknown as symbol)!;
        return Key.includes("Top")
            ? "top"
            : "bottom";
    }
};

/* eslint-enable @typescript-eslint/typedef */

const GetCharacterFromLeaf = (Theme: Theme.Theme, Token: BoxTokenLeaf | BoxTokenSides): string =>
{
    const Fallback: keyof CliBoxes.Boxes = "single";

    const ThemeOverride: Option.Option<keyof CliBoxes.Boxes> = Predicate.isSymbol(Token)
        ? GetTheme(Token)
        : GetTheme(Token.Left as BoxTokenLeaf);

    const BoxPropKey: keyof CliBoxes.BoxStyle = GetBoxStylePropKey(Token);

    return Option.isSome(ThemeOverride)
        ? CliBoxes.default[ThemeOverride.value][BoxPropKey]
        : "BorderStyle" in Theme
            ? Predicate.isString(Theme.BorderStyle)
                ? CliBoxes.default[Theme.BorderStyle as keyof CliBoxes.Boxes][BoxPropKey]
                : (Theme.BorderStyle as CliBoxes.BoxStyle)[BoxPropKey]
            : CliBoxes.default[Fallback][BoxPropKey];
};

const GetCharacter: {
    (Theme: Theme.Theme, Token: BoxTokenLeaf): string;

    (Theme: Theme.Theme, Token: BoxTokenBox): CliBoxes.BoxStyle;

    (Theme: Theme.Theme, Token: BoxToken): string | CliBoxes.BoxStyle;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
} = (Theme: Theme.Theme, Token: BoxToken): any =>
{
    if (Predicate.isSymbol(Token))
    {
        return GetCharacterFromLeaf(Theme, Token);
    }
    else if ("Top" in Token)
    {
        return {
            bottom: GetCharacterFromLeaf(Theme, Token.Bottom),
            bottomLeft: GetCharacterFromLeaf(Theme, Token.Bottom.Left as BoxTokenLeaf),
            bottomRight: GetCharacterFromLeaf(Theme, Token.Bottom.Right as BoxTokenLeaf),
            left: GetCharacterFromLeaf(Theme, Token.Left as BoxTokenLeaf),
            right: GetCharacterFromLeaf(Theme, Token.Right as BoxTokenLeaf),
            top: GetCharacterFromLeaf(Theme, Token.Top),
            topLeft: GetCharacterFromLeaf(Theme, Token.Top.Left as BoxTokenLeaf),
            topRight: GetCharacterFromLeaf(Theme, Token.Top.Right as BoxTokenLeaf)
        };
    }
    else
    {
        return GetCharacterFromLeaf(Theme, Token);
    }
};

export const UseBox: {
    (Token: BoxTokenLeaf): string;

    (Token: BoxTokenBox): CliBoxes.BoxStyle;

    (Token: BoxToken): string | CliBoxes.BoxStyle;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
} = (In: BoxToken): any =>
{
    const Token: BoxToken = In as BoxToken;
    const UserTheme: Theme.Theme = Theme.UseTheme();
    return GetCharacter(UserTheme, Token);
};

export { _Symbol as Symbol };
