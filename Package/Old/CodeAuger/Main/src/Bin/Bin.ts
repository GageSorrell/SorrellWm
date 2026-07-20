#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, pipe } from "effect";
// import { CodeAuger, CodeAuger as name } from "./Shared/Utility.js";
import { Command } from "@sorrell/effect/unstable/cli";
import { ConsumerCommands } from "./Consumer/index.js";
import { NodeRuntime } from "@effect/platform-node";
import { NodeServices } from "@effect/platform-node";
import PackageJson from "../../package.json" with { type: "json" };
import { ProvidersCommand } from "./Provider/Providers.Command.js";
import { RootCommand } from "./Shared/Master.Command.js";

/* eslint-disable @typescript-eslint/typedef */
const ApplicationCommand = pipe(
    RootCommand,
    Command.withSubcommands([ ...ConsumerCommands, ProvidersCommand ])
);

// const Cli: Sorrell.Cli.Command.Cli<TaskError> =
const Cli =
    Command.run(
        ApplicationCommand,
        {
            version: PackageJson.version
        }
    );

pipe(
    Cli,
    Effect.provide(NodeServices.layer),
    NodeRuntime.runMain
);
