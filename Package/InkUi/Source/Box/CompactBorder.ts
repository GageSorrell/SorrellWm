/**
 * Pixel rendering helpers for compact box borders.
 *
 * @module @sorrell/ink-ui/Box/CompactBorder
 *
 * @file      CompactBorder.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** A predefined CSS `<corner-shape-value>`. */
export type CornerShapeKeyword =
    | "bevel"
    | "notch"
    | "round"
    | "scoop"
    | "square"
    | "squircle";

/** A CSS `<corner-shape-value>`. */
export type CornerShapeValue = CornerShapeKeyword | `superellipse(${ string })`;

/** The measurements used to resolve a CSS length. */
export interface CssLengthContext
{
    readonly CellHeight: number;
    readonly CellWidth: number;
    readonly Height: number;
    readonly Width: number;
}

/** One RGBA color. */
export type Rgba = readonly [ Red: number, Green: number, Blue: number, Alpha: number ];

/** Options for one compact border corner. */
export interface CompactCornerOptions
{
    readonly Radius: number | string | undefined;
    readonly Shape: CornerShapeValue;
}

/** Options for rasterizing a compact border. */
export interface CompactBorderOptions extends CssLengthContext
{
    readonly Bottom: boolean;
    readonly BottomColor: Rgba;
    readonly BottomLeft: CompactCornerOptions;
    readonly BottomRight: CompactCornerOptions;
    readonly Left: boolean;
    readonly LeftColor: Rgba;
    /** Color behind the box, used to restore pixels outside a shaped corner. */
    readonly OuterBackgroundColor: Rgba | undefined;
    readonly Right: boolean;
    readonly RightColor: Rgba;
    readonly Top: boolean;
    readonly TopColor: Rgba;
    readonly TopLeft: CompactCornerOptions;
    readonly TopRight: CompactCornerOptions;
}

interface Point
{
    readonly X: number;
    readonly Y: number;
}

interface ResolvedCorner
{
    readonly Curvature: number;
    readonly Radius: number;
}

interface ResolvedCorners
{
    readonly BottomLeft: ResolvedCorner;
    readonly BottomRight: ResolvedCorner;
    readonly TopLeft: ResolvedCorner;
    readonly TopRight: ResolvedCorner;
}

interface ContentBounds
{
    readonly Bottom: number;
    readonly Left: number;
    readonly Right: number;
    readonly Top: number;
}

const CssLengthPattern: RegExp = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
const SuperellipsePattern: RegExp =
    /^superellipse\(\s*([+-]?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|infinity))\s*\)$/iu;

const KeywordCurvatures: Readonly<Record<CornerShapeKeyword, number>> = {
    bevel: 0,
    notch: Number.NEGATIVE_INFINITY,
    round: 1,
    scoop: -1,
    square: Number.POSITIVE_INFINITY,
    squircle: 2
};

/** Parse a CSS `<corner-shape-value>` into its superellipse parameter. */
export function ParseCornerShape(Value: CornerShapeValue | string): number | undefined
{
    const Normalized: string = Value.trim().toLowerCase();

    if (Object.hasOwn(KeywordCurvatures, Normalized))
    {
        return KeywordCurvatures[Normalized as CornerShapeKeyword];
    }

    const Match: RegExpExecArray | null = SuperellipsePattern.exec(Normalized);

    if (Match?.[1] === undefined)
    {
        return undefined;
    }

    if (Match[1] === "infinity" || Match[1] === "+infinity")
    {
        return Number.POSITIVE_INFINITY;
    }
    if (Match[1] === "-infinity")
    {
        return Number.NEGATIVE_INFINITY;
    }

    const Result: number = Number(Match[1]);
    return Number.isFinite(Result) ? Result : undefined;
}

/**
 * Resolve a CSS length into pixels.
 *
 * Font-relative units use the terminal cell: `1em` is one cell high and
 * `1ch` is one cell wide. Viewport units use the measured box. Percentages
 * use the smaller box dimension so scalar radii remain circular.
 */
export function ParseCssLength(
    Value: number | string,
    Context: CssLengthContext
): number | undefined
{
    if (typeof Value === "number")
    {
        return Number.isFinite(Value) ? Math.max(0, Value) : undefined;
    }

    const Match: RegExpExecArray | null = CssLengthPattern.exec(Value.trim());

    if (Match === null)
    {
        return undefined;
    }

    const Quantity: number = Number(Match[1]);
    const Unit: string = Match[2]?.toLowerCase() ?? "";
    const MinimumDimension: number = Math.min(Context.Width, Context.Height);
    const UnitValue: number | undefined = (() =>
    {
        switch (Unit)
        {
            case "":
            case "px": return 1;
            case "%": return MinimumDimension / 100;
            case "ch":
            case "ic": return Context.CellWidth;
            case "em":
            case "lh":
            case "rem":
            case "rlh": return Context.CellHeight;
            case "ex": return Context.CellHeight / 2;
            case "cap": return Context.CellHeight * 0.7;
            case "vw": return Context.Width / 100;
            case "vh": return Context.Height / 100;
            case "vmin": return MinimumDimension / 100;
            case "vmax": return Math.max(Context.Width, Context.Height) / 100;
            case "in": return 96;
            case "cm": return 96 / 2.54;
            case "mm": return 96 / 25.4;
            case "q": return 96 / 101.6;
            case "pt": return 96 / 72;
            case "pc": return 16;
            default: return undefined;
        }
    })();

    if (UnitValue === undefined || !Number.isFinite(Quantity))
    {
        return undefined;
    }

    return Math.max(0, Quantity * UnitValue);
}

/** Rasterize a one-pixel compact border into a transparent RGBA buffer. */
export function RenderCompactBorder(Options: CompactBorderOptions): Buffer
{
    const Width: number = Math.max(0, Math.floor(Options.Width));
    const Height: number = Math.max(0, Math.floor(Options.Height));
    const Canvas: Buffer = Buffer.alloc(Width * Height * 4);

    if (Width === 0 || Height === 0)
    {
        return Canvas;
    }

    const LeftX: number = Options.Left
        ? Math.min(Width - 1, Math.max(0, Math.round(Options.CellWidth) - 1))
        : 0;
    const RightX: number = Options.Right
        ? Math.max(0, Math.min(Width - 1, Width - Math.round(Options.CellWidth)))
        : Width - 1;
    const TopY: number = Options.Top
        ? Math.min(Height - 1, Math.max(0, Math.round(Options.CellHeight) - 1))
        : 0;
    const BottomY: number = Options.Bottom
        ? Math.max(0, Math.min(Height - 1, Height - Math.round(Options.CellHeight)))
        : Height - 1;

    if (LeftX > RightX || TopY > BottomY)
    {
        return Canvas;
    }

    const Corners: ResolvedCorners = ResolveCorners(
        Options,
        RightX - LeftX,
        BottomY - TopY
    );
    const Content: ContentBounds = {
        Bottom: Options.Bottom ? Height - Math.round(Options.CellHeight) - 1 : Height - 1,
        Left: Options.Left ? Math.round(Options.CellWidth) : 0,
        Right: Options.Right ? Width - Math.round(Options.CellWidth) - 1 : Width - 1,
        Top: Options.Top ? Math.round(Options.CellHeight) : 0
    };

    DrawSides(Canvas, Width, Options, Corners, LeftX, RightX, TopY, BottomY);
    DrawCorners(Canvas, Width, Options, Corners, Content, LeftX, RightX, TopY, BottomY);
    return Canvas;
}

function ResolveCorners(
    Options: CompactBorderOptions,
    AvailableWidth: number,
    AvailableHeight: number
): ResolvedCorners
{
    const Resolve = (Corner: CompactCornerOptions): ResolvedCorner => ({
        Curvature: ParseCornerShape(Corner.Shape) ?? 1,
        Radius: Math.max(0, Math.round(
            Corner.Radius === undefined ? 0 : (ParseCssLength(Corner.Radius, Options) ?? 0)
        ))
    });
    const Unscaled: ResolvedCorners = {
        BottomLeft: Resolve(Options.BottomLeft),
        BottomRight: Resolve(Options.BottomRight),
        TopLeft: Resolve(Options.TopLeft),
        TopRight: Resolve(Options.TopRight)
    };
    const Ratios: ReadonlyArray<number> = [
        RadiusRatio(AvailableWidth, Unscaled.TopLeft.Radius + Unscaled.TopRight.Radius),
        RadiusRatio(AvailableWidth, Unscaled.BottomLeft.Radius + Unscaled.BottomRight.Radius),
        RadiusRatio(AvailableHeight, Unscaled.TopLeft.Radius + Unscaled.BottomLeft.Radius),
        RadiusRatio(AvailableHeight, Unscaled.TopRight.Radius + Unscaled.BottomRight.Radius)
    ];
    const Scale: number = Math.min(1, ...Ratios);
    const ApplyScale = (Corner: ResolvedCorner): ResolvedCorner => ({
        ...Corner,
        Radius: Math.round(Corner.Radius * Scale)
    });

    return {
        BottomLeft: ApplyScale(Unscaled.BottomLeft),
        BottomRight: ApplyScale(Unscaled.BottomRight),
        TopLeft: ApplyScale(Unscaled.TopLeft),
        TopRight: ApplyScale(Unscaled.TopRight)
    };
}

function RadiusRatio(Available: number, Sum: number): number
{
    return Sum <= 0 ? 1 : Math.max(0, Available / Sum);
}

function DrawSides(
    Canvas: Buffer,
    Width: number,
    Options: CompactBorderOptions,
    Corners: ResolvedCorners,
    LeftX: number,
    RightX: number,
    TopY: number,
    BottomY: number
): void
{
    if (Options.Top)
    {
        DrawLine(Canvas, Width,
            LeftX + (Options.Left ? Corners.TopLeft.Radius : 0), TopY,
            RightX - (Options.Right ? Corners.TopRight.Radius : 0), TopY,
            Options.TopColor);
    }
    if (Options.Right)
    {
        DrawLine(Canvas, Width,
            RightX, TopY + (Options.Top ? Corners.TopRight.Radius : 0),
            RightX, BottomY - (Options.Bottom ? Corners.BottomRight.Radius : 0),
            Options.RightColor);
    }
    if (Options.Bottom)
    {
        DrawLine(Canvas, Width,
            RightX - (Options.Right ? Corners.BottomRight.Radius : 0), BottomY,
            LeftX + (Options.Left ? Corners.BottomLeft.Radius : 0), BottomY,
            Options.BottomColor);
    }
    if (Options.Left)
    {
        DrawLine(Canvas, Width,
            LeftX, BottomY - (Options.Bottom ? Corners.BottomLeft.Radius : 0),
            LeftX, TopY + (Options.Top ? Corners.TopLeft.Radius : 0),
            Options.LeftColor);
    }
}

function DrawCorners(
    Canvas: Buffer,
    Width: number,
    Options: CompactBorderOptions,
    Corners: ResolvedCorners,
    Content: ContentBounds,
    LeftX: number,
    RightX: number,
    TopY: number,
    BottomY: number
): void
{
    if (Options.Top && Options.Left)
    {
        DrawCorner(Canvas, Width, Content, Corners.TopLeft,
            { X: LeftX, Y: TopY + Corners.TopLeft.Radius },
            { X: LeftX + Corners.TopLeft.Radius, Y: TopY },
            { X: LeftX, Y: TopY },
            { X: LeftX + Corners.TopLeft.Radius, Y: TopY + Corners.TopLeft.Radius },
            Options.LeftColor, Options.TopColor, Options.OuterBackgroundColor);
    }
    if (Options.Top && Options.Right)
    {
        DrawCorner(Canvas, Width, Content, Corners.TopRight,
            { X: RightX - Corners.TopRight.Radius, Y: TopY },
            { X: RightX, Y: TopY + Corners.TopRight.Radius },
            { X: RightX, Y: TopY },
            { X: RightX - Corners.TopRight.Radius, Y: TopY + Corners.TopRight.Radius },
            Options.TopColor, Options.RightColor, Options.OuterBackgroundColor);
    }
    if (Options.Bottom && Options.Right)
    {
        DrawCorner(Canvas, Width, Content, Corners.BottomRight,
            { X: RightX, Y: BottomY - Corners.BottomRight.Radius },
            { X: RightX - Corners.BottomRight.Radius, Y: BottomY },
            { X: RightX, Y: BottomY },
            { X: RightX - Corners.BottomRight.Radius, Y: BottomY - Corners.BottomRight.Radius },
            Options.RightColor, Options.BottomColor, Options.OuterBackgroundColor);
    }
    if (Options.Bottom && Options.Left)
    {
        DrawCorner(Canvas, Width, Content, Corners.BottomLeft,
            { X: LeftX + Corners.BottomLeft.Radius, Y: BottomY },
            { X: LeftX, Y: BottomY - Corners.BottomLeft.Radius },
            { X: LeftX, Y: BottomY },
            { X: LeftX + Corners.BottomLeft.Radius, Y: BottomY - Corners.BottomLeft.Radius },
            Options.BottomColor, Options.LeftColor, Options.OuterBackgroundColor);
    }
}

function DrawCorner(
    Canvas: Buffer,
    Width: number,
    Content: ContentBounds,
    Corner: ResolvedCorner,
    Start: Point,
    End: Point,
    Outer: Point,
    Inner: Point,
    StartColor: Rgba,
    EndColor: Rgba,
    OuterBackgroundColor: Rgba | undefined
): void
{
    const Points: ReadonlyArray<Point> = MakeCornerPoints(Corner, Start, End, Outer, Inner);

    if (OuterBackgroundColor !== undefined && Corner.Radius > 0)
    {
        FillPolygon(Canvas, Width, [ Outer, ...Points ], Content, OuterBackgroundColor);
    }

    for (let Index: number = 1; Index < Points.length; Index += 1)
    {
        const Previous: Point | undefined = Points[Index - 1];
        const Current: Point | undefined = Points[Index];

        if (Previous !== undefined && Current !== undefined)
        {
            DrawLine(
                Canvas, Width, Previous.X, Previous.Y, Current.X, Current.Y,
                Index < Points.length / 2 ? StartColor : EndColor
            );
        }
    }
}

function MakeCornerPoints(
    Corner: ResolvedCorner,
    Start: Point,
    End: Point,
    Outer: Point,
    Inner: Point
): ReadonlyArray<Point>
{
    if (Corner.Radius === 0)
    {
        return [ Start ];
    }
    if (Corner.Curvature === Number.POSITIVE_INFINITY)
    {
        return [ Start, Outer, End ];
    }
    if (Corner.Curvature === Number.NEGATIVE_INFINITY)
    {
        return [ Start, Inner, End ];
    }

    const Center: Point = Corner.Curvature < 0 ? Outer : Inner;
    const Exponent: number = 0.5 ** Math.abs(Corner.Curvature);
    const Steps: number = Math.max(4, Math.ceil(Corner.Radius * Math.PI * 2));
    const Points: Array<Point> = [ ];

    for (let Step: number = 0; Step <= Steps; Step += 1)
    {
        const T: number = Step / Steps;
        const EndFactor: number = T ** Exponent;
        const StartFactor: number = (1 - T) ** Exponent;

        Points.push({
            X: Center.X + (End.X - Center.X) * EndFactor
                + (Start.X - Center.X) * StartFactor,
            Y: Center.Y + (End.Y - Center.Y) * EndFactor
                + (Start.Y - Center.Y) * StartFactor
        });
    }

    return Points;
}

function FillPolygon(
    Canvas: Buffer,
    Width: number,
    Polygon: ReadonlyArray<Point>,
    Content: ContentBounds,
    Color: Rgba
): void
{
    const MinimumX: number = Math.max(Content.Left, Math.floor(Math.min(
        ...Polygon.map((Value: Point) => Value.X)
    )));
    const MaximumX: number = Math.min(Content.Right, Math.ceil(Math.max(
        ...Polygon.map((Value: Point) => Value.X)
    )));
    const MinimumY: number = Math.max(Content.Top, Math.floor(Math.min(
        ...Polygon.map((Value: Point) => Value.Y)
    )));
    const MaximumY: number = Math.min(Content.Bottom, Math.ceil(Math.max(
        ...Polygon.map((Value: Point) => Value.Y)
    )));

    for (let Y: number = MinimumY; Y <= MaximumY; Y += 1)
    {
        for (let X: number = MinimumX; X <= MaximumX; X += 1)
        {
            if (PointInPolygon(X + 0.5, Y + 0.5, Polygon))
            {
                SetPixel(Canvas, Width, X, Y, Color);
            }
        }
    }
}

function PointInPolygon(X: number, Y: number, Polygon: ReadonlyArray<Point>): boolean
{
    let Inside: boolean = false;

    for (let Index: number = 0, PreviousIndex: number = Polygon.length - 1;
        Index < Polygon.length;
        PreviousIndex = Index, Index += 1)
    {
        const Current: Point | undefined = Polygon[Index];
        const Previous: Point | undefined = Polygon[PreviousIndex];

        if (Current === undefined || Previous === undefined)
        {
            continue;
        }

        const Crosses: boolean = (Current.Y > Y) !== (Previous.Y > Y)
            && X < (Previous.X - Current.X) * (Y - Current.Y)
                / (Previous.Y - Current.Y) + Current.X;
        if (Crosses)
        {
            Inside = !Inside;
        }
    }

    return Inside;
}

function DrawLine(
    Canvas: Buffer,
    Width: number,
    StartX: number,
    StartY: number,
    EndX: number,
    EndY: number,
    Color: Rgba
): void
{
    let X: number = Math.round(StartX);
    let Y: number = Math.round(StartY);
    const TargetX: number = Math.round(EndX);
    const TargetY: number = Math.round(EndY);
    const DeltaX: number = Math.abs(TargetX - X);
    const DeltaY: number = -Math.abs(TargetY - Y);
    const StepX: number = X < TargetX ? 1 : -1;
    const StepY: number = Y < TargetY ? 1 : -1;
    let Error: number = DeltaX + DeltaY;

    while (true)
    {
        SetPixel(Canvas, Width, X, Y, Color);

        if (X === TargetX && Y === TargetY)
        {
            break;
        }

        const DoubleError: number = Error * 2;

        if (DoubleError >= DeltaY)
        {
            Error += DeltaY;
            X += StepX;
        }
        if (DoubleError <= DeltaX)
        {
            Error += DeltaX;
            Y += StepY;
        }
    }
}

function SetPixel(Canvas: Buffer, Width: number, X: number, Y: number, Color: Rgba): void
{
    const Height: number = Canvas.length / 4 / Width;

    if (X < 0 || X >= Width || Y < 0 || Y >= Height)
    {
        return;
    }

    const Offset: number = (Y * Width + X) * 4;
    Canvas[Offset] = Color[0];
    Canvas[Offset + 1] = Color[1];
    Canvas[Offset + 2] = Color[2];
    Canvas[Offset + 3] = Color[3];
}
