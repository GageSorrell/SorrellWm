/**
 * @file      Config.Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { Args, Command } from "@effect/cli";
import type { Effect } from "effect";
import type { FileSystem } from "@effect/platform";

export type FConfigCommandConfig =
    {
        Out: Args.Args<string>;
    };

export type FConfigCommandOptions =
    Readonly<{
        Out: string;
    }>;

export type FConfigCommand =
    Command.Command<
        "init-config",
        FConfigCommandConfig,
        never,
        FConfigCommandOptions
    >;

export type ConfigCommandEffect = Effect.Effect<void, never, FileSystem.FileSystem>;
