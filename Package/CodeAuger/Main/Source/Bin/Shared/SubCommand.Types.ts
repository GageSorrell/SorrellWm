/**
 * @file      SubCommand.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@effect/cli";
import type { Handler } from "@sorrell/cli-utilities/cli";

export type SubCommand<
    NameType extends string,
    ConfigType extends Command.Command.Config,
    R,
    E
> =
    Command.Command<
        NameType,
        | Command.Command.Context<"code-auger">
        | R,
        E,
        Handler.Argument<ConfigType>
    >;
