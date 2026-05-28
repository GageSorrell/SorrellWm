#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@sorrell/cli-utilities/cli";
import { ConsumerCommands } from "./Consumer/index.js";
import { ProvidersCommand } from "./Provider/Providers.Command.js";
import { RootCommand } from "./Shared/Master.Command.js";
import { Version } from "./Version.js";

Command.RunCli(
    "code-auger",
    Version,
    RootCommand,
    [ ...ConsumerCommands, ProvidersCommand ]
);
