/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { Effect, pipe } from "effect";
import { Command } from "@effect/cli";
import { MakeSync } from "@sorrell/utilities/effect";

export const makeWith = <ArgumentVectorType extends ReadonlyArray<unknown>, ReturnType>(
    In: (...ArgumentVector: ArgumentVectorType) => ReturnType
) =>
    (...ArgumentVector: Parameters<typeof In>) =>
    {
        return <Name extends string, R, E, A>(
            Self: Command.Command<Name, R, E, A>
        ): Command.Command<Name, R, E, A> =>
            pipe(
                Self,
                Command.transformHandler((HandlerEffect: Effect.Effect<void, E, R>) =>
                    pipe(
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        MakeSync(In, ...(ArgumentVector as any)),
                        Effect.zipRight(HandlerEffect)
                    )
                )
            );
    };
