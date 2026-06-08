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

import {
    Children,
    type PropsWithChildren,
    type ReactElement,
    type ReactNode,
    isValidElement
} from "react";
import {
    DefaultKeyMap,
    type InputAction,
    type InputCommand,
    type KeyEvent,
    type KeyEventType,
    type KeyMap,
    ResolveInputCommand
} from "./Input.js";
import { Effect, Layer, type Scope } from "effect";
import {
    type InkAlreadyUnmountedError,
    InkExitError,
    type InkRenderError,
    inkAlreadyUnmounted
} from "./Error.js";
import type {
    InkInstance,
    InkRenderOptions,
    InkRenderer as InkRendererService
} from "./InkRenderer.js";
import { InkRenderer } from "./InkRenderer.js";

export type TestRenderFrameKind =
    | "Render"
    | "Rerender"
    | "Clear"
    | "Unmount"
    | "Cleanup";

export interface TestRenderFrame
{
    readonly Kind: TestRenderFrameKind;
    readonly Element?: ReactNode;
    readonly Options?: InkRenderOptions;
    readonly Index: number;
}

export interface TestInkDriver
{
    readonly GetFrames: Effect.Effect<ReadonlyArray<TestRenderFrame>>;
    readonly ClearFrames: Effect.Effect<void>;

    readonly GetLatestFrame: Effect.Effect<TestRenderFrame | undefined>;
    readonly GetLatestElement: Effect.Effect<ReactNode | undefined>;
    readonly GetTextSnapshot: Effect.Effect<string>;

    readonly CompleteCurrentInstance: (Value?: unknown) => Effect.Effect<void>;
    readonly FailCurrentInstance: (Cause: unknown) => Effect.Effect<void>;
}

export interface TestInkRenderer
{
    readonly Driver: TestInkDriver;
    readonly Layer: Layer.Layer<InkRendererService>;
}

interface MutableExitState
{
    readonly Promise: Promise<unknown>;
    readonly Resolve: (Value: unknown) => void;
    readonly Reject: (Cause: unknown) => void;
    IsSettled: boolean;
}

interface MutableInstanceState
{
    IsUnmounted: boolean;
    ExitState: MutableExitState;
}

export const MakeTestInkRenderer = (): TestInkRenderer =>
{
    const Frames: Array<TestRenderFrame> = [];
    let CurrentInstanceState: MutableInstanceState | undefined;

    const PushFrame = (
        Frame: Omit<TestRenderFrame, "Index">
    ): TestRenderFrame =>
    {
        const NextFrame: TestRenderFrame =
            {
                ...Frame,
                Index: Frames.length
            };

        Frames.push(NextFrame);

        return NextFrame;
    };

    const MakeExitState = (): MutableExitState =>
    {
        let ResolveFunction!: (Value: unknown) => void;
        let RejectFunction!: (Cause: unknown) => void;

        const Promise: Promise<unknown> = new globalThis.Promise<unknown>((
            /* eslint-disable @typescript-eslint/typedef */
            Resolve,
            Reject
            /* eslint-enable @typescript-eslint/typedef */
        ) =>
        {
            ResolveFunction = Resolve;
            RejectFunction = Reject;
        });

        return {
            IsSettled: false,
            Promise,
            Reject: RejectFunction,
            Resolve: ResolveFunction
        };
    };

    const SettleExitState = (
        ExitState: MutableExitState,
        Value: unknown
    ): void =>
    {
        if (ExitState.IsSettled)
        {
            return;
        }

        ExitState.IsSettled = true;
        ExitState.Resolve(Value);
    };

    const FailExitState = (
        ExitState: MutableExitState,
        Cause: unknown
    ): void =>
    {
        if (ExitState.IsSettled)
        {
            return;
        }

        ExitState.IsSettled = true;
        ExitState.Reject(Cause);
    };

    const WrapTestInstance = (
        InstanceState: MutableInstanceState
    ): InkInstance =>
    {
        const RequireMounted = <A, E>(
            EffectToRun: Effect.Effect<A, E>
        ): Effect.Effect<A, E | ReturnType<typeof inkAlreadyUnmounted>> =>
            InstanceState.IsUnmounted
                ? Effect.fail(inkAlreadyUnmounted())
                : EffectToRun;

        const Rerender = (
            Element: ReactNode
        ) =>
            RequireMounted(
                Effect.sync(() =>
                {
                    PushFrame({
                        Element,
                        Kind: "Rerender"
                    });
                })
            );

        const Unmount: Effect.Effect<void> = Effect.sync(() =>
        {
            if (InstanceState.IsUnmounted)
            {
                return;
            }

            InstanceState.IsUnmounted = true;

            PushFrame({
                Kind: "Unmount"
            });

            SettleExitState(
                InstanceState.ExitState,
                undefined
            );
        });

        const Cleanup: Effect.Effect<void> = Effect.sync(() =>
        {
            if (InstanceState.IsUnmounted)
            {
                return;
            }

            InstanceState.IsUnmounted = true;

            PushFrame({
                Kind: "Cleanup"
            });

            SettleExitState(
                InstanceState.ExitState,
                undefined
            );
        });

        const Clear: Effect.Effect<void, InkAlreadyUnmountedError> =
            RequireMounted(
                Effect.sync(() =>
                {
                    PushFrame({
                        Kind: "Clear"
                    });
                })
            );

        const WaitUntilExit: Effect.Effect<unknown, InkExitError, never> =
            Effect.tryPromise({
                catch: (Cause: unknown) => new InkExitError({
                    Cause,
                    Message: "The test Ink instance exited with a failure."
                }),
                try: () => InstanceState.ExitState.Promise
            });

        const WaitUntilRenderFlush: Effect.Effect<void, InkAlreadyUnmountedError, never> =
            RequireMounted(
                Effect.void
            );

        return {
            Cleanup,
            Clear,
            Rerender,
            Unmount,
            WaitUntilExit,
            WaitUntilRenderFlush
        };
    };

    const Renderer: InkRendererService =
        {
            Render: (
                Element: ReactNode,
                Options?: InkRenderOptions
            ): Effect.Effect<InkInstance, InkRenderError, Scope.Scope> =>
                Effect.acquireRelease(
                    Effect.sync(() =>
                    {
                        const InstanceState: MutableInstanceState =
                            {
                                ExitState: MakeExitState(),
                                IsUnmounted: false
                            };

                        CurrentInstanceState = InstanceState;

                        if (Options !== undefined)
                        {
                            PushFrame({
                                Element,
                                Kind: "Render",
                                Options
                            });
                        }
                        else
                        {
                            PushFrame({ Element, Kind: "Render" });
                        }

                        return WrapTestInstance(InstanceState);
                    }),
                    (Instance: InkInstance) => Instance.Cleanup
                ),

            Run: (
                Element: ReactNode,
                Options?: InkRenderOptions
            ) =>
                Effect.scoped(
                    Effect.gen(function* ()
                    {
                        const Instance: InkInstance = yield* Renderer.Render(
                            Element,
                            Options
                        );

                        return yield* Instance.WaitUntilExit;
                    })
                )
        };

    const Driver: TestInkDriver =
        {
            GetFrames: Effect.sync(() =>
            {
                return [ ...Frames ];
            }),

            ClearFrames: Effect.sync(() =>
            {
                Frames.splice(
                    0,
                    Frames.length
                );
            }),

            GetLatestFrame: Effect.sync(() =>
            {
                return Frames.at(-1);
            }),

            GetLatestElement: Effect.sync(() =>
            {
                return FindLatestElement(Frames);
            }),

            GetTextSnapshot: Effect.sync(() =>
            {
                return StringifyReactNode(
                    FindLatestElement(Frames)
                );
            }),

            CompleteCurrentInstance: (
                Value?: unknown
            ) =>
                Effect.sync(() =>
                {
                    if (CurrentInstanceState === undefined)
                    {
                        return;
                    }

                    SettleExitState(
                        CurrentInstanceState.ExitState,
                        Value
                    );
                }),

            FailCurrentInstance: (
                Cause: unknown
            ) =>
                Effect.sync(() =>
                {
                    if (CurrentInstanceState === undefined)
                    {
                        return;
                    }

                    FailExitState(
                        CurrentInstanceState.ExitState,
                        Cause
                    );
                })
        };

    return {
        Driver,
        Layer: Layer.succeed(
            InkRenderer,
            Renderer
        )
    };
};

export const MakeTestLayer = (): TestInkRenderer =>
{
    return MakeTestInkRenderer();
};

export interface TestKeyEventOptions
{
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

export const MakeTestKeyEvent = (
    Options: TestKeyEventOptions = { }
): KeyEvent =>
{
    return {
        Input: Options.Input ?? "",

        Down: Options.Down ?? false,
        Left: Options.Left ?? false,
        Right: Options.Right ?? false,
        Up: Options.Up ?? false,

        End: Options.End ?? false,
        Home: Options.Home ?? false,
        PageDown: Options.PageDown ?? false,
        PageUp: Options.PageUp ?? false,

        Backspace: Options.Backspace ?? false,
        Delete: Options.Delete ?? false,
        Escape: Options.Escape ?? false,
        Return: Options.Return ?? false,
        Tab: Options.Tab ?? false,

        Control: Options.Control ?? false,
        Hyper: Options.Hyper ?? false,
        Meta: Options.Meta ?? false,
        Shift: Options.Shift ?? false,
        Super: Options.Super ?? false,

        CapsLock: Options.CapsLock ?? false,
        NumLock: Options.NumLock ?? false,

        EventType: Options.EventType ?? "press"
    };
};

export const MakeTestInputCommand = (
    Action: InputAction,
    Options: TestKeyEventOptions & {
        readonly Text?: string;
    } = {}
): InputCommand =>
{
    return {
        Action,
        Event: MakeTestKeyEvent(Options),
        ...((Options.Text !== undefined) ? { Text: Options.Text } : { } )
    };
};

export const SubmitCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "Submit",
        {
            Return: true
        }
    );
};

export const CancelCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "Cancel",
        {
            Escape: true
        }
    );
};

export const MoveUpCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "MoveUp",
        {
            Up: true
        }
    );
};

export const MoveDownCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "MoveDown",
        {
            Down: true
        }
    );
};

export const MoveLeftCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "MoveLeft",
        {
            Left: true
        }
    );
};

export const MoveRightCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "MoveRight",
        {
            Right: true
        }
    );
};

export const PageUpCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "PageUp",
        {
            PageUp: true
        }
    );
};

export const PageDownCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "PageDown",
        {
            PageDown: true
        }
    );
};

export const MoveHomeCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "MoveHome",
        {
            Home: true
        }
    );
};

export const MoveEndCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "MoveEnd",
        {
            End: true
        }
    );
};

export const DeleteBackwardCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "DeleteBackward",
        {
            Backspace: true
        }
    );
};

export const DeleteForwardCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "DeleteForward",
        {
            Delete: true
        }
    );
};

export const ToggleCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "Toggle",
        {
            Input: " "
        }
    );
};

export const ClearCommand = (): InputCommand =>
{
    return MakeTestInputCommand(
        "Clear",
        {
            Control: true,
            Input: "u"
        }
    );
};

export const InsertTextCommand = (
    Text: string
): InputCommand =>
{
    return MakeTestInputCommand(
        "InsertText",
        {
            Input: Text,
            Text
        }
    );
};

export const TextToInputCommands = (
    Text: string
): ReadonlyArray<InputCommand> =>
{
    return Array
        .from(Text)
        .map((Character: string) => InsertTextCommand(Character));
};

export const ResolveTestInputCommand = (
    Options: TestKeyEventOptions,
    CurrentKeyMap: KeyMap = DefaultKeyMap,
    AllowTextInput: boolean = true
): InputCommand =>
{
    return ResolveInputCommand(
        MakeTestKeyEvent(Options),
        CurrentKeyMap,
        AllowTextInput
    );
};

export const RunReducerWithCommands = <State>(
    InitialState: State,
    Reducer: (State: State, Command: InputCommand) => State,
    Commands: Iterable<InputCommand>
): State =>
{
    let CurrentState: State = InitialState;

    for (const Command of Commands)
    {
        CurrentState = Reducer(
            CurrentState,
            Command
        );
    }

    return CurrentState;
};

export const FindLatestElement = (
    Frames: ReadonlyArray<TestRenderFrame>
): ReactNode | undefined =>
{
    for (let Index: number = Frames.length - 1; Index >= 0; Index--)
    {
        const Frame: TestRenderFrame = Frames[Index];

        if (Frame?.Element !== undefined)
        {
            return Frame.Element;
        }
    }

    return undefined;
};

export const FramesToTextSnapshot = (
    Frames: ReadonlyArray<TestRenderFrame>
): string =>
{
    return StringifyReactNode(
        FindLatestElement(Frames)
    );
};

export const StringifyReactNode = (
    Node: ReactNode
): string =>
{
    if (
        Node === undefined
        || Node === null
        || typeof Node === "boolean"
    )
    {
        return "";
    }

    if (
        typeof Node === "string"
        || typeof Node === "number"
        || typeof Node === "bigint"
    )
    {
        return String(Node);
    }

    if (Array.isArray(Node))
    {
        return Node
            .map(StringifyReactNode)
            .join("");
    }

    if (isValidElement(Node))
    {
        return StringifyReactElement(Node);
    }

    if (IsIterable(Node))
    {
        return Array
            .from(Node)
            .map((Child: ReactNode) => StringifyReactNode(Child as ReactNode))
            .join("");
    }

    return "";
};

const StringifyReactElement = (
    Element: ReactElement
): string =>
{
    const Properties: PropsWithChildren = Element.props as {
        readonly children?: ReactNode;
    };

    const ChildrenValue: ReactNode = Properties.children;

    if (ChildrenValue === undefined)
    {
        return "";
    }

    return Children
        .toArray(ChildrenValue)
        .map(StringifyReactNode)
        .join("");
};

const IsIterable = (
    Value: unknown
): Value is Iterable<unknown> =>
{
    return typeof Value === "object"
        && Value !== null
        && Symbol.iterator in Value;
};
