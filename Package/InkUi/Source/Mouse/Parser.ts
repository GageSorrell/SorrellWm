/**
 * SGR terminal mouse parser.
 *
 * @module @sorrell/ink-ui/Mouse/Parser
 *
 * @file      Parser.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable no-control-regex */

import {
    Button,
    Click,
    Modifiers,
    MouseEvent,
    Scroll,
    type TrackingOptions
} from "./index.ts";
import { Data, Effect, Option } from "effect";
import { IntPoint } from "@sorrell/math";

export/** The runtime identifier for the terminal mouse parser. */
const TypeId = "~sorrell/ink-ui/Mouse/Parser" as const;

/** The type of the parser runtime identifier. */
export  type TypeId = typeof TypeId;

/** State retained between terminal input chunks. */
export class ParserState extends Data.Class<{
    readonly ActivePress: Option.Option<MouseEvent.MouseEvent.Down>;
    readonly BufferedInput: string;
    readonly IsDragging: boolean;
    readonly LastRelease: Option.Option<MouseEvent.MouseEvent.Up>;
    readonly Settings: TrackingOptions;
}> { }

/** The events and updated state produced by parsing an input chunk. */
export class ParseResult extends Data.Class<{
    readonly Events: ReadonlyArray<MouseEvent.MouseEvent>;
    readonly State: ParserState;
}> { }

/** Optional behavior supplied for a parser invocation. */
export interface ParserOptions
{
    readonly HorizontalScrollDirectionByButton?: Scroll.HorizontalDirection;
    readonly Now?: () => number;
}

const MouseReportPattern: RegExp =
    /^\x1b\[<(\d+);(\d+);(\d+)([Mm])/;

export/**
       * Create empty parser state with the supplied gesture settings.
       *
       * @category Mouse
       * @since 1.0.0
       */
const Make = (Settings: TrackingOptions): ParserState => new ParserState({
    ActivePress: Option.none(),
    BufferedInput: "",
    IsDragging: false,
    LastRelease: Option.none(),
    Settings
});

export/**
       * Parse SGR mouse and terminal-focus reports from an input chunk.
       *
       * Incomplete reports are buffered and completed by the next call.
       *
       * @category Mouse
       * @since 1.0.0
       */
const Parse = Effect.fn(`${ TypeId }!Parse`)(
    (
        State: ParserState,
        Data: string | Buffer<ArrayBufferLike>,
        Options: ParserOptions = { }
    ): Effect.Effect<ParseResult> =>
        Effect.sync(() =>
        {
            const Input = State.BufferedInput + Data.toString();
            const Events: Array<MouseEvent.MouseEvent> = [ ];
            const Now = Options.Now ?? Date.now;
            let CurrentState = State;
            let Index = 0;

            while (Index < Input.length)
            {
                if (Input.startsWith("\x1b[I", Index))
                {
                    Events.push(MouseEvent.MouseEvent.FocusIn({ Time: Now() }));
                    Index += 3;
                    continue;
                }

                if (Input.startsWith("\x1b[O", Index))
                {
                    Events.push(MouseEvent.MouseEvent.FocusOut({ Time: Now() }));
                    Index += 3;
                    continue;
                }

                const Match = MouseReportPattern.exec(Input.slice(Index));
                if (Match !== null)
                {
                    const Parsed = GetTerminalMouseEvent(
                        CurrentState,
                        Number(Match[1]),
                        IntPoint.IntPoint(
                            Number(Match[2]),
                            Number(Match[3])
                        ),
                        Match[4] as "M" | "m",
                        Options,
                        Now()
                    );
                    CurrentState = Parsed.State;
                    Events.push(Parsed.Event);
                    Index += Match[0].length;
                    continue;
                }

                if (Input[Index] === "\x1b")
                {
                    const Remaining = Input.slice(Index);
                    if (IsPossiblyIncompleteMouseSequence(Remaining))
                    {
                        return new ParseResult({
                            Events,
                            State: new ParserState({
                                ...CurrentState,
                                BufferedInput: Remaining
                            })
                        });
                    }
                }

                Index += 1;
            }

            return new ParseResult({
                Events,
                State: new ParserState({
                    ...CurrentState,
                    BufferedInput: ""
                })
            });
        })
);

const IsPossiblyIncompleteMouseSequence = (Input: string): boolean =>
    "\x1b[I".startsWith(Input)
    || "\x1b[O".startsWith(Input)
    || /^\x1b(?:\[|$)/.test(Input)
    || /^\x1b\[<(?:\d+)?(?:;(?:\d+)?)?(?:;(?:\d+)?)?$/.test(Input);

interface ParsedEvent
{
    readonly Event: MouseEvent.MouseEvent;
    readonly State: ParserState;
}

const GetTerminalMouseEvent = (
    State: ParserState,
    RawCode: number,
    Position: IntPoint.IntPoint,
    FinalCharacter: "M" | "m",
    Options: ParserOptions,
    Time: number
): ParsedEvent =>
{
    const TheModifiers = Modifiers.Modifiers(RawCode);
    const ProtocolNum = Button.GetProtocolNum(RawCode);

    if (
        FinalCharacter === "M"
        && Option.isSome(ProtocolNum)
        && Scroll.IsWheelProtocolNum(ProtocolNum.value)
    )
    {
        const Number = ProtocolNum.value;
        return {
            Event: MouseEvent.MouseEvent.Wheel({
                Button: Button.FromProtocolNum(ProtocolNum),
                Modifiers: TheModifiers,
                Position,
                ProtocolNum: Number,
                RawCode,
                ScrollAxis: Scroll.GetAxis(Number),
                ScrollDirection: Scroll.GetDirection(Number, Options),
                Time
            }),
            State
        };
    }

    if (FinalCharacter === "m")
    {
        const TheButton = Button.FromProtocolNum(ProtocolNum);
        const Click = GetClick(State, TheButton, Position, Time);
        const Event = MouseEvent.MouseEvent.Release({
            Button: TheButton,
            Click,
            Modifiers: TheModifiers,
            Position,
            ProtocolNum,
            RawCode,
            Time
        });
        return {
            Event,
            State: new ParserState({
                ...State,
                ActivePress: Option.none(),
                IsDragging: false,
                LastRelease: Option.some(Event)
            })
        };
    }

    if ((RawCode & 32) !== 0)
    {
        const ShouldDrag = Option.isSome(ProtocolNum)
            && (
                State.IsDragging
                || Option.isNone(State.ActivePress)
                || HasReachedDragThreshold(
                    State.ActivePress.value.Position,
                    Position,
                    State.Settings.DragActivationDistance
                )
            );

        if (ShouldDrag)
        {
            return {
                Event: MouseEvent.MouseEvent.Drag({
                    Button: Button.FromProtocolNum(ProtocolNum),
                    Modifiers: TheModifiers,
                    Position,
                    ProtocolNum,
                    RawCode,
                    Time
                }),
                State: new ParserState({
                    ...State,
                    IsDragging: true
                })
            };
        }

        return {
            Event: MouseEvent.MouseEvent.Move({
                Modifiers: TheModifiers,
                Position,
                RawCode,
                Time
            }),
            State
        };
    }

    const Event = MouseEvent.MouseEvent.Press({
        Button: Button.FromProtocolNum(ProtocolNum),
        Modifiers: TheModifiers,
        Position,
        ProtocolNum,
        RawCode,
        Time
    });
    return {
        Event,
        State: new ParserState({
            ...State,
            ActivePress: Option.some(Event),
            IsDragging: false
        })
    };
};

const GetClick = (
    State: ParserState,
    Button: Button.Button,
    Position: IntPoint.IntPoint,
    Time: number
): Click.Click =>
{
    if (Option.isNone(State.LastRelease))
    {
        return Click.Click.Single();
    }

    const Last = State.LastRelease.value;
    const Drift = IntPoint.IntPoint(
        Math.abs(Position.X - Last.Position.X),
        Math.abs(Position.Y - Last.Position.Y)
    );
    const Duration = Time - Last.Time;
    const Maximum = State.Settings.DoubleClickMaxDistance;

    return Last.Button === Button
        && Duration >= 0
        && Duration <= State.Settings.DoubleClickTimeMs
        && Drift.X <= Maximum.X
        && Drift.Y <= Maximum.Y
        ? Click.Click.Double({ Drift, Duration })
        : Click.Click.Single();
};

const HasReachedDragThreshold = (
    Origin: IntPoint.IntPoint,
    Position: IntPoint.IntPoint,
    Threshold: IntPoint.IntPoint
): boolean =>
    Math.abs(Position.X - Origin.X) >= Threshold.X
    || Math.abs(Position.Y - Origin.Y) >= Threshold.Y;
