/**
 * @file      SubCommand.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CliApp } from "@effect/cli/CliApp";
import type { Command } from "@effect/cli";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { MasterConfig } from "./Master.Command.Types.js";
import type { TaskError } from "./Error.js";

export type Subcommand<
    NameType extends string,
    ConfigType extends Command.Command.Config,
    R = never
> =
    Command.Command<
        NameType,
        | Command.Command.Context<"code-auger">
        | CliApp.Environment
        | R,
        TaskError,
        Handler.Argument<MasterConfig & ConfigType>
    >;
