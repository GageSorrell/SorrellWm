#!/usr/bin/env node
/**
 * CLI tool for effect and TypeScript development.
 *
 * @module @sorrell/cli
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { NodeRuntime } from "@effect/platform-node";
import { Program } from "./Entry.ts";

NodeRuntime.runMain(Program);
