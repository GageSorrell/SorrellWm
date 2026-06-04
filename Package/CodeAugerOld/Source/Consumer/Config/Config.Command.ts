/**
 * @file      Config.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, Command, Options } from "@sorrell/effect/unstable/cli";
import type { FConfigCommand, FConfigCommandConfig } from "./Config.Command.Internal.Types.js";
import Chalk from "chalk";
import { Code } from "@sorrell/cli-utilities/format";
import { HandleConfigCommand } from "./Config.Command.Internal.js";
import { pipe } from "effect";

export/** The default file name of the (consumer) config file. */
const DefaultConfigFileName: string = "code-auger.config.ts";

const ConfigCommandConfig: FConfigCommandConfig =
    {
        Out: pipe(
            Args.file({ exists: "no", name: "out" }),
            Args.withDefault(DefaultConfigFileName),
            Args.withDescription("The path to where the config file will be written.")
        ),
        PackageJson: pipe(
            Options.boolean("package-json", { aliases: [ "p" ] }),
            Options.withDefault(false),
            Options.withDescription(
                `Whether to add/update a custom ${ Code("\"code-auger\"") } field in your ` +
                `package's ${ Code("project.json") }.  If not specified, then this is done iff the ` +
                `${ Code("\"out\"") } file path is ${ Chalk.italic("not") } the default value.`
            )
        )
    };

/* eslint-disable @typescript-eslint/no-empty-object-type */
// const ConfigCommand: Command.Command<"init-config", FConfigCommandConfig, never, FConfigCommandConfig> =

export/** Write a default config file to the root of the package. */
const ConfigCommand: FConfigCommand =
    Command.make("init-config", ConfigCommandConfig, HandleConfigCommand);

/* eslint-enable @typescript-eslint/no-empty-object-type */
