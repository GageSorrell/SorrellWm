/**
 *
 *
 * @module @sorrell/cli/Root
 *
 * @file      Root.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "effect/unstable/cli";

export type RootCommand = Command.Command<
    "sorrell",
    Record<never, never>,
    Record<never, never>,
    Error,
    Command.Environment
>;

export const RootCommand: RootCommand = Command.make("sorrell");
