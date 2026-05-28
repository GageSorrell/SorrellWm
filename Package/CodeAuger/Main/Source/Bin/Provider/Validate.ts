/**
 * @file      Validate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@effect/cli";
import { Effect } from "effect";

/* eslint-disable @typescript-eslint/no-empty-object-type */

function HandleValidate(_: { }): Effect.Effect<void, never, never>
{
    return Effect.gen(function* ()
    {
        return yield* Effect.succeed(undefined);
    });
}

/* eslint-enable @typescript-eslint/no-empty-object-type */

export const ValidateCommand: Command.Command<"validate", never, never, { }> =
    Command.make("validate", { }, HandleValidate);
