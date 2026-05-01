/**
 * @file      IndexCommand.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CommandExecutor, FileSystem } from "@effect/platform";
import type { ConfigError, Effect } from "effect";
import type { Args } from "@effect/cli/Args";
import type { FStepService } from "../Effect/Effect.js";
import type { NodeContext } from "@effect/platform-node";
import type { Options } from "@effect/cli/Options";
import type { TCommand } from "../Command/Command.Types.js";
import type { TConfig } from "../Config/Config.Types.js";

export type TsExtension =
    | "from-config"
    | "none"
    | "js"
    | "ts";

export type IndexConfig =
    TConfig<{
        extension: Args<TsExtension>;
        internal: Options<boolean>;
        name: Args<string>;
    }>;

export type FIndexCommand =
    TCommand<
        "index",
        IndexConfig,
        never,
        FileSystem.FileSystem
    >;

export type FIndexEffect =
    Effect.Effect<
        void,
        ConfigError.ConfigError,
        | FileSystem.FileSystem
        | FStepService
        | NodeContext.NodeContext
        | CommandExecutor.CommandExecutor
    >;
