/**
 * A subtle, animated gradient to show as a fallback while another component loads.
 *
 * @module @sorrell/ink-ui/Skeleton
 *
 * @file      Skeleton.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";

const DefaultFramesPerSecond = 20;
const InitialDelayMilliseconds = 180;
const MaximumFramesPerSecond = 60;
const MaximumTailLength = 6;
const MinimumPulseDurationMilliseconds = 700;
const PulseIntervalMilliseconds = 1_100;
const TailWidthRatio = 0.125;
const TravelCellsPerSecond = 48;

const TrackCharacter = "─";
const Shades: ReadonlyArray<string> = [ TrackCharacter, "░", "▒", "▓", "█" ];

/** {@inheritDoc Skeleton} */
export interface SkeletonProps
{
    /** Background color applied across the skeleton's complete width. */
    readonly BackgroundColor?: string;
    /** Foreground color shared by the track, tails, and full-block highlight. */
    readonly Color?: string;
    /** The number of frames per second at which the animation plays. Defaults to 20. */
    readonly FramesPerSecond?: number;
    /** Width in terminal cells or as a percentage of the parent. Defaults to `100%`. */
    readonly Width?: number | `${ number }%`;
}

interface AnimationProps
{
    readonly BackgroundColor: string | undefined;
    readonly Color: string | undefined;
    readonly FramesPerSecond: number;
    readonly Measure: () => void;
    readonly Width: number;
}

export/**
       * Renders an animated, terminal-native loading placeholder.
       *
       * The animation uses only box-drawing, shade, and block characters. Pulses
       * are launched at a fixed cadence, so ordinary widths include a quiet gap
       * while sufficiently wide skeletons can contain multiple pulses.
       *
       * @category Feedback
       * @since 1.0.0
       */
const Skeleton = ({
    BackgroundColor,
    Color,
    FramesPerSecond = DefaultFramesPerSecond,
    Width = "100%"
}: SkeletonProps): React.ReactElement =>
{
    const Reference = React.useRef<Ink.DOMElement>(null);
    const [ MeasuredWidth, SetMeasuredWidth ] = React.useState(
        typeof Width === "number" ? NormalizeWidth(Width) : 0
    );
    const Measure = React.useCallback((): void =>
    {
        const Node: Ink.DOMElement | null = Reference.current;
        if (Node === null)
        {
            return;
        }

        const NextWidth: number = NormalizeWidth(Ink.measureElement(Node).width);
        SetMeasuredWidth((CurrentWidth: number) =>
            CurrentWidth === NextWidth ? CurrentWidth : NextWidth);
    }, [ ]);

    React.useLayoutEffect(Measure, [ Measure, Width ]);

    return (
        <Ink.Box
            aria-hidden
            flexShrink={ 0 }
            height={ 1 }
            overflow="hidden"
            ref={ Reference }
            width={ Width }>
            <SkeletonAnimation
                BackgroundColor={ BackgroundColor }
                Color={ Color }
                FramesPerSecond={ NormalizeFramesPerSecond(FramesPerSecond) }
                Measure={ Measure }
                Width={ MeasuredWidth } />
        </Ink.Box>
    );
};

/**
 * Keep the frame clock below the measuring wrapper so a frame update does not
 * run layout effects for the complete Skeleton.
 */
const SkeletonAnimation = ({
    BackgroundColor,
    Color,
    FramesPerSecond,
    Measure,
    Width
}: AnimationProps): React.ReactElement =>
{
    const StartedAt = React.useRef<number>(Date.now());
    const TicksUntilMeasurement = React.useRef<number>(FramesPerSecond);
    const [ ElapsedMilliseconds, SetElapsedMilliseconds ] = React.useState(0);

    React.useEffect(() =>
    {
        if (Width <= 0)
        {
            return;
        }

        TicksUntilMeasurement.current = FramesPerSecond;
        const Tick = (): void =>
        {
            SetElapsedMilliseconds(Date.now() - StartedAt.current);
            TicksUntilMeasurement.current -= 1;
            if (TicksUntilMeasurement.current <= 0)
            {
                TicksUntilMeasurement.current = FramesPerSecond;
                Measure();
            }
        };
        const Interval: ReturnType<typeof setInterval> = setInterval(
            Tick,
            1_000 / FramesPerSecond
        );
        Tick();

        return (): void => clearInterval(Interval);
    }, [ FramesPerSecond, Measure, Width ]);

    const Frame: string = React.useMemo(
        () => RenderFrame(Width, ElapsedMilliseconds),
        [ ElapsedMilliseconds, Width ]
    );

    return (
        <Ink.Text
            aria-hidden
            { ...(BackgroundColor === undefined ? { } : { backgroundColor: BackgroundColor }) }
            { ...(Color === undefined ? { } : { color: Color }) }
            wrap="truncate-end">
            { Frame }
        </Ink.Text>
    );
};

/** Render one animation frame with zero or more independently eased pulses. */
const RenderFrame = (Width: number, ElapsedMilliseconds: number): string =>
{
    if (Width <= 0)
    {
        return "";
    }

    const Intensities: Array<number> = Array.from({ length: Width }, () => 0);
    const AnimationTime: number = ElapsedMilliseconds - InitialDelayMilliseconds;

    if (AnimationTime < 0)
    {
        return TrackCharacter.repeat(Width);
    }

    const TailLength: number = GetTailLength(Width);
    const StartPosition: number = -TailLength - 1;
    const EndPosition: number = Width + TailLength;
    const TravelDistance: number = EndPosition - StartPosition;
    const PulseDuration: number = Math.max(
        MinimumPulseDurationMilliseconds,
        TravelDistance / TravelCellsPerSecond * 1_000
    );
    const LastPulse: number = Math.floor(AnimationTime / PulseIntervalMilliseconds);
    const FirstPulse: number = Math.max(
        0,
        Math.ceil((AnimationTime - PulseDuration) / PulseIntervalMilliseconds)
    );

    for (let Pulse: number = FirstPulse; Pulse <= LastPulse; Pulse += 1)
    {
        const Age: number = AnimationTime - Pulse * PulseIntervalMilliseconds;
        if (Age < 0 || Age > PulseDuration)
        {
            continue;
        }

        const Progress: number = EaseInOutCubic(Age / PulseDuration);
        const Center: number = Math.round(
            StartPosition + TravelDistance * Progress
        );
        ApplyPulse(Intensities, Center, TailLength);
    }

    return Intensities.map((Intensity: number) => Shades[Intensity] ?? TrackCharacter).join("");
};

/** Overlay one full-block highlight and its symmetric shaded tails. */
const ApplyPulse = (
    Intensities: Array<number>,
    Center: number,
    TailLength: number
): void =>
{
    for (let Offset: number = -TailLength; Offset <= TailLength; Offset += 1)
    {
        const Position: number = Center + Offset;
        if (Position < 0 || Position >= Intensities.length)
        {
            continue;
        }

        const Distance: number = Math.abs(Offset);
        const Intensity: number = Distance === 0
            ? 4
            : Math.max(1, Math.ceil((TailLength - Distance + 1) / TailLength * 3));
        Intensities[Position] = Math.max(Intensities[Position] ?? 0, Intensity);
    }
};

/** Smooth acceleration and deceleration without discontinuities at pulse boundaries. */
const EaseInOutCubic = (Value: number): number =>
{
    const Clamped: number = Math.max(0, Math.min(1, Value));
    return Clamped < 0.5
        ? 4 * Clamped ** 3
        : 1 - (-2 * Clamped + 2) ** 3 / 2;
};

/** Scale tails with width while keeping wide skeletons visually restrained. */
const GetTailLength = (Width: number): number =>
    Math.max(1, Math.min(MaximumTailLength, Math.round(Width * TailWidthRatio)));

const NormalizeFramesPerSecond = (Value: number): number =>
{
    if (!Number.isFinite(Value) || Value <= 0)
    {
        return DefaultFramesPerSecond;
    }
    return Math.min(MaximumFramesPerSecond, Value);
};

const NormalizeWidth = (Value: number): number =>
    Number.isFinite(Value) ? Math.max(0, Math.floor(Value)) : 0;
