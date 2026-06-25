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

import * as Event from "./Internal/Event.tsx";
import * as Ink from "ink";
import type * as Internal from "./Internal/Prompt.ts";
import * as Option from "effect/Option";
import type * as Prompt from "./Prompt.ts";
import { type FC, type ReactNode, useState } from "react";

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
{
    IsSubmitted: boolean;
    Options: Required<OptionsType>;
    State: StateType;
}

export type Component<StateType, OptionsType> = FC<Props<StateType, OptionsType>>;

/** @internal */
export const RootComponent = (): ReactNode =>
{
    // const [ Bridge ] = Event.UseEvents();
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const [ TheComponent, SetTheComponent ] = useState<FC<any>>(() => (_Props: any) => undefined);
    const [ TheOptions, SetTheOptions ] = useState<unknown>({ });
    const [ TheState, SetTheState ] = useState<Option.Option<unknown>>(Option.none());

    const [ _Inn, SetInn ] = useState<unknown>("_Inn");

    const [ Bridge ] = Event.UseEvents();

    Ink.useInput((Input: string, Key: Ink.Key) =>
    {
        Bridge.Publish({
            _tag: "InputEvent",

            Input: Input !== "" ? Option.some(Input) : Option.none(),
            Key
        });
    });

    Event.UseEvent((_In: Prompt.AnyAction | Event.BeginPromptEvent): void =>
    {
        SetInn(_In);
        if (_In._tag === "BeginPromptEvent")
        {
            // Effect.runSync(Console.log(`In.Component is ${ JSON.stringify(_In.Component) }.`));
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            SetTheComponent((_Old: FC<any>) => _In.Component);
            SetTheOptions(_In.Options);
            SetTheState((_Old) => Option.none());
        }
        else if (_In._tag === "NextFrame")
        {
            SetTheState(Option.some(_In.State));
        }
    });

    return Option.isSome(TheState)
        ? <TheComponent
            IsSubmitted={ false }
            Options={ TheOptions }
            State={ TheState.value }
        />
        : undefined;
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

export const Text = (_Props: Props<Internal.TextState, Internal.TextOptionsInternal>): ReactNode =>
{
    // @TODO TEMPORARY
    // IsSubmitted;
    // Options;
    // State;

    return <Ink.Text>{ _Props.State.value }</Ink.Text>;
};
