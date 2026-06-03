#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, pipe } from "effect";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Code } from "@sorrell/cli-utilities/format";
import { Command } from "@effect/cli";
import { CreateCommand } from "./Create/Create.Command.js";
import { ListCommand } from "./List/index.js";
import { Version } from "./Version.js";

/* eslint-disable-next-line @typescript-eslint/typedef */
const RootCommand = pipe(
    CreateCommand,
    Command.withDescription(`Set up your package to use ${ Code("code-auger") }.`),
    Command.withSubcommands([ ListCommand ])
);

/* eslint-disable-next-line @typescript-eslint/typedef */
const Cli =
    Command.run(
        RootCommand,
        {
            name: "create-code-auger",
            version: Version
        }
    );

pipe(
    Cli(process.argv),
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Effect.provide(NodeContext.layer) as any,
    NodeRuntime.runMain
);
