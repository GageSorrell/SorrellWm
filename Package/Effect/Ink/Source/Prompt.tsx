/**
 * Low-level tooling for building prompts.  This can be used by dependents
 * to build custom prompts.
 *
 * @module @sorrell/effect-ink/Prompt
 */

/**
 * @file      Prompt.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Impl from "./PromptImpl.ts";
import {
    type AppProps,
    Box,
    type DOMElement,
    type Key as InkKey,
    render as InkRender,
    type Instance,
    type RenderOptions,
    Text,
    type TextProps,
    useApp,
    useBoxMetrics,
    useInput
} from "ink";
import {
    Array,
    Data,
    Effect,
    Effectable,
    Option,
    type PlatformError,
    Predicate,
    type Record,
    type Terminal,
    flow,
    pipe
} from "effect";
import { PromptCanceled, PromptFailed, type PromptRunError } from "./Error.ts";
import {
    type ReactElement,
    type ReactNode,
    type RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import type { Covariant } from "effect/Types";
import type { ForegroundColor } from "chalk";
import type { PromptInput } from "./Input.ts";

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-ink/Prompt");

export interface Prompt<A> extends Effect.Effect<
    A,
    | PlatformError.PlatformError
    | Terminal.QuitError
    | PromptRunError,
    Terminal.Terminal
>
{
    readonly [ TypeId ]:
    {
        readonly _A: Covariant<A>;
    };
}

/* eslint-disable-next-line @typescript-eslint/typedef */
const Prototype =
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        ...Effectable.Prototype<Prompt<any>>({
            evaluate()
            {
                return Run(this);
            },
            label: "InkPrompt"
        }),
        [ TypeId ]:
        {
            _A: (_: never) => _,
            _E: (_: never) => _,
            _R: (_: never) => _
        }
    };

export type Result<SelfType> =
    SelfType extends Impl.PromptImpl<infer A>
        ? A
        : never;

export function Loop<StateType, A>(
    Definition: LoopDecl<StateType, A>
): Prompt<A>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Object.create(Prototype);
    Out._tag = "Loop";

    Out.InitialState = Definition.InitialState;

    Out.Process = (Input: PromptInput, State: unknown) =>
    {
        return Definition.Process(
            Input,
            State as StateType
        ) as Effect.Effect<Action.Action<unknown, A>>;
    };

    Out.Render = (State: unknown) =>
    {
        return Definition.Render(State as StateType);
    };

    return Out;
}

/**
 * Construct a {@link Impl.PromptImpl} that succeeds upon interpretation.
 *
 * @category Constructor
 *
 * @template A - The success value type of this.
 *
 * @param Value - The value to which this {@link Impl.PromptImpl} immediately resolves.
 * @returns {Impl.PromptImpl<A>} A {@link Impl.PromptImpl} that succeeds upon interpretation.
 */
export function Succeed<A>(Value: A): Prompt<A>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Object.create(Prototype);
    Out._tag = "Succeed";
    Out.Value = Value;

    return Out;
}

export const WithHeader = <A,>(
    Title: string,
    Options?: Options.Header
): ((Self: Impl.PromptImpl<A>) => Impl.PromptImpl<A>) =>
{
    return (Self: Impl.PromptImpl<A>): Impl.PromptImpl<A> =>
    {
        const Header: Prose.Prose = Prose.Prose.Header({ Title, ...Options });

        if (Self.Prose !== undefined)
        {
            const OutProse: ReadonlyArray<Prose.Prose> = pipe(
                Self.Prose,
                Array.findFirstIndex(Predicate.isTagged("Header")),
                Option.match<Option.Option<ReadonlyArray<Prose.Prose>>, number>({
                    onNone: () => Option.some([ ...(Self.Prose ?? [ ]), Header ]),
                    onSome: (Index: number) => Array.replace(Self.Prose ?? [ ], Index, Header)
                }),
                Option.getOrElse(() => [ Header ])
            );

            return {
                ...Self,
                Prose: OutProse
            };
        }

        return {
            ...Self,
            Prose: [ Header ]
        };
    };
};

export function FlatMap<A, A2>(
    Self: Prompt<A>,
    OnSuccess: (Value: A) => Prompt<A2>
): Prompt<A2>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Object.create(Prototype);
    Out._tag = "OnSuccess";
    Out.OnSuccess = OnSuccess as (Value: unknown) => Prompt<A2>;
    Out.Prompt = Self;

    return Out as Prompt<A2>;
}

export function Map<A, A2>(
    Self: Prompt<A>,
    Function: (Value: A) => A2
): Prompt<A2>
{
    return FlatMap(Self, flow(Function, Succeed));
}

export function All<const Prompts extends ReadonlyArray<Prompt<unknown>>>(
    Prompts: Prompts
): Prompt<{ readonly [ Key in keyof Prompts ]: Result<Prompts[Key]>; }>;

export function All<const PromptRecord extends Readonly<Record<string, Prompt<unknown>>>>(
    Prompts: PromptRecord
): Prompt<{ readonly [ Key in keyof PromptRecord ]: Result<PromptRecord[Key]>; }>;

export function All(
    Prompts:
        | ReadonlyArray<Prompt<unknown>>
        | Readonly<Record<string, Prompt<unknown>>>
): Prompt<unknown>
{
    if (globalThis.Array.isArray(Prompts))
    {
        let Accumulator: Prompt<ReadonlyArray<unknown>> = Succeed([ ]);

        for (const CurrentPrompt of Prompts)
        {
            Accumulator = FlatMap(
                Accumulator,
                (Values: ReadonlyArray<unknown>) =>
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
                    [ Key ]: Value
                };
            });
        });
    }

    return Accumulator;
}

export namespace Options
{
    export interface Header
    {
        readonly Body?: string;
        readonly IsCompact?: boolean;
    }
}

export interface RunOptions
{
    readonly InkOptions?: RenderOptions;
    readonly OnBeep?: () => void;
}

interface PromptAppProps<A>
{
    readonly Prompt: Impl.PromptImpl<A>;

    readonly Cancel: (Message?: string) => void;
    readonly Fail: (Reason: { Cause?: unknown; Message?: string; }) => void;
    readonly Submit: (Out: A) => void;

    // readonly Resolve: (Value: A) => void;
    // readonly Reject: (Cause: unknown) => void;
    readonly OnBeep?: () => void;
}

type RunLoopFunction = <A>(Loop: Impl.LoopPrompt<A>) => Promise<A>;

async function InterpretPromptProgram<A>(
    Prompt: Impl.PromptImpl<A>,
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

type FlowBraceToken =
    {
        Character: string;
        Color: typeof ForegroundColor | undefined;
    };

type FlowBraceProps =
    {
        BoxReference: RefObject<DOMElement | null>;
        End: FlowBraceToken;
        Middle: FlowBraceToken;
        Start: FlowBraceToken;
    };

export function FlowBrace({ BoxReference, End, Middle, Start }: FlowBraceProps): ReactElement
{
    const {
        height: Height,
        hasMeasured: HasMeasured
    } = useBoxMetrics(BoxReference);

    const LineIndices: Array<number> = useMemo(
        () =>
        {
            if (!HasMeasured)
            {
                return [ ];
            }

            return Array.range(0, Height - 1);
        },
        [ Height, HasMeasured ]
    );

    const Line = (Index: number): ReactNode =>
    {
        const { Character, Color: color } = Index === 0
            ? Start
            : Index === LineIndices.length - 1
                ? End
                : Middle;

        const TextProps: TextProps =
            {
                ...((color !== undefined) ? { color } : { })
            };

        return (
            <Text
                { ...TextProps }
                key={ Index.toString() + Character }>
                { Character }{"  "}
            </Text>
        );
    };

    return (
        <Box
            aria-hidden
            flexDirection="column"
            flexShrink={ 0 }
            height="100%"
            overflow="hidden"
            width={ 3 }>
            { LineIndices.map(Line) }
        </Box>
    );
}

function PromptApp<A>(
    Props: PromptAppProps<A>
): ReactElement | null
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
    }, [  ]);

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
                    Props.Impl.Submit(Value);
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
            (Action: Action.Action<unknown, unknown>) =>
            {
                switch (Action._tag)
                {
                    case "Beep":
                    {
                        Props.OnBeep?.();
                        return;
                    }

                    case "Impl.NextFrame":
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

// function RunPromptAsPromise<A>(
//     Prompt: Prompt<A>,
//     Options: RunOptions
// ): Promise<A>
function RunPromptAsPromise<A>(
    Prompt: Impl.PromptImpl<A>,
    Options: RunOptions
): Effect.Effect<A, PromptRunError | Terminal.QuitError>
{
    return Effect.callback((
        Resume: (Out: Effect.Effect<A, PromptRunError>) => void,
        Signal: AbortSignal
    ) =>
    {
        let HasCompleted: boolean = false;

        const HandleResume = (Out: Effect.Effect<A, PromptRunError>): void =>
        {
            if (HasCompleted)
            {
                return;
            }

            HasCompleted = true;

            Instance.waitUntilExit().then(() =>
            {
                Resume(Out);
            });

            Instance.unmount();
        };

        const Cancel = (Message?: string) =>
        {
            /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
            const ErrorArgument: { Message: string; } | { } = Message !== undefined
                ? { Message }
                : { };

            HandleResume(Effect.fail(new PromptCanceled(ErrorArgument)));
        };

        const Fail = (Reason: { Cause?: unknown; Message?: string; }) =>
        {
            HandleResume(Effect.fail(new PromptFailed(Reason)));
        };

        // readonly Cancel: (Message?: string) => void;
        // readonly Submit: (Out: A) => void;

        const Submit = (Value: A) =>
        {
            HandleResume(Effect.succeed(Value));
        };

        const Instance: Instance = InkRender(
            <PromptApp { ...{ ...Options, Cancel, Fail, Prompt, Submit } } />,
            Options.InkOptions
        );

        //     MakeElement({
        //         Submit: (Answer) =>
        //         {
        //             Complete(Effect.succeed(Answer));
        //         },

        //         Cancel: () =>
        //         {
        //             Complete(Effect.fail(new PromptCanceled()));
        //         }
        //     })
        //     );

        Signal.addEventListener("abort", Instance.unmount as () => void);

        return Effect.sync(Instance.unmount);
    });
    // /* eslint-disable-next-line @typescript-eslint/typedef */
    // return new Promise<A>((Resolve, Reject) =>
    // {
    //     let HasSettled: boolean = false;

    //     const ResolveOnce = (Value: A): void =>
    //     {
    //         if (HasSettled)
    //         {
    //             return;
    //         }

    //         HasSettled = true;
    //         Resolve(Value);
    //     };

    //     const RejectOnce = (Cause: unknown): void =>
    //     {
    //         if (HasSettled)
    //         {
    //             return;
    //         }

    //         HasSettled = true;
    //         Reject(Cause);
    //     };

    //     try
    //     {
    //         const InkInstance: Instance = InkRender(
    //             <PromptApp
    //                 { ...Options }
    //                 Prompt={ Prompt }
    //                 Reject={ RejectOnce }
    //                 Resolve={ ResolveOnce }
    //             />,
    //             Options.InkOptions
    //         );

    //         void InkInstance.waitUntilExit().then(
    //             () =>
    //             {
    //                 if (!HasSettled)
    //                 {
    //                     RejectOnce(new PromptCanceled());
    //                 }
    //             },
    //             RejectOnce
    //         );
    //     }
    //     catch (Cause)
    //     {
    //         RejectOnce(Cause);
    //     }
    // });
}

export type PromptEffect<A> =
    Effect.Effect<
        A,
        | Terminal.QuitError
        | PromptRunError
        | PlatformError.PlatformError,
        Terminal.Terminal
    >;

export const Run = <A,>(Prompt: Prompt<A>, Options: RunOptions = { }): PromptEffect<A> =>
{
    return RunPromptAsPromise(Prompt as unknown as Impl.PromptImpl<A>, Options);
};

export namespace Validator
{
    export interface Simple<A>
    {
        (Value: A): true | string;
    }

    export interface Annotated<A>
    {
        GetErrorMessage:
            | ((FailedPredicates: ReadonlyArray<string>) => string)
            | ((FailedPredicates: ReadonlyArray<string>, FailedValue: A) => string);

        Predicates: Record<string, (Value: A) => boolean>;
    }

    export type Validator<A> =
        | Simple<A>
        | Annotated<A>;
}

export interface TextPromptOptions
{
    readonly Message: ReactNode;
    readonly Placeholder?: string;
    readonly InitialValue?: string;
    readonly Validate?: Validator.Validator<string>;
}

export namespace State
{
    export interface Internal
    {
        readonly IsActive: boolean;
        readonly ErrorMessage: string | undefined;
        readonly FailedKeys: ReadonlyArray<string>;
    }

    export interface Text extends Internal
    {
        readonly Value: string;
        readonly CursorIndex: number;
    }

    export interface Select extends Internal
    {
        readonly Page: number;
        readonly Index: number;
    }
}

function InsertIntoTextPromptState(
    Text: string
): (State: State.Text) => State.Text
{
    return function (State: State.Text)
    {
        const BeforeCursor: string = State.Value.slice(
            0,
            State.CursorIndex
        );

        const AfterCursor: string = State.Value.slice(State.CursorIndex);

        return {
            ...State,
            CursorIndex: State.CursorIndex + Text.length,
            IsActive: State.IsActive,
            Value: `${ BeforeCursor }${ Text }${ AfterCursor }`
        };
    };
}

function SetErrorMessage<StateType extends State.Internal>(
    Validation:
        | true
        | string
        | { ErrorMessage: string; FailedKeys: ReadonlyArray<string>; }
): (State: StateType) => StateType
{
    return function (State: StateType): StateType
    {
        if (Validation === true)
        {
            return {
                ...State,
                ErrorMessage: undefined,
                FailedKeys: [ ]
            };
        }
        else if (typeof Validation === "string")
        {
            return {
                ...State,
                ErrorMessage: Validation,
                FailedKeys: [ ]
            };
        }
        else
        {
            return {
                ...State,
                ...Validation
            };
        }
    };
}

function RemoveBeforeCursor(
    State: State.Text
): State.Text
{
    if (State.CursorIndex <= 0)
    {
        return State;
    }

    return {
        ...State,
        CursorIndex: State.CursorIndex - 1,
        IsActive: State.IsActive,
        Value: `${State.Value.slice(0, State.CursorIndex - 1)}${State.Value.slice(State.CursorIndex)}`
    };
}

function RemoveAtCursor(
    State: State.Text
): State.Text
{
    if (State.CursorIndex >= State.Value.length)
    {
        return State;
    }

    return {
        ...State,
        CursorIndex: State.CursorIndex,
        IsActive: State.IsActive,
        Value: `${State.Value.slice(0, State.CursorIndex)}${State.Value.slice(State.CursorIndex + 1)}`
    };
}

function MoveCursor(CursorIndex: number): (State: State.Text) => State.Text
{
    return function (State: State.Text): State.Text
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
    };
}

const IsValid = <A,>(
    Value: A,
    Validator: Validator.Validator<A> | undefined
): (
    | true
    | { ErrorMessage: string; FailedKeys: ReadonlyArray<string>; }
) =>
{
    if (Validator === undefined)
    {
        return true;
    }

    if (Predicate.isFunction(Validator))
    {
        const Out: string | boolean = Validator(Value);
        if (typeof Out === "string")
        {
            return {
                ErrorMessage: Out,
                FailedKeys: [ ]
            };
        }
        else
        {
            return Out;
        }
    }
    else
    {
        const Predicates: ReadonlyArray<[ string, (Value: A) => boolean ]> =
            Object.entries(Validator.Predicates);

        const FailedKeys: ReadonlyArray<string> = Predicates.map(
            ([ Key, Predicate ]: [ string, (Value: A) => boolean ]): string | undefined =>
            {
                return Predicate(Value)
                    ? undefined
                    : Key;
            })
            .filter((Value: string | undefined) => Value !== undefined);

        if (FailedKeys.length > 0)
        {
            const ErrorMessage: string = Validator.GetErrorMessage(FailedKeys, Value);

            return {
                ErrorMessage,
                FailedKeys
            };
        }
        else
        {
            return true;
        }
    }
};

export function TextPrompt(
    Options: TextPromptOptions
): Prompt<string>
{
    const InitialValue: string = Options.InitialValue ?? "";

    return Loop<State.Text, string>({
        InitialState:
        {
            CursorIndex: InitialValue.length,
            ErrorMessage: undefined,
            FailedKeys: [ ],
            IsActive: true,
            Value: InitialValue
        },
        Process: (Input: PromptInput, State: State.Text) =>
        {
            /* eslint-disable-next-line @typescript-eslint/typedef */
            const GetNextFrame = Impl.NextFrame(State);

            // @TODO If return is pressed and value is empty, then use placeholder.
            if (Input.Key.return)
            {
                // if (Options.Validate !== undefined && !Options.Validate(State.Value))
                const Validation: true | { ErrorMessage: string; FailedKeys: ReadonlyArray<string>; } =
                    IsValid(State.Value, Options.Validate);

                if (Validation === true)
                {
                    return Effect.succeed(Impl.Submit(State.Value));
                }
                else
                {
                    return GetNextFrame(SetErrorMessage<State.Text>(Validation));
                }
            }

            if (Input.Key.backspace)
            {
                return GetNextFrame(RemoveBeforeCursor);
            }

            if (Input.Key.delete)
            {
                return GetNextFrame(RemoveAtCursor);
            }

            if (Input.Key.leftArrow)
            {
                return GetNextFrame(MoveCursor(State.CursorIndex - 1));
            }

            if (Input.Key.rightArrow)
            {
                return GetNextFrame(MoveCursor(State.CursorIndex + 1));
            }

            if (Input.Key.home)
            {
                return GetNextFrame(MoveCursor(0));
            }

            if (Input.Key.end)
            {
                return GetNextFrame(MoveCursor(State.Value.length));
            }

            if (Input.Text.length > 0 && !Input.Key.ctrl && !Input.Key.meta)
            {
                return GetNextFrame(InsertIntoTextPromptState(Input.Text));
            }

            return Effect.succeed(Impl.Beep());
        },
        Render: (State: State.Text) =>
        {
            let OutText: ReactNode = undefined;

            if (State.IsActive)
            {
                if (State.Value.length === 0)
                {
                    const Placeholder: string = Options.Placeholder ?? " ";
                    OutText = (
                        <>
                            <Text inverse>{ Placeholder[0] }</Text>
                            <Text dimColor>{ Placeholder.slice(1) }</Text>
                        </>
                    );
                }
                else
                {
                    OutText = (
                        <>
                            {
                                State.CursorIndex > 0 &&
                                <Text>{ State.Value.slice(0, State.CursorIndex) }</Text>
                            }
                            {
                                State.Value.length - 1 >= State.CursorIndex
                                    ? <Text inverse>{ State.Value[State.CursorIndex] }</Text>
                                    : <Text inverse>{" "}</Text>
                            }
                            {
                                State.CursorIndex < State.Value.length - 1 && (
                                    <Text>{ State.Value.slice(State.CursorIndex + 1) }</Text>
                                )
                            }
                        </>
                    );
                }
            }
            else
            {
                OutText = <Text dimColor>{ State.Value }</Text>;
            }

            return (
                <Box
                    flexDirection="column"
                    flexWrap="nowrap"
                    width={ "100%" }>
                    <Text bold>{ Options.Message }</Text>
                    <Box flexDirection="row">{ OutText }</Box>
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
            /* eslint-disable-next-line @typescript-eslint/typedef */
            const GetNextFrame = Impl.NextFrame(State);

            if (Input.Key.return)
            {
                return Effect.succeed(Impl.Submit(State.Value));
            }

            if (
                Input.Text === "y" ||
                Input.Text === "Y" ||
                Input.Key.rightArrow
            )
            {
                return GetNextFrame({ Value: true });
            }

            if (
                Input.Text === "n" ||
                Input.Text === "N" ||
                Input.Key.leftArrow
            )
            {
                return GetNextFrame({ Value: false });
            }

            if (Input.Text === " ")
            {
                return GetNextFrame({ Value: !State.Value });
            }

            return Effect.succeed(Impl.Beep());
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

export interface SelectChoice<A>
{
    readonly Label: ReactNode;
    readonly Hint?: ReactNode;
    readonly Value: A;
}

export namespace Prose
{
    type Positionable =
        {
            readonly IsAfter?: boolean;
        };

    export type Prose = Data.TaggedEnum<{
        Header:
            Positionable &
            Options.Header &
            {
                readonly Title: ReactNode;
            };

        Exposition:
            Positionable &
            {
                readonly Status: "Normal" | "Warn" | "Error";
                readonly Content: ReactNode;
            };
    }>;

    export const Prose: Data.TaggedEnum.Constructor<Prose> = Data.taggedEnum<Prose>();
}

export interface SelectPromptOptions<A>
{
    readonly Message: ReactNode;
    readonly Choices: ReadonlyArray<SelectChoice<A>>;
    readonly InitialIndex?: number;
    readonly NumDisplay?: number;
    readonly Loop?: boolean;
}

function MoveSelectIndex(
    NumDisplay: number,
    Length: number,
    Amount: number
): (State: State.Select) => State.Select
{
    return function (State: State.Select): State.Select
    {
        const NextIndex: number = (State.Index + Amount + Length) % Length;
        const Page: number = ((): number =>
        {
            let Out: number = 0;

            while (Out * NumDisplay < NextIndex + 1)
            {
                Out++;
            }

            return Out - 1;
        })();

        return {
            ...State,
            Index: NextIndex,
            Page
        };
    };
}

export function SelectPrompt<A>(
    Options: SelectPromptOptions<A>
): Prompt<A>
{
    if (Options.Choices.length === 0)
    {
        return Succeed(undefined as A);
    }

    const InitialIndex: number = Math.max(
        0,
        Math.min(
            Options.InitialIndex ?? 0,
            Options.Choices.length - 1
        )
    );

    const NumDisplay: number = Options.NumDisplay ?? Math.min(Options.Choices.length, 8);

    return Loop<State.Select, A>({
        InitialState:
        {
            ErrorMessage: undefined,
            FailedKeys: [ ],
            Index: InitialIndex,
            IsActive: true,
            Page: Math.floor(
                NumDisplay > Options.Choices.length
                    ? InitialIndex / NumDisplay
                    : 0
            )
        },
        Process: (Input: PromptInput, State: State.Select) =>
        {
            /* eslint-disable-next-line @typescript-eslint/typedef */
            const GetNextFrame = Impl.NextFrame(State);

            if (Input.Key.return)
            {
                // @TODO Implement Validation
                return Effect.succeed(Impl.Submit(Options.Choices[State.Index]!.Value));
            }

            if (Input.Key.upArrow || Input.Text === "k")
            {
                return GetNextFrame(MoveSelectIndex(
                    NumDisplay,
                    Options.Choices.length,
                    -1
                ));
            }

            if (Input.Key.downArrow || Input.Text === "j")
            {
                return GetNextFrame(MoveSelectIndex(
                    NumDisplay,
                    Options.Choices.length,
                    1
                ));
            }

            return Effect.succeed(Impl.Beep());
        },
        Render: (State: State.Select) =>
        {
            const DisplayedChoices: ReadonlyArray<SelectChoice<A>> =
                Options.Choices.slice(NumDisplay * State.Page, NumDisplay * (State.Page + 1));

            const NumEmptyLines: number = NumDisplay - DisplayedChoices.length;

            const PaginatedIndex: number = State.Index % NumDisplay;

            // @TODO Left/right arrows to move between pages.
            // @TODO When no longer active, just show selected choice (and no caret or hint).

            return (
                <Box flexDirection="column">
                    <Text bold>{ Options.Message }</Text>
                    {
                        DisplayedChoices.map((Choice: SelectChoice<A>, Index: number) =>
                        {
                            return (
                                <Box
                                    flexDirection="row"
                                    key={ Choice.Label + Index.toString() }>
                                    <Text dimColor={ Index !== PaginatedIndex }>
                                        { Index === PaginatedIndex ? "› " : "  " }
                                        { Choice.Label }
                                    </Text>
                                    {
                                        Choice?.Hint && Index === PaginatedIndex &&
                                        <Text dimColor>{" "}({ Choice.Hint })</Text>
                                    }
                                </Box>
                            );
                        })
                    }
                    {
                        NumEmptyLines > 0 &&
                        Array.range(1, NumEmptyLines).map(() => <Text>{" "}</Text>)
                    }
                    {
                        Options.Choices.length > NumDisplay &&
                        <>
                            <Text>{" "}</Text>
                            <Text dimColor>
                                Page { State.Page + 1 } of { Math.ceil(Options.Choices.length / NumDisplay) }
                            </Text>
                        </>
                    }
                </Box>
            );
        }
    }) as unknown as Prompt<A>;
}
