/**
 * @file      ProvidersCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { RunCli, type MainCommand } from "@sorrell/cli-utilities/command";
import { ValidateCommand } from "./Validate.js";

export const ProvidersCommand: MainCommand = RunCli("provider", [ ValidateCommand ]);
