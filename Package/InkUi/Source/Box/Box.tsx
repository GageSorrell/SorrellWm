/**
 *
 *
 * @module @sorrell/ink-ui/Box/Box
 *
 * @file      Box.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import {
    type BoxElevation,
    RenderBoxShadow,
    type RenderedBoxShadow
} from "./Shadow.js";
import {
    type BoxMouseHandlers,
    BoxMouseRegion,
    HasBoxMouseHandlers
} from "./Mouse.js";
import { CancelBoxPaint, QueueBoxPaint } from "./Paint.js";
import {
    type CompactBorderOptions,
    type CompactCornerOptions,
    type CornerShapeValue,
    RenderCompactBorder,
    type Rgba
} from "./CompactBorder.js";
import {
    type ShadowContextValue,
    type ShadowDefaults,
    useShadowDefaults
} from "../Shadow/index.js";
import { QueryTerminalSupport } from "../Support/Query.js";
import type { TerminalSupport } from "../Support/Types.js";
import { createRequire } from "node:module";
import { image2sixel } from "sixel";
import { useTerminalBackgroundColor } from "../Backdrop/index.js";

/** Props for {@link Box}. */
export type BoxProps = Omit<Ink.BoxProps, "borderStyle"> & BoxMouseHandlers &
{
    readonly children?: React.ReactNode;
    /** Use `compact` for a one-pixel Sixel border at the content-facing cell edges. */
    readonly borderStyle?: Ink.BoxProps["borderStyle"] | "compact" | undefined;
    /** Radius shared by all compact corners, in pixels or as a CSS length. */
    readonly borderRadius?: number | string | undefined;
    readonly borderTopLeftRadius?: number | string | undefined;
    readonly borderTopRightRadius?: number | string | undefined;
    readonly borderBottomRightRadius?: number | string | undefined;
    readonly borderBottomLeftRadius?: number | string | undefined;
    /** CSS shape shared by all compact corners. */
    readonly cornerShape?: CornerShapeValue | undefined;
    readonly cornerTopLeftShape?: CornerShapeValue | undefined;
    readonly cornerTopRightShape?: CornerShapeValue | undefined;
    readonly cornerBottomRightShape?: CornerShapeValue | undefined;
    readonly cornerBottomLeftShape?: CornerShapeValue | undefined;
    /** @deprecated Use `cornerShape`. */
    readonly compactCornerStyle?: CornerShapeValue | undefined;
    /** Sixel shadow height. Zero disables the shadow. */
    readonly elevation?: BoxElevation | undefined;
    /** Base shadow color blended with the background at each shadow pixel. */
    readonly shadowColor?: string | undefined;
    /** Paint order used when pixel effects overlap other components. */
    readonly zOrder?: number | undefined;
};

interface Position
{
    readonly AppHeight: number;
    readonly Column: number;
    readonly Row: number;
}

interface CellSize
{
    readonly BackgroundColor: Rgba | undefined;
    readonly Height: number;
    readonly Width: number;
}

const CompactLayoutBorder =
    {
        bottom: " ",
        bottomLeft: " ",
        bottomRight: " ",
        left: " ",
        right: " ",
        top: " ",
        topLeft: " ",
        topRight: " "
    } as const;

const Require = createRequire(import.meta.url);
const CssColorNames = Require("color-name") as Readonly<Record<string, ReadonlyArray<number>>>;

const DefaultColor: Rgba = [ 255, 255, 255, 255 ] as const;
const DefaultShadowColor: Rgba = [ 0, 0, 0, 255 ] as const;

const AnsiColors: Readonly<Record<string, Rgba>> =
    {
        black: [ 0, 0, 0, 255 ],
        blue: [ 36, 114, 200, 255 ],
        cyan: [ 17, 168, 205, 255 ],
        gray: [ 102, 102, 102, 255 ],
        green: [ 13, 188, 121, 255 ],
        grey: [ 102, 102, 102, 255 ],
        magenta: [ 188, 63, 188, 255 ],
        red: [ 205, 49, 49, 255 ],
        white: [ 229, 229, 229, 255 ],
        yellow: [ 229, 229, 16, 255 ],

        blackbright: [ 102, 102, 102, 255 ],
        bluebright: [ 59, 142, 234, 255 ],
        cyanbright: [ 41, 184, 219, 255 ],
        greenbright: [ 35, 209, 139, 255 ],
        magentabright: [ 214, 112, 214, 255 ],
        redbright: [ 241, 76, 76, 255 ],
        whitebright: [ 255, 255, 255, 255 ],
        yellowbright: [ 245, 245, 67, 255 ]
    };

export/**
       * Ink's `Box`, extended with `borderStyle="compact"`.
       *
       * Compact borders retain Ink's normal border-cell layout but draw a single
       * pixel on each border cell's inside edge. If Sixel support or the terminal
       * cell pixel size cannot be determined, the border is simply omitted.
       */
const Box = React.forwardRef<Ink.DOMElement, BoxProps>(function BoxComponent(
    Props: BoxProps,
    ForwardedReference: React.ForwardedRef<Ink.DOMElement>
): React.ReactElement
{
    const {
        borderStyle,
        elevation,
        onAuxClick,
        onClick,
        onContextMenu,
        onDoubleClick,
        onMouseDown,
        onMouseDrag,
        onMouseEnter,
        onMouseLeave,
        onMouseMove,
        onMouseOut,
        onMouseOver,
        onMouseUp,
        onWheel,
        shadowColor,
        zOrder,
        ...InkProps
    }: BoxProps = Props;
    const MouseHandlers: BoxMouseHandlers = {
        onAuxClick,
        onClick,
        onContextMenu,
        onDoubleClick,
        onMouseDown,
        onMouseDrag,
        onMouseEnter,
        onMouseLeave,
        onMouseMove,
        onMouseOut,
        onMouseOver,
        onMouseUp,
        onWheel
    };
    delete InkProps.borderBottomLeftRadius;
    delete InkProps.borderBottomRightRadius;
    delete InkProps.borderRadius;
    delete InkProps.borderTopLeftRadius;
    delete InkProps.borderTopRightRadius;
    delete InkProps.compactCornerStyle;
    delete InkProps.cornerBottomLeftShape;
    delete InkProps.cornerBottomRightShape;
    delete InkProps.cornerShape;
    delete InkProps.cornerTopLeftShape;
    delete InkProps.cornerTopRightShape;
    const TerminalBackgroundColor: string | undefined = useTerminalBackgroundColor();
    const EffectiveBackgroundColor: string | undefined = Props.backgroundColor
        ?? TerminalBackgroundColor;
    if (EffectiveBackgroundColor !== undefined)
    {
        InkProps.backgroundColor = EffectiveBackgroundColor;
    }
    const IsCompact: boolean = borderStyle === "compact";
    const ShadowContext: ShadowContextValue = useShadowDefaults();
    const ResolvedElevation: BoxElevation = NormalizeElevation(
        elevation ?? ShadowContext.Defaults.elevation ?? 0
    );
    const ElevationDefaults: Omit<ShadowDefaults, "elevation"> | undefined =
        ResolvedElevation === 0 ? undefined : ShadowContext.ElevationDefaults[ResolvedElevation];
    const ResolvedShadowColor: string | undefined = shadowColor
        ?? ElevationDefaults?.shadowColor
        ?? ShadowContext.Defaults.shadowColor;
    const ResolvedZOrder: number = NormalizeZOrder(
        zOrder ?? ElevationDefaults?.zOrder ?? ShadowContext.Defaults.zOrder ?? 0
    );
    const HasShadow: boolean = ResolvedElevation > 0;
    const NeedsPixelRendering: boolean = IsCompact || HasShadow;
    const { stdin, setRawMode } = Ink.useStdin();
    const { stdout } = Ink.useStdout();
    const InternalReference = React.useRef<Ink.DOMElement>(null);
    const CellSizeReference = React.useRef<CellSize | undefined>(undefined);
    const FailedReference = React.useRef<boolean>(false);
    const PaintReference = React.useRef<() => void>(() => undefined);
    const CacheReference = React.useRef<
        { readonly Key: string; readonly Sixel: string } | undefined
    >(undefined);
    const PaintIdReference = React.useRef<object>({ });

    const SetReference = React.useCallback((Node: Ink.DOMElement | null): void =>
    {
        InternalReference.current = Node;

        if (typeof ForwardedReference === "function")
        {
            ForwardedReference(Node);
        }
        else if (ForwardedReference !== null)
        {
            ForwardedReference.current = Node;
        }
    }, [ ForwardedReference ]);

    const SchedulePaint = React.useCallback((): void =>
    {
        setImmediate(() =>
        {
            PaintReference.current();
        });
    }, [ ]);

    React.useEffect(() =>
    {
        let Cancelled: boolean = false;

        if (!NeedsPixelRendering)
        {
            return;
        }

        void QueryTerminalSupport({ SetRawMode: setRawMode, Stdin: stdin, Stdout: stdout })
            .then((Support: TerminalSupport) =>
            {
                if (!Cancelled && Support.Sixel === true && Support.CellSizePixels !== undefined)
                {
                    CellSizeReference.current = {
                        BackgroundColor: Support.BackgroundColor === undefined
                            ? undefined
                            : [
                                Support.BackgroundColor.Red,
                                Support.BackgroundColor.Green,
                                Support.BackgroundColor.Blue,
                                255
                            ],
                        Height: Support.CellSizePixels.Height,
                        Width: Support.CellSizePixels.Width
                    };
                    SchedulePaint();
                }
            });

        return () =>
        {
            Cancelled = true;
        };
    }, [ NeedsPixelRendering, SchedulePaint, setRawMode, stdin, stdout ]);

    React.useEffect(() =>
    {
        CacheReference.current = undefined;
        FailedReference.current = false;
    }, [ Props, ResolvedElevation, ResolvedShadowColor, ShadowContext.Lofi ]);

    const Paint = React.useCallback((): void =>
    {
        const CellSizeValue: CellSize | undefined = CellSizeReference.current;
        const Reference: Ink.DOMElement | null = InternalReference.current;

        if (!NeedsPixelRendering || CellSizeValue === undefined
            || Reference === null || FailedReference.current)
        {
            return;
        }

        try
        {
            const PositionValue: Position | undefined = GetPosition(Reference);
            const Size: { readonly height: number; readonly width: number } = Ink.measureElement(Reference);
            const CellWidth: number = Math.floor(Size.width);
            const CellHeight: number = Math.floor(Size.height);

            if (PositionValue === undefined || CellWidth <= 0 || CellHeight <= 0
                || !IsFullyVisible(PositionValue, CellWidth, CellHeight, stdout))
            {
                return;
            }

            const PixelWidth: number = Math.round(CellWidth * CellSizeValue.Width);
            const PixelHeight: number = Math.round(CellHeight * CellSizeValue.Height);
            const OuterBackground: Rgba | undefined = FindInheritedBackground(Reference)
                ?? CellSizeValue.BackgroundColor;
            const BorderOptions: CompactBorderOptions | undefined = IsCompact
                ? CreateBorderOptions(
                    Props,
                    CellSizeValue,
                    PixelWidth,
                    PixelHeight,
                    EffectiveBackgroundColor === undefined ? undefined : OuterBackground
                )
                : undefined;
            const Shadow: RenderedBoxShadow | undefined = ResolvedElevation === 0
                ? undefined
                : RenderBoxShadow({
                    BackgroundColor: OuterBackground ?? DefaultShadowColor,
                    BoxHeight: PixelHeight,
                    BoxWidth: PixelWidth,
                    CellHeight: CellSizeValue.Height,
                    CellWidth: CellSizeValue.Width,
                    Elevation: ResolvedElevation,
                    Lofi: ShadowContext.Lofi,
                    ShadowColor: ParseColor(ResolvedShadowColor) ?? DefaultShadowColor
                });
            const CanvasWidth: number = Shadow?.Width ?? PixelWidth;
            const CanvasHeight: number = Shadow?.Height ?? PixelHeight;
            const LeftCells: number = (Shadow?.Insets.Left ?? 0) / CellSizeValue.Width;
            const TopCells: number = (Shadow?.Insets.Top ?? 0) / CellSizeValue.Height;
            const ExpandedPosition: Position = {
                ...PositionValue,
                Column: PositionValue.Column - LeftCells,
                Row: PositionValue.Row - TopCells
            };
            const ExpandedCellWidth: number = CanvasWidth / CellSizeValue.Width;
            const ExpandedCellHeight: number = CanvasHeight / CellSizeValue.Height;

            if (!IsFullyVisible(
                ExpandedPosition,
                ExpandedCellWidth,
                ExpandedCellHeight,
                stdout
            ))
            {
                return;
            }

            const CacheKey: string = JSON.stringify({
                BorderOptions,
                CanvasHeight,
                CanvasWidth,
                Elevation: ResolvedElevation,
                Lofi: ShadowContext.Lofi,
                OuterBackground,
                ShadowColor: ResolvedShadowColor
            });
            let Sixel: string | undefined = CacheReference.current?.Key === CacheKey
                ? CacheReference.current.Sixel
                : undefined;

            if (Sixel === undefined)
            {
                const Pixels: Buffer = Shadow?.Pixels ?? Buffer.alloc(CanvasWidth * CanvasHeight * 4);
                if (BorderOptions !== undefined)
                {
                    Composite(
                        Pixels,
                        CanvasWidth,
                        RenderCompactBorder(BorderOptions),
                        PixelWidth,
                        PixelHeight,
                        Shadow?.Insets.Left ?? 0,
                        Shadow?.Insets.Top ?? 0
                    );
                }
                Sixel = image2sixel(Pixels, CanvasWidth, CanvasHeight, 64, 1);
                CacheReference.current = { Key: CacheKey, Sixel };
            }

            const MoveUp: number = ExpandedPosition.AppHeight - ExpandedPosition.Row;
            const MoveRight: string = ExpandedPosition.Column > 0
                ? `\u001B[${ ExpandedPosition.Column }C`
                : "";

            QueueBoxPaint(
                stdout,
                PaintIdReference.current,
                ResolvedZOrder,
                `\u001B7${ MoveUp > 0 ? `\u001B[${ MoveUp }A` : "" }\r${ MoveRight }${ Sixel }\u001B8`
            );
        }
        catch
        {
            FailedReference.current = true;
        }
    }, [
        EffectiveBackgroundColor,
        IsCompact,
        NeedsPixelRendering,
        Props,
        ResolvedElevation,
        ResolvedShadowColor,
        ResolvedZOrder,
        ShadowContext.Lofi,
        stdout
    ]);

    PaintReference.current = Paint;

    React.useEffect(() =>
    {
        SchedulePaint();
    }, [ SchedulePaint ]);

    React.useEffect(() =>
    {
        stdout.on("resize", SchedulePaint);

        return () =>
        {
            stdout.off("resize", SchedulePaint);
        };
    }, [ SchedulePaint, stdout ]);

    React.useEffect(() => () =>
    {
        CancelBoxPaint(stdout, PaintIdReference.current);
    }, [ stdout ]);

    React.useEffect(() =>
    {
        if (!NeedsPixelRendering)
        {
            CancelBoxPaint(stdout, PaintIdReference.current);
        }
    }, [ NeedsPixelRendering, stdout ]);

    return (
        <React.Profiler id="@sorrell/ink-ui/Box"
            onRender={ SchedulePaint }>
            <>
                <Ink.Box
                    { ...InkProps }
                    borderStyle={ borderStyle === "compact" ? CompactLayoutBorder : borderStyle }
                    ref={ SetReference } />
                { HasBoxMouseHandlers(MouseHandlers)
                    ? <BoxMouseRegion
                        { ...MouseHandlers }
                        TargetReference={ InternalReference } />
                    : null }
            </>
        </React.Profiler>
    );
});

Box.displayName = "Box";

const NormalizeElevation = (Value: BoxElevation | number): BoxElevation =>
{
    if (!Number.isInteger(Value) || Value < 0 || Value > 5)
    {
        return 0;
    }

    return Value as BoxElevation;
};

const NormalizeZOrder = (Value: number): number =>
{
    return Number.isFinite(Value) ? Math.trunc(Value) : 0;
};

/** Place one RGBA image over another, including transparent source pixels. */
function Composite(
    Destination: Buffer,
    DestinationWidth: number,
    Source: Buffer,
    SourceWidth: number,
    SourceHeight: number,
    DestinationX: number,
    DestinationY: number
): void
{
    for (let Row: number = 0; Row < SourceHeight; Row += 1)
    {
        const SourceStart: number = Row * SourceWidth * 4;
        const DestinationStart: number = (
            (DestinationY + Row) * DestinationWidth + DestinationX
        ) * 4;
        Source.copy(
            Destination,
            DestinationStart,
            SourceStart,
            SourceStart + SourceWidth * 4
        );
    }
}

/**
 * Construct border options from `BoxProps`.
 *
 * @category Conversion
 * @since 1.0.0
 */
function CreateBorderOptions(
    Props: BoxProps,
    CellSizeValue: CellSize,
    Width: number,
    Height: number,
    OuterBackgroundColor: Rgba | undefined
): CompactBorderOptions
{
    const BaseColor: string | undefined = Props.borderColor;
    const BaseDim: boolean = Props.borderDimColor === true;

    return {
        Bottom: Props.borderBottom !== false,
        BottomColor: ResolveColor(
            Props.borderBottomColor ?? BaseColor,
            Props.borderBottomDimColor ?? BaseDim
        ),
        BottomLeft: CreateCorner(
            Props.borderBottomLeftRadius ?? Props.borderRadius,
            Props.cornerBottomLeftShape ?? Props.cornerShape ?? Props.compactCornerStyle
        ),
        BottomRight: CreateCorner(
            Props.borderBottomRightRadius ?? Props.borderRadius,
            Props.cornerBottomRightShape ?? Props.cornerShape ?? Props.compactCornerStyle
        ),
        CellHeight: CellSizeValue.Height,
        CellWidth: CellSizeValue.Width,
        Height,
        Left: Props.borderLeft !== false,
        LeftColor: ResolveColor(
            Props.borderLeftColor ?? BaseColor,
            Props.borderLeftDimColor ?? BaseDim
        ),
        OuterBackgroundColor,
        Right: Props.borderRight !== false,
        RightColor: ResolveColor(
            Props.borderRightColor ?? BaseColor,
            Props.borderRightDimColor ?? BaseDim
        ),
        Top: Props.borderTop !== false,
        TopColor: ResolveColor(
            Props.borderTopColor ?? BaseColor,
            Props.borderTopDimColor ?? BaseDim
        ),
        TopLeft: CreateCorner(
            Props.borderTopLeftRadius ?? Props.borderRadius,
            Props.cornerTopLeftShape ?? Props.cornerShape ?? Props.compactCornerStyle
        ),
        TopRight: CreateCorner(
            Props.borderTopRightRadius ?? Props.borderRadius,
            Props.cornerTopRightShape ?? Props.cornerShape ?? Props.compactCornerStyle
        ),
        Width
    };
}

/**
 * Construct a corner from its constituent values.
 *
 * @category Constructor
 * @since 1.0.0
 */
function CreateCorner(
    Radius: number | string | undefined,
    Shape: CornerShapeValue | undefined
): CompactCornerOptions
{
    return { Radius, Shape: Shape ?? "round" };
}

/**
 * Resolve a color from a color prop value and `dim` value.
 *
 * @category Constructor
 * @since 1.0.0
 */
function ResolveColor(Value: string | undefined, Dim: boolean): Rgba
{
    const Color: Rgba = ParseColor(Value) ?? DefaultColor;

    return Dim
        ? [ Math.round(Color[0] / 2), Math.round(Color[1] / 2), Math.round(Color[2] / 2), Color[3] ]
        : Color;
}

/**
 * Convert a color prop value into a `Rgba` value, if possible.
 *
 * @category Constructor
 * @since 1.0.0
 */
function ParseColor(Value: string | undefined): Rgba | undefined
{
    if (Value === undefined)
    {
        return undefined;
    }

    const Normalized: string = Value.trim().toLowerCase();
    const Named: Rgba | undefined = AnsiColors[Normalized];

    if (Named !== undefined)
    {
        return Named;
    }

    const CssNamed: ReadonlyArray<number> | undefined = CssColorNames[Normalized];

    if (CssNamed !== undefined)
    {
        return [ CssNamed[0] ?? 0, CssNamed[1] ?? 0, CssNamed[2] ?? 0, 255 ];
    }

    const HexPattern: RegExp = /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/iu;
    const HexMatch: RegExpExecArray | null = HexPattern.exec(Normalized);

    if (HexMatch !== null && HexMatch[1] !== undefined)
    {
        const Hex: string = HexMatch[1].length <= 4
            ? [ ...HexMatch[1] ].map((Character: string) => Character.repeat(2)).join("")
            : HexMatch[1];

        return [
            Number.parseInt(Hex.slice(0, 2), 16),
            Number.parseInt(Hex.slice(2, 4), 16),
            Number.parseInt(Hex.slice(4, 6), 16),
            Hex.length === 8 ? Number.parseInt(Hex.slice(6, 8), 16) : 255
        ];
    }

    const RgbPattern: RegExp = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/iu;
    const RgbMatch: RegExpExecArray | null = RgbPattern.exec(Normalized);

    if (RgbMatch !== null)
    {
        return [
            ClampByte(Number(RgbMatch[1])),
            ClampByte(Number(RgbMatch[2])),
            ClampByte(Number(RgbMatch[3])),
            255
        ];
    }

    const AnsiMatch: RegExpExecArray | null = /^ansi256\(\s*(\d+)\s*\)$/iu.exec(Normalized);

    return AnsiMatch === null ? undefined : Ansi256(Number(AnsiMatch[1]));
}

/**
 * Convert an `ansi256` color.
 *
 * @category Constructor
 * @since 1.0.0
 */
function Ansi256(Value: number): Rgba | undefined
{
    if (!Number.isInteger(Value) || Value < 0 || Value > 255)
    {
        return undefined;
    }

    const Basic: ReadonlyArray<Rgba> = [
        [ 0, 0, 0, 255 ], [ 128, 0, 0, 255 ], [ 0, 128, 0, 255 ], [ 128, 128, 0, 255 ],
        [ 0, 0, 128, 255 ], [ 128, 0, 128, 255 ], [ 0, 128, 128, 255 ], [ 192, 192, 192, 255 ],
        [ 128, 128, 128, 255 ], [ 255, 0, 0, 255 ], [ 0, 255, 0, 255 ], [ 255, 255, 0, 255 ],
        [ 0, 0, 255, 255 ], [ 255, 0, 255, 255 ], [ 0, 255, 255, 255 ], [ 255, 255, 255, 255 ]
    ];

    if (Value < 16)
    {
        return Basic[Value];
    }
    if (Value >= 232)
    {
        const Gray: number = 8 + (Value - 232) * 10;
        return [ Gray, Gray, Gray, 255 ];
    }

    const Levels: ReadonlyArray<number> = [ 0, 95, 135, 175, 215, 255 ];
    const Index: number = Value - 16;

    return [
        Levels[Math.floor(Index / 36)] ?? 0,
        Levels[Math.floor(Index % 36 / 6)] ?? 0,
        Levels[Index % 6] ?? 0,
        255
    ];
}

/**
 * Clamp a given color part to the appropriate range of integers.
 *
 * @category Conversion
 * @since 1.0.0
 */
function ClampByte(Value: number): number
{
    return Math.max(0, Math.min(255, Math.round(Value)));
}

/**
 * Get the background color that is "underneath" a component.
 *
 * @category Layout
 * @since 1.0.0
 */
function FindInheritedBackground(Node: Ink.DOMElement): Rgba | undefined
{
    let Current: Ink.DOMElement | undefined = Node.parentNode;

    while (Current !== undefined)
    {
        const Background: Rgba | undefined = ParseColor(Current.style.backgroundColor);

        if (Background !== undefined)
        {
            return Background;
        }

        Current = Current.parentNode;
    }

    return undefined;
}

/**
 * Get the position of a given element in screen space.
 *
 * @category Layout
 * @since 1.0.0
 */
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

/**
 * Determine whether a given set of bounds is contained by the terminal screen.
 *
 * @category Layout
 * @since 1.0.0
 */
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
