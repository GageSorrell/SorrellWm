/**
 * @file      Init.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, pipe } from "effect";
import { Command } from "@effect/cli";

function HandleInit()
{
    return Effect.gen(function* ()
    {

    });
}

type InitCommand =
    Command.Command<
        "init",
        never,
        never,
        { }
    >;

export const InitCommand: InitCommand = pipe(
    Command.make("init", { }, HandleInit),
    Command.withDescription(
        "Create a basic config file, with the scaffolding for all currently-installed provider packages."
    )
);
