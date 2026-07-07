/**
 * Group {@link Prompt | Prompts} and resulting {@link Task | Tasks} together into {@link Page | Pages}, which
 * can be navigated to and from.  An automatically-generated summary page can also be appended, allowing the
 * user to review their input before proceeding.
 *
 * @module @sorrell/effect-ink/Wizard
 *
 * @file      Wizard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Internal from "./Internal/index.js";
import type * as React from "react";
import * as Prompt from "./Prompt.ts";
import { Data, Effect, Effectable, type Record, type Terminal, type Types } from "effect";
import type * as Text from "./Text.ts";

export const TypeIdKey: "~sorrell/effect-ink/Wizard" = "~sorrell/effect-ink/Wizard" as const;
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export type Environment = Prompt.Environment;

export class TaskPageCanceled extends Data.TaggedClass("TaskPageCanceled")<{ readonly Foo: string; }> { }

export type WizardError =
    | Terminal.QuitError
    | TaskPageCanceled;

export type Result = Record.ReadonlyRecord<string, unknown>;

export interface Wizard<A extends Result, E extends WizardError = never>
    extends Effect.Effect<A, E, Environment>
{
    readonly [ TypeId ]:
    {
        readonly _A: Types.Covariant<A>;
        readonly _E: Types.Covariant<E>;
    };
}

export const Run: {
    <A extends Record.ReadonlyRecord<string, unknown>,
        E extends WizardError = never>(
        Self: Wizard<A, E>
    ): Effect.Effect<A, E, Environment>;
} = Effect.fnUntraced(function* <
    A extends Record.ReadonlyRecord<string, unknown>,
    E extends WizardError = never
>(_Self: Wizard<A, E>)
{

});

// type PromptsFromResult<A extends Result> =
//     {
//         [ Key in keyof A ]: Prompt.Prompt<A>;
//     };

type PromptRecord = Record.ReadonlyRecord<string, Prompt.Any>;

type ResultFromPrompts<RecordType extends PromptRecord> =
    {
        [ Key in keyof RecordType ]: RecordType[Key] extends Prompt.Prompt<infer A>
            ? A
            : never;
    };

export namespace Page
{
    type StateBase = { readonly Title?: Text.Text; };

    /**
     * @property Idle - The page is currently viewed, possibly being edited.
     * @property Success - The page is no longer being viewed, and was filled out successfully.
     * @property Inactive - The page has been viewed, but is currently incomplete, and another
     * page is currently being viewed.
     * @property Disabled - The page has not yet been viewed (and possibly will not be viewed).
     * @property Warn - The page was filled out successfully such that the wizard may continue, but
     * the page was completed in a state that was undesirable in some sense.
     * @property Error - An error occurred from which the wizard cannot recover.
     * @property Skipped - Due to the state of completed pages (which were completed *before* this page),
     * it is no longer necessary (or possible) for the user to access this page.
     *
     * @property Validating - A validator function is being run for a given prompt within the page.
     * @property ValidationFailed - A validator function was run but failed.
     */
    export type Status = Data.TaggedEnum<{
        readonly Idle: StateBase & { };
        readonly Disabled: { };
        readonly Success: { };
        readonly Inactive: { };
        readonly Warn: { };
        readonly Error: { };
        readonly Skipped: { };
        readonly Validating: { };
        readonly ValidationFailed: { };
        readonly : { };
    }>;

    // @TODO Move this to a new internal module; this will be private state.
    export interface State
    {
        readonly Status: Status;
        readonly Hint?: React.ReactNode;
    }

    // @TODO Move this to a new internal module; this will be private state.
    export interface Page<in out RecordType extends PromptRecord>
    {
        readonly Prompts: ResultFromPrompts<RecordType>;
        readonly State: State;
    }

    export type CanChangePageArgument<RecordType extends PromptRecord> =
        {
            readonly Current: Partial<ResultFromPrompts<RecordType>>;
            readonly HasCompleted: boolean;
        };

    export type CanChangePage<RecordType extends PromptRecord> =
        Internal.Types.CallbackArgument<
            CanChangePageArgument<RecordType>,
            Internal.Types.OrEffect<boolean>
        >;

    export interface Options<in out RecordType extends PromptRecord>
    {
        readonly CanGoForward?: CanChangePage<RecordType>;
        readonly CanGoBackward?: CanChangePage<RecordType>;
    }

    export const Page: {
        <RecordType extends PromptRecord>(Prompts: RecordType): Page<typeof Prompts>;
    } = Effect.fnUntraced(function* <RecordType extends PromptRecord>(_Prompts: RecordType)
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        return undefined as any;
    });
}

