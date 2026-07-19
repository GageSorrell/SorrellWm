/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
// @TODO TEMPORARY
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-control-regex */
import * as Ink from "ink";
import * as React from "react";
import { Data, Effect } from "effect";
export class TerminalMouseModifiers extends Data.Class {
}
export class TerminalMousePosition extends Data.Class {
}
export const TerminalMouseEvent = Data.taggedEnum();
export class TerminalMouseParserState extends Data.Class {
}
export class TerminalMouseParseResult extends Data.Class {
}
const EnableCellMouseTracking = "\x1b[?1006h\x1b[?1003h\x1b[?1004h";
const DisableCellMouseTracking = "\x1b[?1004l\x1b[?1003l\x1b[?1006l";
/* eslint-disable-next-line @typescript-eslint/typedef */
const DefaultHorizontalScrollDirectionByButton = {
    6: "Left",
    7: "Right"
};
/* eslint-disable-next-line no-control-regex */
const MouseReportPattern = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])/;
export const EnableTerminalMouseTracking = Effect.fn("EnableTerminalMouseTracking")((Write) => Effect.sync(() => Write(EnableCellMouseTracking)));
export const DisableTerminalMouseTracking = Effect.fn("DisableTerminalMouseTracking")((Write) => Effect.sync(() => Write(DisableCellMouseTracking)));
export const SetRawMode = Effect.fn("SetRawMode")((SetRawModeImplementation, IsRawMode) => Effect.sync(() => SetRawModeImplementation(IsRawMode)));
export const ResumeInput = Effect.fn("ResumeInput")((StandardInput) => Effect.sync(() => void StandardInput.resume()));
export const AddInputListener = Effect.fn("AddInputListener")((StandardInput, HandleData) => Effect.sync(() => StandardInput.on("data", HandleData)));
export const RemoveInputListener = Effect.fn("RemoveInputListener")((StandardInput, HandleData) => Effect.sync(() => StandardInput.off("data", HandleData)));
// @TODO
/* eslint-disable @typescript-eslint/typedef */
export const InstallTerminalMouseTracking = Effect.fn("InstallTerminalMouseTracking")((StandardInput, Write, SetRawModeImplementation, HandleData) => Effect.gen(function* () {
    yield* SetRawMode(SetRawModeImplementation, true);
    yield* ResumeInput(StandardInput);
    yield* EnableTerminalMouseTracking(Write);
    yield* AddInputListener(StandardInput, HandleData);
}));
export const UninstallTerminalMouseTracking = Effect.fn("UninstallTerminalMouseTracking")((StandardInput, Write, SetRawModeImplementation, HandleData) => Effect.gen(function* () {
    yield* RemoveInputListener(StandardInput, HandleData);
    yield* DisableTerminalMouseTracking(Write);
    yield* SetRawMode(SetRawModeImplementation, false);
}));
export const ParseTerminalMouseInput = Effect.fn("ParseTerminalMouseInput")((State, Data, Options) => Effect.sync(() => {
    const Input = State.BufferedInput + Data.toString();
    const Events = [];
    let Index = 0;
    while (Index < Input.length) {
        if (Input.startsWith("\x1b[I", Index)) {
            Events.push(TerminalMouseEvent.FocusIn());
            Index += 3;
            continue;
        }
        if (Input.startsWith("\x1b[O", Index)) {
            Events.push(TerminalMouseEvent.FocusOut());
            Index += 3;
            continue;
        }
        const Match = MouseReportPattern.exec(Input.slice(Index));
        if (Match !== null) {
            const RawButtonCode = Number(Match[1]);
            const Column = Number(Match[2]);
            const Row = Number(Match[3]);
            const FinalCharacter = Match[4];
            Events.push(GetTerminalMouseEvent(RawButtonCode, new TerminalMousePosition({ Column, Row }), FinalCharacter, Options));
            Index += Match[0].length;
            continue;
        }
        if (Input[Index] === "\x1b") {
            const PossibleIncompleteSequence = Input.slice(Index);
            if (IsPossiblyIncompleteMouseSequence(PossibleIncompleteSequence)) {
                return new TerminalMouseParseResult({
                    Events,
                    State: new TerminalMouseParserState({
                        BufferedInput: PossibleIncompleteSequence
                    })
                });
            }
        }
        Index += 1;
    }
    return new TerminalMouseParseResult({
        Events,
        State: new TerminalMouseParserState({
            BufferedInput: ""
        })
    });
}));
function IsPossiblyIncompleteMouseSequence(Input) {
    return "\x1b[I".startsWith(Input)
        || "\x1b[O".startsWith(Input)
        || /^\x1b(?:\[|$)/.test(Input)
        || /^\x1b\[<(?:\d+)?(?:;(?:\d+)?)?(?:;(?:\d+)?)?$/.test(Input);
}
function GetTerminalMouseEvent(RawButtonCode, Position, FinalCharacter, Options) {
    const Modifiers = GetTerminalMouseModifiers(RawButtonCode);
    const ButtonNumber = GetTerminalProtocolButtonNumber(RawButtonCode);
    if (FinalCharacter === "M" && IsWheelButton(ButtonNumber)) {
        return TerminalMouseEvent.Wheel({
            ButtonNumber,
            Modifiers,
            Position,
            RawButtonCode,
            ScrollAxis: GetTerminalScrollAxis(ButtonNumber),
            ScrollDirection: GetTerminalScrollDirection(ButtonNumber, Options)
        });
    }
    if (FinalCharacter === "m") {
        return TerminalMouseEvent.Release({
            Button: GetTerminalMouseButton(ButtonNumber),
            ButtonNumber,
            Modifiers,
            Position,
            RawButtonCode
        });
    }
    if ((RawButtonCode & 32) !== 0) {
        if (ButtonNumber === null) {
            return TerminalMouseEvent.Move({
                Modifiers,
                Position,
                RawButtonCode
            });
        }
        return TerminalMouseEvent.Drag({
            Button: GetTerminalMouseButton(ButtonNumber),
            ButtonNumber,
            Modifiers,
            Position,
            RawButtonCode
        });
    }
    return TerminalMouseEvent.Press({
        Button: GetTerminalMouseButton(ButtonNumber),
        ButtonNumber,
        Modifiers,
        Position,
        RawButtonCode
    });
}
function GetTerminalMouseModifiers(RawButtonCode) {
    return new TerminalMouseModifiers({
        Alt: (RawButtonCode & 8) !== 0,
        Control: (RawButtonCode & 16) !== 0,
        Shift: (RawButtonCode & 4) !== 0
    });
}
function GetTerminalProtocolButtonNumber(RawButtonCode) {
    const ButtonCodeWithoutModifiers = RawButtonCode & ~(4 | 8 | 16 | 32);
    if ((ButtonCodeWithoutModifiers & 128) !== 0) {
        const ButtonNumber = 8 + (ButtonCodeWithoutModifiers & 3);
        return IsTerminalProtocolButtonNumber(ButtonNumber) ? ButtonNumber : null;
    }
    if ((ButtonCodeWithoutModifiers & 64) !== 0) {
        const ButtonNumber = 4 + (ButtonCodeWithoutModifiers & 3);
        return IsTerminalProtocolButtonNumber(ButtonNumber) ? ButtonNumber : null;
    }
    const BaseButtonCode = ButtonCodeWithoutModifiers & 3;
    if (BaseButtonCode === 3) {
        return null;
    }
    const ButtonNumber = BaseButtonCode + 1;
    return IsTerminalProtocolButtonNumber(ButtonNumber) ? ButtonNumber : null;
}
function IsTerminalProtocolButtonNumber(Value) {
    return Value >= 1 && Value <= 11;
}
function IsWheelButton(ButtonNumber) {
    return ButtonNumber === 4
        || ButtonNumber === 5
        || ButtonNumber === 6
        || ButtonNumber === 7;
}
function GetTerminalMouseButton(ButtonNumber) {
    switch (ButtonNumber) {
        case 1:
            return "Left";
        case 2:
            return "Middle";
        case 3:
            return "Right";
        case 8:
            return "Button8";
        case 9:
            return "Button9";
        case 10:
            return "Button10";
        case 11:
            return "Button11";
        case null:
            return "None";
        default:
            return "Unknown";
    }
}
function GetTerminalScrollAxis(ButtonNumber) {
    switch (ButtonNumber) {
        case 4:
        case 5:
            return "Vertical";
        case 6:
        case 7:
            return "Horizontal";
    }
}
function GetTerminalScrollDirection(ButtonNumber, Options) {
    switch (ButtonNumber) {
        case 4:
            return "Up";
        case 5:
            return "Down";
        case 6:
            return Options.HorizontalScrollDirectionByButton?.[6]
                ?? DefaultHorizontalScrollDirectionByButton[6];
        case 7:
            return Options.HorizontalScrollDirectionByButton?.[7]
                ?? DefaultHorizontalScrollDirectionByButton[7];
    }
}
export function useTerminalMouseTracking(Options) {
    const { stdin, isRawModeSupported, setRawMode } = Ink.useStdin();
    const { write } = Ink.useStdout();
    const OptionsReference = React.useRef(Options);
    const ParserStateReference = React.useRef(new TerminalMouseParserState({ BufferedInput: "" }));
    OptionsReference.current = Options;
    React.useEffect(() => {
        if (Options.IsEnabled === false) {
            return;
        }
        if (!isRawModeSupported) {
            return;
        }
        const HandleData = (Data) => {
            const Result = Effect.runSync(ParseTerminalMouseInput(ParserStateReference.current, Data, OptionsReference.current));
            ParserStateReference.current = Result.State;
            for (const Event of Result.Events) {
                OptionsReference.current.OnEvent(Event);
            }
        };
        Effect.runSync(InstallTerminalMouseTracking(stdin, write, setRawMode, HandleData));
        return () => {
            Effect.runSync(UninstallTerminalMouseTracking(stdin, write, setRawMode, HandleData));
            ParserStateReference.current = new TerminalMouseParserState({ BufferedInput: "" });
        };
    }, [stdin, isRawModeSupported, setRawMode, write, Options.IsEnabled]);
}
//# sourceMappingURL=index.js.map