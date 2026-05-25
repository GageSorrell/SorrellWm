/**
 * @file      Consumer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "@sorrell/cli-utilities/cli";
import { GenerateCommand } from "./Generate.js";
import { InitCommand } from "./Init.js";
import { RefreshCommand } from "./Refresh.js";

export/**
       * The commands available to consumers.
       */
const ConsumerCommands: ReadonlyArray<Command.Any> =
    [
        InitCommand,
        GenerateCommand,
        RefreshCommand
    ] as const;
