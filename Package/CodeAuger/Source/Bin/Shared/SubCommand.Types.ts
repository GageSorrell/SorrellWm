/**
 * @file      SubCommand.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@effect/cli";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { MasterConfig } from "./Master.Command.Types.js";

export type SubCommandHandlerArgument<ConfigType extends Command.Command.Config> =
    Handler.Argument<MasterConfig> & Handler.Argument<ConfigType>;

export type SubCommand<NameType extends string, ConfigType extends Command.Command.Config, R, E> =
    Command.Command<
        NameType,
        | Command.Command.Context<"code-auger">
        | R,
        E,
        Handler.Argument<ConfigType>
    >;
