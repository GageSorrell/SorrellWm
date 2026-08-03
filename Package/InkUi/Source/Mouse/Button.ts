/**
 * Button types and operations for Ink UI.
 *
 * @module @sorrell/ink-ui/Mouse/Button
 *
 * @file      Button.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Option } from "effect";

export/** The runtime identifier for mouse buttons. */
const TypeId = "~sorrell/ink-ui/Mouse/Button" as const;

/** The type of the mouse-button runtime identifier. */
export type TypeId = typeof TypeId;

/** Create a globally registered key for a button. */
const MakeKey = (Name: string): string => `${ TypeId }!${ Name }`;

export/** The primary mouse button. */
const Left: unique symbol = Symbol.for(MakeKey("Left"));

/** The type of the primary mouse button. */
export type Left = typeof Left;

export/** The middle mouse button. */
const Middle: unique symbol = Symbol.for(MakeKey("Middle"));

/** The type of the middle mouse button. */
export type Middle = typeof Middle;

export/** The secondary mouse button. */
const Right: unique symbol = Symbol.for(MakeKey("Right"));

/** The type of the secondary mouse button. */
export type Right = typeof Right;

export/** The value used when no mouse button is active. */
const None: unique symbol = Symbol.for(MakeKey("None"));

/** The type used when no mouse button is active. */
export type None = typeof None;

export/** Extended mouse button eight. */
const Button8: unique symbol = Symbol.for(MakeKey("Button8"));

/** The type of extended mouse button eight. */
export type Button8 = typeof Button8;

export/** Extended mouse button nine. */
const Button9: unique symbol = Symbol.for(MakeKey("Button9"));

/** The type of extended mouse button nine. */
export type Button9 = typeof Button9;

export/** Extended mouse button ten. */
const Button10: unique symbol = Symbol.for(MakeKey("Button10"));

/** The type of extended mouse button ten. */
export type Button10 = typeof Button10;

export/** Extended mouse button eleven. */
const Button11: unique symbol = Symbol.for(MakeKey("Button11"));

/** The type of extended mouse button eleven. */
export type Button11 = typeof Button11;

export/** A mouse button not recognized by this package. */
const Unknown: unique symbol = Symbol.for(MakeKey("Unknown"));

/** The type of an unrecognized mouse button. */
export type Unknown = typeof Unknown;

/** Any mouse button recognized by the terminal parser. */
export type Button =
    | Left
    | Middle
    | Right
    | None
    | Button8
    | Button9
    | Button10
    | Button11
    | Unknown;

export/** Every mouse button value recognized by the terminal parser. */
const Buttons: ReadonlyArray<Button> =
    [
        Left,
        Middle,
        Right,
        None,
        Button8,
        Button9,
        Button10,
        Button11,
        Unknown
    ] as const;

export/** Determine whether a value is a recognized mouse button. */
const IsMouseButton = (Value: unknown): Value is Button =>
    Buttons.includes(Value as Button);

/** A button number used by the SGR mouse protocol. */
export type ProtocolNum =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11;

export/** Decode the button number from a raw SGR mouse code. */
const GetProtocolNum = (RawCode: number): Option.Option<ProtocolNum> =>
{
    const Code = RawCode & ~(4 | 8 | 16 | 32);
    if ((Code & 128) !== 0)
    {
        return ToProtocolNumber(8 + (Code & 3));
    }
    if ((Code & 64) !== 0)
    {
        return ToProtocolNumber(4 + (Code & 3));
    }

    const Base = Code & 3;
    return Base === 3 ? Option.none() : ToProtocolNumber(Base + 1);
};

/** Convert an integer into a valid protocol button number. */
const ToProtocolNumber = (Value: number): Option.Option<ProtocolNum> =>
    Value >= 1 && Value <= 11
        ? Option.some(Value as ProtocolNum)
        : Option.none();

export/** Convert a protocol button number into its public button value. */
const FromProtocolNum = (Number: Option.Option<ProtocolNum>): Button =>
{
    if (Option.isNone(Number))
    {
        return None;
    }

    switch (Number.value)
    {
        case 1: return Left;
        case 2: return Middle;
        case 3: return Right;
        case 8: return Button8;
        case 9: return Button9;
        case 10: return Button10;
        case 11: return Button11;
        default: return Unknown;
    }
};
