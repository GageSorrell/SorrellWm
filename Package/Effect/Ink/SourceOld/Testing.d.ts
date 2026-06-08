/**
 * Provide `ink` with a theme.  This is particularly useful
 * for {@link \@sorrell/effect-ink/cli/Prompt | prompts}.
 *
 * @module @sorrell/effect-ink/Theme
 */
/**
 * @file      Testing.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { type ReactNode } from "react";
import { type InputAction, type InputCommand, type KeyEvent, type KeyEventType, type KeyMap } from "./Input.js";
import { Effect, Layer } from "effect";
import type { InkRenderOptions, InkRenderer as InkRendererService } from "./InkRenderer.js";
export type TestRenderFrameKind = "Render" | "Rerender" | "Clear" | "Unmount" | "Cleanup";
export interface TestRenderFrame {
    readonly Kind: TestRenderFrameKind;
    readonly Element?: ReactNode;
    readonly Options?: InkRenderOptions;
    readonly Index: number;
}
export interface TestInkDriver {
    readonly GetFrames: Effect.Effect<ReadonlyArray<TestRenderFrame>>;
    readonly ClearFrames: Effect.Effect<void>;
    readonly GetLatestFrame: Effect.Effect<TestRenderFrame | undefined>;
    readonly GetLatestElement: Effect.Effect<ReactNode | undefined>;
    readonly GetTextSnapshot: Effect.Effect<string>;
    readonly CompleteCurrentInstance: (Value?: unknown) => Effect.Effect<void>;
    readonly FailCurrentInstance: (Cause: unknown) => Effect.Effect<void>;
}
export interface TestInkRenderer {
    readonly Driver: TestInkDriver;
    readonly Layer: Layer.Layer<InkRendererService>;
}
export declare const MakeTestInkRenderer: () => TestInkRenderer;
export declare const MakeTestLayer: () => TestInkRenderer;
export interface TestKeyEventOptions {
    readonly Input?: string;
    readonly Up?: boolean;
    readonly Down?: boolean;
    readonly Left?: boolean;
    readonly Right?: boolean;
    readonly PageDown?: boolean;
    readonly PageUp?: boolean;
    readonly Home?: boolean;
    readonly End?: boolean;
    readonly Return?: boolean;
    readonly Escape?: boolean;
    readonly Tab?: boolean;
    readonly Backspace?: boolean;
    readonly Delete?: boolean;
    readonly Control?: boolean;
    readonly Shift?: boolean;
    readonly Meta?: boolean;
    readonly Super?: boolean;
    readonly Hyper?: boolean;
    readonly CapsLock?: boolean;
    readonly NumLock?: boolean;
    readonly EventType?: KeyEventType;
}
export declare const MakeTestKeyEvent: (Options?: TestKeyEventOptions) => KeyEvent;
export declare const MakeTestInputCommand: (Action: InputAction, Options?: TestKeyEventOptions & {
    readonly Text?: string;
}) => InputCommand;
export declare const SubmitCommand: () => InputCommand;
export declare const CancelCommand: () => InputCommand;
export declare const MoveUpCommand: () => InputCommand;
export declare const MoveDownCommand: () => InputCommand;
export declare const MoveLeftCommand: () => InputCommand;
export declare const MoveRightCommand: () => InputCommand;
export declare const PageUpCommand: () => InputCommand;
export declare const PageDownCommand: () => InputCommand;
export declare const MoveHomeCommand: () => InputCommand;
export declare const MoveEndCommand: () => InputCommand;
export declare const DeleteBackwardCommand: () => InputCommand;
export declare const DeleteForwardCommand: () => InputCommand;
export declare const ToggleCommand: () => InputCommand;
export declare const ClearCommand: () => InputCommand;
export declare const InsertTextCommand: (Text: string) => InputCommand;
export declare const TextToInputCommands: (Text: string) => ReadonlyArray<InputCommand>;
export declare const ResolveTestInputCommand: (Options: TestKeyEventOptions, CurrentKeyMap?: KeyMap, AllowTextInput?: boolean) => InputCommand;
export declare const RunReducerWithCommands: <State>(InitialState: State, Reducer: (State: State, Command: InputCommand) => State, Commands: Iterable<InputCommand>) => State;
export declare const FindLatestElement: (Frames: ReadonlyArray<TestRenderFrame>) => ReactNode | undefined;
export declare const FramesToTextSnapshot: (Frames: ReadonlyArray<TestRenderFrame>) => string;
export declare const StringifyReactNode: (Node: ReactNode) => string;
//# sourceMappingURL=Testing.d.ts.map