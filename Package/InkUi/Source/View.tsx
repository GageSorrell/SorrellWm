/**
 * Terminal.Gui-style framed views with shared border junctions.
 *
 * @module @sorrell/ink-ui/View
 *
 * @file      View.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "./Theme.js";

const Direction =
    {
        Down: 1 << 0,
        Left: 1 << 1,
        Right: 1 << 2,
        Up: 1 << 3
    } as const;

const Glyphs: Readonly<Record<number, string>> = Object.freeze({
    [Direction.Down]: "│",
    [Direction.Left]: "─",
    [Direction.Right]: "─",
    [Direction.Up]: "│",
    [Direction.Down | Direction.Left]: "┐",
    [Direction.Down | Direction.Right]: "┌",
    [Direction.Left | Direction.Right]: "─",
    [Direction.Up | Direction.Down]: "│",
    [Direction.Up | Direction.Left]: "┘",
    [Direction.Up | Direction.Right]: "└",
    [Direction.Down | Direction.Left | Direction.Right]: "┬",
    [Direction.Up | Direction.Down | Direction.Left]: "┤",
    [Direction.Up | Direction.Down | Direction.Right]: "├",
    [Direction.Up | Direction.Left | Direction.Right]: "┴",
    [Direction.Up | Direction.Down | Direction.Left | Direction.Right]: "┼"
});

/** {@inheritDoc ViewPane} */
export interface ViewPaneProps extends React.PropsWithChildren
{
    /** Zero-based column containing the pane's left edge. */
    readonly Column: number;

    /** Number of column tracks occupied by the pane. */
    readonly ColumnSpan?: number;

    /** Horizontal padding inside the pane's shared frame. */
    readonly PaddingX?: number;

    /** Vertical padding inside the pane's shared frame. */
    readonly PaddingY?: number;

    /** Zero-based row containing the pane's top edge. */
    readonly Row: number;

    /** Number of row tracks occupied by the pane. */
    readonly RowSpan?: number;
}

/** {@inheritDoc View} */
export interface ViewProps extends React.PropsWithChildren
{
    /** Use the active theme border color for the complete shared frame. */
    readonly Active?: boolean;

    /** Interior widths of the view's column tracks. */
    readonly Columns: ReadonlyArray<number>;

    /** Interior heights of the view's row tracks. */
    readonly Rows: ReadonlyArray<number>;
}

interface NormalizedPane
{
    readonly Children: React.ReactNode;
    readonly Column: number;
    readonly ColumnSpan: number;
    readonly Key: string | number;
    readonly PaddingX: number;
    readonly PaddingY: number;
    readonly Row: number;
    readonly RowSpan: number;
}

interface PaneFrame extends NormalizedPane
{
    readonly Bottom: number;
    readonly Left: number;
    readonly Right: number;
    readonly Top: number;
}

const PositiveInteger = (Value: number, Name: string): number =>
{
    if (!Number.isSafeInteger(Value) || Value < 1)
    {
        throw new RangeError(`${ Name } must be a positive safe integer.`);
    }

    return Value;
};

const NonNegativeInteger = (Value: number, Name: string): number =>
{
    if (!Number.isSafeInteger(Value) || Value < 0)
    {
        throw new RangeError(`${ Name } must be a non-negative safe integer.`);
    }

    return Value;
};

const TrackLines = (
    Tracks: ReadonlyArray<number>,
    Name: string
): ReadonlyArray<number> =>
{
    if (Tracks.length === 0)
    {
        throw new RangeError(`${ Name } must contain at least one track.`);
    }

    const Lines = [ 0 ];

    for (const [ Index, Size ] of Tracks.entries())
    {
        Lines.push(Lines[Lines.length - 1]!
            + PositiveInteger(Size, `${ Name }[${ Index }]`)
            + 1);
    }

    return Lines;
};

const NormalizePanes = (Value: React.ReactNode): ReadonlyArray<NormalizedPane> =>
    /* eslint-disable-next-line @typescript-eslint/typedef */
    React.Children.toArray(Value).map((Child, Index: number): NormalizedPane =>
    {
        if (!React.isValidElement<ViewPaneProps>(Child) || Child.type !== ViewPane)
        {
            throw new TypeError("View children must be direct ViewPane elements.");
        }

        return {
            Children: Child.props.children,
            Column: NonNegativeInteger(Child.props.Column, "ViewPane Column"),
            ColumnSpan: PositiveInteger(
                Child.props.ColumnSpan ?? 1,
                "ViewPane ColumnSpan"
            ),
            Key: Child.key ?? Index,
            PaddingX: NonNegativeInteger(Child.props.PaddingX ?? 0, "ViewPane PaddingX"),
            PaddingY: NonNegativeInteger(Child.props.PaddingY ?? 0, "ViewPane PaddingY"),
            Row: NonNegativeInteger(Child.props.Row, "ViewPane Row"),
            RowSpan: PositiveInteger(Child.props.RowSpan ?? 1, "ViewPane RowSpan")
        };
    });

const Frames = (
    Panes: ReadonlyArray<NormalizedPane>,
    ColumnLines: ReadonlyArray<number>,
    RowLines: ReadonlyArray<number>
): ReadonlyArray<PaneFrame> =>
{
    const Occupied = new Set<string>();

    return Panes.map((Pane: NormalizedPane): PaneFrame =>
    {
        if (Pane.Column + Pane.ColumnSpan >= ColumnLines.length
            || Pane.Row + Pane.RowSpan >= RowLines.length)
        {
            throw new RangeError("A ViewPane extends beyond the configured View tracks.");
        }

        for (let Row = Pane.Row; Row < Pane.Row + Pane.RowSpan; Row += 1)
        {
            for (
                let Column = Pane.Column;
                Column < Pane.Column + Pane.ColumnSpan;
                Column += 1
            )
            {
                const Cell = `${ Column },${ Row }`;
                if (Occupied.has(Cell))
                {
                    throw new RangeError("ViewPane track regions must not overlap.");
                }
                Occupied.add(Cell);
            }
        }

        return {
            ...Pane,
            Bottom: RowLines[Pane.Row + Pane.RowSpan]!,
            Left: ColumnLines[Pane.Column]!,
            Right: ColumnLines[Pane.Column + Pane.ColumnSpan]!,
            Top: RowLines[Pane.Row]!
        };
    });
};

const AddHorizontal = (
    Canvas: Array<Array<number>>,
    Left: number,
    Right: number,
    Row: number
): void =>
{
    for (let Column = Left; Column < Right; Column += 1)
    {
        const Current = Canvas[Row]![Column]!;
        const Next = Canvas[Row]![Column + 1]!;
        Canvas[Row]![Column] = Current | Direction.Right;
        Canvas[Row]![Column + 1] = Next | Direction.Left;
    }
};

const AddVertical = (
    Canvas: Array<Array<number>>,
    Top: number,
    Bottom: number,
    Column: number
): void =>
{
    for (let Row = Top; Row < Bottom; Row += 1)
    {
        const Current = Canvas[Row]![Column]!;
        const Next = Canvas[Row + 1]![Column]!;
        Canvas[Row]![Column] = Current | Direction.Down;
        Canvas[Row + 1]![Column] = Next | Direction.Up;
    }
};

const BorderCanvas = (
    Width: number,
    Height: number,
    Panes: ReadonlyArray<PaneFrame>
): string =>
{
    const Canvas = Array.from(
        { length: Height },
        () => Array.from({ length: Width }, () => 0)
    );

    for (const Pane of Panes)
    {
        AddHorizontal(Canvas, Pane.Left, Pane.Right, Pane.Top);
        AddHorizontal(Canvas, Pane.Left, Pane.Right, Pane.Bottom);
        AddVertical(Canvas, Pane.Top, Pane.Bottom, Pane.Left);
        AddVertical(Canvas, Pane.Top, Pane.Bottom, Pane.Right);
    }

    return Canvas.map((Row: ReadonlyArray<number>) =>
        Row.map((Mask: number) => Glyphs[Mask] ?? " ").join("")
    ).join("\n");
};

export/**
       * Declares one content pane within a `View`; its frame is drawn by the parent.
       *
       * @category Layout
       * @since 1.0.0
       */
const ViewPane = (_Props: ViewPaneProps): React.ReactNode => null;

export/**
       * Arranges framed panes on shared row and column tracks, joining every border.
       *
       * Track sizes describe pane interiors. Adjacent panes reuse the same border
       * coordinate, while row and column spans produce the appropriate T-junction
       * and cross glyphs automatically.
       *
       * @category Layout
       * @since 1.0.0
       */
const View = ({
    Active = false,
    Columns,
    Rows,
    children
}: ViewProps): React.ReactNode =>
{
    const Theme = useTheme();
    const ColumnLines = TrackLines(Columns, "View Columns");
    const RowLines = TrackLines(Rows, "View Rows");
    const Width = ColumnLines[ColumnLines.length - 1]! + 1;
    const Height = RowLines[RowLines.length - 1]! + 1;
    const Panes = Frames(NormalizePanes(children), ColumnLines, RowLines);

    return (
        <Ink.Box
            height={ Height }
            position="relative"
            width={ Width }>
            <Ink.Box
                height={ Height }
                left={ 0 }
                position="absolute"
                top={ 0 }
                width={ Width }>
                <Ink.Text color={ Active ? Theme.BorderActive : Theme.Border }>
                    { BorderCanvas(Width, Height, Panes) }
                </Ink.Text>
            </Ink.Box>
            { Panes.map((Pane: PaneFrame) =>
            {
                const ContentWidth = Math.max(
                    0,
                    Pane.Right - Pane.Left - 1 - (Pane.PaddingX * 2)
                );
                const ContentHeight = Math.max(
                    0,
                    Pane.Bottom - Pane.Top - 1 - (Pane.PaddingY * 2)
                );
                const Content = typeof Pane.Children === "string"
                    || typeof Pane.Children === "number"
                    ? <Ink.Text>{ Pane.Children }</Ink.Text>
                    : Pane.Children;

                return ContentWidth === 0 || ContentHeight === 0
                    ? null
                    : (
                        <Ink.Box
                            flexDirection="column"
                            height={ ContentHeight }
                            key={ Pane.Key }
                            left={ Pane.Left + 1 + Pane.PaddingX }
                            overflow="hidden"
                            position="absolute"
                            top={ Pane.Top + 1 + Pane.PaddingY }
                            width={ ContentWidth }>
                            { Content }
                        </Ink.Box>
                    );
            }) }
        </Ink.Box>
    );
};
