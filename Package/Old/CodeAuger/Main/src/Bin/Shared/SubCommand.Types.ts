/**
 * @file      SubCommand.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@sorrell/effect/unstable/cli";
import type { Environment } from "@sorrell/effect/unstable/cli/Prompt";
import type { PlatformError } from "effect/PlatformError";

export type Subcommand<
    NameType extends string,
    ConfigType extends Command.Command.Config
> =
    Command.Command<
        NameType,
        Command.Command.Config.Infer<ConfigType>,
                { },
        PlatformError,
        | Environment
        | Command.CommandContext<"code-auger">
    >;
