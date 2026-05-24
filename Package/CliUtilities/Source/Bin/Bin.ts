#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { RunCli } from "../Command/Command.js";
import { Version } from "./Version.js";
import { WriteVersionCommand } from "./WriteVersionCommand.js";

RunCli("@sorrell/cli-utilities", Version, [ WriteVersionCommand ]);
