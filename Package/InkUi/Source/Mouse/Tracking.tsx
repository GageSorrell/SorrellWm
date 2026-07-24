/**
 * Ink terminal mouse provider and hooks.
 *
 * @module @sorrell/ink-ui/Mouse/Tracking
 *
 * @file      Tracking.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type MouseEvent, type Scroll } from "./index.js";
import { Effect } from "effect";
import { IntPoint } from "@sorrell/math";

const EnableCellMouseTracking =
    "\x1b[?1006h\x1b[?1003h\x1b[?1004h";
const DisableCellMouseTracking =
    "\x1b[?1004l\x1b[?1003l\x1b[?1006l";

export/** Enable SGR mouse and terminal-focus reporting. */
const EnableTerminalMouseTracking = (
    Write: (Data: string) => void
): Effect.Effect<void> => Effect.sync(() => Write(EnableCellMouseTracking));

export/** Disable SGR mouse and terminal-focus reporting. */
const DisableTerminalMouseTracking = (
    Write: (Data: string) => void
): Effect.Effect<void> => Effect.sync(() => Write(DisableCellMouseTracking));

export/** Set the terminal input stream's raw-mode state. */
const SetRawMode = (
    Implementation: (IsRawMode: boolean) => void,
    IsRawMode: boolean
): Effect.Effect<void> =>
    Effect.sync(() => Implementation(IsRawMode));

export/** Resume a paused terminal input stream. */
const ResumeInput = (
    StandardInput: NodeJS.ReadStream
): Effect.Effect<void> =>
    Effect.sync(() => void StandardInput.resume());

export/** Attach a data listener to a terminal input stream. */
const AddInputListener = (
    StandardInput: NodeJS.ReadStream,
    HandleData: (Data: Buffer | string) => void
): Effect.Effect<void> =>
    Effect.sync(() => StandardInput.on("data", HandleData));

export/** Remove a data listener from a terminal input stream. */
const RemoveInputListener = (
    StandardInput: NodeJS.ReadStream,
    HandleData: (Data: Buffer | string) => void
): Effect.Effect<void> =>
    Effect.sync(() => StandardInput.off("data", HandleData));

export/**
       * Enable terminal tracking and attach an input listener.
       *
       * @category Mouse
       * @since 1.0.0
       */
const InstallTerminalMouseTracking = Effect.fn(
    "InstallTerminalMouseTracking"
)((
    StandardInput: NodeJS.ReadStream,
    Write: (Data: string) => void,
    SetRawModeImplementation: (IsRawMode: boolean) => void,
    HandleData: (Data: Buffer | string) => void
) => Effect.gen(function*()
{
    yield* SetRawMode(SetRawModeImplementation, true);
    yield* ResumeInput(StandardInput);
    yield* EnableTerminalMouseTracking(Write);
    yield* AddInputListener(StandardInput, HandleData);
}));

export/**
       * Detach an input listener and restore terminal mouse state.
       *
       * @category Mouse
       * @since 1.0.0
       */
const UninstallTerminalMouseTracking = Effect.fn(
    "UninstallTerminalMouseTracking"
)((
    StandardInput: NodeJS.ReadStream,
    Write: (Data: string) => void,
    SetRawModeImplementation: (IsRawMode: boolean) => void,
    HandleData: (Data: Buffer | string) => void
) => Effect.gen(function*()
{
    yield* RemoveInputListener(StandardInput, HandleData);
    yield* DisableTerminalMouseTracking(Write);
    yield* SetRawMode(SetRawModeImplementation, false);
}));

export/** Normalize a configurable distance into terminal-cell coordinates. */
const ResolveMouseDistance = (
    Value: MouseDistance | undefined,
    DefaultValue: IntPoint.IntPoint
): IntPoint.IntPoint =>
{
    if (Value === undefined)
    {
        return DefaultValue;
    }

    const X = typeof Value === "number" ? Value : Value.X;
    const Y = typeof Value === "number" ? Value : Value.Y;
    return IntPoint.IntPoint(
        Math.max(0, Math.floor(Number.isFinite(X) ? X : DefaultValue.X)),
        Math.max(0, Math.floor(Number.isFinite(Y) ? Y : DefaultValue.Y))
    );
};

/**
 * Configurable gesture thresholds used by the mouse parser.
 *
 * @category Mouse
 * @since 1.0.0
 */
export interface TrackingOptions
{
    readonly DoubleClickTimeMs: number;
    readonly DoubleClickMaxDistance: IntPoint.IntPoint;
    readonly DragActivationDistance: IntPoint.IntPoint;
}

/** A scalar or per-axis distance measured in terminal cells. */
export type MouseDistance =
    | number
    | IntPoint.IntPoint;

/**
 * Options shared by terminal mouse parsers and listeners.
 *
 * @category Mouse
 * @since 1.0.0
 */
export interface MouseOptions
{
    readonly OnEvent: (Event: MouseEvent.MouseEvent) => void;
    readonly IsEnabled?: boolean;
    readonly DoubleClickTimeMs?: number;
    readonly DoubleClickMaxDistance?: MouseDistance;
    readonly DragActivationDistance?: MouseDistance;
    readonly HorizontalScrollDirectionByButton?: Scroll.HorizontalDirection;
}

export/** The default double-click and drag gesture thresholds. */
const DefaultMouseGestureSettings: TrackingOptions =
    {
        DoubleClickMaxDistance: IntPoint.Unit.IJ,
        DoubleClickTimeMs: 500,
        DragActivationDistance: IntPoint.Unit.IJ
    } as const;
