/**
 * @file      Generate.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Consumer from "../../../Consumer/Config/index.js";
import type * as Provider from "../../../Provider/index.js";
import type { FileSystem, Path } from "@effect/platform";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import type { ConfigError } from "effect/ConfigError";
import type { CliApp, ConfigFile } from "@sorrell/effect-cli";
import type { Effect } from "effect";
import type { GenerateConfig } from "./Generate.Command.js";
import type { PlatformError } from "@effect/platform/Error";
import type { Requirements } from "@sorrell/utilities/effect";
import type { Subcommand } from "../../Shared/SubCommand.Types.js";

export type GenerateCommandEffect =
    Effect.Effect<
        void,
        any,
        CliApp.CliApp.Environment
    >;

export type GenerateCommandType =
    Subcommand<
        "generate",
        typeof GenerateConfig,
        Requirements.FsPath
    >;

export type GenerateConfigPart =
    Readonly<{
        Consumer: Consumer.Provider;
        Provider: Provider.Config;
    }>;

export type GenerateConfigRecord = Readonly<Record<string, GenerateConfigPart>>;

export type EGetGenerateConfig =
    Effect.Effect<
        GenerateConfigRecord,
        | RootDirectoryNotFoundError
        | PackageJsonParseError
        | PlatformError
        | ConfigError
        | ConfigFile.ConfigFileError,
        CliApp.CliApp.Environment
    >;

export type GetOutPathFn =
    (PackageName: string) => Effect.Effect<
        string,
        | PlatformError
        | RootDirectoryNotFoundError,
        | Path.Path
        | FileSystem.FileSystem
    >;
