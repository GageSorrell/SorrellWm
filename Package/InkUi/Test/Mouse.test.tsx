/**
 * Terminal mouse input tests.
 *
 * @module @sorrell/ink-ui/Test/Mouse
 *
 * @file      Mouse.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import { Text } from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import {
    MakeTerminalMouseParserState,
    MouseButton,
    MousePoint,
    MouseProvider,
    ParseTerminalMouseInput,
    type MouseGestureSettings,
    useMouse
} from "../Source/Mouse/index.js";

const Settings: MouseGestureSettings = {
    DoubleClickMaxDistance: new MousePoint({ X: 1, Y: 1 }),
    DoubleClickTimeMs: 500,
    DragActivationDistance: new MousePoint({ X: 2, Y: 2 })
};

const Parse = (
    State: ReturnType<typeof MakeTerminalMouseParserState>,
    Input: string,
    Times: Array<number>
) => Effect.runSync(ParseTerminalMouseInput(
    State,
    Input,
    { Now: () => Times.shift() ?? 0 }
));

describe("terminal mouse parser", () =>
{
    it("parses press, release, and modifiers", () =>
    {
        const Result = Parse(
            MakeTerminalMouseParserState(Settings),
            "\x1b[<20;4;7M\x1b[<20;4;7m",
            [ 100, 200 ]
        );

        expect(Result.Events.map((Event) => Event._tag))
            .toEqual([ "Press", "Release" ]);
        const Press = Result.Events[0]!;
        expect(Press._tag).toBe("Press");
        if (Press._tag === "Press")
        {
            expect(Press.Button).toBe(MouseButton.Left);
            expect(Press.Modifiers.Control).toBe(true);
            expect(Press.Position).toEqual({ X: 4, Y: 7 });
        }
    });

    it("recognizes configured double clicks across input chunks", () =>
    {
        const First = Parse(
            MakeTerminalMouseParserState(Settings),
            "\x1b[<0;4;7M\x1b[<0;4;7m",
            [ 100, 150 ]
        );
        const Second = Parse(
            First.State,
            "\x1b[<0;5;8M\x1b[<0;5;8m",
            [ 300, 350 ]
        );
        const Release = Second.Events[1]!;

        expect(Release._tag).toBe("Release");
        if (Release._tag === "Release")
        {
            expect(Release.Click._tag).toBe("Double");
            expect(Release.Click).toMatchObject({
                Drift: { X: 1, Y: 1 },
                Duration: 200
            });
        }
    });

    it("buffers partial reports and applies the drag threshold", () =>
    {
        const Partial = Parse(
            MakeTerminalMouseParserState(Settings),
            "\x1b[<0;2;",
            []
        );
        expect(Partial.Events).toHaveLength(0);
        expect(Partial.State.BufferedInput).not.toBe("");

        const Press = Parse(Partial.State, "3M", [ 10 ]);
        const Movement = Parse(
            Press.State,
            "\x1b[<32;3;3M\x1b[<32;4;3M",
            [ 20, 30 ]
        );
        expect(Movement.Events.map((Event) => Event._tag))
            .toEqual([ "Move", "Drag" ]);
    });
});

describe("MouseProvider", () =>
{
    it("provides explicit gesture configuration", () =>
    {
        const Consumer = (): React.ReactNode =>
        {
            const { Settings: Value } = useMouse();
            return (
                <Text>
                    { Value.DoubleClickTimeMs }:
                    { Value.DoubleClickMaxDistance.X }:
                    { Value.DragActivationDistance.Y }
                </Text>
            );
        };
        const App = render(
            <MouseProvider
                DoubleClickMaxDistance={ 3 }
                DoubleClickTimeMs={ 275 }
                DragActivationDistance={ { X: 4, Y: 5 } }
                IsEnabled={ false }>
                <Consumer />
            </MouseProvider>
        );

        expect(App.lastFrame()).toBe("275:3:5");
    });
});

