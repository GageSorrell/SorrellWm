/**
 * Render SVG content with the iTerm2 image protocol or Sixel.
 *
 * @module @sorrell/ink-ui/Svg/Svg
 *
 * @file      Svg.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { FINALIZER, introducer, sixelEncode } from "sixel";
import { RegisterPainter, RequestPaint } from "./Paint.ts";
import { type RenderedImage, Resvg } from "@resvg/resvg-js";
import type { RgbColor, TerminalSupport } from "../Support/Types.ts";
import { renderToStaticMarkup } from "react-dom/server";
import { useTerminalSupport } from "../Support/Hook.tsx";

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

/** A component rendered when SVG image rendering or its terminal requirements fail. */
export type SvgFallback = React.ReactElement | React.ComponentType<{ readonly error: Error }>;

/** Pixel-edge treatment used while rasterizing an SVG. */
export type SvgRasterization =
    | "crisp"
    | "smooth";

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
    readonly ItermDoNotMoveCursor: boolean;
    readonly Protocol: ImageProtocol;
}

type ImageProtocol = "iterm2" | "sixel";

interface Position
{
    readonly AppHeight: number;
    readonly Column: number;
    readonly Row: number;
}

/**
 * Renders one SVG element as an inline terminal image.
 *
 * When no fallback is supplied, the component emits nothing if the terminal
 * does not report its cell pixel dimensions and at least one supported image
 * protocol. The iTerm2 protocol is preferred when both it and Sixel are
 * available.
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
        { readonly Image: string; readonly Key: string } | undefined
    >(undefined);
    const [ Failure, SetFailure ] = React.useState<Error>();
    const Protocol: ImageProtocol | undefined = SelectImageProtocol(Support);
    const Capabilities: TerminalCapabilities | undefined = React.useMemo(() =>
        Protocol !== undefined && Support?.CellSizePixels !== undefined
            ? {
                ...(Support.BackgroundColor === undefined
                    ? { }
                    : { BackgroundColor: Support.BackgroundColor }),
                CellHeight: Support.CellSizePixels.Y,
                CellWidth: Support.CellSizePixels.X,
                ItermDoNotMoveCursor: Support.Terminal.Kind === "wezterm",
                Protocol
            }
            : undefined,
    [ Protocol, Support ]);
    const CapabilityFailure: Error | undefined = Support === undefined
        ? undefined
        : (Protocol === undefined
            ? new Error("The terminal does not support iTerm2 image or Sixel rendering.")
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
        Capabilities?.CellWidth,
        Capabilities?.ItermDoNotMoveCursor,
        Capabilities?.Protocol
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
            const CacheKey: string = `${ Capabilities.Protocol }\u0000${ Prepared.Content }`
                + `\u0000${ PixelWidth }x${ PixelHeight }\u0000${ CellWidth }x${ CellHeight }`
                + `\u0000${ rasterization }\u0000${ Capabilities.ItermDoNotMoveCursor }`;
            let Image: string | undefined = RasterCache.current?.Key === CacheKey
                ? RasterCache.current.Image
                : undefined;

            if (Image === undefined)
            {
                Image = RenderImage(
                    Capabilities.Protocol,
                    Prepared,
                    PixelWidth,
                    PixelHeight,
                    CellWidth,
                    CellHeight,
                    Capabilities.BackgroundColor,
                    Capabilities.ItermDoNotMoveCursor,
                    rasterization
                );
                RasterCache.current = { Image, Key: CacheKey };
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
                `\u001B7${ MoveUp > 0 ? `\u001B[${ MoveUp }A` : "" }\r${ MoveRight }${ Image }\u001B8`
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
    const RegisteredPainter = React.useCallback(
        (WriteValue: (Value: string) => void): void =>
            PaintReference.current(WriteValue),
        [ ]
    );
    React.useEffect(() =>
    {
        return RegisterPainter(stdout, RegisteredPainter);
    }, [ RegisteredPainter, stdout ]);
    React.useEffect(
        () => RequestPaint(stdout, RegisteredPainter),
        [ Paint, RegisteredPainter, stdout ]
    );

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

/** Prefer iTerm2 inline images and retain Sixel as the fallback. */
function SelectImageProtocol(Support: TerminalSupport | undefined): ImageProtocol | undefined
{
    if (Support?.ItermImages === true)
    {
        return "iterm2";
    }
    if (Support?.Sixel === true)
    {
        return "sixel";
    }
    return undefined;
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

/** Rasterize and encode an SVG with the selected terminal image protocol. */
function RenderImage(
    Protocol: ImageProtocol,
    SvgValue: PreparedSvg,
    PixelWidth: number,
    PixelHeight: number,
    CellWidth: number,
    CellHeight: number,
    BackgroundColor: RgbColor | undefined,
    ItermDoNotMoveCursor: boolean,
    Rasterization: SvgRasterization
): string
{
    return Protocol === "iterm2"
        ? RenderItermImage(
            SvgValue,
            PixelWidth,
            PixelHeight,
            CellWidth,
            CellHeight,
            ItermDoNotMoveCursor,
            Rasterization
        )
        : RenderSixel(
            SvgValue,
            PixelWidth,
            PixelHeight,
            BackgroundColor,
            Rasterization
        );
}

/** Encode a rasterized SVG with the OSC 1337 `File` inline-image protocol. */
function RenderItermImage(
    SvgValue: PreparedSvg,
    PixelWidth: number,
    PixelHeight: number,
    CellWidth: number,
    CellHeight: number,
    DoNotMoveCursor: boolean,
    Rasterization: SvgRasterization
): string
{
    const Png: Buffer = RasterizeSvg(
        SvgValue,
        PixelWidth,
        PixelHeight,
        Rasterization,
        true
    ).asPng();
    const ArgumentsValue: string = `inline=1;size=${ Png.length };width=${ CellWidth }`
        + `;height=${ CellHeight };preserveAspectRatio=1`
        + (DoNotMoveCursor ? ";doNotMoveCursor=1" : "");

    return `\u001B]1337;File=${ ArgumentsValue }:${ Png.toString("base64") }\u0007`;
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
    const Rendered: RenderedImage =
        RasterizeSvg(SvgValue, PixelWidth, PixelHeight, Rasterization, false);
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

/** Rasterize an SVG to fit within a terminal-cell pixel rectangle. */
function RasterizeSvg(
    SvgValue: PreparedSvg,
    PixelWidth: number,
    PixelHeight: number,
    Rasterization: SvgRasterization,
    UseSvgCrispEdges: boolean
): RenderedImage
{
    const Scale: number = Math.min(PixelWidth / SvgValue.Width, PixelHeight / SvgValue.Height);
    const Content: string = Rasterization === "crisp" && UseSvgCrispEdges
        ? WithCrispEdges(SvgValue.Content)
        : SvgValue.Content;

    return new Resvg(Content, {
        fitTo: { mode: "zoom", value: Scale }
    }).render();
}

/** Make crisp rendering available to PNG-backed protocols as well as Sixel. */
function WithCrispEdges(Content: string): string
{
    return Content.replace(
        /<svg\b([^>]*)>/u,
        (Element: string, Attributes: string): string =>
            /\bshape-rendering\s*=/u.test(Attributes)
                ? Element
                : `<svg shape-rendering="crispEdges"${ Attributes }>`
    );
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

const Blend = (Foreground: number, Background: number, Opacity: number): number =>
    Math.round(Foreground * Opacity + Background * (1 - Opacity));

/** Use exact colors for ordinary SVGs and a bounded palette for complex gradients. */
const MakePalette = (Canvas: Buffer): Array<[ number, number, number ]> =>
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
};

const FixedPalette = (): Array<[ number, number, number ]> =>
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
};

/** Get the position of a given element on the screen. */
const GetPosition = (Node: Ink.DOMElement | null): Position | undefined =>
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
};

/** Whether a given boundary is contained by the screen. */
const IsFullyVisible = (
    PositionValue: Position,
    Width: number,
    Height: number,
    Stdout: NodeJS.WriteStream
): boolean =>
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
};

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
