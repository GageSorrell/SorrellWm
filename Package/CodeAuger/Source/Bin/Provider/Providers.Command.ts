/**
 * @file      Providers.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Sorrell from "@sorrell/cli-utilities/cli";
import { type Option, pipe } from "effect";
import { Command } from "@effect/cli";
import { ValidateCommand } from "./Validate.js";

type ProvidersCommand =
    Command.Command<
        "provider",
        never,
        never,
        Readonly<{ subcommand: Option.Option<{ }>; }>
    >;

export/**
       * The commands available to provider packages.
       */
const ProvidersCommand: ProvidersCommand =
    pipe(
        Sorrell.Command.GetMain("provider", { }),
        Command.withSubcommands([ ValidateCommand ])
    );
