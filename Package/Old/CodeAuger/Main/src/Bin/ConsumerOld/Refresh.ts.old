/**
 * @file      Refresh.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, pipe } from "effect";
import { Command } from "@effect/cli";

function HandleRefresh()
{
    return Effect.gen(function* ()
    {

    });
}

type RefreshCommand =
    Command.Command<
        "refresh",
        never,
        never,
        { }
    >;

export const RefreshCommand: RefreshCommand = pipe(
    Command.make("refresh", { }, HandleRefresh),
    Command.withDescription(
        "Refresh your config file's imports to include manifests of any newly-added provider packages."
    )
);
