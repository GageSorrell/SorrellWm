/**
 * @file      LoadConfig.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FileSystem, Path } from "@effect/platform";
import { Config } from "../../../Consumer/Config/Config.js";
import type { ConfigError } from "effect/ConfigError";
import { ConfigFile } from "@sorrell/effect/unstable/cli";
import { Effect } from "effect";
import { Path as EffectPath } from "@effect/platform";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import type { PlatformError } from "@effect/platform/Error";
import { Config as ProviderConfig } from "../../../Provider/Config/Config.js";
import type { SearchExhaustedError } from "@sorrell/utilities/effect/platform";

/**
 * Load a given consumer's config file.
 *
 * @param Cwd - The value of the `cwd` option.
 *
 * @returns {Effect.Effect<Config>} The {@link Effect.Effect | effect} that
 * retrieves the consumer's config.
 */
export function Consumer(
    Cwd?: string | undefined
): Effect.Effect<
    Config,
    | ConfigError
    | ConfigFile.ConfigFileError
    | SearchExhaustedError
    | PlatformError,
    | Path.Path
    | FileSystem.FileSystem
>
{
    return Effect.gen(function* ()
    {
        const RootPath: string = yield* GetPackageRootDirectory(Cwd);

        return yield* ConfigFile.load<Config>("code-auger.config", RootPath, Config);
    });
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
export function Provider(
    PackageName: string,
    NodeModulesDirectory: string
): Effect.Effect<
    ProviderConfig,
    | ConfigError
    | ConfigFile.ConfigFileError,
    | Path.Path
    | FileSystem.FileSystem
>
{
    return Effect.gen(function* ()
    {
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const ProviderPath: string = Path.resolve(NodeModulesDirectory, PackageName);

        return yield* ConfigFile.load<ProviderConfig>("code-auger.provider", ProviderPath, ProviderConfig);
    });
}
