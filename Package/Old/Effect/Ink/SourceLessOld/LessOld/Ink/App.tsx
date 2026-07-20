/**
 * The root component rendered by `ink` for displaying interactive CLI prompts.
 *
 * @module @sorrell/effect-ink/Ink/App
 */

import { type AppProps, Box, type Key as InkKey, useApp } from "ink";
import { type ReactElement, type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Runtime, type Impl, type Prose } from "../Prompt/index.ts";

/**
 * @file      App.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export interface PromptAppProps<A>
{
    readonly Prompt: Impl.PromptImpl<A>;

    readonly Cancel: (Message?: string) => void;
    readonly Fail: (Reason: { Cause?: unknown; Message?: string; }) => void;
    readonly Submit: (Out: A) => void;

    // readonly Resolve: (Value: A) => void;
    // readonly Reject: (Cause: unknown) => void;
    readonly OnBeep?: () => void;
}

export function PromptApp<A>(Props: PromptAppProps<A>): ReactElement | null
{
    const App: AppProps = useApp();

    const [ ActiveLoop, SetActiveLoop ] = useState<Impl.ActiveLoopState | undefined>(undefined);

    type RenderState =
        Pick<Impl.LoopPrompt<unknown>, "Render"> &
        Pick<Impl.ActiveLoopState, "State">;

    const [ SubmittedFields, SetSubmittedFields ] = useState<ReadonlyArray<RenderState>>([ ]);
    /* eslint-disable-next-line @typescript-eslint/typedef */
    const PushSubmitted = useCallback((Loop: Impl.ActiveLoopState): void =>
    {
        SetSubmittedFields((Old: ReadonlyArray<RenderState>): ReadonlyArray<RenderState> =>
        {
            const Out: RenderState =
                {
                    Render: Loop.Loop.Render,
                    State:
                    {
                        ...(Loop.State as object),
                        IsActive: false
                    }
                };

            return [ ...Old, Out ];
        });
    }, [ ]);

    const ActiveLoopRef: RefObject<Impl.ActiveLoopState | undefined> =
        useRef<Impl.ActiveLoopState | undefined>(undefined);

    const IsProcessingRef: RefObject<boolean> = useRef(false);
    const IsCompleteRef: RefObject<boolean> = useRef(false);

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const SetCurrentActiveLoop = useCallback(
        (NextActiveLoop: Impl.ActiveLoopState | undefined) =>
        {
            ActiveLoopRef.current = NextActiveLoop;
            SetActiveLoop(NextActiveLoop);
        },
        [ ]
    );

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const RunLoop = useCallback(
        <LoopOutput,>(Loop: Impl.LoopPrompt<LoopOutput>): Promise<LoopOutput> =>
        {
            /* eslint-disable-next-line @typescript-eslint/typedef */
            return new Promise<LoopOutput>((Resolve, Reject) =>
            {
                const NextActiveLoop: Impl.ActiveLoopState =
                    {
                        Loop: Loop as Impl.LoopPrompt<unknown>,
                        Reject,
                        Resolve: Resolve as (Value: unknown) => void,
                        State: Loop.InitialState
                    };

                SetCurrentActiveLoop(NextActiveLoop);
            });
        },
        [ SetCurrentActiveLoop ]
    );

    useEffect(
        () =>
        {
            void Runtime.InterpretPromptProgram(
                Props.Prompt,
                RunLoop
            ).then(
                (Value: A | Prose.TypeId) =>
                {
                    if (IsCompleteRef.current)
                    {
                        return;
                    }

                    IsCompleteRef.current = true;
                    Props.Submit(Value as A);
                    // Props.Resolve(Value);
                    App.exit();
                },
                (Cause: unknown) =>
                {
                    if (IsCompleteRef.current)
                    {
                        return;
                    }

                    IsCompleteRef.current = true;
                    Props.Fail({ Cause });
                    App.exit();
                    // Props.Reject(Cause);
                    // App.exit(Cause instanceof Error ? Cause : new PromptFailed(Cause));
                }
            );

            return () =>
            {
                if (IsCompleteRef.current)
                {
                    return;
                }

                IsCompleteRef.current = true;

                const CurrentActiveLoop: Impl.ActiveLoopState | undefined = ActiveLoopRef.current;

                if (CurrentActiveLoop !== undefined)
                {
                    CurrentActiveLoop.Reject(undefined);
                }

                Props.Cancel();
                // Props.Reject(new PromptCanceled({ }));
            };
        },
        [ App, Props, RunLoop ]
    );

    useInput((TextInput: string, Key: InkKey) =>
    {
        const CurrentActiveLoop: Impl.ActiveLoopState | undefined = ActiveLoopRef.current;

        if (CurrentActiveLoop === undefined)
        {
            return;
        }

        if (IsProcessingRef.current)
        {
            return;
        }

        IsProcessingRef.current = true;

        const Input: PromptInput =
            {
                Key,
                Text: TextInput
            };

        void Effect.runPromise(
            CurrentActiveLoop.Loop.Process(
                Input,
                CurrentActiveLoop.State
            )
        ).then(
            (Action: Impl.Action.Action<unknown, unknown>) =>
            {
                switch (Action._tag)
                {
                    case "Beep":
                    {
                        Props.OnBeep?.();
                        return;
                    }

                    case "NextFrame":
                    {
                        const NextActiveLoop: Impl.ActiveLoopState =
                            {
                                ...CurrentActiveLoop,
                                State: Action.State
                            };

                        SetCurrentActiveLoop(NextActiveLoop);
                        return;
                    }

                    case "Submit":
                    {
                        SetCurrentActiveLoop(undefined);
                        PushSubmitted(CurrentActiveLoop);
                        CurrentActiveLoop.Resolve(Action.Value);
                        return;
                    }
                }
            },
            (Cause: unknown) =>
            {
                CurrentActiveLoop.Reject(Cause);
            }
        ).finally(
            () =>
            {
                IsProcessingRef.current = false;
            }
        );
    },
    {
        isActive: ActiveLoop !== undefined
    }
    );

    if (ActiveLoop === undefined)
    {
        return null;
    }

    // const SubmittedFieldView = ({ Render, State }: RenderState) =>
    //     <Render
    //         key={ Hash.hash(State) }
    //         { ...(State as object) }
    //     />;

    const WithFlowBrace = ({ Render, State, Index }: PromptItemViewProps) =>
    {
        const IsCurrent: boolean = Index === PromptItems.length - 1;
        const ActiveColor: typeof ForegroundColor = "cyan";
        const InactiveColor: undefined = undefined;
        const ErrorColor: typeof ForegroundColor = "yellow";

        const Color: typeof ForegroundColor | undefined = IsCurrent
            ? (State as State.Internal).ErrorMessage !== undefined
                ? ErrorColor
                : ActiveColor
            : InactiveColor;

        const BoxReference: RefObject<DOMElement | null> = useRef<DOMElement>(null);

        const IsError: boolean = (State as State.Internal).ErrorMessage !== undefined;

        const FlowBraceProps: FlowBraceProps =
            {
                BoxReference,
                End:
                {
                    Character: IsCurrent ? "└" : "│",
                    Color
                },
                Middle:
                {
                    Character: "│",
                    Color
                },
                Start:
                {
                    Character: Index === PromptItems.length - 1
                        ? IsError
                            ? "▲"
                            : "◆"
                        : "◇",
                    Color: (IsError && IsCurrent) ? ErrorColor : ActiveColor
                }
            };

        return (
            <Box flexDirection="row">
                <FlowBrace { ...FlowBraceProps }/>
                <Box
                    flexDirection="column"
                    ref={ BoxReference }>
                    <Render { ...(State as object) } />
                    <Text color="yellow">
                        {
                            (State as State.Internal).IsActive
                                ? (State as State.Internal).ErrorMessage ?? " "
                                : " "
                        }
                    </Text>
                </Box>
            </Box>
        );
    };

    const PromptItems: ReadonlyArray<RenderState> =
        [
            ...SubmittedFields,
            {
                Render: ActiveLoop.Loop.Render,
                State: ActiveLoop.State
            }
        ];

    type PromptItemViewProps =
        RenderState &
        {
            readonly Index: number;
        };

    const PromptItemView = ({ Index, Render, State }: PromptItemViewProps) =>
    {
        return <WithFlowBrace { ...{ Index, Render, State } } />;
    };

    return (
        <Box flexDirection="column">
            {
                PromptItems.map((Item: RenderState, Index: number) =>
                    <PromptItemView
                        key={ Index }
                        { ...{ ...Item, Index } }
                    />
                )
            }
        </Box>
    );
}
