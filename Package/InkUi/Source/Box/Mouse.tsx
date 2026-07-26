/**
 * Mouse-region behavior for Box.
 *
 * @module @sorrell/ink-ui/Box/Mouse
 *
 * @file      Mouse.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Button, MouseEvent, useOptionalMouseEvent } from "../Mouse/index.js";

/** A zero-based position relative to a Box's top-left cell. */
export interface BoxMousePosition
{
    readonly X: number;
    readonly Y: number;
}

/** A terminal mouse event augmented with its target Box and local position. */
export type BoxMouseEvent<EventType extends MouseEvent.LocalMouseEvent = MouseEvent.LocalMouseEvent> =
    EventType &
    {
        readonly CurrentTarget: Ink.DOMElement;
        readonly LocalPosition: BoxMousePosition;
    };

export type BoxMouseDownEvent = BoxMouseEvent<
    Extract<MouseEvent.MouseEvent, { readonly _tag: "Press" }>
>;

export type BoxMouseUpEvent = BoxMouseEvent<
    Extract<MouseEvent.MouseEvent, { readonly _tag: "Release" }>
>;

export type BoxMouseMoveEvent = BoxMouseEvent<
    Extract<MouseEvent.MouseEvent, { readonly _tag: "Move" | "Drag" }>
>;

export type BoxMouseDragEvent = BoxMouseEvent<
    Extract<MouseEvent.MouseEvent, { readonly _tag: "Drag" }>
>;

export type BoxWheelEvent = BoxMouseEvent<
    Extract<MouseEvent.MouseEvent, { readonly _tag: "Wheel" }>
>;

/** DOM-style mouse callbacks supported by Box. */
export interface BoxMouseHandlers
{
    readonly onAuxClick?: ((Event: BoxMouseUpEvent) => void) | undefined;
    readonly onClick?: ((Event: BoxMouseUpEvent) => void) | undefined;
    readonly onContextMenu?: ((Event: BoxMouseUpEvent) => void) | undefined;
    readonly onDoubleClick?: ((Event: BoxMouseUpEvent) => void) | undefined;
    readonly onMouseDown?: ((Event: BoxMouseDownEvent) => void) | undefined;
    readonly onMouseDrag?: ((Event: BoxMouseDragEvent) => void) | undefined;
    readonly onMouseEnter?: ((Event: BoxMouseEvent) => void) | undefined;
    readonly onMouseLeave?: ((Event: BoxMouseEvent) => void) | undefined;
    readonly onMouseMove?: ((Event: BoxMouseMoveEvent) => void) | undefined;
    readonly onMouseOut?: ((Event: BoxMouseEvent) => void) | undefined;
    readonly onMouseOver?: ((Event: BoxMouseEvent) => void) | undefined;
    readonly onMouseUp?: ((Event: BoxMouseUpEvent) => void) | undefined;
    readonly onWheel?: ((Event: BoxWheelEvent) => void) | undefined;
}

/** Half-open screen-space bounds in the terminal's one-based mouse coordinates. */
export interface BoxMouseBounds
{
    readonly Bottom: number;
    readonly Left: number;
    readonly Right: number;
    readonly Top: number;
}

interface BoxMouseRegionProps extends BoxMouseHandlers
{
    readonly TargetReference: React.RefObject<Ink.DOMElement | null>;
}

/** Subscribe a rendered Box region to the nearest MouseProvider. */
export function BoxMouseRegion(Props: BoxMouseRegionProps): null
{
    const { stdout } = Ink.useStdout();
    const IsInsideReference = React.useRef(false);
    const LastEventReference = React.useRef<BoxMouseEvent | undefined>(undefined);
    const PressedButtonsReference = React.useRef(new Set<Button.Button>());

    useOptionalMouseEvent((Event: MouseEvent.MouseEvent): void =>
    {
        const Target: Ink.DOMElement | null = Props.TargetReference.current;
        if (Target === null)
        {
            return;
        }

        if (!MouseEvent.IsLocalMouseEvent(Event))
        {
            if (Event._tag === "FocusOut")
            {
                const LastEvent: BoxMouseEvent | undefined = LastEventReference.current;
                if (IsInsideReference.current && LastEvent !== undefined)
                {
                    Props.onMouseLeave?.(LastEvent);
                    Props.onMouseOut?.(LastEvent);
                }
                IsInsideReference.current = false;
                PressedButtonsReference.current.clear();
            }
            return;
        }

        const Bounds: BoxMouseBounds | undefined = GetBoxMouseBounds(
            Target,
            stdout.columns,
            stdout.rows
        );
        const IsInside: boolean = Bounds !== undefined
            && IsMousePositionInside(Bounds, Event.Position.X, Event.Position.Y);
        const BoxEvent: BoxMouseEvent = MakeBoxMouseEvent(Event, Target);
        const WasInside: boolean = IsInsideReference.current;

        if (IsInside && !WasInside)
        {
            Props.onMouseEnter?.(BoxEvent);
            Props.onMouseOver?.(BoxEvent);
        }
        else if (!IsInside && WasInside)
        {
            Props.onMouseLeave?.(BoxEvent);
            Props.onMouseOut?.(BoxEvent);
        }

        IsInsideReference.current = IsInside;
        LastEventReference.current = BoxEvent;

        if (!IsInside)
        {
            if (Event._tag === "Release")
            {
                PressedButtonsReference.current.delete(Event.Button);
            }
            return;
        }

        switch (Event._tag)
        {
            case "Press":
                PressedButtonsReference.current.add(Event.Button);
                Props.onMouseDown?.(BoxEvent as BoxMouseDownEvent);
                break;
            case "Release":
            {
                const ReleaseEvent = BoxEvent as BoxMouseUpEvent;
                const WasPressedInside: boolean = PressedButtonsReference.current.delete(Event.Button);
                Props.onMouseUp?.(ReleaseEvent);
                if (WasPressedInside)
                {
                    if (Event.Button === Button.Left)
                    {
                        Props.onClick?.(ReleaseEvent);
                        if (Event.Click._tag === "Double")
                        {
                            Props.onDoubleClick?.(ReleaseEvent);
                        }
                    }
                    else
                    {
                        Props.onAuxClick?.(ReleaseEvent);
                    }
                    if (Event.Button === Button.Right)
                    {
                        Props.onContextMenu?.(ReleaseEvent);
                    }
                }
                break;
            }
            case "Move":
                Props.onMouseMove?.(BoxEvent as BoxMouseMoveEvent);
                break;
            case "Drag":
                Props.onMouseMove?.(BoxEvent as BoxMouseMoveEvent);
                Props.onMouseDrag?.(BoxEvent as BoxMouseDragEvent);
                break;
            case "Wheel":
                Props.onWheel?.(BoxEvent as BoxWheelEvent);
                break;
        }
    });

    return null;
}

/** Determine whether any mouse callback has been supplied. */
export function HasBoxMouseHandlers(Props: BoxMouseHandlers): boolean
{
    return Props.onAuxClick !== undefined
        || Props.onClick !== undefined
        || Props.onContextMenu !== undefined
        || Props.onDoubleClick !== undefined
        || Props.onMouseDown !== undefined
        || Props.onMouseDrag !== undefined
        || Props.onMouseEnter !== undefined
        || Props.onMouseLeave !== undefined
        || Props.onMouseMove !== undefined
        || Props.onMouseOut !== undefined
        || Props.onMouseOver !== undefined
        || Props.onMouseUp !== undefined
        || Props.onWheel !== undefined;
}

/** Calculate a Box's visible, terminal-clipped bounds for mouse hit testing. */
export function GetBoxMouseBounds(
    Node: Ink.DOMElement,
    TerminalColumns?: number,
    TerminalRows?: number
): BoxMouseBounds | undefined
{
    const Position = GetAbsolutePosition(Node);
    const Size = Ink.measureElement(Node);
    let Bounds: BoxMouseBounds = {
        Bottom: Position.Top + Size.height,
        Left: Position.Left,
        Right: Position.Left + Size.width,
        Top: Position.Top
    };
    let Ancestor: Ink.DOMElement | undefined = Node.parentNode;

    while (Ancestor !== undefined)
    {
        const AncestorPosition = GetAbsolutePosition(Ancestor);
        const AncestorSize = Ink.measureElement(Ancestor);
        if (Ancestor.style.overflow === "hidden" || Ancestor.style.overflowX === "hidden")
        {
            Bounds = {
                ...Bounds,
                Left: Math.max(Bounds.Left, AncestorPosition.Left),
                Right: Math.min(Bounds.Right, AncestorPosition.Left + AncestorSize.width)
            };
        }
        if (Ancestor.style.overflow === "hidden" || Ancestor.style.overflowY === "hidden")
        {
            Bounds = {
                ...Bounds,
                Bottom: Math.min(Bounds.Bottom, AncestorPosition.Top + AncestorSize.height),
                Top: Math.max(Bounds.Top, AncestorPosition.Top)
            };
        }
        Ancestor = Ancestor.parentNode;
    }

    if (TerminalColumns !== undefined)
    {
        Bounds = { ...Bounds, Left: Math.max(1, Bounds.Left), Right: Math.min(
            TerminalColumns + 1,
            Bounds.Right
        ) };
    }
    if (TerminalRows !== undefined)
    {
        Bounds = { ...Bounds, Bottom: Math.min(TerminalRows + 1, Bounds.Bottom), Top: Math.max(
            1,
            Bounds.Top
        ) };
    }

    return Bounds.Right > Bounds.Left && Bounds.Bottom > Bounds.Top ? Bounds : undefined;
}

/** Test a one-based terminal mouse position against half-open Box bounds. */
export function IsMousePositionInside(Bounds: BoxMouseBounds, X: number, Y: number): boolean
{
    return X >= Bounds.Left && X < Bounds.Right && Y >= Bounds.Top && Y < Bounds.Bottom;
}

function GetAbsolutePosition(Node: Ink.DOMElement): { readonly Left: number; readonly Top: number }
{
    let Current: Ink.DOMElement | undefined = Node;
    let Left = 1;
    let Top = 1;
    while (Current !== undefined)
    {
        if (Current.yogaNode !== undefined)
        {
            Left += Current.yogaNode.getComputedLeft();
            Top += Current.yogaNode.getComputedTop();
        }
        Current = Current.parentNode;
    }
    return { Left, Top };
}

function MakeBoxMouseEvent(
    Event: MouseEvent.LocalMouseEvent,
    Target: Ink.DOMElement
): BoxMouseEvent
{
    const Position = GetAbsolutePosition(Target);
    return {
        ...Event,
        CurrentTarget: Target,
        LocalPosition: {
            X: Event.Position.X - Position.Left,
            Y: Event.Position.Y - Position.Top
        }
    };
}
