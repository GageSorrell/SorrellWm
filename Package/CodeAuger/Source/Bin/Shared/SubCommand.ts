/**
 * @file      SubCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@effect/cli";
import { Effect } from "effect";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { MasterConfig } from "./Master.Command.Types.js";
import { RootCommand } from "./Master.Command.js";
import type { SubCommandHandlerArgument } from "./SubCommand.Types.js";

export function HandleSubCommand<const ConfigType extends Command.Command.Config, E, R>(
    SubCommandHandler:
    (Config: SubCommandHandlerArgument<ConfigType>) => Effect.Effect<void, E, R>
)
{
    return function (Config: Extract<Handler.Argument<ConfigType>, object>)
    {
        return Effect.flatMap(RootCommand, (RootOptions: Handler.Argument<MasterConfig>) =>
        {
            return SubCommandHandler({ ...Config, ...RootOptions });
        });
    };
}
