/**
 * @file      Clack.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

import * as SorrellEffect from "@sorrell/utilities/effect";
import { Cause, Chunk, Context, Effect, Exit } from "effect";
import {
    intro as ClackIntro,
    outro as ClackOutro,
    progress as ClackProgress,
    type CommonOptions,
    type ProgressOptions,
    type ProgressResult
} from "@clack/prompts";
import { Clamp, NormalizeMax, NormalizeStep, UnknownToMessage } from "./Clack.Internal.js";

/**
 * @module Clack
 * This module allows {@link Effect.Effect | effects} to convey their progress
 * in the terminal with {@link https://www.npmjs.com/package/@clack/prompts | \@clack/prompts}.
 */

/** The {@link Context!Tag | tag} for the {@link Clack:module | Clack module}. */
export class Clack extends Context.Tag("Clack")<Clack, Clack.Clack>() { }

/** The functions provided by the {@link Clack:module | Clack module}. */
export namespace Clack
{
    /**
     * The interface of the {@link Clack:class} service.
     *
     * @property {(Title: string, Options?: CommonOptions) => Effect.Effect<void>} Intro - The function
     * that wraps {@link ClackIntro | intro}.  This should always be called before starting any tasks.
     *
     * @property {(Message?: string, Options?: CommonOptions) => Effect.Effect<void>} Outro - The function
     * that wraps {@link ClackOutro | outro}.  This should always be called after all desired tasks have
     * completed successfully.
     */
    export interface Clack
    {
        readonly Intro: (Title: string, Options?: CommonOptions) => Effect.Effect<void>;
        readonly Outro: (Message?: string, Options?: CommonOptions) => Effect.Effect<void>;
    }

    export/** The static instance of {@link Clack:namespace}. */
    const _Clack: Clack =
        {
            Intro: SorrellEffect.MakeSyncCallback(ClackIntro),
            Outro(Message?: string, Options?: CommonOptions): Effect.Effect<void>
            {
                return Effect.sync(() =>
                {
                    ClackOutro(Message, Options);
                });
            }
        };
}

/** The {@link Context!Tag | tag} for the {@link Progress:namespace | Progress service}. */
export class Progress extends Context.Tag("Clack/Progress")<
    Progress,
    Progress.Progress
>() { }

export namespace Progress
{
    /**
     * The service used to communicate the progress of an {@link Effect.Effect | effect}.
     *
     * @property {(Message: string) => Effect.Effect<void, never, never>} SetStatus - Update
     * the status of a given task.
     * @property {(Step?: number, Message?: string) => Effect.Effect<void>} Advance - Set the current
     * step of a given task.
     * @property {(Completed: number, Message?: string) => Effect.Effect<void>} SetCompleted - Set the
     * number of steps of the given task as completed.
     * @property {(Message?: string) => Effect.Effect<void>} Complete - Set the given task as completed.
     * @property {(Message?: string) => Effect.Effect<void>} Fail - Communicate that the given
     * task has failed.
     * @property {(Message?: string) => Effect.Effect<void>} Cancel - Communicate that the given task has
     * been canceled.
     */
    export interface Progress
    {
        readonly SetStatus: (Message: string) => Effect.Effect<void>;
        readonly Advance: (Step?: number, Message?: string) => Effect.Effect<void>;
        readonly SetCompleted: (Completed: number, Message?: string) => Effect.Effect<void>;
        readonly Complete: (Message?: string) => Effect.Effect<void>;
        readonly Fail: (Message?: string) => Effect.Effect<void>;
        readonly Cancel: (Message?: string) => Effect.Effect<void>;
    }
}

/**
 * The options for how a task's progress should be displayed via {@link Clack:module}.
 *
 * @template A - The `A` type of the given {@link Program}.
 * @template E - The error type of the given {@link Program}.
 */
export interface DisplayedTaskOptions<A, E>
{
    readonly Title: string;
    readonly Max?: number;
    readonly StartMessage?: string;
    readonly SuccessMessage?:
        | string
        | ((Value: A) => string);
    readonly FailureMessage?:
        | string
        | ((FailureCause: Cause.Cause<E>) => string);
    readonly ProgressOptions?: ProgressOptions;
}

/**
 * Options for how a given task should interact with {@link Clack:module}.
 *
 * @template E - The error type of the {@link Effect.Effect | effect} to run.
 */
export interface RunOptions<E>
{
    readonly Intro?:
        | string
        | false
        | Readonly<Partial<{
            Title: string;
            Options: CommonOptions;
        }>>;

    readonly SuccessOutro?:
        | string
        | false;

    readonly FailureOutro?:
        | string
        | ((FailureCause: Cause.Cause<E>) => string);

    readonly CommonOptions?: CommonOptions;
}

/**
 * Provide a given {@link Self | effect} with the {@link Progress | Progress service}.
 *
 * @param Options - The options for how the given {@link Self | effect} should
 * interact with {@link Clack:module}.
 *
 * @param Self - The {@link Effect.Effect | effect} to track with {@link Clack:module}.
 *
 * @returns {Effect.Effect<A, E, R>} The effect that wraps the {@link Self | given effect}
 * and provides the {@link Progress | Progress service}.
 */
export function WithDisplayedTask<A, E, R>(
    Options: DisplayedTaskOptions<A, E>,
    Self: Effect.Effect<A, E, R | Progress>
): Effect.Effect<A, E, R>
{
    return Effect.gen(function* ()
    {
        const Max: number = NormalizeMax(Options.Max ?? Options.ProgressOptions?.max);
        const ProgressItem: ProgressResult = ClackProgress({
            ...Options.ProgressOptions,
            max: Max
        });

        let CurrentCompleted: number = 0;
        let IsClosed: boolean = false;

        const MoveForward = (Step: number, Message?: string): void =>
        {
            if (IsClosed)
            {
                return;
            }

            const NormalizedStep: number = NormalizeStep(Step);
            const Remaining: number = Math.max(0, Max - CurrentCompleted);
            const ActualStep: number = Math.min(NormalizedStep, Remaining);

            if (ActualStep > 0)
            {
                CurrentCompleted += ActualStep;
                ProgressItem.advance(ActualStep, Message);
                return;
            }

            if (Message !== undefined)
            {
                ProgressItem.message(Message);
            }
        };

        const MoveTo = (Completed: number, Message?: string): void =>
        {
            if (IsClosed)
            {
                return;
            }

            const NormalizedCompleted: number = Clamp(Completed, 0, Max);
            const Step: number = NormalizedCompleted - CurrentCompleted;

            if (Step > 0)
            {
                MoveForward(Step, Message);
                return;
            }

            if (Message !== undefined)
            {
                ProgressItem.message(Message);
            }
        };

        const CloseWithSuccess = (Message?: string): void =>
        {
            if (IsClosed)
            {
                return;
            }

            MoveTo(Max, Message);
            IsClosed = true;
            ProgressItem.stop(Message);
        };

        const CloseWithFailure = (Message?: string): void =>
        {
            if (IsClosed)
            {
                return;
            }

            IsClosed = true;
            ProgressItem.error(Message);
        };

        const CloseWithCancel = (Message?: string): void =>
        {
            if (IsClosed)
            {
                return;
            }

            IsClosed = true;
            ProgressItem.cancel(Message);
        };

        const Service: Progress.Progress =
            {
                Advance: (Step: number = 1, Message?: string) =>
                    Effect.sync(() =>
                    {
                        MoveForward(Step, Message);
                    }),
                Cancel: SorrellEffect.MakeSyncCallback(CloseWithCancel),
                Complete: SorrellEffect.MakeSyncCallback(CloseWithSuccess),
                Fail: SorrellEffect.MakeSyncCallback(CloseWithFailure),
                SetCompleted: SorrellEffect.MakeSyncCallback(MoveTo),
                SetStatus: (Message: string) =>
                    Effect.sync(() =>
                    {
                        if (!IsClosed)
                        {
                            ProgressItem.message(Message);
                        }
                    })
            };

        ProgressItem.start(Options.StartMessage ?? Options.Title);

        const ProgramExit: Exit.Exit<A, E> = yield* Effect.exit(
            Effect.provideService(Self, Progress, Service)
        );

        if (Exit.isSuccess(ProgramExit))
        {
            const SuccessMessage: string =
                typeof Options.SuccessMessage === "function"
                    ? Options.SuccessMessage(ProgramExit.value)
                    : Options.SuccessMessage ?? Options.Title;

            CloseWithSuccess(SuccessMessage);

            return ProgramExit.value;
        }

        const FailureMessage: string =
            typeof Options.FailureMessage === "function"
                ? Options.FailureMessage(ProgramExit.cause)
                : Options.FailureMessage ?? CauseToMessage(ProgramExit.cause);

        CloseWithFailure(FailureMessage);

        return yield* Effect.failCause(ProgramExit.cause);
    });
}

/**
 * Run a given {@link Program} as an `async` function, which wraps {@link Effect.runPromiseExit}.
 *
 * @param Program - The {@link Effect.Effect | effect} that is at the boundary of your
 * application (or at the boundary of the part of your application that uses {@link Clack:module}).
 *
 * @param Options - If specified, the options for running the given {@link Program} with {@link Clack:module}.
 *
 * @returns {Promise<Exit.Exit<A, E>>} A {@link Promise} that resolves with the {@link Exit.Exit} type
 * that corresponds to the given {@link Program}.
 */
export async function RunEffectExit<A, E>(
    Program: Effect.Effect<A, E, Clack>,
    Options: RunOptions<E> = { }
): Promise<Exit.Exit<A, E>>
{
    const ProgramWithIntro: Effect.Effect<A, E, Clack> = Effect.gen(function* ()
    {
        if (Options.Intro !== false && Options.Intro !== undefined)
        {
            if (typeof Options.Intro === "string")
            {
                ClackIntro(Options.Intro);
            }
            else
            {
                ClackIntro(Options.Intro.Title, Options.Intro.Options);
            }
        }

        return yield* Program;
    });

    const ProgramExit: Exit.Exit<A, E> = await Effect.runPromiseExit(
        Effect.provideService(ProgramWithIntro, Clack, Clack._Clack)
    );

    if (Exit.isSuccess(ProgramExit))
    {
        if (Options.SuccessOutro !== false)
        {
            ClackOutro(Options.SuccessOutro ?? "Done.", Options.CommonOptions);
        }

        return ProgramExit;
    }

    const FailureMessage: string =
        typeof Options.FailureOutro === "function"
            ? Options.FailureOutro(ProgramExit.cause)
            : Options.FailureOutro ?? CauseToMessage(ProgramExit.cause);

    ClackOutro(FailureMessage, Options.CommonOptions);

    return ProgramExit;
};

/**
 * Run a given {@link Program} as an `async` function, which throws, but does
 * not control the application lifetime like {@link RunMain} does.
 *
 * @param Program - The {@link Effect.Effect | effect} that is at the boundary of your
 * application (or at the boundary of the part of your application that uses {@link Clack:module}).
 *
 * @param Options - If specified, the options for running the given {@link Program} with {@link Clack:module}.
 *
 * @returns {Promise<A>} A {@link Promise} that resolves with the result of the given {@link Program}.
 */
export async function RunEffect<A, E>(
    Program: Effect.Effect<A, E, Clack>,
    Options: RunOptions<E> = { }
): Promise<A>
{
    const ProgramExit: Exit.Exit<A, E> = await RunEffectExit(Program, Options);

    if (Exit.isSuccess(ProgramExit))
    {
        return ProgramExit.value;
    }

    throw new Error(CauseToMessage(ProgramExit.cause));
};

/**
 * Run a {@link Program} that must have {@link Clack:class} provided to it.
 *
 * @template A - The `A` type of the given {@link Program}.
 * @template E - The error type of the given {@link Program}.
 *
 * @param Program - The {@link Effect.Effect | effect} at the boundary of your program.
 * @param Options - If specified, the run options.
 *
 * @returns {Promise<void>} The {@link Promise} that resolves when the given {@link Program}
 * has exited.
 */
export async function RunMain<A, E>(
    Program: Effect.Effect<A, E, Clack>,
    Options: RunOptions<E> = { }
): Promise<void>
{
    const ProgramExit: Exit.Exit<A, E> = await RunEffectExit(Program, Options);

    if (Exit.isFailure(ProgramExit))
    {
        type GlobalThis = Readonly<Partial<{ process: Partial<{ exitCode: number; }>; }>>;

        const Process: GlobalThis["process"] = (globalThis as GlobalThis).process;

        if (Process !== undefined)
        {
            Process.exitCode = 1;
        }
    }
};

/**
 * Get the message associated with a given {@link FailureCause}.
 *
 * @param FailureCause - The cause of the failure, from which the printed message is taken.
 *
 * @returns {string} The message corresponding to the given {@link FailureCause}.
 */
export function CauseToMessage<E>(FailureCause: Cause.Cause<E>): string
{
    const Defects: ReadonlyArray<unknown> = Chunk.toReadonlyArray(Cause.defects(FailureCause));

    for (const Defect of Defects)
    {
        const Message: string | undefined = UnknownToMessage(Defect);

        if (Message !== undefined)
        {
            return Message;
        }
    }

    const Failures: ReadonlyArray<E> = Chunk.toReadonlyArray(Cause.failures(FailureCause));

    for (const Failure of Failures)
    {
        const Message: string | undefined = UnknownToMessage(Failure);

        if (Message !== undefined)
        {
            return Message;
        }
    }

    const PrettyMessage: string = Cause.pretty(
        FailureCause,
        { renderErrorCause: false }
    ).trim();

    return PrettyMessage.length > 0
        ? PrettyMessage
        : "The program failed.";
};
