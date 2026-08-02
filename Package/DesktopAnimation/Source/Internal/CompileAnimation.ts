/**
 * Compiles a sequential desktop timeline into browser CSS keyframes.
 *
 * @module @sorrell/desktop-animation/Internal/CompileAnimation
 *
 * @file      CompileAnimation.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    CursorType,
    DesktopAnimationDefinition,
    DesktopWindow
} from "../Model.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/Internal/CompileAnimation" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

interface WindowState
{
    Height: number;
    Opacity: number;
    Scale: number;
    Width: number;
    X: number;
    Y: number;
}

interface WindowFrame extends WindowState
{
    At: number;
}

interface CursorState
{
    Opacity: number;
    Scale: number;
    Type: CursorType;
    X: number;
    Y: number;
}

interface CursorFrame extends CursorState
{
    At: number;
}

/**
 * Compiled render information for one desktop window.
 *
 * @category Model
 * @since 1.0.0
 */
export interface CompiledWindow
{
    readonly AnimationName: string;
    readonly Window: DesktopWindow;
}

/**
 * Compiled render information for the optional desktop cursor.
 *
 * @category Model
 * @since 1.0.0
 */
export interface CompiledCursor
{
    readonly AnimationName: string;
    readonly TypeAnimationNames: ReadonlyMap<CursorType, string>;
    readonly Types: ReadonlyArray<CursorType>;
}

/**
 * CSS keyframes and render metadata for a desktop animation.
 *
 * @category Model
 * @since 1.0.0
 */
export interface CompiledAnimation
{
    readonly Cursor?: CompiledCursor;
    readonly Duration: number;
    readonly StyleSheet: string;
    readonly Windows: ReadonlyArray<CompiledWindow>;
}

const CopyWindowState = (State: WindowState, At: number): WindowFrame =>
    ({ ...State, At });

const CopyCursorState = (State: CursorState, At: number): CursorFrame =>
    ({ ...State, At });

const NumberText = (Value: number): string =>
    Value.toFixed(5).replace(/\.?0+$/u, "");

const Percentage = (Value: number, Total: number): string =>
    `${ NumberText((Value / Total) * 100) }%`;

const CanvasPercentage = (Value: number, Extent: number): string =>
    `${ NumberText((Value / Extent) * 100) }%`;

const WindowFrameRule = (
    Frame: WindowFrame,
    Definition: DesktopAnimationDefinition,
    Total: number
): string =>
    [
        `${ Percentage(Frame.At, Total) } {`,
        `left: ${ CanvasPercentage(Frame.X, Definition.Canvas.Width) };`,
        `top: ${ CanvasPercentage(Frame.Y, Definition.Canvas.Height) };`,
        `width: ${ CanvasPercentage(Frame.Width, Definition.Canvas.Width) };`,
        `height: ${ CanvasPercentage(Frame.Height, Definition.Canvas.Height) };`,
        `opacity: ${ NumberText(Frame.Opacity) };`,
        `transform: scale(${ NumberText(Frame.Scale) });`,
        "}"
    ].join(" ");

const CursorFrameRule = (
    Frame: CursorFrame,
    Definition: DesktopAnimationDefinition,
    Total: number
): string =>
    [
        `${ Percentage(Frame.At, Total) } {`,
        `left: ${ CanvasPercentage(Frame.X, Definition.Canvas.Width) };`,
        `top: ${ CanvasPercentage(Frame.Y, Definition.Canvas.Height) };`,
        `opacity: ${ NumberText(Frame.Opacity) };`,
        `transform: scale(${ NumberText(Frame.Scale) });`,
        "}"
    ].join(" ");

const CursorTypeFrameRule = (
    Frame: CursorFrame,
    Type: CursorType,
    Total: number
): string =>
    `${ Percentage(Frame.At, Total) } { opacity: ${ Frame.Type === Type ? "1" : "0" }; }`;

/**
 * Compiles a validated desktop animation into CSS keyframes.
 *
 * @internal
 */
export const CompileAnimation = (
    Definition: DesktopAnimationDefinition,
    NamePrefix: string
): CompiledAnimation =>
{
    const WindowDefinitions = new Map<string, DesktopWindow>();
    const InitiallyVisible = new Set<string>();

    for (const WindowValue of Definition.Windows ?? [])
    {
        WindowDefinitions.set(WindowValue.Id, WindowValue);
        InitiallyVisible.add(WindowValue.Id);
    }

    for (const Step of Definition.Steps)
    {
        if (Step.Kind === "CreateWindow")
        {
            WindowDefinitions.set(Step.Window.Id, Step.Window);
        }
    }

    const WindowStates = new Map<string, WindowState>();
    const WindowFrames = new Map<string, Array<WindowFrame>>();

    for (const [ Id, WindowValue ] of WindowDefinitions)
    {
        const IsVisible = InitiallyVisible.has(Id);
        const State: WindowState =
            {
                Height: WindowValue.Frame.Height,
                Opacity: IsVisible ? 1 : 0,
                Scale: IsVisible ? 1 : 0.96,
                Width: WindowValue.Frame.Width,
                X: WindowValue.Frame.X,
                Y: WindowValue.Frame.Y
            };
        WindowStates.set(Id, State);
        WindowFrames.set(Id, [ CopyWindowState(State, 0) ]);
    }

    const FirstShownCursor = Definition.Steps.find(
        (Step) => Step.Kind === "ShowCursor"
    );
    const CursorSeed = Definition.Cursor ?? (
        FirstShownCursor?.Kind === "ShowCursor" ? FirstShownCursor.Cursor : undefined
    );
    const CursorStateValue: CursorState | undefined = CursorSeed === undefined
        ? undefined
        : {
            Opacity: Definition.Cursor === undefined ? 0 : 1,
            Scale: Definition.Cursor === undefined ? 0.9 : 1,
            Type: CursorSeed.Type,
            X: CursorSeed.Position.X,
            Y: CursorSeed.Position.Y
        };
    const CursorFrames: Array<CursorFrame> = CursorStateValue === undefined
        ? []
        : [ CopyCursorState(CursorStateValue, 0) ];
    let At = 0;

    const AddWindowFrame = (Id: string, FrameAt: number): void =>
    {
        const State = WindowStates.get(Id);
        const Frames = WindowFrames.get(Id);

        if (State !== undefined && Frames !== undefined)
        {
            Frames.push(CopyWindowState(State, FrameAt));
        }
    };

    const AddCursorFrame = (FrameAt: number): void =>
    {
        if (CursorStateValue !== undefined)
        {
            CursorFrames.push(CopyCursorState(CursorStateValue, FrameAt));
        }
    };

    for (const Step of Definition.Steps)
    {
        const End = At + Step.Duration;

        switch (Step.Kind)
        {
            case "CreateWindow":
            {
                const State = WindowStates.get(Step.Window.Id);

                if (State !== undefined)
                {
                    AddWindowFrame(Step.Window.Id, At);
                    State.Opacity = 1;
                    State.Scale = 1;
                    AddWindowFrame(Step.Window.Id, End);
                }
                break;
            }

            case "MoveWindow":
            {
                const State = WindowStates.get(Step.Id);

                if (State !== undefined)
                {
                    AddWindowFrame(Step.Id, At);
                    State.X = Step.Position.X;
                    State.Y = Step.Position.Y;
                    AddWindowFrame(Step.Id, End);
                }
                break;
            }

            case "ResizeWindow":
            {
                const State = WindowStates.get(Step.Id);

                if (State !== undefined)
                {
                    AddWindowFrame(Step.Id, At);
                    State.Height = Step.Size.Height;
                    State.Width = Step.Size.Width;
                    AddWindowFrame(Step.Id, End);
                }
                break;
            }

            case "DestroyWindow":
            {
                const State = WindowStates.get(Step.Id);

                if (State !== undefined)
                {
                    AddWindowFrame(Step.Id, At);
                    State.Opacity = 0;
                    State.Scale = 0.96;
                    AddWindowFrame(Step.Id, End);
                }
                break;
            }

            case "ShowCursor":
                if (CursorStateValue !== undefined)
                {
                    CursorStateValue.X = Step.Cursor.Position.X;
                    CursorStateValue.Y = Step.Cursor.Position.Y;
                    CursorStateValue.Type = Step.Cursor.Type;
                    AddCursorFrame(At);
                    CursorStateValue.Opacity = 1;
                    CursorStateValue.Scale = 1;
                    AddCursorFrame(End);
                }
                break;

            case "MoveCursor":
                if (CursorStateValue !== undefined)
                {
                    AddCursorFrame(At);
                    CursorStateValue.X = Step.Position.X;
                    CursorStateValue.Y = Step.Position.Y;
                    AddCursorFrame(End);
                }
                break;

            case "ChangeCursor":
                if (CursorStateValue !== undefined)
                {
                    AddCursorFrame(At);
                    CursorStateValue.Type = Step.CursorType;
                    AddCursorFrame(End);
                }
                break;

            case "HideCursor":
                if (CursorStateValue !== undefined)
                {
                    AddCursorFrame(At);
                    CursorStateValue.Opacity = 0;
                    CursorStateValue.Scale = 0.9;
                    AddCursorFrame(End);
                }
                break;

            case "DragWindow":
            {
                const State = WindowStates.get(Step.Id);

                if (State !== undefined && CursorStateValue !== undefined)
                {
                    const DeltaX = Step.Position.X - State.X;
                    const DeltaY = Step.Position.Y - State.Y;
                    const PreviousType = CursorStateValue.Type;
                    AddWindowFrame(Step.Id, At);
                    AddCursorFrame(At);
                    CursorStateValue.Scale = 0.9;
                    CursorStateValue.Type = "Grabbing";
                    AddCursorFrame(At);
                    State.X = Step.Position.X;
                    State.Y = Step.Position.Y;
                    CursorStateValue.X += DeltaX;
                    CursorStateValue.Y += DeltaY;
                    AddWindowFrame(Step.Id, End);
                    AddCursorFrame(End);
                    CursorStateValue.Scale = 1;
                    CursorStateValue.Type = PreviousType;
                    AddCursorFrame(End);
                }
                break;
            }

            case "Wait":
                break;
        }

        At = End;
    }

    const Duration = Math.max(At, 1);

    for (const [ Id ] of WindowDefinitions)
    {
        AddWindowFrame(Id, Duration);
    }
    AddCursorFrame(Duration);

    const StyleRules: Array<string> = [];
    const CompiledWindows: Array<CompiledWindow> = [];
    let WindowIndex = 0;

    for (const [ Id, WindowValue ] of WindowDefinitions)
    {
        const AnimationName = `${ NamePrefix }-window-${ WindowIndex }`;
        const Frames = WindowFrames.get(Id) ?? [];
        StyleRules.push(`@keyframes ${ AnimationName } { ${ Frames.map(
            (Frame) => WindowFrameRule(Frame, Definition, Duration)
        ).join(" ") } }`);
        CompiledWindows.push({ AnimationName, Window: WindowValue });
        WindowIndex += 1;
    }

    let CompiledCursorValue: CompiledCursor | undefined;

    if (CursorStateValue !== undefined)
    {
        const AnimationName = `${ NamePrefix }-cursor`;
        const Types = [ ...new Set(CursorFrames.map((Frame) => Frame.Type)) ];
        const TypeAnimationNames = new Map<CursorType, string>();
        StyleRules.push(`@keyframes ${ AnimationName } { ${ CursorFrames.map(
            (Frame) => CursorFrameRule(Frame, Definition, Duration)
        ).join(" ") } }`);

        for (const [ Index, Type ] of Types.entries())
        {
            const TypeAnimationName = `${ NamePrefix }-cursor-type-${ Index }`;
            TypeAnimationNames.set(Type, TypeAnimationName);
            StyleRules.push(`@keyframes ${ TypeAnimationName } { ${ CursorFrames.map(
                (Frame) => CursorTypeFrameRule(Frame, Type, Duration)
            ).join(" ") } }`);
        }

        CompiledCursorValue = {
            AnimationName,
            TypeAnimationNames,
            Types
        };
    }

    StyleRules.push([
        "@media (prefers-reduced-motion: reduce) {",
        `[data-desktop-animation="${ NamePrefix }"] [data-animated] {`,
        "animation-duration: 1ms !important;",
        "animation-iteration-count: 1 !important;",
        "} }"
    ].join(" "));

    const Result: CompiledAnimation = {
        Duration,
        StyleSheet: StyleRules.join("\n"),
        Windows: CompiledWindows
    };

    return CompiledCursorValue === undefined
        ? Result
        : { ...Result, Cursor: CompiledCursorValue };
};
