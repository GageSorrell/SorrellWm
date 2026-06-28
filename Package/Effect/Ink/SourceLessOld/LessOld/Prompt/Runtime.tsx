/**
 * Low-level tooling for building prompts.  This can be used by dependents
 * to build custom prompts.
 *
 * @module @sorrell/effect-ink/Prompt/Runtime
 */

/**
 * @file      Prompt.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Impl from "./Impl.ts";
import * as Ink from "../Ink/index.ts";
import * as Prose from "./Prose.tsx";
import {
    Box,
    render as InkRender,
    type Instance,
    type RenderOptions,
    Text
} from "ink";
import {
    Array,
    Effect,
    type PlatformError,
    Predicate,
    type Record,
    type Terminal,
    flow
} from "effect";
import { PromptCanceled, PromptFailed, type PromptRunError } from "../Error.ts";
import type { Covariant } from "effect/Types";
import type { Input } from "../Input.ts";
import type { ReactNode } from "react";
import { dual } from "effect/Function";
import type { Validator } from "./index.ts";

export * from "../Task/PromptAdapter.ts";

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

export type Result<SelfType> =
    SelfType extends Impl.PromptImpl<infer A>
        ? A
        : never;

export function Loop<StateType, A>(
    Definition: Impl.LoopDecl<StateType, A>
): Prompt<A>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Object.create(Impl.Prototype);
    Out._tag = "Loop";

    Out.InitialState = Definition.InitialState;

    Out.Process = (Input: Input, State: unknown) =>
    {
        return Definition.Process(
            Input,
            State as StateType
        ) as Effect.Effect<Impl.Action.Action<unknown, A>>;
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
    const Out: any = Object.create(Impl.Prototype);
    Out._tag = "Succeed";
    Out.Value = Value;

    return Out;
}

export const WithHeader: {
    <A>(Title: (Props: Prose.Props) => ReactNode, Options: Prose.HeaderOptions, Self: Prompt<A>): Prompt<A>;

    <A>(Title: string, Options: Prose.HeaderOptions): (Self: Prompt<A>) => Prompt<A>;
} = dual(3, <A,>(Title: string, Options: Prose.HeaderOptions, Self: Prompt<A>): Prompt<A> =>
{
    return FlatMap(Prose.Header(Title, Options), (_: void) => Self);
});

export function FlatMap<A, A2>(
    Self: Prompt<A>,
    OnSuccess: (Value: A) => Prompt<A2>
): Prompt<A2>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Object.create(Impl.Prototype);
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
                        if (Value === Prose.TypeId)
                        {
                            return Values;
                        }
                        else
                        {
                            return [
                                ...Values,
                                Value
                            ];
                        }
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

export interface RunOptions
{
    readonly InkOptions?: RenderOptions;
    readonly OnBeep?: () => void;
}

type RunLoopFunction = <A>(Loop: Impl.LoopPrompt<A>) => Promise<A>;

export async function InterpretPromptProgram<A>(
    Prompt: Impl.PromptImpl<A>,
    RunLoop: RunLoopFunction
): Promise<A | Prose.TypeId>
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

        case "Prose":
        {
            return Prose.TypeId;
        }

        case "Loop":
        {
            return await RunLoop(Prompt);
        }
    }
}

export type PromptEffect<A> =
    Effect.Effect<
        A,
        | Terminal.QuitError
        | PromptRunError
        | PlatformError.PlatformError,
        Terminal.Terminal
    >;

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
            <Ink.App.PromptApp { ...{ ...Options, Cancel, Fail, Prompt, Submit } } />,
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

export const Run = <A,>(Prompt: Prompt<A>, Options: RunOptions = { }): PromptEffect<A> =>
{
    return RunPromptAsPromise(Prompt as unknown as Impl.PromptImpl<A>, Options);
};

function InsertIntoTextPromptState(
    Text: string
): (State: State) => State
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
        Process: (Input: Input, State: State.Text) =>
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
        Process: (Input: Input, State: ConfirmPromptState) =>
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

// export namespace Prose
// {
//     type Positionable =
//         {
//             readonly IsAfter?: boolean;
//         };

//     export type Prose = Data.TaggedEnum<{
//         Header:
//             Positionable &
//             Options.Header &
//             {
//                 readonly Title: ReactNode;
//             };

//         Exposition:
//             Positionable &
//             {
//                 readonly Status: "Normal" | "Warn" | "Error";
//                 readonly Content: ReactNode;
//             };
//     }>;

//     export const Prose: Data.TaggedEnum.Constructor<Prose> = Data.taggedEnum<Prose>();
// }

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
        Process: (Input: Input, State: State.Select) =>
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
