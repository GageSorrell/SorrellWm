/**
 * Components for the built-in prompts offered by this package.
 *
 * @module @sorrell/effect-ink/Component
 */

/**
 * @file      Component.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Arr from "effect/Array";
// import * as Effect from "effect/effect";
import * as Event from "./Internal/Event.tsx";
import * as Function from "effect/Function";
// import * as Function from "effect/Function";
import * as Ink from "ink";
import type * as Internal from "./Internal/Prompt.ts";
import * as Option from "effect/Option";
import * as Prompt from "./Prompt.js";
import { type FC, type ReactNode, type RefObject, useRef, useState } from "react";
import Chalk from "chalk";
import Spinner from "ink-spinner";
import { pipe } from "effect/Function";

// @TODO TEMPORARY
/* eslint-disable @typescript-eslint/no-unused-expressions */

/**
 * The base type for props given to the components `export`ed by this module.
 *
 * @template StateType - The type of the state given to a component in this module.
 * This is expected to change across most rerenders.
 *
 * @template OptionsType - The type of the options given to a component in this module.
 * This is expected to *not* change across rerenders.
 */
export interface Props<in out StateType, in out OptionsType>
    extends Pick<Field, "IsValidating" | "ErrorMessage">
{
    IsSubmitted: boolean;
    Options: Required<OptionsType>;
    State: StateType;
}

export type Component<StateType, OptionsType> = FC<Props<StateType, OptionsType>>;

interface Field
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    readonly Component: FC<any>;
    readonly Options: unknown;
    readonly State: Option.Option<unknown>;
    readonly ErrorMessage: Option.Option<ReactNode>;
    readonly IsValidating: boolean;
}

/** @internal */
export const RootComponent = (): ReactNode =>
{
    const [ Fields, SetFields ] =
        useState<ReadonlyArray<Field>>([ {
            Component: (_Props: unknown) => undefined,
            ErrorMessage: Option.none(),
            IsValidating: false,
            Options: { },
            State: Option.none()
        } ]);

    const [ Bridge ] = Event.UseEvents();

    Ink.useInput((Input: string, Key: Ink.Key) =>
    {
        Bridge.Publish({
            _tag: "InputEvent",

            Input: Input !== "" ? Option.some(Input) : Option.none(),
            Key
        });
    });

    const UpdateTail = (Callback: (OldTail: Field) => Field) =>
    {
        SetFields((Old: ReadonlyArray<Field>) =>
        {
            const Tail: Field = Old[Old.length - 1];
            return [ ...(Old.slice(0, Old.length - 1)), Callback({ ...Tail }) ];
        });
    };

    Event.UseEvent((InEvent: Prompt.AnyAction | Event.BeginPromptEvent): void =>
    {
        // Effect.runSync(Console.log(`_tag is: "${ InEvent._tag }".`));
        if (InEvent._tag === "BeginPromptEvent")
        {
            // Effect.runSync(Console.log(`In.Component is ${ JSON.stringify(_In.Component) }.`));
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            SetFields((Old: ReadonlyArray<Field>) => [
                ...Old,
                {
                    Component: InEvent.Component,
                    ErrorMessage: Option.none(),
                    IsValidating: false,
                    Options: InEvent.Options,
                    State: Option.none()
                }
            ]);
        }
        else
        {
            pipe(
                InEvent,
                Prompt.Action.$match({
                    ClearError: (_Value: unknown) =>
                    {
                        UpdateTail((Old: Field) =>
                        {
                            // Effect.runSync(Console.log("ClearError"));
                            return {
                                ...Old,
                                ErrorMessage: Option.none()
                            };
                        });
                    },
                    Fail: ({ Message }: { readonly Message: ReactNode; }) =>
                    {
                        UpdateTail((Old: Field) =>
                        {
                            // Effect.runSync(Console.log("Fail"));
                            return {
                                ...Old,
                                ErrorMessage: Option.some(Message),
                                IsValidating: false
                            };
                        });
                    },
                    NextFrame: ({ State }: { readonly State: unknown; }) =>
                    {
                        // Effect.runSync(Console.log("NextFrame Callback"));
                        UpdateTail((OldTail: Field) =>
                        {
                            return {
                                ...OldTail,
                                State: Option.some(State)
                            };
                        });
                    },
                    NoOp: Function.identity,
                    StartValidation: (_Value: unknown) =>
                    {
                        UpdateTail((OldTail: Field) =>
                        {
                            // Effect.runSync(Console.log("StartValidation"));
                            return {
                                ...OldTail,
                                ErrorMessage: Option.none(),
                                IsValidating: true
                            };
                        });
                    },
                    Submit: Function.identity
                    // Submit: ({ value }: { readonly value: unknown; }) =>
                    // {
                    //     UpdateTail((OldTail: Field) =>
                    //     {
                    //         return {
                    //             ...OldTail,
                    //             State: Option.some()
                    //         };
                    //     });
                    // }
                })
            );
        }
    });

    return Fields.map(({ Component, ErrorMessage, IsValidating, Options, State }: Field, Index: number) =>
    {
        return Option.isSome(State)
            ? <Field
                Component={ Component }
                Props={ {
                    ErrorMessage,
                    IsSubmitted: Index < Fields.length - 1,
                    IsValidating,
                    Options,
                    State: State.value
                } }
                key={ JSON.stringify(State) + Index.toString() }
            />
            : <Ink.Text key={ JSON.stringify(State) + Index.toString() }></Ink.Text>;
    });

};

export const Confirm = ({
    IsSubmitted,
    Options,
    State
}: Props<Internal.ConfirmState, Prompt.ConfirmOptions>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

export const Date = ({
    IsSubmitted,
    Options,
    State
}: Props<Internal.DateState, Prompt.DateOptions>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

export const File = ({
    IsSubmitted,
    Options,
    State
}: Props<Internal.FileState, Internal.FileOptionsInternal>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

export const Float = ({
    IsSubmitted,
    Options,
    State
}: Props<Internal.NumberState, Prompt.FloatOptions>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

export const Integer = ({
    IsSubmitted,
    Options,
    State
}: Props<Internal.NumberState, Prompt.IntegerOptions>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

export const Select = <A,>({
    IsSubmitted,
    Options,
    State
}: Props<Internal.SelectState, Prompt.SelectOptions<A>>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

export const MultiSelect = <A,>({
    IsSubmitted,
    Options,
    State
}: Props<Internal.MultiSelectState, Internal.MultiSelectOptionsInternal<A>>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

export const AutoComplete = <A,>({
    IsSubmitted,
    Options,
    State
}: Props<Internal.AutoCompleteState, Prompt.AutoCompleteOptions<A>>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

export const Toggle = ({
    IsSubmitted,
    Options,
    State
}: Props<Internal.ToggleState, Prompt.ToggleOptions>): ReactNode =>
{
    // @TODO TEMPORARY
    IsSubmitted;
    Options;
    State;

    return (
        undefined
    );
};

const ApplyCursor = (InLine: string, CursorIndex: number, IsSubmitted: boolean): string =>
{
    if (IsSubmitted)
    {
        return InLine;
    }

    const Line: string = CursorIndex === InLine.length
        ? InLine + " "
        : InLine;

    return (
        Line.slice(0, CursorIndex) +
        Chalk.inverse(Line[CursorIndex]) +
        Line.slice(CursorIndex + 1)
    );
};

export const Text = (Props: Props<Internal.TextState, Internal.TextOptionsInternal>): ReactNode =>
{
    if (Props.Options.type === "Text")
    {
        return <Ink.Text>{ ApplyCursor(Props.State.value, Props.State.cursor, Props.IsSubmitted) }</Ink.Text>;
    }
    else if (Props.Options.type === "Hidden")
    {
        return <Ink.Text inverse>{" "}</Ink.Text>;
    }
    else
    {
        return <Ink.Text>{
            ApplyCursor("*".repeat(Props.State.value.length), Props.State.cursor, Props.IsSubmitted)
        }</Ink.Text>;
    }
};

interface FieldProps
{
    /* eslint-disable @typescript-eslint/no-explicit-any */
    readonly Component: FC<any>;
    readonly Props: Omit<Props<any, any>, "Options"> & { readonly Options: any; };
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

interface MessageProps extends Pick<Props<never, never>, "IsSubmitted">
{
    readonly Message: ReactNode;
}

const Message = ({ IsSubmitted, Message }: MessageProps): ReactNode =>
{
    return <Ink.Text dimColor={ IsSubmitted }>{ Message }</Ink.Text>;
};

const PrimaryColor: string = "cyan";

const Field = ({ Component, Props }: FieldProps): ReactNode =>
{
    const BarBoxRef: RefObject<Ink.DOMElement | null> = useRef<Ink.DOMElement>(null);

    const { height } = Ink.useBoxMetrics(BarBoxRef);

    return (
        <Ink.Box
            flexDirection="row"
            gap={ 1 }>
            <Ink.Box
                flexDirection="column"
                height="100%"
                marginRight={ 1 }
                width={ 1 }>
                {
                    Arr.range(0, height - 1).map((Value: number) =>
                    {
                        const Character: ReactNode = Value === 0
                            ? Props.IsValidating
                                ? <Spinner type="circle"/>
                                : Props.IsSubmitted
                                    ? "◇"
                                    : "◆"
                            : Value !== height - 1
                                ? "│"
                                : Props.IsSubmitted ? "│" : "└";

                        return <Ink.Text
                            { ...(!Props.IsSubmitted ? { color: PrimaryColor } : { }) }
                            key={ Value.toString() + Character }>
                            { Character }
                        </Ink.Text>;
                    })
                }
            </Ink.Box>
            <Ink.Box
                flexDirection="column"
                gap={ 1 }
                paddingBottom={ 1 }
                ref={ BarBoxRef }>
                <Message
                    IsSubmitted={ Props.IsSubmitted }
                    Message={ Props.Options.Message }
                />
                <Component { ...Props } />
            </Ink.Box>
        </Ink.Box>
    );
};
