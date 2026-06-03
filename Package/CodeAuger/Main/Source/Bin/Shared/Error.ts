/**
 * @file      Error.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Console, Data, Effect, pipe } from "effect";

export class TaskError extends Data.TaggedError("TaskError")<{ readonly Message: string; }> { }

export function CatchTaskErrors<A, E, R>(
    Self: Effect.Effect<A, E | TaskError, R>
)
{
    type ThisErrorValue = NoInfer<
        | TaskError
        | Extract<E, { _tag: "TaskError"; }>
    >;

    function LogError(In: ThisErrorValue)
    {
        if ("Message" in In)
        {
            return Console.error(In.Message);
        }
        else
        {
            return Effect.dieMessage("Could not parse error.");
        }
    }

    return pipe(
        Self,
        Effect.tapErrorTag("TaskError", LogError)
    );
};
