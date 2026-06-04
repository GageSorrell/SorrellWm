/**
 * @file      SubCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { Command } from "@sorrell/effect/unstable/cli";
import type { MasterConfig } from "./Master.Command.Types.js";
export declare function MakeConfig<ConfigType extends Command.Command.Config>(In: ConfigType): ConfigType & MasterConfig;
//# sourceMappingURL=SubCommand.d.ts.map