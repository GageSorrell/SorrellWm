/**
 * @file      Master.Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ConfigMaster } from "./Master.Command.js";

/**
 * The type of the {@link ConfigMaster} that is passed on
 * to all subcommands.
 */
export type MasterConfig = typeof ConfigMaster;
