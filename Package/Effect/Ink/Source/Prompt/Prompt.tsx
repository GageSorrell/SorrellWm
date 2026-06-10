/**
 * @file      Prompt.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    type AppProps,
    Box,
    type Key as InkKey,
    render as InkRender,
    type Instance,
    Text,
    useApp,
    useInput
} from "ink";
import { Effect, type Record } from "effect";
import {
    type ReactElement,
    type ReactNode,
    type RefObject,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

export interface PromptInput
{
    readonly Text: string;
    readonly Key: InkKey;
}

export interface BeepAction
{
    readonly _tag: "Beep";
}

export interface NextFrameAction<StateType>
{
    readonly _tag: "NextFrame";
    readonly State: StateType;
}

export interface SubmitAction<A>
{
    readonly _tag: "Submit";
    readonly Value: A;
}

export type PromptAction<StateType, A> =
    | BeepAction
    | NextFrameAction<StateType>
    | SubmitAction<A>;

export function Beep(): BeepAction
{
    return {
        _tag: "Beep"
    };
}

export function NextFrame<StateType>(State: StateType): NextFrameAction<StateType>
{
    return {
        _tag: "NextFrame",

        State
    };
}

export function Submit<A>(Value: A): SubmitAction<A>
{
    return {
        _tag: "Submit",

        Value
    };
}

export interface LoopDefinition<StateType, A>
{
    readonly InitialState: StateType;
    readonly Render: (State: StateType) => ReactNode;
    readonly Process: (
        Input: PromptInput,
        State: StateType
    ) => Effect.Effect<PromptAction<StateType, A>>;
}

export interface LoopPrompt<A>
{
    readonly _tag: "Loop";
    readonly InitialState: unknown;
    readonly Render: (State: unknown) => ReactNode;
    readonly Process: (
        Input: PromptInput,
        State: unknown
    ) => Effect.Effect<PromptAction<unknown, A>>;
}

export interface SucceedPrompt<A>
{
    readonly _tag: "Succeed";
    readonly Value: A;
}

export interface OnSuccessPrompt<A>
{
    readonly _tag: "OnSuccess";
    readonly Prompt: Prompt<unknown>;
    readonly OnSuccess: (Value: unknown) => Prompt<A>;
}

export type Prompt<A> =
    | LoopPrompt<A>
    | SucceedPrompt<A>
    | OnSuccessPrompt<A>;

export type PromptOutput<SelfType> =
    SelfType extends Prompt<infer A>
        ? A
        : never;

export function Loop<StateType, A>(
    Definition: LoopDefinition<StateType, A>
): Prompt<A>
{
    return {
        _tag: "Loop",

        InitialState: Definition.InitialState,
        Process: (Input: PromptInput, State: unknown) =>
        {
            return Definition.Process(
                Input,
                State as StateType
            ) as Effect.Effect<PromptAction<unknown, A>>;
        },
        Render: (State: unknown) =>
        {
            return Definition.Render(State as StateType);
        }
    };
}

export function Succeed<A>(Value: A): Prompt<A>
{
    return {
        _tag: "Succeed",

        Value
    };
}

export function FlatMap<A, A2>(
    Self: Prompt<A>,
    OnSuccess: (Value: A) => Prompt<A2>
): Prompt<A2>
{
    return {
        _tag: "OnSuccess",

        OnSuccess: (Value: unknown) =>
        {
            return OnSuccess(Value as A);
        },
        Prompt: Self as Prompt<unknown>
    };
}

export function Map<A, A2>(
    Self: Prompt<A>,
    Function: (Value: A) => A2
): Prompt<A2>
{
    return FlatMap(Self, (Value: A) =>
    {
        return Succeed(Function(Value));
    });
}

export function All<const Prompts extends ReadonlyArray<Prompt<unknown>>>(
    Prompts: Prompts
): Prompt<{ readonly [ Key in keyof Prompts ]: PromptOutput<Prompts[Key]> }>;

export function All<const PromptRecord extends Readonly<Record<string, Prompt<unknown>>>>(
    Prompts: PromptRecord
): Prompt<{ readonly [ Key in keyof PromptRecord ]: PromptOutput<PromptRecord[Key]> }>;

export function All(
    Prompts:
        | ReadonlyArray<Prompt<unknown>>
        | Readonly<Record<string, Prompt<unknown>>>
): Prompt<unknown>
{
    if (Array.isArray(Prompts))
    {
        let Accumulator: Prompt<ReadonlyArray<unknown>> = Succeed([ ]);

        for (const CurrentPrompt of Prompts)
        {
            Accumulator = FlatMap(Accumulator, (Values: ReadonlyArray<unknown>) =>
            {
                return Map(CurrentPrompt, (Value: unknown) =>
                {
                    return [
                        ...Values,
                        Value
                    ];
                });
            });
        }

        return Accumulator;
    }

    let Accumulator: Prompt<Readonly<Record<string, unknown>>> = Succeed({ });

    for (const [ Key, CurrentPrompt ] of Object.entries(Prompts))
    {
        Accumulator = FlatMap(Accumulator, (Values: Record.ReadonlyRecord<string, unknown>) =>
        {
            return Map(CurrentPrompt, (Value: unknown) =>
            {
                return {
                    ...Values,
                    [Key]: Value
                };
            });
        });
    }

    return Accumulator;
}

export class PromptCancelled extends Error
{
    public readonly _tag: string = "PromptCancelled";

    public constructor()
    {
        super("The prompt was cancelled before it submitted a value.");
    }
}

export class PromptFailed extends Error
{
    public readonly _tag: string = "PromptFailed";

    public constructor(
        public readonly Cause: unknown
    )
    {
        super("The prompt failed.");
    }
}

export type PromptRunError =
    | PromptCancelled
    | PromptFailed;

function ToPromptRunError(Cause: unknown): PromptRunError
{
    if (Cause instanceof PromptCancelled)
    {
        return Cause;
    }

    if (Cause instanceof PromptFailed)
    {
        return Cause;
    }

    return new PromptFailed(Cause);
}

export interface RunOptions
{
    readonly InkOptions?: Parameters<typeof InkRender>[1];
    readonly OnBeep?: () => void;
}

interface ActiveLoopState
{
    readonly Loop: LoopPrompt<unknown>;
    readonly State: unknown;
    readonly Resolve: (Value: unknown) => void;
    readonly Reject: (Cause: unknown) => void;
}

interface PromptAppProps<A>
{
    readonly Prompt: Prompt<A>;
    readonly Resolve: (Value: A) => void;
    readonly Reject: (Cause: unknown) => void;
    readonly OnBeep?: () => void;
}

type RunLoopFunction = <A>(
    Loop: LoopPrompt<A>
) => Promise<A>;

async function InterpretPromptProgram<A>(
    Prompt: Prompt<A>,
    RunLoop: RunLoopFunction
): Promise<A>
{
    switch (Prompt._tag)
    {
        case "Succeed":
        {
            return Prompt.Value;
        }

        case "OnSuccess":
        {
            const Value: unknown = await InterpretPromptProgram(
                Prompt.Prompt,
                RunLoop
            );

            return await InterpretPromptProgram(
                Prompt.OnSuccess(Value),
                RunLoop
            );
        }

        case "Loop":
        {
            return await RunLoop(Prompt);
        }
    }
}

function PromptApp<A>(
    Props: PromptAppProps<A>
): ReactElement | null
{
    const App: AppProps = useApp();

    const [ ActiveLoop, SetActiveLoop ] = useState<ActiveLoopState | undefined>(undefined);

    const ActiveLoopRef: RefObject<ActiveLoopState | undefined> =
        useRef<ActiveLoopState | undefined>(undefined);

    const IsProcessingRef: RefObject<boolean> = useRef(false);
    const IsCompleteRef: RefObject<boolean> = useRef(false);

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const SetCurrentActiveLoop = useCallback(
        (NextActiveLoop: ActiveLoopState | undefined) =>
        {
            ActiveLoopRef.current = NextActiveLoop;
            SetActiveLoop(NextActiveLoop);
        },
        [ ]
    );

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const RunLoop = useCallback(
        <LoopOutput,>(Loop: LoopPrompt<LoopOutput>): Promise<LoopOutput> =>
        {
            /* eslint-disable-next-line @typescript-eslint/typedef */
            return new Promise<LoopOutput>((Resolve, Reject) =>
            {
                const NextActiveLoop: ActiveLoopState =
                    {
                        Loop: Loop as LoopPrompt<unknown>,
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
            void InterpretPromptProgram(
                Props.Prompt,
                RunLoop
            ).then(
                (Value: A) =>
                {
                    if (IsCompleteRef.current)
                    {
                        return;
                    }

                    IsCompleteRef.current = true;
                    Props.Resolve(Value);
                    App.exit();
                },
                (Cause: unknown) =>
                {
                    if (IsCompleteRef.current)
                    {
                        return;
                    }

                    IsCompleteRef.current = true;
                    Props.Reject(Cause);
                    App.exit(Cause instanceof Error ? Cause : new PromptFailed(Cause));
                }
            );

            return () =>
            {
                if (IsCompleteRef.current)
                {
                    return;
                }

                IsCompleteRef.current = true;

                const CurrentActiveLoop: ActiveLoopState | undefined = ActiveLoopRef.current;

                if (CurrentActiveLoop !== undefined)
                {
                    CurrentActiveLoop.Reject(new PromptCancelled());
                }

                Props.Reject(new PromptCancelled());
            };
        },
        [ App, Props, RunLoop ]
    );

    useInput((TextInput: string, Key: InkKey) =>
    {
        const CurrentActiveLoop: ActiveLoopState | undefined = ActiveLoopRef.current;

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
            (Action: PromptAction<unknown, unknown>) =>
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
                        const NextActiveLoop: ActiveLoopState =
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

    return (
        <>
            { ActiveLoop.Loop.Render(ActiveLoop.State) }
        </>
    );
}

function RunPromptAsPromise<A>(
    Prompt: Prompt<A>,
    Options: RunOptions
): Promise<A>
{
    /* eslint-disable-next-line @typescript-eslint/typedef */
    return new Promise<A>((Resolve, Reject) =>
    {
        let HasSettled: boolean = false;

        const ResolveOnce = (Value: A): void =>
        {
            if (HasSettled)
            {
                return;
            }

            HasSettled = true;
            Resolve(Value);
        };

        const RejectOnce = (Cause: unknown): void =>
        {
            if (HasSettled)
            {
                return;
            }

            HasSettled = true;
            Reject(Cause);
        };

        try
        {
            const InkInstance: Instance = InkRender(
                <PromptApp
                    { ...Options }
                    Prompt={ Prompt }
                    Reject={ RejectOnce }
                    Resolve={ ResolveOnce }
                />,
                Options.InkOptions
            );

            void InkInstance.waitUntilExit().then(
                () =>
                {
                    if (!HasSettled)
                    {
                        RejectOnce(new PromptCancelled());
                    }
                },
                RejectOnce
            );
        }
        catch (Cause)
        {
            RejectOnce(Cause);
        }
    });
}

export function Run<A>(
    Prompt: Prompt<A>,
    Options: RunOptions = { }
): Effect.Effect<A, PromptRunError>
{
    return Effect.tryPromise({
        catch: ToPromptRunError,
        try: () =>
        {
            return RunPromptAsPromise(
                Prompt,
                Options
            );
        }
    });
}

export interface TextPromptOptions
{
    readonly Message: ReactNode;
    readonly Placeholder?: string;
    readonly InitialValue?: string;
    readonly Validate?: (Value: string) => boolean;
}

interface TextPromptState
{
    readonly Value: string;
    readonly CursorIndex: number;
}

function InsertIntoTextPromptState(
    State: TextPromptState,
    Text: string
): TextPromptState
{
    const BeforeCursor: string = State.Value.slice(
        0,
        State.CursorIndex
    );

    const AfterCursor: string = State.Value.slice(State.CursorIndex);

    return {
        CursorIndex: State.CursorIndex + Text.length,
        Value: `${BeforeCursor}${Text}${AfterCursor}`
    };
}

function RemoveBeforeCursor(
    State: TextPromptState
): TextPromptState
{
    if (State.CursorIndex <= 0)
    {
        return State;
    }

    return {
        CursorIndex: State.CursorIndex - 1,
        Value: `${State.Value.slice(0, State.CursorIndex - 1)}${State.Value.slice(State.CursorIndex)}`
    };
}

function RemoveAtCursor(
    State: TextPromptState
): TextPromptState
{
    if (State.CursorIndex >= State.Value.length)
    {
        return State;
    }

    return {
        CursorIndex: State.CursorIndex,
        Value: `${State.Value.slice(0, State.CursorIndex)}${State.Value.slice(State.CursorIndex + 1)}`
    };
}

function MoveCursor(
    State: TextPromptState,
    CursorIndex: number
): TextPromptState
{
    const NextCursorIndex: number = Math.max(
        0,
        Math.min(
            CursorIndex,
            State.Value.length
        )
    );

    return {
        ...State,
        CursorIndex: NextCursorIndex
    };
}

export function TextPrompt(
    Options: TextPromptOptions
): Prompt<string>
{
    const InitialValue: string = Options.InitialValue ?? "";

    return Loop<TextPromptState, string>({
        InitialState:
        {
            CursorIndex: InitialValue.length,
            Value: InitialValue
        },
        Process: (Input: PromptInput, State: TextPromptState) =>
        {
            if (Input.Key.return)
            {
                if (Options.Validate !== undefined && !Options.Validate(State.Value))
                {
                    return Effect.succeed(Beep());
                }

                return Effect.succeed(Submit(State.Value));
            }

            if (Input.Key.backspace)
            {
                return Effect.succeed(NextFrame(RemoveBeforeCursor(State)));
            }

            if (Input.Key.delete)
            {
                return Effect.succeed(NextFrame(RemoveAtCursor(State)));
            }

            if (Input.Key.leftArrow)
            {
                return Effect.succeed(NextFrame(MoveCursor(State, State.CursorIndex - 1)));
            }

            if (Input.Key.rightArrow)
            {
                return Effect.succeed(NextFrame(MoveCursor(State, State.CursorIndex + 1)));
            }

            if (Input.Key.home)
            {
                return Effect.succeed(NextFrame(MoveCursor(State, 0)));
            }

            if (Input.Key.end)
            {
                return Effect.succeed(NextFrame(MoveCursor(State, State.Value.length)));
            }

            if (Input.Text.length > 0 && !Input.Key.ctrl && !Input.Key.meta)
            {
                return Effect.succeed(NextFrame(InsertIntoTextPromptState(State, Input.Text)));
            }

            return Effect.succeed(Beep());
        },
        Render: (State: TextPromptState) =>
        {
            const DisplayValue: string = State.Value.length > 0
                ? State.Value
                : Options.Placeholder ?? "";

            return (
                <Box>
                    <Text>{ Options.Message }</Text>
                    <Text> </Text>
                    <Text dimColor={ State.Value.length === 0 }>
                        { DisplayValue }
                    </Text>
                </Box>
            );
        }
    });
}

export interface ConfirmPromptOptions
{
    readonly Message: ReactNode;
    readonly InitialValue?: boolean;
}

interface ConfirmPromptState
{
    readonly Value: boolean;
}

export function ConfirmPrompt(
    Options: ConfirmPromptOptions
): Prompt<boolean>
{
    return Loop<ConfirmPromptState, boolean>({
        InitialState: {
            Value: Options.InitialValue ?? true
        },
        Process: (Input: PromptInput, State: ConfirmPromptState) =>
        {
            if (Input.Key.return)
            {
                return Effect.succeed(Submit(State.Value));
            }

            if (
                Input.Text === "y" ||
                Input.Text === "Y" ||
                Input.Key.rightArrow
            )
            {
                return Effect.succeed(NextFrame({ Value: true }));
            }

            if (
                Input.Text === "n" ||
                Input.Text === "N" ||
                Input.Key.leftArrow
            )
            {
                return Effect.succeed(NextFrame({ Value: false }));
            }

            if (Input.Text === " ")
            {
                return Effect.succeed(NextFrame({ Value: !State.Value }));
            }

            return Effect.succeed(Beep());
        },
        Render: (State: ConfirmPromptState) =>
        {
            return (
                <Box>
                    <Text>{Options.Message}</Text>
                    <Text> </Text>
                    <Text>
                        { State.Value ? "[Yes]" : "[No]" }
                    </Text>
                </Box>
            );
        }
    });
}

export interface SelectChoice<Value>
{
    readonly Label: ReactNode;
    readonly Value: Value;
}

export interface SelectPromptOptions<Value>
{
    readonly Message: ReactNode;
    readonly Choices: ReadonlyArray<SelectChoice<Value>>;
    readonly InitialIndex?: number;
}

interface SelectPromptState
{
    readonly Index: number;
}

function MoveSelectIndex(
    State: SelectPromptState,
    Length: number,
    Amount: number
): SelectPromptState
{
    const NextIndex: number = (State.Index + Amount + Length) % Length;

    return {
        Index: NextIndex
    };
}

export function SelectPrompt<Value>(
    Options: SelectPromptOptions<Value>
): Prompt<Value>
{
    if (Options.Choices.length === 0)
    {
        return Succeed(undefined as Value);
    }

    const InitialIndex: number = Math.max(
        0,
        Math.min(
            Options.InitialIndex ?? 0,
            Options.Choices.length - 1
        )
    );

    return Loop<SelectPromptState, Value>({
        InitialState: {
            Index: InitialIndex
        },
        Process: (Input: PromptInput, State: SelectPromptState) =>
        {
            if (Input.Key.return)
            {
                return Effect.succeed(Submit(Options.Choices[State.Index]!.Value));
            }

            if (Input.Key.upArrow || Input.Text === "k")
            {
                return Effect.succeed(NextFrame(MoveSelectIndex(
                    State,
                    Options.Choices.length,
                    -1
                )));
            }

            if (Input.Key.downArrow || Input.Text === "j")
            {
                return Effect.succeed(NextFrame(MoveSelectIndex(
                    State,
                    Options.Choices.length,
                    1
                )));
            }

            return Effect.succeed(Beep());
        },
        Render: (State: SelectPromptState) =>
        {
            return (
                <Box flexDirection="column">
                    <Text>{Options.Message}</Text>
                    {
                        Options.Choices.map((Choice: SelectChoice<Value>, Index: number) =>
                        {
                            return (
                                <Text key={ Index }>
                                    {Index === State.Index ? "› " : "  "}
                                    {Choice.Label}
                                </Text>
                            );
                        })
                    }
                </Box>
            );
        }
    });
}
