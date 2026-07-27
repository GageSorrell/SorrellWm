/**
 * Ink component for rendering ThreeJS scenes as terminal text.
 *
 * @module @sorrell/ink-ui/Three/InkThreeView
 *
 * @file      InkThreeView.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Boolean from "effect/Boolean";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Ink from "ink";
import * as React from "react";
import type * as THREE from "three";
import {
    type ColorOptions,
    type LightingOptions,
    SceneToFrame,
    SceneToString
} from "./Terminal/Renderer.js";
import {
    ColorToHex,
    DefaultColor,
    ParseColor,
    ScaleColor
} from "./Terminal/Color.js";
import type { Frame, FrameCell } from "./Terminal/Frame.js";
import type { RenderMode } from "./Terminal/RenderMode.js";

/**
 * Props for the Ink ThreeJS terminal view component.
 *
 * @category Rendering
 * @since 1.0.0
 */
export interface InkThreeViewProps
{
    readonly Scene: THREE.Scene;
    readonly Camera: THREE.Camera;
    readonly Width?: number;
    readonly Height?: number;
    readonly Fps?: number;
    readonly Character?: string;
    readonly CharacterRamp?: string;
    readonly RenderMode?: RenderMode;
    readonly RenderFaces?: boolean;
    readonly RenderWireframe?: boolean;
    readonly Lighting?: LightingOptions;
    readonly Color?: string;
    readonly ColorOptions?: ColorOptions;
    readonly RenderColor?: boolean;
    readonly AutoResize?: boolean;
}

interface ColoredRun
{
    Color: string;
    Text: string;
}

/**
 * Renders a ThreeJS scene inside an Ink text view.
 *
 * @category Rendering
 * @since 1.0.0
 */
export function InkThreeView(Props: InkThreeViewProps): React.ReactElement
{
    const {
        Scene,
        Camera,
        Width = 80,
        Height = 40,
        Fps = 30,
        Character,
        CharacterRamp,
        RenderMode,
        RenderFaces,
        RenderWireframe,
        Lighting,
        Color = "#66CCFF",
        ColorOptions,
        RenderColor = false,
        AutoResize = false
    }: InkThreeViewProps = Props;

    const { stdout } = Ink.useStdout();
    const [ Heartbeat, SetHeartbeat ] = React.useState<boolean>(false);

    React.useEffect(() =>
    {
        const FpsSafe: number = Math.max(1, Fps);
        const Interval: number = Math.max(1, Math.round(1000 / FpsSafe));
        const RuntimeFiber: Fiber.Fiber<never> = Effect.runFork(Effect.gen(function*()
        {
            while (true)
            {
                yield* Effect.sleep(`${ Interval } millis`);
                yield* Effect.sync(() => SetHeartbeat(Boolean.not));
            }
        }));

        return () => void Effect.runFork(Fiber.interrupt(RuntimeFiber));
    }, [ Fps ]);

    const RenderWidth: number = AutoResize ? GetSafeDimension(stdout.columns, Width) : Width;
    const RenderHeight: number = AutoResize ? GetSafeDimension(stdout.rows, Height) : Height;

    const Frame: string | Frame = React.useMemo<string | Frame>(() =>
    {
        if (RenderColor)
        {
            return SceneToFrame(
                Scene,
                Camera,
                {
                    Character,
                    CharacterRamp,
                    Color,
                    ColorOptions,
                    Height: RenderHeight,
                    Lighting,
                    RenderFaces,
                    RenderMode,
                    RenderWireframe,
                    Width: RenderWidth
                }
            );
        }

        return SceneToString(Scene, Camera, {
            Character,
            CharacterRamp,
            Color,
            ColorOptions,
            Height: RenderHeight,
            Lighting,
            RenderFaces,
            RenderMode,
            RenderWireframe,
            Width: RenderWidth
        });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [
        Scene,
        Camera,
        RenderWidth,
        RenderHeight,
        Character,
        CharacterRamp,
        RenderMode,
        RenderFaces,
        RenderWireframe,
        Lighting,
        Color,
        ColorOptions,
        RenderColor,
        Heartbeat
    ]);

    if (typeof Frame !== "string")
    {
        return <Ink.Text>{ RenderColoredFrame(Frame, Color) }</Ink.Text>;
    }

    return <Ink.Text>{ Frame }</Ink.Text>;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function RenderColoredFrame(Frame: Frame, Color: string): Array<React.ReactNode>
{
    const Elements: Array<React.ReactNode> = [ ];

    for (let LineIndex: number = 0; LineIndex < Frame.Lines.length; LineIndex += 1)
    {
        const Line: Array<FrameCell> = Frame.Lines[LineIndex]!;
        const Runs: Array<ColoredRun> = CreateColoredRuns(Line, Color);

        for (let RunIndex: number = 0; RunIndex < Runs.length; RunIndex += 1)
        {
            const Run: ColoredRun | undefined = Runs[RunIndex];

            Elements.push(
                <Ink.Text
                    { ...(Run?.Color !== undefined ? { color: Run?.Color } : { }) }
                    key={ `${ LineIndex }:${ RunIndex }` }>
                    { Run?.Text ?? "" }
                </Ink.Text>
            );
        }

        if (LineIndex < Frame.Lines.length - 1)
        {
            Elements.push("\n");
        }
    }

    return Elements;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function CreateColoredRuns(Line: Array<FrameCell>, Color: string): Array<ColoredRun>
{
    const Runs: Array<ColoredRun> = [ ];

    for (const Cell of Line)
    {
        const CellColor: string = CalculateBrightnessColor(Cell, Color);
        const PreviousRun: ColoredRun | undefined = Runs[Runs.length - 1];

        if (PreviousRun !== undefined && PreviousRun.Color === CellColor)
        {
            PreviousRun.Text += Cell.Character;
            continue;
        }

        Runs.push({
            Color: CellColor,
            Text: Cell.Character
        });
    }

    return Runs;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function CalculateBrightnessColor(Cell: FrameCell, FallbackColor: string): string
{
    const BaseColor: ReturnType<typeof ParseColor> =
        Cell.Color ?? ParseColor(FallbackColor) ?? DefaultColor;

    return ColorToHex(ScaleColor(BaseColor, Cell.Brightness));
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function GetSafeDimension(Dimension: number | undefined, Fallback: number): number
{
    if (Dimension === undefined || !Number.isFinite(Dimension) || Dimension <= 0)
    {
        return Fallback;
    }

    return Math.max(1, Math.floor(Dimension));
}

