/**
 * @file      Config.Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { Args, Command, Options } from "@effect/cli";
import type { FileSystem, Path } from "@effect/platform";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import type { Effect } from "effect";
import type { PlatformError } from "@effect/platform/Error";

export type FConfigCommandConfig =
    {
        Out: Args.Args<string>;
        PackageJson: Options.Options<boolean>;
    };

export type FConfigCommandOptions =
    Readonly<{
        Out: string;
        PackageJson: boolean;
    }>;

export type GetBaseConfigFileTemplateEffect =
    Effect.Effect<
        string,
        PlatformError,
        | Path.Path
        | FileSystem.FileSystem
    >;

export type WriteConfigManifestsTypeEffect =
    Effect.Effect<
        string,
        PlatformError,
        | Path.Path
        | FileSystem.FileSystem
    >;

export type GetConfigPathEffect =
    Effect.Effect<
        string,
        RootDirectoryNotFoundError,
        Path.Path
    >;

function GetNodeModulesPath(InTestPath?: string): Effect.Effect<string, PlatformError | RootDirectoryNotFoundError, EffectPath.Path | FileSystem.FileSystem>

export type FConfigCommand =
    Command.Command<
        "init-config",
        | Path.Path
        | FileSystem.FileSystem,
        | PlatformError
        | RootDirectoryNotFoundError
        | PackageJsonParseError,
        FConfigCommandOptions
    >;

export type ConfigCommandEffect =
    Effect.Effect<
        void,
        | PlatformError
        | RootDirectoryNotFoundError
        | PackageJsonParseError,
        | Path.Path
        | FileSystem.FileSystem
    >;
