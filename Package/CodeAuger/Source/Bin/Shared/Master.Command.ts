/**
 * @file      Master.Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Cli from "@sorrell/cli-utilities/cli";
import { type Command, Options } from "@effect/cli";
import { Code } from "@sorrell/cli-utilities/format";
import { pipe } from "effect";
import type { MasterConfig } from "./Master.Command.Types.js";

/* eslint-disable @typescript-eslint/typedef */

export/**
       * The config that is passed on to all subcommands.
       */
const ConfigMaster =
    {
        Silent: pipe(
            Options.boolean("silent", { aliases: [ "s" ] }),
            Options.withDefault(false),
            Options.withDescription(`Suppress output to ${ Code("stdout") } and ${ Code("stderr") }.`)
        )
    } satisfies Command.Command.Config;

export/**
       * The root command that wraps all commands in this application.
       */
const RootCommand: Cli.Command.Main<"code-auger", MasterConfig> =
    Cli.Command.GetMain("code-auger", ConfigMaster);

/* eslint-enable @typescript-eslint/typedef */
