/**
 *
 *
 * @module @sorrell/ink-ui/Mouse/MouseEvent
 *
 * @file      MouseEvent.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Button, Click, Scroll } from "./index.js";
import { Data, type Option } from "effect";
import type { IntPoint } from "@sorrell/math";
import type { Modifiers } from "./Modifiers.js";

/** Properties shared by every terminal mouse event. */
export interface MouseEventBase
{
    readonly Time: number;
}

/** Properties shared by mouse events associated with a terminal cell. */
export interface PositionedMouseEvent extends MouseEventBase
{
    readonly Button: Button.Button;
    readonly ProtocolNum: Option.Option<Button.ProtocolNum>;
    readonly Position: IntPoint.IntPoint;
    readonly Modifiers: Modifiers;
    readonly RawCode: number;
}

/** Every mouse and terminal-focus event emitted by the parser. */
export type MouseEvent = Data.TaggedEnum<{
    readonly FocusIn: MouseEventBase;
    readonly FocusOut: MouseEventBase;
    readonly Press: PositionedMouseEvent;
    readonly Release: PositionedMouseEvent & {
        readonly Click: Click.Click;
    };
    readonly Drag: PositionedMouseEvent;
    readonly Move: MouseEventBase &
        Pick<PositionedMouseEvent, "Position" | "Modifiers" | "RawCode">;
    readonly Wheel: Omit<PositionedMouseEvent, "ProtocolNum"> & {
        readonly ProtocolNum: Scroll.ScrollProtocolNum;
        readonly ScrollAxis: Scroll.Axis;
        readonly ScrollDirection: Scroll.Direction;
    };
}>;

export/** Constructors and matchers for terminal mouse events. */
const MouseEvent: Data.TaggedEnum.Constructor<MouseEvent> =
    Data.taggedEnum<MouseEvent>();

export namespace MouseEvent
{
    /** A mouse-button press event. */
    export type Down = Data.TaggedEnum.Value<MouseEvent, "Press">;
    /** A mouse-button release event. */
    export type Up = Data.TaggedEnum.Value<MouseEvent, "Release">;
    /** A mouse-wheel event. */
    export type Scroll = Data.TaggedEnum.Value<MouseEvent, "Wheel">;
}

/** A mouse event that includes a terminal-cell position. */
export type LocalMouseEvent = Exclude<
    MouseEvent,
    | Data.TaggedEnum.Value<MouseEvent, "FocusIn">
    | Data.TaggedEnum.Value<MouseEvent, "FocusOut">
>;

/**
 * Determine whether an event includes a terminal-cell position.
 *
 * @category Mouse
 * @since 1.0.0
 */
export/**
       * Determine whether an event includes a terminal-cell position.
       *
       * @category Mouse
       * @since 1.0.0
       */
const IsLocalMouseEvent = (
    Value: MouseEvent
): Value is LocalMouseEvent =>
    Value._tag !== "FocusIn" && Value._tag !== "FocusOut";
