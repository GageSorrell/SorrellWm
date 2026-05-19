/**
 * @file      Config.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, Command } from "@effect/cli";
import type { FConfigCommand, FConfigCommandConfig } from "./Config.Command.Internal.Types.js";
import { HandleConfigCommand } from "./Config.Command.Internal.js";
import { pipe } from "effect";

const ConfigCommandConfig: FConfigCommandConfig =
    {
        Out: pipe(
            Args.file({ exists: "no", name: "out" }),
            Args.withDefault("code-auger.config.ts"),
            Args.withDescription("The path to where the config file will be written.")
        )
    };

/* eslint-disable @typescript-eslint/no-empty-object-type */
// const ConfigCommand: Command.Command<"init-config", FConfigCommandConfig, never, FConfigCommandConfig> =

export/** Write a default config file to the root of the package. */
const ConfigCommand: FConfigCommand =
    Command.make("init-config", ConfigCommandConfig, HandleConfigCommand);

/* eslint-enable @typescript-eslint/no-empty-object-type */
