/**
 * @file      ProvidersCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@sorrell/cli-utilities/command";
import { ValidateCommand } from "./Validate.js";

export const ProvidersCommand: Command.Main = Command.GetMain("provider", [ ValidateCommand ]);
