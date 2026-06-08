/**
 * @file      Generate.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Consumer from "../../../Consumer/Config/index.js";
import type * as Provider from "../../../Provider/index.js";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import type { Environment } from "effect/unstable/cli/Prompt";
import type { Effect, PlatformError } from "effect";
import type { GenerateConfig } from "./Generate.Command.js";
import type { Subcommand } from "../../Shared/SubCommand.Types.js";
import type { Command } from "effect/unstable/cli";

export type GenerateCommandEffect =
    Effect.Effect<
        void,
        any,
        | Environment
        | Command.CommandContext<"code-auger">
    >;

export type GenerateCommandType =
    Subcommand<
        "generate",
        typeof GenerateConfig
    >;

export type GenerateConfigPart =
    Readonly<{
        Consumer: boolean | typeof Consumer.Provider.Type;
        Provider: Provider.Config;
    }>;

export type GenerateConfigRecord = Readonly<Record<string, GenerateConfigPart>>;

export type EGetGenerateConfig =
    Effect.Effect<
        GenerateConfigRecord,
        | RootDirectoryNotFoundError
        | PackageJsonParseError
        | PlatformError.PlatformError,
        Environment
    >;

export type GetOutPathFn =
    (PackageName: string) => Effect.Effect<
        string,
        | PlatformError.PlatformError
        | RootDirectoryNotFoundError,
        Environment
    >;
