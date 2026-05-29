/**
 * @file      Consumer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@sorrell/cli-utilities/cli";
import { GenerateCommand } from "./Generate/index.js";
import { ValidateCommand } from "./Validate/index.js";

export/**
       * The commands available to consumers.
       */
const ConsumerCommands: ReadonlyArray<Command.Any> =
    [
        GenerateCommand,
        ValidateCommand
        // InitCommand,
        // GenerateCommand,
        // RefreshCommand
    ] as const;
