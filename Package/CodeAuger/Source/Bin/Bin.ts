#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@sorrell/cli-utilities/command";
import { ConsumerCommands } from "./Consumer/Consumer.js";
import { ProvidersCommand } from "./Provider/ProvidersCommand.js";
import { Version } from "./Version.js";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
Command.RunCli("code-auger", Version, [ ...ConsumerCommands, ProvidersCommand ] as any);

