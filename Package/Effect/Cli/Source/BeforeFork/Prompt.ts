/**
 * This module extends the original
 * {@link https://effect-ts.github.io/effect/cli/Prompt.ts.html | \@effect/cli/Prompt} module.
 *
 * @module @sorrell/effect-cli/Prompt
 */

/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

// @TODO TEMPORARY
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable jsdoc/require-jsdoc */

import * as Clack from "@clack/prompts";
import * as Sorrell from "@sorrell/utilities/effect";
import * as Terminal from "@effect/platform/Terminal";
import { Data, Effect, pipe } from "effect";
import { Command } from "@effect/cli";
import { makeWith } from "./Internal/Prompt.js";

export * from "@effect/cli/Prompt";

export type IntroOptions = NonNullable<Parameters<typeof Clack.intro>[1]>;

export const intro: (title?: string, options?: IntroOptions) => Effect.Effect<void> =
    Sorrell.MakeSyncCallback(Clack.intro);

export const withIntro = makeWith(intro);

export type OutroOptions = NonNullable<Parameters<typeof Clack.outro>[1]>;

export const outro = Sorrell.MakeSyncCallback(Clack.outro);

export const withOutro = makeWith(outro);

export type CancelOptions = NonNullable<Parameters<typeof Clack.cancel>[1]>;

export const cancel = Sorrell.MakeSyncCallback(Clack.cancel);

export const withCancel = (
    message?: string,
    options?: CancelOptions
) =>
    <Name extends string, R, E, A>(
        Self: Command.Command<Name, R, E, A>
    ): Command.Command<Name, R, E, A> =>
        Self.pipe(
            Command.transformHandler((HandlerEffect: Effect.Effect<void, E, R>) =>
                pipe(
                    HandlerEffect,
                    Effect.catchIf(
                        Terminal.isQuitException,
                        (Error: NoInfer<E>) =>
                            pipe(
                                cancel(message, options),
                                Effect.zipRight(Effect.fail(Error))
                            )
                    ),
                    Effect.onInterrupt(() => cancel(message, options))
                )
            )
        );

/* eslint-disable @typescript-eslint/no-empty-object-type */

export class ClackCancelledError extends Data.TaggedError("ClackCancelledError")<{ }> { }

/* eslint-enable @typescript-eslint/no-empty-object-type */

export const fromClack = <Type>(
    getValue: () => Promise<Type | symbol>,
    message: string = "Operation cancelled"
): Effect.Effect<Type, ClackCancelledError> =>
    pipe(
        Effect.promise(getValue),
        Effect.flatMap((Value: Type | symbol) =>
        {
            if (Clack.isCancel(Value))
            {
                return pipe(
                    cancel(message),
                    Effect.zipRight(Effect.fail(new ClackCancelledError()))
                );
            }

            return Effect.succeed(Value);
        })
    );

export type NoteOptions = Parameters<typeof Clack.note>[2];

export const note = Sorrell.MakeSyncCallback(Clack.note);

export const withNote = makeWith(note);

export type ClackBoxOptions = Parameters<typeof Clack.box>[2];

export const box = (
    message = "",
    title = "",
    options?: ClackBoxOptions
): Effect.Effect<void> =>
{
    return Sorrell.MakeSync(Clack.box, message, title, options);
};

export const withBox = (
    message = "",
    title = "",
    options?: ClackBoxOptions
) =>
{
    return makeWith(box)(message, title, options);
};

export const withSuccessBox = (
    message = "",
    title = "",
    options?: ClackBoxOptions
) =>
{
    return <Name extends string, R, E, A>(
        Self: Command.Command<Name, R, E, A>
    ): Command.Command<Name, R, E, A> =>
        Self.pipe(
            Command.transformHandler((HandlerEffect) =>
                HandlerEffect.pipe(
                    Effect.tap(() => box(message, title, options))
                )
            )
        );
};

export type ClackLogMessage = Parameters<typeof Clack.log.message>[0];
export type ClackLogMessageOptions = Parameters<typeof Clack.log.message>[1];

export const logMessage = (
    message: ClackLogMessage = [ ],
    options?: ClackLogMessageOptions
): Effect.Effect<void> =>
    Effect.sync(() =>
    {
        Clack.log.message(message, options);
    });

export const LogInfo = (
    Message: Parameters<typeof Clack.log.info>[0],
    Options?: Parameters<typeof Clack.log.info>[1]
): Effect.Effect<void> =>
    Effect.sync(() =>
    {
        Clack.log.info(Message, Options);
    });

export const LogSuccess = (
    Message: string,
    Options?: ClackLogMessageOptions
): Effect.Effect<void> =>
    Effect.sync(() =>
    {
        Clack.log.success(Message, Options);
    });

export const LogStep = (
    Message: string,
    Options?: ClackLogMessageOptions
): Effect.Effect<void> =>
    Effect.sync(() =>
    {
        Clack.log.step(Message, Options);
    });

export const LogWarn = (
    message: string,
    options?: ClackLogMessageOptions
): Effect.Effect<void> =>
    Effect.sync(() =>
    {
        Clack.log.warn(message, options);
    });

export const LogWarning = LogWarn;

export const LogError = (
    Message: string,
    Options?: ClackLogMessageOptions
): Effect.Effect<void> =>
    Effect.sync(() =>
    {
        Clack.log.error(Message, Options);
    });

export const withLogMessage = (
    Message: ClackLogMessage = [ ],
    Options?: ClackLogMessageOptions
) =>
{
    return makeWith(logMessage)(Message, Options);
};

export const withLogInfo = makeWith(LogInfo);

export const withLogSuccess = makeWith(LogSuccess);

export const withLogWarn = makeWith(LogWarn);

export const withLogError = makeWith(LogError);

export const withSuccessLogInfo = (
    Message: string,
    Options?: ClackLogMessageOptions
) =>
    <Name extends string, R, E, A>(
        Self: Command.Command<Name, R, E, A>
    ): Command.Command<Name, R, E, A> =>
        Self.pipe(
            Command.transformHandler((HandlerEffect) =>
                HandlerEffect.pipe(
                    Effect.tap(() => LogInfo(Message, Options))
                )
            )
        );

export const withSuccessLogSuccess =
    (
        Message: Parameters<typeof LogSuccess>[0],
        Options?: Parameters<typeof LogSuccess>[1]
    ) =>
        <Name extends string, Requirements, Error, Config>(
            Self: Command.Command<Name, Requirements, Error, Config>
        ): Command.Command<Name, Requirements, Error, Config> =>
            Self.pipe(
                Command.transformHandler((HandlerEffect) =>
                    HandlerEffect.pipe(
                        Effect.tap(() => LogSuccess(Message, Options))
                    )
                )
            );

export const withSuccessLogStep =
    (
        Message: Parameters<typeof LogStep>[0],
        Options?: Parameters<typeof LogStep>[1]
    ) =>
        <Name extends string, Requirements, Error, Config>(
            Self: Command.Command<Name, Requirements, Error, Config>
        ): Command.Command<Name, Requirements, Error, Config> =>
            Self.pipe(
                Command.transformHandler((HandlerEffect) =>
                    HandlerEffect.pipe(
                        Effect.tap(() => LogStep(Message, Options))
                    )
                )
            );
