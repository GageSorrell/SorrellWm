#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import PackageJson from "../../package.json" with { type: "json" };
import type * as Sorrell from "@sorrell/cli-utilities";
import { CatchTaskErrors, type TaskError } from "./Shared/Error.js";
import { CodeAuger, CodeAuger as name } from "./Shared/Utility.js";
import { ConfigFile, HelpDoc, Span, ValidationError } from "@sorrell/effect/unstable/cli";
import { Config, Effect, pipe } from "effect";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Command } from "@sorrell/effect/unstable/cli";
import { ConsumerCommands } from "./Consumer/index.js";
import { ProvidersCommand } from "./Provider/Providers.Command.js";
import { RootCommand } from "./Shared/Master.Command.js";

/* eslint-disable @typescript-eslint/typedef */
const ApplicationCommand = pipe(
    RootCommand,
    Command.withSubcommands([ ...ConsumerCommands, ProvidersCommand ])
);

// const Cli: Sorrell.Cli.Command.Cli<TaskError> =
const Cli: Effect.Effect<void, any, any> =
    Command.run(
        ApplicationCommand,
        {
            version: PackageJson.version
        }
    );

pipe(
    Cli(process.argv),
    CatchTaskErrors,
    Effect.provide(
        ConfigFile.layer(
            `${ CodeAuger }.config`,
            {
                formats: [ "json", "yaml" ],
                searchPaths:
                [
                    ".",
                    "./config",
                    "./.config",
                    "./Configuration",
                    "./Config",
                    "./.Config"
                ]
            }
        )
    ),
    Effect.provide(
        ConfigFile.layer(
            `${ CodeAuger }.provider`,
            {
                formats: [ "json", "yaml" ],
                searchPaths:
                [
                    ".",
                    "./config",
                    "./.config",
                    "./Configuration",
                    "./Config",
                    "./.Config"
                ]
            }
        )
    ),
    Effect.provide(ConfigFile.layer(`${ CodeAuger }.provider`)),
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain
);
