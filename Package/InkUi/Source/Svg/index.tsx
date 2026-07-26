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
import { image2sixel } from "sixel";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryTerminalSupport } from "../Support/Query.js";
import type { TerminalSupport } from "../Support/Types.js";

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

/** A component which is rendered after SVG rasterization or Sixel encoding fails. */
export type SvgFallback = React.ReactElement | React.ComponentType<{ readonly error: Error }>;

/** Props for {@link Svg}. Dimensions use the same terminal-cell units as Ink's `Box`. */
export interface SvgProps extends SizeProps
{
    readonly children: string | SvgElement;
    readonly fallback?: SvgFallback;
}

interface PreparedSvg
{
    readonly Content: string;
    readonly Height: number;
    readonly Width: number;
}

interface TerminalCapabilities
{
    readonly CellHeight: number;
    readonly CellWidth: number;
    readonly SupportsSixel: boolean;
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
 * The component emits nothing when the terminal does not report both its cell
 * pixel dimensions and Sixel support.
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
        aspectRatio
    }: SvgProps = Props;
    const { stdin, setRawMode } = Ink.useStdin();
    const { stdout } = Ink.useStdout();
    const BoxReference = React.useRef<Ink.DOMElement>(null);
    const Mounted = React.useRef<boolean>(true);
    const RasterCache = React.useRef<
        { readonly Key: string; readonly Sixel: string } | undefined
    >(undefined);
    const [ Capabilities, SetCapabilities ] = React.useState<TerminalCapabilities>();
    const [ Failure, SetFailure ] = React.useState<Error>();

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
        let Cancelled: boolean = false;

        void QueryTerminalSupport({ SetRawMode: setRawMode, Stdin: stdin, Stdout: stdout })
            .then((Result: TerminalSupport) =>
            {
                if (!Cancelled && Result.Sixel === true && Result.CellSizePixels !== undefined)
                {
                    SetCapabilities({
                        CellHeight: Result.CellSizePixels.Height,
                        CellWidth: Result.CellSizePixels.Width,
                        SupportsSixel: true
                    });
                }
            });

        return () =>
        {
            Cancelled = true;
        };
    }, [ setRawMode, stdin, stdout ]);

    React.useEffect(() =>
    {
        RasterCache.current = undefined;
        SetFailure(undefined);
    }, [ Preparation.Svg?.Content, Capabilities?.CellHeight, Capabilities?.CellWidth ]);

    const Paint = React.useCallback((): void =>
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
            const CacheKey: string = `${ Prepared.Content }\u0000${ PixelWidth }x${ PixelHeight }`;
            let Sixel: string | undefined = RasterCache.current?.Key === CacheKey
                ? RasterCache.current.Sixel
                : undefined;

            if (Sixel === undefined)
            {
                Sixel = RenderSixel(Prepared, PixelWidth, PixelHeight);
                RasterCache.current = { Key: CacheKey, Sixel };
            }

            const MoveUp: number = PositionValue.AppHeight - PositionValue.Row;
            const MoveRight: string = PositionValue.Column > 0
                ? `\u001B[${ PositionValue.Column }C`
                : "";

            stdout.write(
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
    }, [ Capabilities, Failure, Preparation.Svg, stdout ]);

    const SchedulePaint = React.useCallback((): void =>
    {
        setImmediate(Paint);
    }, [ Paint ]);

    React.useEffect(SchedulePaint);

    React.useEffect(() =>
    {
        stdout.on("resize", SchedulePaint);

        return () =>
        {
            stdout.off("resize", SchedulePaint);
        };
    }, [ SchedulePaint, stdout ]);

    const Error: Error | undefined = Preparation.Error ?? Failure;

    if (Error !== undefined)
    {
        return RenderFallback(fallback, Error);
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
        <React.Profiler id="@sorrell/ink-ui/Svg"
            onRender={ SchedulePaint }>
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
        </React.Profiler>
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
function RenderSixel(SvgValue: PreparedSvg, PixelWidth: number, PixelHeight: number): string
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

    return image2sixel(Canvas, PixelWidth, PixelHeight, 256, 1);
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

    return Columns !== undefined
        && Rows !== undefined
        && PositionValue.Column >= 0
        && PositionValue.Column + Width <= Columns
        && PositionValue.AppHeight - PositionValue.Row <= Rows
        && PositionValue.AppHeight - PositionValue.Row - Height >= 0;
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
