/**
 * @file      Consumer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Command } from "effect/unstable/cli";
import { GenerateCommand } from "./Generate/index.js";
import { InitCommand } from "./Init/index.js";
import { ListCommand } from "./List/List.Command.js";
import { SchemaCommand } from "./Schema/Schema.Command.ts";
import { ValidateCommand } from "./Validate/index.js";

/* eslint-disable @typescript-eslint/typedef */

export/**
       * The commands available to consumers.
       */
const ConsumerCommands: ReadonlyArray<Command.Command.Any> =
    [
        GenerateCommand,
        ValidateCommand,
        InitCommand,
        ListCommand,
        SchemaCommand
        // RefreshCommand
    ] as const;
