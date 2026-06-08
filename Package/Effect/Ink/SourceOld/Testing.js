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
import { Children, isValidElement } from "react";
import { DefaultKeyMap, ResolveInputCommand } from "./Input.js";
import { Effect, Layer } from "effect";
import { InkExitError, inkAlreadyUnmounted } from "./Error.js";
import { InkRenderer } from "./InkRenderer.js";
export const MakeTestInkRenderer = () => {
    const Frames = [];
    let CurrentInstanceState;
    const PushFrame = (Frame) => {
        const NextFrame = {
            ...Frame,
            Index: Frames.length
        };
        Frames.push(NextFrame);
        return NextFrame;
    };
    const MakeExitState = () => {
        let ResolveFunction;
        let RejectFunction;
        const Promise = new globalThis.Promise((
        /* eslint-disable @typescript-eslint/typedef */
        Resolve, Reject
        /* eslint-enable @typescript-eslint/typedef */
        ) => {
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
    const SettleExitState = (ExitState, Value) => {
        if (ExitState.IsSettled) {
            return;
        }
        ExitState.IsSettled = true;
        ExitState.Resolve(Value);
    };
    const FailExitState = (ExitState, Cause) => {
        if (ExitState.IsSettled) {
            return;
        }
        ExitState.IsSettled = true;
        ExitState.Reject(Cause);
    };
    const WrapTestInstance = (InstanceState) => {
        const RequireMounted = (EffectToRun) => InstanceState.IsUnmounted
            ? Effect.fail(inkAlreadyUnmounted())
            : EffectToRun;
        const Rerender = (Element) => RequireMounted(Effect.sync(() => {
            PushFrame({
                Element,
                Kind: "Rerender"
            });
        }));
        const Unmount = Effect.sync(() => {
            if (InstanceState.IsUnmounted) {
                return;
            }
            InstanceState.IsUnmounted = true;
            PushFrame({
                Kind: "Unmount"
            });
            SettleExitState(InstanceState.ExitState, undefined);
        });
        const Cleanup = Effect.sync(() => {
            if (InstanceState.IsUnmounted) {
                return;
            }
            InstanceState.IsUnmounted = true;
            PushFrame({
                Kind: "Cleanup"
            });
            SettleExitState(InstanceState.ExitState, undefined);
        });
        const Clear = RequireMounted(Effect.sync(() => {
            PushFrame({
                Kind: "Clear"
            });
        }));
        const WaitUntilExit = Effect.tryPromise({
            catch: (Cause) => new InkExitError({
                Cause,
                Message: "The test Ink instance exited with a failure."
            }),
            try: () => InstanceState.ExitState.Promise
        });
        const WaitUntilRenderFlush = RequireMounted(Effect.void);
        return {
            Cleanup,
            Clear,
            Rerender,
            Unmount,
            WaitUntilExit,
            WaitUntilRenderFlush
        };
    };
    const Renderer = {
        Render: (Element, Options) => Effect.acquireRelease(Effect.sync(() => {
            const InstanceState = {
                ExitState: MakeExitState(),
                IsUnmounted: false
            };
            CurrentInstanceState = InstanceState;
            if (Options !== undefined) {
                PushFrame({
                    Element,
                    Kind: "Render",
                    Options
                });
            }
            else {
                PushFrame({ Element, Kind: "Render" });
            }
            return WrapTestInstance(InstanceState);
        }), (Instance) => Instance.Cleanup),
        Run: (Element, Options) => Effect.scoped(Effect.gen(function* () {
            const Instance = yield* Renderer.Render(Element, Options);
            return yield* Instance.WaitUntilExit;
        }))
    };
    const Driver = {
        GetFrames: Effect.sync(() => {
            return [...Frames];
        }),
        ClearFrames: Effect.sync(() => {
            Frames.splice(0, Frames.length);
        }),
        GetLatestFrame: Effect.sync(() => {
            return Frames.at(-1);
        }),
        GetLatestElement: Effect.sync(() => {
            return FindLatestElement(Frames);
        }),
        GetTextSnapshot: Effect.sync(() => {
            return StringifyReactNode(FindLatestElement(Frames));
        }),
        CompleteCurrentInstance: (Value) => Effect.sync(() => {
            if (CurrentInstanceState === undefined) {
                return;
            }
            SettleExitState(CurrentInstanceState.ExitState, Value);
        }),
        FailCurrentInstance: (Cause) => Effect.sync(() => {
            if (CurrentInstanceState === undefined) {
                return;
            }
            FailExitState(CurrentInstanceState.ExitState, Cause);
        })
    };
    return {
        Driver,
        Layer: Layer.succeed(InkRenderer, Renderer)
    };
};
export const MakeTestLayer = () => {
    return MakeTestInkRenderer();
};
export const MakeTestKeyEvent = (Options = {}) => {
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
export const MakeTestInputCommand = (Action, Options = {}) => {
    return {
        Action,
        Event: MakeTestKeyEvent(Options),
        ...((Options.Text !== undefined) ? { Text: Options.Text } : {})
    };
};
export const SubmitCommand = () => {
    return MakeTestInputCommand("Submit", {
        Return: true
    });
};
export const CancelCommand = () => {
    return MakeTestInputCommand("Cancel", {
        Escape: true
    });
};
export const MoveUpCommand = () => {
    return MakeTestInputCommand("MoveUp", {
        Up: true
    });
};
export const MoveDownCommand = () => {
    return MakeTestInputCommand("MoveDown", {
        Down: true
    });
};
export const MoveLeftCommand = () => {
    return MakeTestInputCommand("MoveLeft", {
        Left: true
    });
};
export const MoveRightCommand = () => {
    return MakeTestInputCommand("MoveRight", {
        Right: true
    });
};
export const PageUpCommand = () => {
    return MakeTestInputCommand("PageUp", {
        PageUp: true
    });
};
export const PageDownCommand = () => {
    return MakeTestInputCommand("PageDown", {
        PageDown: true
    });
};
export const MoveHomeCommand = () => {
    return MakeTestInputCommand("MoveHome", {
        Home: true
    });
};
export const MoveEndCommand = () => {
    return MakeTestInputCommand("MoveEnd", {
        End: true
    });
};
export const DeleteBackwardCommand = () => {
    return MakeTestInputCommand("DeleteBackward", {
        Backspace: true
    });
};
export const DeleteForwardCommand = () => {
    return MakeTestInputCommand("DeleteForward", {
        Delete: true
    });
};
export const ToggleCommand = () => {
    return MakeTestInputCommand("Toggle", {
        Input: " "
    });
};
export const ClearCommand = () => {
    return MakeTestInputCommand("Clear", {
        Control: true,
        Input: "u"
    });
};
export const InsertTextCommand = (Text) => {
    return MakeTestInputCommand("InsertText", {
        Input: Text,
        Text
    });
};
export const TextToInputCommands = (Text) => {
    return Array
        .from(Text)
        .map((Character) => InsertTextCommand(Character));
};
export const ResolveTestInputCommand = (Options, CurrentKeyMap = DefaultKeyMap, AllowTextInput = true) => {
    return ResolveInputCommand(MakeTestKeyEvent(Options), CurrentKeyMap, AllowTextInput);
};
export const RunReducerWithCommands = (InitialState, Reducer, Commands) => {
    let CurrentState = InitialState;
    for (const Command of Commands) {
        CurrentState = Reducer(CurrentState, Command);
    }
    return CurrentState;
};
export const FindLatestElement = (Frames) => {
    for (let Index = Frames.length - 1; Index >= 0; Index--) {
        const Frame = Frames[Index];
        if (Frame?.Element !== undefined) {
            return Frame.Element;
        }
    }
    return undefined;
};
export const FramesToTextSnapshot = (Frames) => {
    return StringifyReactNode(FindLatestElement(Frames));
};
export const StringifyReactNode = (Node) => {
    if (Node === undefined
        || Node === null
        || typeof Node === "boolean") {
        return "";
    }
    if (typeof Node === "string"
        || typeof Node === "number"
        || typeof Node === "bigint") {
        return String(Node);
    }
    if (Array.isArray(Node)) {
        return Node
            .map(StringifyReactNode)
            .join("");
    }
    if (isValidElement(Node)) {
        return StringifyReactElement(Node);
    }
    if (IsIterable(Node)) {
        return Array
            .from(Node)
            .map((Child) => StringifyReactNode(Child))
            .join("");
    }
    return "";
};
const StringifyReactElement = (Element) => {
    const Properties = Element.props;
    const ChildrenValue = Properties.children;
    if (ChildrenValue === undefined) {
        return "";
    }
    return Children
        .toArray(ChildrenValue)
        .map(StringifyReactNode)
        .join("");
};
const IsIterable = (Value) => {
    return typeof Value === "object"
        && Value !== null
        && Symbol.iterator in Value;
};
//# sourceMappingURL=Testing.js.map