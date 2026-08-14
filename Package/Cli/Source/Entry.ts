/**
 *
 *
 * @module @sorrell/cli/Entry
 *
 * @file      Entry.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { NodeServices } from "@effect/platform-node";
import { Effect, pipe, Struct } from "effect";
import { Command } from "effect/unstable/cli";
import PackageJson from "../package.json" with { type: "json" };
import { RootCommand } from "./Root.ts";
import { CleanCommand } from "./Clean.ts";

const MainCommand = pipe(
    RootCommand,
    Command.withSubcommands([ CleanCommand ]),
    Command.withDescription(PackageJson.description)
);

export const Program =
    pipe(
        Command.run(MainCommand, Struct.pick(PackageJson, [ "version" ])),
        Effect.provide(NodeServices.layer)
    );
