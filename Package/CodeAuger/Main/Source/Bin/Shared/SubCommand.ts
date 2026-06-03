/**
 * @file      SubCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@effect/cli";
import { ConfigMaster } from "./Master.Command.js";
import type { MasterConfig } from "./Master.Command.Types.js";

export function MakeConfig<ConfigType extends Command.Command.Config>(
    In: ConfigType
): ConfigType & MasterConfig
{
    return {
        ...In,
        ...ConfigMaster
    };
}
