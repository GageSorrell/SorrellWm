/**
 * Scroll types and operations for Ink UI.
 *
 * @module @sorrell/ink-ui/Mouse/Scroll
 *
 * @file      Scroll.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Button, Parser } from "./index.js";
import { Data } from "effect";
import type { ProtocolNum } from "./Button.js";

export/** The runtime identifier for scroll values. */
const TypeId: unique symbol = Symbol.for("~sorrell/ink-ui/Mouse/Scroll");

/** The type of the scroll runtime identifier. */
export type TypeId = typeof TypeId;

/** Directions in which a terminal may report scrolling. */
export type Direction = Data.TaggedEnum<{
    readonly Up: { };
    readonly Down: { };
    readonly Left: { };
    readonly Right: { };
    readonly Unknown: { };
}>;

/** Axes along which a terminal may report scrolling. */
export type Axis = Data.TaggedEnum<{
    readonly Vertical: { };
    readonly Horizontal: { };
    readonly Unknown: { };
}>;

export/** Constructors and matchers for scroll axes. */
const Axis = Data.taggedEnum<Axis>();

export/** Constructors and matchers for scroll directions. */
const Direction = Data.taggedEnum<Direction>();

/** A scroll axis paired with its direction. */
export interface Scroll
{
    readonly [ TypeId ]: TypeId;

    readonly Axis: Axis;
    readonly Direction: Direction;
}

const Proto = { [ TypeId ]: TypeId } as const;

export/** Create an immutable scroll value. */
const Scroll = (Axis: Axis, Direction: Direction): Scroll =>
{
    const Out = Object.create(Proto);
    Out.Axis = Axis;
    Out.Direction = Direction;
    return Object.freeze(Out);
};

/** SGR protocol button numbers reserved for mouse-wheel reports. */
export type ScrollProtocolNum =
    Extract<ProtocolNum, 4 | 5 | 6 | 7>;

export/** Determine whether a button number represents a wheel report. */
const IsWheelProtocolNum = (Value: ProtocolNum): Value is ScrollProtocolNum =>
    Value >= 4 && Value <= 7;

export/** Resolve the scroll axis represented by a protocol button number. */
const GetAxis = (
    Number: Button.ProtocolNum
): Axis => Number === 4 || Number === 5
    ?  Axis.Vertical()
    :  Axis.Horizontal();

const DefaultHorizontalScrollDirectionByButton =
    {
        6: Direction.Left(),
        7: Direction.Right()
    } as const;

export/** Resolve the scroll direction represented by a protocol button number. */
const GetDirection = (
    ProtocolNum: Button.ProtocolNum,
    Options: Parser.ParserOptions
): Direction =>
{
    switch (ProtocolNum)
    {
        case 4: return Direction.Up();
        case 5: return Direction.Down();
        case 6:
            return Options.HorizontalScrollDirectionByButton?.[6]
                ?? DefaultHorizontalScrollDirectionByButton[6];
        case 7:
            return Options.HorizontalScrollDirectionByButton?.[7]
                ?? DefaultHorizontalScrollDirectionByButton[7];
        default:
            throw new RangeError(`Button.ProtocolNum was out of bounds, was ${ ProtocolNum }.`);
    }
};

/** Optional mapping of horizontal wheel buttons to directions. */
export type HorizontalDirection = Readonly<{
    readonly 6?:
        | Data.TaggedEnum.Value<Direction, "Left">
        | Data.TaggedEnum.Value<Direction, "Right">;
    readonly 7?:
        | Data.TaggedEnum.Value<Direction, "Left">
        | Data.TaggedEnum.Value<Direction, "Right">;
}>;
