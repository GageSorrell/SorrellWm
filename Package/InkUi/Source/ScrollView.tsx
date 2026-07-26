/**
 * Two-axis, Box-compatible scrolling viewport.
 *
 * @module @sorrell/ink-ui/ScrollView
 *
 * @file      ScrollView.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import {
    Box,
    type BoxMouseDownEvent,
    type BoxMouseDragEvent,
    type BoxMouseUpEvent,
    type BoxProps,
    type BoxWheelEvent
} from "./Box/index.js";
import { type FocusableState, useFocusable } from "./Interaction/Focus.js";
import { Button as MouseButton } from "./Mouse/index.js";
import { useRoutedInput } from "./Interaction/Shortcut.js";
import { useTheme } from "./Theme.js";

/** CSS overflow values supported by {@link ScrollView}. */
export type ScrollViewOverflow = "auto" | "clip" | "hidden" | "scroll" | "visible";

/** Current zero-based scroll offsets. */
export interface ScrollViewPosition
{
    readonly Left: number;
    readonly Top: number;
}

/** Scrollbar thumb placement within its track. */
export interface ScrollbarGeometry
{
    readonly Length: number;
    readonly Start: number;
}

/** Props for {@link ScrollView}. */
export interface ScrollViewProps extends Omit<
    BoxProps,
    "children" | "overflow" | "overflowX" | "overflowY"
>
{
    /** Registers this viewport as the initial interaction focus. */
    readonly AutoFocus?: boolean;
    readonly children?: React.ReactNode;
    /** Prevent keyboard focus and scrolling interaction. */
    readonly Disabled?: boolean;
    /** Keep the viewport in focus order even while its contents do not overflow. */
    readonly FocusableWhenNotScrollable?: boolean;
    /** Node used where horizontal and vertical scrollbars meet. */
    readonly ScrollbarCorner?: React.ReactNode;
    /** Default node for both scrollbar thumbs. */
    readonly ScrollbarThumb?: React.ReactNode;
    /** Default node for both scrollbar tracks. */
    readonly ScrollbarTrack?: React.ReactNode;
    /** Node used for each cell of the horizontal thumb. */
    readonly HorizontalScrollbarThumb?: React.ReactNode;
    /** Node used for each cell of the horizontal track. */
    readonly HorizontalScrollbarTrack?: React.ReactNode;
    /** Interaction-system focus identifier. */
    readonly Id?: string;
    /** Called after the viewport's offsets change. */
    readonly OnScroll?: ((Position: ScrollViewPosition) => void) | undefined;
    readonly OnBlur?: (() => void) | undefined;
    readonly OnFocus?: (() => void) | undefined;
    /** Interaction-system focus ordering. */
    readonly Order?: number;
    /** CSS-like overflow policy for both axes. Defaults to `auto`. */
    readonly overflow?: ScrollViewOverflow;
    /** CSS-like horizontal overflow policy. */
    readonly overflowX?: ScrollViewOverflow;
    /** CSS-like vertical overflow policy. */
    readonly overflowY?: ScrollViewOverflow;
    /** Cells moved by an arrow key or one mouse-wheel step. */
    readonly ScrollStep?: number;
    /** Node used for each cell of the vertical thumb. */
    readonly VerticalScrollbarThumb?: React.ReactNode;
    /** Node used for each cell of the vertical track. */
    readonly VerticalScrollbarTrack?: React.ReactNode;
}

interface ScrollMetrics
{
    readonly ContentHeight: number;
    readonly ContentWidth: number;
    readonly ViewportHeight: number;
    readonly ViewportWidth: number;
}

interface DragState
{
    readonly Axis: "horizontal" | "vertical";
    readonly Coordinate: number;
    readonly Offset: number;
}

const EmptyMetrics: ScrollMetrics = {
    ContentHeight: 0,
    ContentWidth: 0,
    ViewportHeight: 0,
    ViewportWidth: 0
};

/** Calculate a proportional scrollbar thumb at block-element eighth-cell resolution. */
export function GetScrollbarGeometry(
    TrackLength: number,
    ViewportLength: number,
    ContentLength: number,
    Offset: number
): ScrollbarGeometry
{
    const SafeTrack: number = Math.max(0, Math.floor(TrackLength));
    if (SafeTrack === 0)
    {
        return { Length: 0, Start: 0 };
    }
    if (ContentLength <= 0 || ContentLength <= ViewportLength)
    {
        return { Length: SafeTrack, Start: 0 };
    }

    const Length: number = Clamp(
        RoundToEighth(SafeTrack * ViewportLength / ContentLength),
        Math.min(0.125, SafeTrack),
        SafeTrack
    );
    const MaximumOffset: number = Math.max(0, ContentLength - ViewportLength);
    const MaximumStart: number = Math.max(0, SafeTrack - Length);
    return {
        Length,
        Start: MaximumOffset === 0
            ? 0
            : RoundToEighth(MaximumStart * Clamp(Offset, 0, MaximumOffset) / MaximumOffset)
    };
}

export/**
       * Renders children in a CSS-like, measured scrolling box.
       *
       * `auto` scrollbars appear only when intrinsic content exceeds the measured
       * viewport. `scroll` always reserves scrollbar cells, `hidden` and `clip` clip
       * without a bar, and `visible` permits content to paint beyond the viewport.
       */
const ScrollView = React.forwardRef<Ink.DOMElement, ScrollViewProps>(
    function ScrollViewComponent(
        Props: ScrollViewProps,
        ForwardedReference: React.ForwardedRef<Ink.DOMElement>
    ): React.ReactElement
    {
        const {
            alignContent,
            alignItems,
            AutoFocus = false,
            children,
            columnGap,
            Disabled = false,
            flexDirection = "column",
            flexWrap,
            FocusableWhenNotScrollable = false,
            gap,
            HorizontalScrollbarThumb,
            HorizontalScrollbarTrack,
            Id,
            justifyContent,
            OnBlur,
            OnFocus,
            OnScroll,
            onMouseDown,
            onWheel,
            Order = 0,
            overflow = "auto",
            overflowX,
            overflowY,
            rowGap,
            ScrollbarCorner,
            ScrollbarThumb,
            ScrollbarTrack,
            ScrollStep = 1,
            VerticalScrollbarThumb,
            VerticalScrollbarTrack,
            ...OuterProps
        } = Props;
        const Theme = useTheme();
        const HorizontalPolicy: ScrollViewOverflow = overflowX ?? overflow;
        const VerticalPolicy: ScrollViewOverflow = overflowY ?? overflow;
        const ViewportReference = React.useRef<Ink.DOMElement>(null);
        const ContentReference = React.useRef<Ink.DOMElement>(null);
        const DragReference = React.useRef<DragState | undefined>(undefined);
        const [ Metrics, SetMetrics ] = React.useState<ScrollMetrics>(EmptyMetrics);
        const [ Position, SetPosition ] = React.useState<ScrollViewPosition>({ Left: 0, Top: 0 });
        const HorizontalOverflow: boolean = Metrics.ContentWidth > Metrics.ViewportWidth;
        const VerticalOverflow: boolean = Metrics.ContentHeight > Metrics.ViewportHeight;
        const ShowHorizontal: boolean = HorizontalPolicy === "scroll"
            || (HorizontalPolicy === "auto" && HorizontalOverflow);
        const ShowVertical: boolean = VerticalPolicy === "scroll"
            || (VerticalPolicy === "auto" && VerticalOverflow);
        const CanScrollHorizontal: boolean = IsScrollable(HorizontalPolicy) && HorizontalOverflow;
        const CanScrollVertical: boolean = IsScrollable(VerticalPolicy) && VerticalOverflow;
        const MaximumLeft: number = Math.max(0, Metrics.ContentWidth - Metrics.ViewportWidth);
        const MaximumTop: number = Math.max(0, Metrics.ContentHeight - Metrics.ViewportHeight);
        const Focus: FocusableState = useFocusable({
            AutoFocus,
            Disabled: Disabled || (!FocusableWhenNotScrollable
                && !CanScrollHorizontal
                && !CanScrollVertical),
            ...(Id === undefined ? { } : { Id }),
            OnBlur,
            OnFocus,
            Order
        });

        const SetOuterReference = React.useCallback((Node: Ink.DOMElement | null): void =>
        {
            if (typeof ForwardedReference === "function")
            {
                ForwardedReference(Node);
            }
            else if (ForwardedReference !== null)
            {
                ForwardedReference.current = Node;
            }
        }, [ ForwardedReference ]);

        const ScrollTo = React.useCallback((Left: number, Top: number): void =>
        {
            SetPosition((Current: ScrollViewPosition) =>
            {
                const Next: ScrollViewPosition =
                    {
                        Left: Clamp(Math.round(Left), 0, MaximumLeft),
                        Top: Clamp(Math.round(Top), 0, MaximumTop)
                    };
                return Next.Left === Current.Left && Next.Top === Current.Top ? Current : Next;
            });
        }, [ MaximumLeft, MaximumTop ]);

        const Measure = React.useCallback((): void =>
        {
            const Viewport: Ink.DOMElement | null = ViewportReference.current;
            const Content: Ink.DOMElement | null = ContentReference.current;
            if (Viewport === null || Content === null)
            {
                return;
            }
            const ViewportSize = Ink.measureElement(Viewport);
            const ContentSize = MeasureChildren(Content);
            const Next: ScrollMetrics = {
                ContentHeight: Math.max(
                    Math.floor(ViewportSize.height),
                    Math.floor(ContentSize.Height)
                ),
                ContentWidth: Math.max(
                    Math.floor(ViewportSize.width),
                    Math.floor(ContentSize.Width)
                ),
                ViewportHeight: Math.max(0, Math.floor(ViewportSize.height)),
                ViewportWidth: Math.max(0, Math.floor(ViewportSize.width))
            };
            SetMetrics((Current: ScrollMetrics) => EqualMetrics(Current, Next) ? Current : Next);
        }, [ ]);

        const ScheduleMeasure = React.useCallback((): void =>
        {
            setImmediate(Measure);
        }, [ Measure ]);

        React.useLayoutEffect(() =>
        {
            Measure();
        }, [ Measure, ShowHorizontal, ShowVertical, children ]);

        React.useLayoutEffect(() =>
        {
            ScrollTo(Position.Left, Position.Top);
        }, [ Position.Left, Position.Top, ScrollTo ]);

        const PreviousPositionReference = React.useRef(Position);
        React.useEffect(() =>
        {
            if (PreviousPositionReference.current !== Position)
            {
                PreviousPositionReference.current = Position;
                OnScroll?.(Position);
            }
        }, [ OnScroll, Position ]);

        useRoutedInput((_Input: string, Key: Ink.Key): boolean =>
        {
            if (Disabled)
            {
                return false;
            }
            if (Key.ctrl && Key.home)
            {
                ScrollTo(0, 0);
                return CanScrollHorizontal || CanScrollVertical;
            }
            if (Key.ctrl && Key.end)
            {
                ScrollTo(MaximumLeft, MaximumTop);
                return CanScrollHorizontal || CanScrollVertical;
            }
            if (Key.leftArrow && CanScrollHorizontal)
            {
                ScrollTo(Position.Left - NormalizeStep(ScrollStep), Position.Top);
                return true;
            }
            if (Key.rightArrow && CanScrollHorizontal)
            {
                ScrollTo(Position.Left + NormalizeStep(ScrollStep), Position.Top);
                return true;
            }
            if (Key.upArrow && CanScrollVertical)
            {
                ScrollTo(Position.Left, Position.Top - NormalizeStep(ScrollStep));
                return true;
            }
            if (Key.downArrow && CanScrollVertical)
            {
                ScrollTo(Position.Left, Position.Top + NormalizeStep(ScrollStep));
                return true;
            }
            if (Key.pageUp)
            {
                if (Key.shift && CanScrollHorizontal)
                {
                    ScrollTo(Position.Left - Metrics.ViewportWidth, Position.Top);
                    return true;
                }
                if (CanScrollVertical)
                {
                    ScrollTo(Position.Left, Position.Top - Metrics.ViewportHeight);
                    return true;
                }
            }
            if (Key.pageDown)
            {
                if (Key.shift && CanScrollHorizontal)
                {
                    ScrollTo(Position.Left + Metrics.ViewportWidth, Position.Top);
                    return true;
                }
                if (CanScrollVertical)
                {
                    ScrollTo(Position.Left, Position.Top + Metrics.ViewportHeight);
                    return true;
                }
            }
            if (Key.home && CanScrollVertical)
            {
                ScrollTo(Position.Left, 0);
                return true;
            }
            if (Key.end && CanScrollVertical)
            {
                ScrollTo(Position.Left, MaximumTop);
                return true;
            }
            return false;
        }, { Active: Focus.Focused && !Disabled, Priority: 50 });

        const HorizontalGeometry: ScrollbarGeometry = GetScrollbarGeometry(
            Metrics.ViewportWidth,
            Metrics.ViewportWidth,
            Metrics.ContentWidth,
            Position.Left
        );
        const VerticalGeometry: ScrollbarGeometry = GetScrollbarGeometry(
            Metrics.ViewportHeight,
            Metrics.ViewportHeight,
            Metrics.ContentHeight,
            Position.Top
        );

        const HandleWheel = (Event: BoxWheelEvent): void =>
        {
            const Horizontal: boolean = Event.ScrollAxis._tag === "Horizontal"
                || (Event.ScrollAxis._tag === "Vertical" && Event.Modifiers.Shift);
            const Direction: number = Event.ScrollDirection._tag === "Up"
                    || Event.ScrollDirection._tag === "Left"
                ? -1
                : Event.ScrollDirection._tag === "Down"
                    || Event.ScrollDirection._tag === "Right"
                    ? 1
                    : 0;
            const Step: number = NormalizeStep(ScrollStep) * Direction;
            if (Horizontal && CanScrollHorizontal)
            {
                ScrollTo(Position.Left + Step, Position.Top);
            }
            else if (!Horizontal && CanScrollVertical)
            {
                ScrollTo(Position.Left, Position.Top + Step);
            }
            onWheel?.(Event);
        };

        const BeginTrackInteraction = (
            Axis: "horizontal" | "vertical",
            Event: BoxMouseDownEvent,
            Geometry: ScrollbarGeometry
        ): void =>
        {
            if (Disabled || Event.Button !== MouseButton.Left)
            {
                return;
            }
            Focus.Focus();
            const Coordinate: number = Axis === "horizontal"
                ? Event.LocalPosition.X
                : Event.LocalPosition.Y;
            const Offset: number = Axis === "horizontal" ? Position.Left : Position.Top;
            const ThumbCellStart: number = Math.floor(Geometry.Start);
            const ThumbCellEnd: number = Math.ceil(Geometry.Start + Geometry.Length);
            if (Coordinate >= ThumbCellStart && Coordinate < ThumbCellEnd)
            {
                DragReference.current = { Axis, Coordinate, Offset };
                return;
            }
            const Direction: number = Coordinate < Geometry.Start ? -1 : 1;
            if (Axis === "horizontal")
            {
                ScrollTo(Position.Left + Direction * Metrics.ViewportWidth, Position.Top);
            }
            else
            {
                ScrollTo(Position.Left, Position.Top + Direction * Metrics.ViewportHeight);
            }
        };

        const DragThumb = (Axis: "horizontal" | "vertical", Event: BoxMouseDragEvent): void =>
        {
            const Drag: DragState | undefined = DragReference.current;
            if (Drag === undefined || Drag.Axis !== Axis || Event.Button !== MouseButton.Left)
            {
                return;
            }
            const Coordinate: number = Axis === "horizontal"
                ? Event.LocalPosition.X
                : Event.LocalPosition.Y;
            const Geometry: ScrollbarGeometry = Axis === "horizontal"
                ? HorizontalGeometry
                : VerticalGeometry;
            const TrackLength: number = Axis === "horizontal"
                ? Metrics.ViewportWidth
                : Metrics.ViewportHeight;
            const MaximumStart: number = Math.max(0, TrackLength - Geometry.Length);
            const MaximumOffset: number = Axis === "horizontal" ? MaximumLeft : MaximumTop;
            const NextOffset: number = MaximumStart === 0
                ? 0
                : Drag.Offset + (Coordinate - Drag.Coordinate) * MaximumOffset / MaximumStart;
            if (Axis === "horizontal")
            {
                ScrollTo(NextOffset, Position.Top);
            }
            else {ScrollTo(Position.Left, NextOffset);}
        };

        const EndDrag = (_Event: BoxMouseUpEvent): void =>
        {
            DragReference.current = undefined;
        };

        const DefaultTrack: React.ReactNode = (
            <Ink.Text aria-hidden
                backgroundColor={ Theme.Background }>{ " " }</Ink.Text>
        );
        const DefaultThumb: React.ReactNode = (
            <Ink.Text aria-hidden
                color={ Focus.Focused ? Theme.Primary : Theme.TextMuted }>█</Ink.Text>
        );
        const ThumbColor: string = Focus.Focused ? Theme.Primary : Theme.TextMuted;
        const HorizontalTrackNode: React.ReactNode = HorizontalScrollbarTrack
            ?? ScrollbarTrack
            ?? DefaultTrack;
        const HorizontalThumbNode: React.ReactNode = HorizontalScrollbarThumb
            ?? ScrollbarThumb
            ?? DefaultThumb;
        const VerticalTrackNode: React.ReactNode = VerticalScrollbarTrack
            ?? ScrollbarTrack
            ?? DefaultTrack;
        const VerticalThumbNode: React.ReactNode = VerticalScrollbarThumb
            ?? ScrollbarThumb
            ?? DefaultThumb;
        const UseHorizontalGranularDefaults: boolean = HorizontalScrollbarTrack === undefined
            && ScrollbarTrack === undefined
            && HorizontalScrollbarThumb === undefined
            && ScrollbarThumb === undefined;
        const UseVerticalGranularDefaults: boolean = VerticalScrollbarTrack === undefined
            && ScrollbarTrack === undefined
            && VerticalScrollbarThumb === undefined
            && ScrollbarThumb === undefined;
        const ContentLayoutProps = Object.fromEntries(Object.entries({
            alignContent,
            alignItems,
            columnGap,
            flexDirection,
            flexWrap,
            gap,
            justifyContent,
            rowGap
        }).filter((Entry: [string, unknown]) => Entry[1] !== undefined)) as BoxProps;

        return (
            <Box
                { ...OuterProps }
                flexDirection="column"
                onMouseDown={ (Event: BoxMouseDownEvent): void =>
                {
                    if (!Disabled && (CanScrollHorizontal || CanScrollVertical))
                    {
                        Focus.Focus();
                    }

                    onMouseDown?.(Event);
                } }
                onWheel={ HandleWheel }
                overflowX={ HorizontalPolicy === "visible" ? "visible" : "hidden" }
                overflowY={ VerticalPolicy === "visible" ? "visible" : "hidden" }
                ref={ SetOuterReference }>
                <Box
                    flexGrow={ 1 }
                    flexShrink={ 1 }
                    minHeight={ 0 }
                    minWidth={ 0 }>
                    <Box
                        alignItems="flex-start"
                        flexGrow={ 1 }
                        flexShrink={ 1 }
                        minHeight={ 0 }
                        minWidth={ 0 }
                        overflowX={ HorizontalPolicy === "visible" ? "visible" : "hidden" }
                        overflowY={ VerticalPolicy === "visible" ? "visible" : "hidden" }
                        ref={ ViewportReference }>
                        <React.Profiler id="@sorrell/ink-ui/ScrollView/Content"
                            onRender={ ScheduleMeasure }>
                            <Box
                                { ...ContentLayoutProps }
                                flexShrink={ 0 }
                                left={ CanScrollHorizontal ? -Position.Left : 0 }
                                position="relative"
                                ref={ ContentReference }
                                top={ CanScrollVertical ? -Position.Top : 0 }>
                                { children }
                            </Box>
                        </React.Profiler>
                    </Box>
                    { ShowVertical
                        ? <Scrollbar
                            Axis="vertical"
                            Geometry={ VerticalGeometry }
                            Granular={ UseVerticalGranularDefaults }
                            Length={ Metrics.ViewportHeight }
                            OnDrag={ (Event: BoxMouseDragEvent) => DragThumb("vertical", Event) }
                            OnMouseDown={ (Event: BoxMouseDownEvent) =>
                                BeginTrackInteraction("vertical", Event, VerticalGeometry) }
                            OnMouseUp={ EndDrag }
                            PartialBackgroundColor={ Theme.Background }
                            Thumb={ VerticalThumbNode }
                            ThumbColor={ ThumbColor }
                            Track={ VerticalTrackNode } />
                        : null }
                </Box>
                { ShowHorizontal
                    ? <Box flexShrink={ 0 }>
                        <Scrollbar
                            Axis="horizontal"
                            Geometry={ HorizontalGeometry }
                            Granular={ UseHorizontalGranularDefaults }
                            Length={ Metrics.ViewportWidth }
                            OnDrag={ (Event: BoxMouseDragEvent) => DragThumb("horizontal", Event) }
                            OnMouseDown={ (Event: BoxMouseDownEvent) =>
                                BeginTrackInteraction("horizontal", Event, HorizontalGeometry) }
                            OnMouseUp={ EndDrag }
                            PartialBackgroundColor={ Theme.Background }
                            Thumb={ HorizontalThumbNode }
                            ThumbColor={ ThumbColor }
                            Track={ HorizontalTrackNode } />
                        { ShowVertical
                            ? <Box flexShrink={ 0 }
                                height={ 1 }
                                overflow="hidden"
                                width={ 1 }>
                                { ToCellNode(ScrollbarCorner ?? " ") }
                            </Box>
                            : null }
                    </Box>
                    : null }
            </Box>
        );
    }
);

ScrollView.displayName = "ScrollView";

interface ScrollbarProps
{
    readonly Axis: "horizontal" | "vertical";
    readonly Geometry: ScrollbarGeometry;
    readonly Granular: boolean;
    readonly Length: number;
    readonly OnDrag: (Event: BoxMouseDragEvent) => void;
    readonly OnMouseDown: (Event: BoxMouseDownEvent) => void;
    readonly OnMouseUp: (Event: BoxMouseUpEvent) => void;
    readonly PartialBackgroundColor: string;
    readonly Thumb: React.ReactNode;
    readonly ThumbColor: string;
    readonly Track: React.ReactNode;
}

const Scrollbar = ({
    Axis,
    Geometry,
    Granular,
    Length,
    OnDrag,
    OnMouseDown,
    OnMouseUp,
    PartialBackgroundColor,
    Thumb,
    ThumbColor,
    Track
}: ScrollbarProps): React.ReactElement => (
    <Box
        flexDirection={ Axis === "horizontal" ? "row" : "column" }
        flexGrow={ Axis === "horizontal" ? 1 : 0 }
        flexShrink={ 0 }
        height={ Axis === "horizontal" ? 1 : "100%" }
        onMouseDown={ OnMouseDown }
        onMouseDrag={ OnDrag }
        onMouseUp={ OnMouseUp }
        overflow="hidden"
        { ...(Axis === "horizontal" ? { minWidth: 0 } : { width: 1 }) }>
        { Array.from({ length: Math.max(0, Length) }, (_: unknown, Index: number) => (
            <Box
                flexShrink={ 0 }
                height={ 1 }
                key={ Index }
                overflow="hidden"
                width={ 1 }>
                { ToCellNode(
                    GetScrollbarCell(
                        Index,
                        Axis,
                        Geometry,
                        Granular,
                        Track,
                        Thumb,
                        ThumbColor,
                        PartialBackgroundColor
                    )
                ) }
            </Box>
        )) }
    </Box>
);

const GetScrollbarCell = (
    Index: number,
    Axis: "horizontal" | "vertical",
    Geometry: ScrollbarGeometry,
    Granular: boolean,
    Track: React.ReactNode,
    Thumb: React.ReactNode,
    ThumbColor: string,
    PartialBackgroundColor: string
): React.ReactNode =>
{
    const Start: number = Geometry.Start;
    const End: number = Geometry.Start + Geometry.Length;
    const Overlap: number = Math.min(Index + 1, End) - Math.max(Index, Start);
    if (Overlap <= 0)
    {
        return Track;
    }
    if (Overlap >= 1)
    {
        return Thumb;
    }
    if (!Granular)
    {
        return Thumb;
    }

    const FilledEighths: number = Clamp(Math.round(Overlap * 8), 1, 7);
    const ThumbOccupiesTrailingEdge: boolean = Start > Index;
    return MakePartialBlock(
        Axis,
        FilledEighths,
        ThumbOccupiesTrailingEdge,
        ThumbColor,
        PartialBackgroundColor
    );
};

const HorizontalBlocks: ReadonlyArray<string> = [ "", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█" ];
const VerticalBlocks: ReadonlyArray<string> = [ "", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█" ];

const MakePartialBlock = (
    Axis: "horizontal" | "vertical",
    FilledEighths: number,
    Trailing: boolean,
    ThumbColor: string,
    BackgroundColor: string
): React.ReactElement =>
{
    const Blocks: ReadonlyArray<string> = Axis === "horizontal"
        ? HorizontalBlocks
        : VerticalBlocks;
    if ((Axis === "vertical") === Trailing)
    {
        return <Ink.Text aria-hidden
            color={ ThumbColor }>{ Blocks[FilledEighths] }</Ink.Text>;
    }

    return <Ink.Text aria-hidden
        backgroundColor={ ThumbColor }
        color={ BackgroundColor }>{ Blocks[8 - FilledEighths] }</Ink.Text>;
};

const ToCellNode = (Node: React.ReactNode): React.ReactNode =>
    typeof Node === "string" || typeof Node === "number"
        ? <Ink.Text aria-hidden>{ Node }</Ink.Text>
        : Node;

const IsScrollable = (Value: ScrollViewOverflow): boolean =>
    Value === "auto" || Value === "scroll";

const NormalizeStep = (Value: number): number =>
    Math.max(1, Number.isFinite(Value) ? Math.round(Math.abs(Value)) : 3);

const RoundToEighth = (Value: number): number => Math.round(Value * 8) / 8;

const Clamp = (Value: number, Minimum: number, Maximum: number): number =>
    Math.min(Maximum, Math.max(Minimum, Value));

const EqualMetrics = (Left: ScrollMetrics, Right: ScrollMetrics): boolean =>
    Left.ContentHeight === Right.ContentHeight
    && Left.ContentWidth === Right.ContentWidth
    && Left.ViewportHeight === Right.ViewportHeight
    && Left.ViewportWidth === Right.ViewportWidth;

const MeasureChildren = (Element: Ink.DOMElement): {
    readonly Height: number;
    readonly Width: number;
} =>
{
    let Height = 0;
    let Width = 0;
    for (const Child of Element.childNodes)
    {
        const Node = Child.yogaNode;
        if (Node === undefined)
        {
            continue;
        }
        Height = Math.max(Height, Node.getComputedTop() + Node.getComputedHeight());
        Width = Math.max(Width, Node.getComputedLeft() + Node.getComputedWidth());
    }
    return { Height, Width };
};
