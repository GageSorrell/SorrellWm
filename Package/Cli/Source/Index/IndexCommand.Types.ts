/**
 * @file      IndexCommand.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args } from "@effect/cli/Args";
import type { FileSystem } from "@effect/platform";
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
        "init",
        IndexConfig,
        never,
        FileSystem.FileSystem
    >;

// type FCommand = Command.Command<
//     "echo",
//     FStepService,
//     never,
//     FConfig
// >;
