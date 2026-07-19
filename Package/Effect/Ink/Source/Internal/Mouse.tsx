/**
 *
 *
 * @module @sorrell/effect-ink/Internal/Mouse
 * @internal
 *
 * @file      Mouse.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Array, Function, HashSet, Number, Option, Record } from "effect";
import type { Types } from "./index.ts";

export const TypeIdKey: "~sorrell/effect-ink/Internal/Mouse" = "~sorrell/effect-ink/Internal/Mouse" as const;

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

// interface MouseContext
// {
//     readonly
// };

// const EmptyContext: MouseContext =
//     {

//     } as const;

// export const Provider = React.createContext<>();

const ControlSequence =
    {
        Disable: "\x1b[?1002l\x1b[?1006l",
        Enable: "\x1b[?1002h\x1b[?1006h"
    } as const;

export namespace Button
{
    const MakeButtonSymbolKey = (OuterScope: string): (Label: string) => string =>
    {
        return (Label: string): string => Array.join([ TypeIdKey, OuterScope, Label ], "!");
    };

    export namespace Key
    {
        const MakeButtonKey: Types.Transform<string> = MakeButtonSymbolKey("Key");

        export const Primary: unique symbol = Symbol.for(MakeButtonKey("Primary"));
        export const Secondary: unique symbol = Symbol.for(MakeButtonKey("Secondary"));
        export const Middle: unique symbol = Symbol.for(MakeButtonKey("Middle"));

        export type Primary = typeof Primary;
        export type Secondary = typeof Secondary;
        export type Middle = typeof Middle;
    }

    export type Key =
        | Key.Primary
        | Key.Secondary
        | Key.Middle;

    export namespace Scroll
    {
        export namespace Direction
        {
            const MakeDirectionKey: Types.Transform<string> = MakeButtonSymbolKey("Direction");

            export const Forward: unique symbol = Symbol.for(MakeDirectionKey("Forward"));
            export const Backward: unique symbol = Symbol.for(MakeDirectionKey("Backward"));

            export type Forward = typeof Forward;
            export type Backward = typeof Backward;

            export const $Is = (Direction: Direction):
            (Value: Scroll) => Value is { readonly Axis: Axis; readonly Direction: typeof Direction; } =>
            {
                type Refined = { readonly Axis: Axis; readonly Direction: typeof Direction; };
                return (Value: Scroll): Value is Refined => Value.Direction === Direction;
            };
        }

        export type Direction =
            | Direction.Forward
            | Direction.Backward;

        export namespace Axis
        {
            const MakeAxisKey: Types.Transform<string> = MakeButtonSymbolKey("Axis");

            export const Vertical: unique symbol = Symbol.for(MakeAxisKey("Vertical"));
            export const Horizontal: unique symbol = Symbol.for(MakeAxisKey("Horizontal"));

            export type Vertical = typeof Vertical;
            export type Horizontal = typeof Horizontal;
        }

        export type Axis =
            | Axis.Vertical
            | Axis.Horizontal;

        export namespace Cardinal
        {
            export interface Up extends Scroll
            {
                readonly Axis: Axis.Vertical;
                readonly Direction: Direction.Backward;
            }

            export const Up: Up =
                {
                    Axis: Axis.Vertical,
                    Direction: Direction.Backward
                } as const;

            export interface Down extends Scroll
            {
                readonly Axis: Axis.Vertical;
                readonly Direction: Direction.Forward;
            }

            export const Down: Down =
                {
                    Axis: Axis.Vertical,
                    Direction: Direction.Forward
                } as const;

            export interface Left extends Scroll
            {
                readonly Axis: Axis.Horizontal;
                readonly Direction: Direction.Backward;
            }

            export const Left: Left =
                {
                    Axis: Axis.Horizontal,
                    Direction: Direction.Backward
                } as const;

            export interface Right extends Scroll
            {
                readonly Axis: Axis.Horizontal;
                readonly Direction: Direction.Forward;
            }

            export const Right: Right =
                {
                    Axis: Axis.Horizontal,
                    Direction: Direction.Forward
                } as const;

            export const $Is = (Cardinal: Scroll.Cardinal): (Value: Scroll) => Value is typeof Cardinal =>
            {
                return (Value: Scroll): Value is typeof Cardinal =>
                    Value.Axis === Cardinal.Axis && Value.Direction === Cardinal.Direction;
            };
        }

        export type Cardinal =
            | Cardinal.Left
            | Cardinal.Right
            | Cardinal.Up
            | Cardinal.Down;
    }

    export interface Scroll
    {
        readonly Axis: Scroll.Axis;
        readonly Direction: Scroll.Direction;
    }

    export namespace Action
    {
        const MakeButtonAction: Types.Transform<string> = MakeButtonSymbolKey("Action");

        export const Press: unique symbol = Symbol.for(MakeButtonAction("Press"));
        export const Release: unique symbol = Symbol.for(MakeButtonAction("Release"));
        export const Drag: unique symbol = Symbol.for(MakeButtonAction("Drag"));

        export type Press = typeof Press;
        export type Release = typeof Release;
        export type Drag = typeof Drag;
    }

    export type Action =
        | Action.Press
        | Action.Release
        | Action.Drag;

    export namespace Modifier
    {
        const MakeButtonModifier: Types.Transform<string> = MakeButtonSymbolKey("Modifier");

        export const Alt: unique symbol = Symbol.for(MakeButtonModifier("Alt"));
        export const Ctrl: unique symbol = Symbol.for(MakeButtonModifier("Ctrl"));
        export const Shift: unique symbol = Symbol.for(MakeButtonModifier("Shift"));

        export type Alt = typeof Alt;
        export type Ctrl = typeof Ctrl;
        export type Shift = typeof Shift;

        export const $Has = (...Values: Array.NonEmptyReadonlyArray<Modifier>) =>
            (Modifiers: Modifiers): boolean =>
                // @TODO Check, the `isSubset` call might be flipped.
                Function.pipe(Values, Function.flow(HashSet.fromIterable, HashSet.isSubset(Modifiers)));
    }

    export type Modifier =
        | Modifier.Alt
        | Modifier.Ctrl
        | Modifier.Shift;

    export type Modifiers = HashSet.HashSet<Modifier>;

    export const Modifiers = (...Modifiers: ReadonlyArray<Modifier>): Modifiers =>
        HashSet.fromIterable<Modifier>(Modifiers);
}

export const ParseSgr = (Buffer: Buffer): Option.Option<Event> =>
{
    /* eslint-disable-next-line no-control-regex */
    const MatchSgr: RegExp = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/;
    const Matches: RegExpExecArray | null = MatchSgr.exec(Buffer.toString());

    if (Matches === null || Matches.length < 5)
    {
        return Option.none();
    }

    const [ , codeS, colS, rowS, suf ] = Matches;

    // @TODO Make sure that the operand order isn't swapped.
    const Shift: { (Right: number): (Left: number) => number; } =
        Function.dual(2, (Left: number, Right: number) => Left & Right);

    const WheelShiftand: 0b11000000 = 0b11000000 as const;
    const ButtonIdShiftand: 0b11 = 0b11 as const;

    const Code: Option.Option<number> = Number.parse(codeS);

    if (Option.isNone(Code))
    {
        return Option.none();
    }

    const Wheel: Option.Option<number> = Function.pipe(Code, Option.map(Shift(WheelShiftand)));
    const ButtonId: Option.Option<number> = Function.pipe(Code, Option.map(Shift(ButtonIdShiftand)));

    if (Option.isNone(Wheel) || Option.isNone(ButtonId))
    {
        return Option.none();
    }

    const OutButton: Button.Key | Button.Scroll = Wheel.value === 64
        ? Button.Scroll.Cardinal.Up
        : Wheel.value === 65
            ? Button.Scroll.Cardinal.Down
            : ButtonId.value === 0
                ? Button.Key.Primary
                : ButtonId.value === 1
                    ? Button.Key.Middle
                    : Button.Key.Secondary;

    const Modifiers: Button.Modifiers = ((): Button.Modifiers =>
    {
        const HasByShiftand = (Code: number) => (Shiftand: number): boolean => (!!(Code & Shiftand));

        const Ids: Record.ReadonlyRecord<string, number> =
            {
                [ Symbol.keyFor(Button.Modifier.Alt)! ]: 8,
                [ Symbol.keyFor(Button.Modifier.Ctrl)! ]: 16,
                [ Symbol.keyFor(Button.Modifier.Shift)! ]: 4
            } as const;

        const Out: ReadonlyArray<Button.Modifier> = Function.pipe(
            Ids,
            Record.filter(HasByShiftand(Code.value)),
            Record.keys,
            Array.map(Symbol.for as Function.FunctionN<readonly [ string ], Button.Modifier>)
        );

        return Button.Modifiers(...Out);
    })();

    const X: Option.Option<number> = Option.map(Number.parse(colS), Number.subtract(1));
    const Y: Option.Option<number> = Option.map(Number.parse(rowS), Number.subtract(1));

    if (Option.isNone(X) || Option.isNone(Y))
    {
        return Option.none();
    }

    const Action: Button.Action = suf === "M" && !Wheel
        ? Button.Action.Press
        : suf === "m"
            ? Button.Action.Release
            : Button.Action.Drag;

    return Option.some({
        Action,
        Button: OutButton,
        Modifiers,
        X: X.value,
        Y: Y.value
    });
};

export interface Event
{
    readonly X: number;
    readonly Y: number;
    readonly Button:
        | Button.Key
        | Button.Scroll;
    readonly Action: Button.Action;
    readonly Modifiers: Button.Modifiers;
}

export namespace Event
{
    type EventSubtype<
        KeyType extends keyof Event,
        ValueSubtype extends Event[KeyType]
    > =
        Omit<Event, KeyType> &
        {
            readonly [ Key in KeyType ]: ValueSubtype;
        };

    export interface OnMouseDown extends EventSubtype<"Action", Button.Action.Press> { }

    export interface OnMouseUp extends EventSubtype<"Action", Button.Action.Release> { }

    export interface OnMouseDrag extends EventSubtype<"Action", Button.Action.Drag> { }

    export interface OnMouseScroll extends EventSubtype<"Action", Button.Action.Drag> { }
}

export const UseMouse = (Callback: Types.Thunk<Event> | undefined): void =>
{
    const Stdin: Ink.StdinProps = Ink.useStdin();
    const Stdout: Ink.StdoutProps = Ink.useStdout();
    React.useEffect((): void | Types.Thunk =>
    {
        if (Callback === undefined)
        {
            return;
        }

        Stdout.write(ControlSequence.Enable);

        const handler: (Buffer: Buffer<ArrayBufferLike>) => void =
            Function.flow(ParseSgr, Option.map(Callback), Function.constVoid);

        Stdin.stdin.on("data", handler);

        return () => void Stdout.write(ControlSequence.Disable);
    }, [ Callback, Stdin.stdin, Stdout ]);
    // const Stdout: Ink.StdoutProps = Ink.useStdout();
    // React.useEffect((): Types.Thunk =>
    // {
    //     Stdout.write(ControlSequence.Enable);
    // }, [ Stdout, Stdout.write ]);
};
