#!/usr/bin/env node

/**
 * @file      Bin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Sorrell from "@sorrell/cli-utilities/cli";
import { Command } from "@effect/cli";
import { Version } from "./Version.js";

const RootCommand = Command.make("create-code-auger", );

Sorrell.Command.RunCli("create-code-auger", Version, RootCommand, [ ListCommand ]);
