/**
 * @file      Generate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command, Options } from "@effect/cli";
import { Effect, pipe } from "effect";
import type { GenerateCommandEffect, GenerateCommandType } from "./Generate.Command.Types.js";
import type { Handler } from "@sorrell/cli-utilities/cli";

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const GenerateConfig =
    {
        Watch: pipe(
            Options.boolean("watch", { aliases: [ "w" ] }),
            Options.withDefault(false),
            Options.withDescription(
                "Watch the codebase, and regenerate modules when a file in the codebase is saved."
            )
        )
    };

function HandleGenerate(
    Options: Handler.Argument<typeof GenerateConfig>
): GenerateCommandEffect
{
    return Effect.gen(function* ()
    {
        if (Options.Watch)
        {

        }
    });
}

export const GenerateCommand: GenerateCommandType = Command.make("generate", GenerateConfig, HandleGenerate);