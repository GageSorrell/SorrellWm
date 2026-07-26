/**
 * Render SVG content in Sixel-capable terminals.
 *
 * @module @sorrell/ink-ui/Svg
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { type RenderedImage, Resvg } from "@resvg/resvg-js";
import { FINALIZER, introducer, sixelEncode } from "sixel";
import { renderToStaticMarkup } from "react-dom/server";
import { useTerminalSupport } from "../Support/Hook.js";
import type { RgbColor, TerminalSupport } from "../Support/Types.js";
import { RegisterPainter, RequestPaint } from "./Paint.js";

type SizeProps = Pick<Ink.BoxProps,
    | "width"
    | "height"
    | "minWidth"
    | "minHeight"
    | "maxWidth"
    | "maxHeight"
    | "aspectRatio">;

/** An SVG element accepted by {@link Svg}. */
export type SvgElement = React.ReactElement<React.SVGProps<SVGSVGElement>, "svg">;

/** A component rendered when SVG/Sixel rendering or its terminal requirements fail. */
export type SvgFallback = React.ReactElement | React.ComponentType<{ readonly error: Error }>;

/** Pixel-edge treatment used while rasterizing an SVG. */
export type SvgRasterization = "crisp" | "smooth";

/** Props for {@link Svg}. Dimensions use the same terminal-cell units as Ink's `Box`. */
export interface SvgProps extends SizeProps
{
    readonly children: string | SvgElement;
    readonly fallback?: SvgFallback;
    /** Edge treatment for rasterized paths. Defaults to `smooth`. */
    readonly rasterization?: SvgRasterization;
}

interface PreparedSvg
{
    readonly Content: string;
    readonly Height: number;
    readonly Width: number;
}

interface TerminalCapabilities
{
    readonly BackgroundColor?: RgbColor;
    readonly CellHeight: number;
    readonly CellWidth: number;
}

interface Position
{
    readonly AppHeight: number;
    readonly Column: number;
    readonly Row: number;
}

/**
 * Renders one SVG element as a Sixel image.
 *
 * When no fallback is supplied, the component emits nothing if the terminal
 * does not report both its cell pixel dimensions and Sixel support.
 */
export function Svg(Props: SvgProps): React.ReactElement | null
{
    const {
        children,
        fallback,
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        aspectRatio,
        rasterization = "smooth"
    }: SvgProps = Props;
    const { stdout } = Ink.useStdout();
    const Support: TerminalSupport | undefined = useTerminalSupport();
    const BoxReference = React.useRef<Ink.DOMElement>(null);
    const Mounted = React.useRef<boolean>(true);
    const RasterCache = React.useRef<
        { readonly Key: string; readonly Sixel: string } | undefined
    >(undefined);
    const [ Failure, SetFailure ] = React.useState<Error>();
    const Capabilities: TerminalCapabilities | undefined = React.useMemo(() =>
        Support?.Sixel === true && Support.CellSizePixels !== undefined
            ? {
                ...(Support.BackgroundColor === undefined
                    ? { }
                    : { BackgroundColor: Support.BackgroundColor }),
                CellHeight: Support.CellSizePixels.Height,
                CellWidth: Support.CellSizePixels.Width
            }
            : undefined,
    [ Support ]);
    const CapabilityFailure: Error | undefined = Support === undefined
        ? undefined
        : (Support.Sixel !== true
            ? new Error("The terminal does not support Sixel rendering.")
            : (Support.CellSizePixels === undefined
                ? new Error("The terminal cell pixel size could not be determined.")
                : undefined));

    const Preparation = React.useMemo<{ readonly Error?: Error; readonly Svg?: PreparedSvg }>(() =>
    {
        try
        {
            return { Svg: PrepareSvg(children) };
        }
        catch (Error: unknown)
        {
            return { Error: ToError(Error) };
        }
    }, [ children ]);

    React.useEffect(() =>
    {
        Mounted.current = true;

        return () =>
        {
            Mounted.current = false;
        };
    }, [ ]);

    React.useEffect(() =>
    {
        RasterCache.current = undefined;
        SetFailure(undefined);
    }, [
        Preparation.Svg?.Content,
        Capabilities?.BackgroundColor,
        Capabilities?.CellHeight,
        Capabilities?.CellWidth
    ]);

    const Paint = React.useCallback((WriteValue: (Value: string) => void): void =>
    {
        const Prepared: PreparedSvg | undefined = Preparation.Svg;

        if (Prepared === undefined || Capabilities === undefined || Failure !== undefined)
        {
            return;
        }

        try
        {
            const Reference: Ink.DOMElement | null = BoxReference.current;
            const PositionValue: Position | undefined = GetPosition(Reference);
            const Size: { readonly height: number; readonly width: number } =
                Reference === null ? { height: 0, width: 0 } : Ink.measureElement(Reference);
            const CellWidth: number = Math.floor(Size.width);
            const CellHeight: number = Math.floor(Size.height);

            if (PositionValue === undefined || CellWidth <= 0 || CellHeight <= 0)
            {
                return;
            }

            if (!IsFullyVisible(PositionValue, CellWidth, CellHeight, stdout))
            {
                return;
            }

            const PixelWidth: number = Math.max(1, Math.round(CellWidth * Capabilities.CellWidth));
            const PixelHeight: number = Math.max(1, Math.round(CellHeight * Capabilities.CellHeight));
            const CacheKey: string = `${ Prepared.Content }\u0000${ PixelWidth }x${ PixelHeight }`
                + `\u0000${ rasterization }`;
            let Sixel: string | undefined = RasterCache.current?.Key === CacheKey
                ? RasterCache.current.Sixel
                : undefined;

            if (Sixel === undefined)
            {
                Sixel = RenderSixel(
                    Prepared,
                    PixelWidth,
                    PixelHeight,
                    Capabilities.BackgroundColor,
                    rasterization
                );
                RasterCache.current = { Key: CacheKey, Sixel };
            }

            const IsFullscreen: boolean = stdout.isTTY === true
                && stdout.rows !== undefined
                && PositionValue.AppHeight >= stdout.rows;
            const MoveUp: number = PositionValue.AppHeight - PositionValue.Row
                - (IsFullscreen ? 1 : 0);
            const MoveRight: string = PositionValue.Column > 0
                ? `\u001B[${ PositionValue.Column }C`
                : "";

            WriteValue(
                `\u001B7${ MoveUp > 0 ? `\u001B[${ MoveUp }A` : "" }\r${ MoveRight }${ Sixel }\u001B8`
            );
        }
        catch (Error: unknown)
        {
            if (Mounted.current)
            {
                SetFailure(ToError(Error));
            }
        }
    }, [ Capabilities, Failure, Preparation.Svg, rasterization, stdout ]);

    const PaintReference = React.useRef(Paint);
    PaintReference.current = Paint;
    React.useEffect(() =>
    {
        return RegisterPainter(stdout, (WriteValue: (Value: string) => void): void =>
            PaintReference.current(WriteValue));
    }, [ stdout ]);
    React.useEffect(() => RequestPaint(stdout), [ Paint, stdout ]);

    const RenderingError: Error | undefined = Preparation.Error ?? CapabilityFailure ?? Failure;

    if (RenderingError !== undefined)
    {
        return RenderFallback(fallback, RenderingError);
    }

    const Prepared: PreparedSvg | undefined = Preparation.Svg;

    if (Prepared === undefined || Capabilities === undefined)
    {
        return null;
    }

    const IntrinsicWidth: number = Math.max(1, Math.ceil(Prepared.Width / Capabilities.CellWidth));
    const IntrinsicHeight: number = Math.max(1, Math.ceil(Prepared.Height / Capabilities.CellHeight));
    const InferredAspectRatio: number =
        (Prepared.Width / Prepared.Height) * (Capabilities.CellHeight / Capabilities.CellWidth);
    const OnlyOneDimensionSpecified: boolean = (width === undefined) !== (height === undefined);

    return (
        <Ink.Box
            aria-hidden
            aspectRatio={ OnlyOneDimensionSpecified
                ? (aspectRatio ?? InferredAspectRatio)
                : aspectRatio }
            height={ height ?? (width === undefined ? IntrinsicHeight : undefined) }
            maxHeight={ maxHeight }
            maxWidth={ maxWidth }
            minHeight={ minHeight }
            minWidth={ minWidth }
            ref={ BoxReference }
            width={ width ?? (height === undefined ? IntrinsicWidth : undefined) } />
    );
}

/**
 * Prepare an SVG `string` or `SVGElement` to be rasterized.
 *
 * @throws {TypeError | Error} When the size cannot be determined.
 */
function PrepareSvg(Child: string | SvgElement): PreparedSvg
{
    if (typeof Child !== "string" && Child.type !== "svg")
    {
        throw new TypeError("Svg expects one SVG element or an SVG-encoded string.");
    }

    const Content: string = typeof Child === "string" ? Child : renderToStaticMarkup(Child);
    const Renderer: Resvg = new Resvg(Content);
    const Width: number = Renderer.width;
    const Height: number = Renderer.height;

    if (!Number.isFinite(Width) || !Number.isFinite(Height) || Width <= 0 || Height <= 0)
    {
        throw new Error("The SVG does not specify usable intrinsic dimensions.");
    }

    return { Content, Height, Width };
}

/** Render a rasterized SVG image into sixel content. */
function RenderSixel(
    SvgValue: PreparedSvg,
    PixelWidth: number,
    PixelHeight: number,
    BackgroundColor: RgbColor | undefined,
    Rasterization: SvgRasterization
): string
{
    const Scale: number = Math.min(PixelWidth / SvgValue.Width, PixelHeight / SvgValue.Height);
    const Rendered: RenderedImage = new Resvg(SvgValue.Content, {
        fitTo: { mode: "zoom", value: Scale }
    }).render();
    const Canvas: Buffer = Buffer.alloc(PixelWidth * PixelHeight * 4);
    const CopyWidth: number = Math.min(PixelWidth, Rendered.width);
    const CopyHeight: number = Math.min(PixelHeight, Rendered.height);
    const SourceX: number = Math.max(0, Math.floor((Rendered.width - CopyWidth) / 2));
    const SourceY: number = Math.max(0, Math.floor((Rendered.height - CopyHeight) / 2));
    const DestinationX: number = Math.max(0, Math.floor((PixelWidth - CopyWidth) / 2));
    const DestinationY: number = Math.max(0, Math.floor((PixelHeight - CopyHeight) / 2));

    for (let Row: number = 0; Row < CopyHeight; Row += 1)
    {
        const SourceStart: number = ((SourceY + Row) * Rendered.width + SourceX) * 4;
        const DestinationStart: number = ((DestinationY + Row) * PixelWidth + DestinationX) * 4;

        Rendered.pixels.copy(
            Canvas,
            DestinationStart,
            SourceStart,
            SourceStart + CopyWidth * 4
        );
    }

    PrepareAlpha(Canvas, BackgroundColor, Rasterization);
    const Palette: Array<[ number, number, number ]> = MakePalette(Canvas);
    return introducer(1)
        + sixelEncode(Canvas, PixelWidth, PixelHeight, Palette)
        + FINALIZER;
}

/** Preserve transparent pixels and composite partial alpha when the terminal background is known. */
function PrepareAlpha(
    Canvas: Buffer,
    BackgroundColor: RgbColor | undefined,
    Rasterization: SvgRasterization
): void
{
    for (let Offset: number = 0; Offset < Canvas.length; Offset += 4)
    {
        const SourceAlpha: number = Canvas[Offset + 3] ?? 0;
        const Alpha: number = Rasterization === "crisp"
            ? CrispAlpha(SourceAlpha)
            : SourceAlpha;
        Canvas[Offset + 3] = Alpha;
        if (Alpha === 0)
        {
            // node-sixel's transparent-band encoder needs a non-zero native color
            // to initialize its transparent palette slot.
            Canvas[Offset] = 1;
            continue;
        }
        if (BackgroundColor === undefined)
        {
            if (Rasterization === "crisp")
            {
                Canvas[Offset + 3] = Alpha >= 96 ? 255 : 0;
                if (Canvas[Offset + 3] === 0) {Canvas[Offset] = 1;}
            }
            continue;
        }
        if (Alpha === 255) {continue;}

        const Opacity: number = Alpha / 255;
        Canvas[Offset] = Blend(Canvas[Offset] ?? 0, BackgroundColor.Red, Opacity);
        Canvas[Offset + 1] = Blend(Canvas[Offset + 1] ?? 0, BackgroundColor.Green, Opacity);
        Canvas[Offset + 2] = Blend(Canvas[Offset + 2] ?? 0, BackgroundColor.Blue, Opacity);
        Canvas[Offset + 3] = 255;
    }
}

/** Increase edge contrast and limit Sixel antialiasing to a small, stable set of shades. */
function CrispAlpha(Value: number): number
{
    if (Value <= 24) {return 0;}
    if (Value >= 231) {return 255;}
    const Normalized: number = (Value - 24) / 207;
    const Contrasted: number = Normalized * Normalized * (3 - 2 * Normalized);
    return Math.round(Contrasted * 7) / 7 * 255;
}

function Blend(Foreground: number, Background: number, Opacity: number): number
{
    return Math.round(Foreground * Opacity + Background * (1 - Opacity));
}

/** Use exact colors for ordinary SVGs and a bounded palette for complex gradients. */
function MakePalette(Canvas: Buffer): Array<[ number, number, number ]>
{
    const Colors = new Map<number, [ number, number, number ]>();
    for (let Offset: number = 0; Offset < Canvas.length; Offset += 4)
    {
        if ((Canvas[Offset + 3] ?? 0) === 0) {continue;}
        const Red: number = Canvas[Offset] ?? 0;
        const Green: number = Canvas[Offset + 1] ?? 0;
        const Blue: number = Canvas[Offset + 2] ?? 0;
        const Key: number = Red << 16 | Green << 8 | Blue;
        Colors.set(Key, [ Red, Green, Blue ]);
        if (Colors.size > 256) {return FixedPalette();}
    }
    return Colors.size === 0 ? [ [ 0, 0, 0 ] ] : [ ...Colors.values() ];
}

function FixedPalette(): Array<[ number, number, number ]>
{
    const Palette: Array<[ number, number, number ]> = [ ];
    const Levels: ReadonlyArray<number> = [ 0, 51, 102, 153, 204, 255 ];
    for (const Red of Levels)
    {
        for (const Green of Levels)
        {
            for (const Blue of Levels) {Palette.push([ Red, Green, Blue ]);}
        }
    }
    for (let Index: number = 0; Index < 32; Index += 1)
    {
        const Gray: number = Math.round(Index / 31 * 255);
        Palette.push([ Gray, Gray, Gray ]);
    }
    return Palette;
}

/** Get the position of a given element on the screen. */
function GetPosition(Node: Ink.DOMElement | null): Position | undefined
{
    if (Node?.yogaNode === undefined)
    {
        return undefined;
    }

    let AppHeight: number = 0;
    let Column: number = 0;
    let Current: Ink.DOMElement | undefined = Node;
    let Row: number = 0;

    while (Current !== undefined)
    {
        if (Current.yogaNode !== undefined)
        {
            Column += Current.yogaNode.getComputedLeft();
            Row += Current.yogaNode.getComputedTop();
            AppHeight = Current.yogaNode.getComputedHeight();
        }

        Current = Current.parentNode;
    }

    return { AppHeight, Column, Row };
}

/** Whether a given boundary is contained by the screen. */
function IsFullyVisible(
    PositionValue: Position,
    Width: number,
    Height: number,
    Stdout: NodeJS.WriteStream
): boolean
{
    const Columns: number | undefined = Stdout.columns;
    const Rows: number | undefined = Stdout.rows;
    const FirstVisibleRow: number = Rows === undefined
        ? 0
        : Math.max(0, PositionValue.AppHeight - Rows);

    return (Columns === undefined || PositionValue.Column + Width <= Columns)
        && PositionValue.Column >= 0
        && PositionValue.Row >= FirstVisibleRow
        && PositionValue.Row + Height <= PositionValue.AppHeight;
}

/** Create a fallback element. */
function RenderFallback(Fallback: SvgFallback | undefined, Error: Error): React.ReactElement | null
{
    if (Fallback === undefined)
    {
        return null;
    }

    if (React.isValidElement(Fallback))
    {
        return Fallback;
    }

    return React.createElement(Fallback, { error: Error });
}

/** Ensure that a given value is an `Error`. */
function ToError(Value: unknown): Error
{
    return Value instanceof Error ? Value : new Error(String(Value));
}
