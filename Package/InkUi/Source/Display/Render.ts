/**
 * Bitmap text rendering adapted from superstarryeyes/bit's ansifonts package.
 *
 * @module @sorrell/ink-ui/Display/Render
 *
 * @file      Render.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { GetDisplayFont, type DisplayFont, type DisplayFontFamily } from "./Fonts.generated.js";

export type DisplayFontScale = 0.5 | 1 | 2 | 4;
export type DisplayShadowOffset = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
export type DisplayShadowStyle = "light" | "medium" | "dark" | 0 | 1 | 2;
export type DisplayTextAlign = "left" | "center" | "right";

export interface RenderDisplayOptions
{
    readonly CharacterSpacing?: number | undefined;
    readonly FontFamily: DisplayFontFamily;
    readonly FontScale?: DisplayFontScale | undefined;
    readonly LineSpacing?: number | undefined;
    readonly Shadow?: boolean | undefined;
    readonly ShadowHorizontalOffset?: DisplayShadowOffset | undefined;
    readonly ShadowStyle?: DisplayShadowStyle | undefined;
    readonly ShadowVerticalOffset?: DisplayShadowOffset | undefined;
    readonly TextAlign?: DisplayTextAlign | undefined;
    readonly WordSpacing?: number | undefined;
}

interface PreparedFont
{
    readonly Font: DisplayFont;
    readonly Glyphs: Readonly<Record<string, ReadonlyArray<string>>>;
    readonly Height: number;
    readonly Widths: Readonly<Record<string, number>>;
}

const PreparedFonts = new Map<string, PreparedFont>();
const ShadowCharacters = [ "░", "▒", "▓" ] as const;

/** Render text using the same bitmap, scaling, kerning, and shadow model as bit. */
export function RenderDisplayText(Text: string, Options: RenderDisplayOptions): ReadonlyArray<string>
{
    if (Text.length === 0) {return [];}

    const Scale: DisplayFontScale = NormalizeScale(Options.FontScale);
    const Font: PreparedFont = PrepareFont(Options.FontFamily, Scale);
    const CharacterSpacing: number = ClampInteger(Options.CharacterSpacing ?? 2, 0, 10);
    const WordSpacing: number = ClampInteger(Options.WordSpacing ?? 2, 0, 20);
    const LineSpacing: number = ClampInteger(Options.LineSpacing ?? 1, 0, 10);
    const Alignment: DisplayTextAlign = Options.TextAlign ?? "center";
    const Blocks: Array<ReadonlyArray<string>> = Text.split("\n").map((Line: string) =>
        Line.length === 0
            ? [ "" ]
            : StripEmptyLines(RenderLine(Line, Font, CharacterSpacing, WordSpacing))
    );
    const MaximumWidth: number = Blocks.reduce((Maximum: number, Block: ReadonlyArray<string>) =>
        Math.max(Maximum, BlockWidth(Block)), 0);
    const HasHalfPixels: boolean = Options.Shadow === true
        && DetectHalfPixels(Text, Font);
    const ShadowEnabled: boolean = Options.Shadow === true && !HasHalfPixels;
    const HorizontalOffset: number = ClampInteger(Options.ShadowHorizontalOffset ?? 1, -5, 5);
    const VerticalOffset: number = ClampInteger(Options.ShadowVerticalOffset ?? 1, -5, 5);
    const ShadowCharacter: string = ShadowCharacters[NormalizeShadowStyle(Options.ShadowStyle)];
    const Result: Array<string> = [];

    for (let Index = 0; Index < Blocks.length; Index++)
    {
        const Block: ReadonlyArray<string> = Blocks[Index] ?? [];
        if (Block.length === 1 && Block[0] === "")
        {
            if (Index > 0) {Result.push("");}
            continue;
        }

        if (Index > 0 && Result.length > 0)
        {
            Result.push(...Array.from({ length: LineSpacing }, () => ""));
        }

        const Aligned: ReadonlyArray<string> = AlignBlock(Block, MaximumWidth, Alignment);
        Result.push(...ApplyShadow(
            Aligned,
            ShadowEnabled,
            HorizontalOffset,
            VerticalOffset,
            ShadowCharacter
        ));
    }

    const Width: number = BlockWidth(Result);
    return Result.map((Line: string) => Line.padEnd(Width));
}

function PrepareFont(FontFamily: DisplayFontFamily, Scale: DisplayFontScale): PreparedFont
{
    const Key = `${ FontFamily }:${ Scale }`;
    const Cached: PreparedFont | undefined = PreparedFonts.get(Key);
    if (Cached !== undefined) {return Cached;}

    const Font: DisplayFont = GetDisplayFont(FontFamily);
    const Scaled = Object.fromEntries(Object.entries(Font.Characters).map(([ Character, Lines ]) =>
        [ Character, ScaleGlyph(Lines, Scale).filter((Line: string) => Line !== "") ]
    )) as Record<string, ReadonlyArray<string>>;
    const Height: number = Math.max(0, ...Object.values(Scaled)
        .map((Lines) => Lines.length));
    const Glyphs: Record<string, ReadonlyArray<string>> = { };
    const Widths: Record<string, number> = { };

    for (const [ Character, Lines ] of Object.entries(Scaled))
    {
        const Glyph: ReadonlyArray<string> = Lines.length === 0
            ? [ " " ]
            : [ ...Lines, ...Array.from({ length: Math.max(0, Height - Lines.length) }, () => "") ];
        Glyphs[Character] = Glyph;
        Widths[Character] = Character === " " ? 1 : BlockWidth(Glyph);
    }

    const Prepared: PreparedFont = { Font, Glyphs, Height, Widths };
    PreparedFonts.set(Key, Prepared);
    return Prepared;
}

function RenderLine(
    Text: string,
    Font: PreparedFont,
    CharacterSpacing: number,
    WordSpacing: number
): ReadonlyArray<string>
{
    const Characters: ReadonlyArray<string> = Array.from(Text);
    const DefaultWidth: number = GetDefaultWidth(Font);
    const Kerning = new Map<string, number>();
    const Width = (Character: string): number => Character === " "
        ? 1
        : (Font.Widths[Character] ?? DefaultWidth);
    const Glyph = (Character: string): ReadonlyArray<string> =>
        Font.Glyphs[Character] ?? [ " ".repeat(DefaultWidth) ];
    const Seen = new Set<string>();

    for (let Index = 0; Index < Characters.length - 1; Index++)
    {
        const Left: string = Characters[Index] ?? "";
        const Right: string = Characters[Index + 1] ?? "";
        Seen.add(Left);
        if (Left !== " " && Right !== " " && Seen.has(Right))
        {
            Kerning.set(`${ Left }\0${ Right }`, ComputeKerning(Glyph(Left), Glyph(Right)));
        }
    }

    const Result: Array<string> = [];
    for (let Row = 0; Row < Font.Height; Row++)
    {
        const Positions: Array<number> = Array.from({ length: Characters.length }, () => 0);
        for (let Index = 1; Index < Characters.length; Index++)
        {
            const Previous: string = Characters[Index - 1] ?? "";
            const Current: string = Characters[Index] ?? "";
            const Advance: number = Previous === " "
                ? 0.5 + (IsWordBoundary(Characters, Index - 1) ? WordSpacing : 0)
                : Width(Previous) + (Kerning.get(`${ Previous }\0${ Current }`) ?? 0)
                    + CharacterSpacing;
            Positions[Index] = (Positions[Index - 1] ?? 0) + Advance;
        }

        const Canvas: Array<string> = [];
        let CumulativeError = 0;
        for (let Index = 0; Index < Characters.length; Index++)
        {
            const Character: string = Characters[Index] ?? "";
            const CurrentPosition: number = (Positions[Index] ?? 0) + CumulativeError;
            const X: number = Math.round(CurrentPosition);
            CumulativeError += CurrentPosition - X;
            const Fragment: string = Character === " "
                ? " ".repeat(Math.ceil(0.5 + (IsWordBoundary(Characters, Index) ? WordSpacing : 0)))
                : (Glyph(Character)[Row] ?? "");
            const Pixels: ReadonlyArray<string> = Array.from(Fragment);

            while (Canvas.length < X + Pixels.length) {Canvas.push(" ");}
            for (let Pixel = 0; Pixel < Pixels.length; Pixel++)
            {
                const Value: string = Pixels[Pixel] ?? " ";
                const Target: number = X + Pixel;
                if (Target >= 0 && (Value !== " " || Canvas[Target] === " "))
                {
                    Canvas[Target] = Value;
                }
            }
        }
        Result.push(Canvas.join("").trimEnd());
    }
    return Result;
}

function ScaleGlyph(Lines: ReadonlyArray<string>, Scale: DisplayFontScale): ReadonlyArray<string>
{
    if (Scale === 1 || Lines.length === 0) {return Lines;}

    const Binary: Array<Array<number>> = [];
    for (const Line of Lines)
    {
        const Top: Array<number> = [];
        const Bottom: Array<number> = [];
        for (const Pixel of Array.from(Line))
        {
            Top.push(Pixel === "█" || Pixel === "▀" ? 1 : 0);
            Bottom.push(Pixel === "█" || Pixel === "▄" ? 1 : 0);
        }
        Binary.push(Top, Bottom);
    }

    const Scaled: ReadonlyArray<ReadonlyArray<number>> = Scale === 0.5
        ? Downscale(Binary)
        : Upscale(Binary, Scale);
    const Result: Array<string> = [];
    for (let Row = 0; Row < Scaled.length; Row += 2)
    {
        const Top: ReadonlyArray<number> = Scaled[Row] ?? [];
        const Bottom: ReadonlyArray<number> = Scaled[Row + 1] ?? [];
        const Width: number = Math.max(Top.length, Bottom.length);
        Result.push(Array.from({ length: Width }, (_, Column: number) =>
        {
            const Upper: number = Top[Column] ?? 0;
            const Lower: number = Bottom[Column] ?? 0;
            if (Upper === 1 && Lower === 1) {return "█";}
            if (Upper === 1) {return "▀";}
            if (Lower === 1) {return "▄";}
            return " ";
        }).join(""));
    }
    return Result;
}

function Upscale(
    Binary: ReadonlyArray<ReadonlyArray<number>>,
    Scale: 2 | 4
): ReadonlyArray<ReadonlyArray<number>>
{
    return Binary.flatMap((Row: ReadonlyArray<number>) =>
    {
        const Expanded: ReadonlyArray<number> = Row.flatMap((Pixel: number) =>
            Array.from({ length: Scale }, () => Pixel));
        return Array.from({ length: Scale }, () => [ ...Expanded ]);
    });
}

function Downscale(Binary: ReadonlyArray<ReadonlyArray<number>>): ReadonlyArray<ReadonlyArray<number>>
{
    const Height: number = Math.floor(Binary.length / 2);
    const Width: number = Math.floor((Binary[0]?.length ?? 0) / 2);
    if (Height === 0 || Width === 0) {return [ [ 0 ] ];}

    return Array.from({ length: Height }, (_, Row: number) =>
        Array.from({ length: Width }, (_, Column: number) =>
        {
            for (let Y = Row * 2; Y < Row * 2 + 2; Y++)
            {
                for (let X = Column * 2; X < Column * 2 + 2; X++)
                {
                    if (Binary[Y]?.[X] === 1) {return 1;}
                }
            }
            return 0;
        })
    );
}

function ComputeKerning(Left: ReadonlyArray<string>, Right: ReadonlyArray<string>): number
{
    const Height: number = Math.max(Left.length, Right.length);
    const LeftWidth: number = BlockWidth(Left);
    let MinimumDistance = Number.POSITIVE_INFINITY;
    let MaximumLeft = -1;
    let MinimumRight = Number.POSITIVE_INFINITY;
    let HasOverlap = false;

    for (let Row = 0; Row < Height; Row++)
    {
        const LeftPixels: ReadonlyArray<string> = Array.from(Left[Row] ?? "".padEnd(LeftWidth));
        const RightPixels: ReadonlyArray<string> = Array.from(Right[Row] ?? "");
        const Rightmost: number = FindLastPixel(LeftPixels);
        const Leftmost: number = RightPixels.findIndex((Pixel: string) => Pixel !== " ");
        MaximumLeft = Math.max(MaximumLeft, Rightmost);
        if (Leftmost >= 0) {MinimumRight = Math.min(MinimumRight, Leftmost);}
        if (Rightmost >= 0 && Leftmost >= 0)
        {
            MinimumDistance = Math.min(MinimumDistance, LeftWidth + Leftmost - Rightmost);
            HasOverlap = true;
        }
    }

    if (!HasOverlap)
    {
        if (MaximumLeft < 0 || !Number.isFinite(MinimumRight)) {return 0;}
        MinimumDistance = LeftWidth + MinimumRight - MaximumLeft;
    }
    return 1 - MinimumDistance;
}

function ApplyShadow(
    Block: ReadonlyArray<string>,
    Enabled: boolean,
    HorizontalOffset: number,
    VerticalOffset: number,
    ShadowCharacter: string
): ReadonlyArray<string>
{
    if (!Enabled) {return Block;}

    const Width: number = BlockWidth(Block);
    const MinimumX: number = Math.min(0, HorizontalOffset);
    const MinimumY: number = Math.min(0, VerticalOffset);
    const CanvasWidth: number = Width + Math.abs(HorizontalOffset);
    const CanvasHeight: number = Block.length + Math.abs(VerticalOffset);
    const Canvas: Array<Array<string>> = Array.from({ length: CanvasHeight }, () =>
        Array.from({ length: CanvasWidth }, () => " "));

    PaintBlock(Canvas, Block, -MinimumX + HorizontalOffset, -MinimumY + VerticalOffset,
        () => ShadowCharacter);
    PaintBlock(Canvas, Block, -MinimumX, -MinimumY, (Pixel: string) => Pixel);
    return Canvas.map((Row: ReadonlyArray<string>) => Row.join("").trimEnd());
}

function PaintBlock(
    Canvas: Array<Array<string>>,
    Block: ReadonlyArray<string>,
    OffsetX: number,
    OffsetY: number,
    Paint: (Pixel: string) => string
): void
{
    for (let Y = 0; Y < Block.length; Y++)
    {
        const Pixels: ReadonlyArray<string> = Array.from(Block[Y] ?? "");
        for (let X = 0; X < Pixels.length; X++)
        {
            const Pixel: string = Pixels[X] ?? " ";
            if (Pixel !== " " && Canvas[OffsetY + Y]?.[OffsetX + X] !== undefined)
            {
                (Canvas[OffsetY + Y] as Array<string>)[OffsetX + X] = Paint(Pixel);
            }
        }
    }
}

function AlignBlock(
    Block: ReadonlyArray<string>,
    Width: number,
    Alignment: DisplayTextAlign
): ReadonlyArray<string>
{
    const OwnWidth: number = BlockWidth(Block);
    const Padding: number = Math.max(0, Width - OwnWidth);
    const Left: number = Alignment === "right" ? Padding
        : Alignment === "center" ? Math.floor(Padding / 2) : 0;
    return Block.map((Line: string) => " ".repeat(Left) + Line.padEnd(OwnWidth)
        + " ".repeat(Padding - Left));
}

function DetectHalfPixels(Text: string, Font: PreparedFont): boolean
{
    return Array.from(Text).some((Character: string) =>
        Font.Glyphs[Character]?.some((Line: string) => /[▀▄]/u.test(Line)) === true);
}

function IsWordBoundary(Characters: ReadonlyArray<string>, SpaceIndex: number): boolean
{
    if (Characters[SpaceIndex] !== " ") {return false;}
    let Before = SpaceIndex - 1;
    while (Before >= 0 && Characters[Before] === " ") {Before--;}
    let BeforeLength = 0;
    while (Before >= 0 && Characters[Before] !== " ") {BeforeLength++; Before--;}
    let After = SpaceIndex + 1;
    while (After < Characters.length && Characters[After] === " ") {After++;}
    let AfterLength = 0;
    while (After < Characters.length && Characters[After] !== " ") {AfterLength++; After++;}
    return BeforeLength > 1 && AfterLength > 1;
}

function GetDefaultWidth(Font: PreparedFont): number
{
    for (const Character of [ " ", "x", "M", "!" ])
    {
        const Width: number | undefined = Font.Widths[Character];
        if (Width !== undefined && Width > 0) {return Width;}
    }
    return 4;
}

function FindLastPixel(Pixels: ReadonlyArray<string>): number
{
    for (let Index = Pixels.length - 1; Index >= 0; Index--)
    {
        if (Pixels[Index] !== " ") {return Index;}
    }
    return -1;
}

function StripEmptyLines(Lines: ReadonlyArray<string>): ReadonlyArray<string>
{
    let Start = 0;
    let End = Lines.length;
    while (Start < End && (Lines[Start] ?? "").trim().length === 0) {Start++;}
    while (End > Start && (Lines[End - 1] ?? "").trim().length === 0) {End--;}
    return Lines.slice(Start, End);
}

function BlockWidth(Lines: ReadonlyArray<string>): number
{
    return Math.max(0, ...Lines.map((Line: string) => Array.from(Line).length));
}

function ClampInteger(Value: number, Minimum: number, Maximum: number): number
{
    return Math.min(Maximum, Math.max(Minimum, Math.trunc(Value)));
}

function NormalizeScale(Value: DisplayFontScale | undefined): DisplayFontScale
{
    return Value === 0.5 || Value === 2 || Value === 4 ? Value : 1;
}

function NormalizeShadowStyle(Value: DisplayShadowStyle | undefined): 0 | 1 | 2
{
    if (Value === "medium" || Value === 1) {return 1;}
    if (Value === "dark" || Value === 2) {return 2;}
    return 0;
}
