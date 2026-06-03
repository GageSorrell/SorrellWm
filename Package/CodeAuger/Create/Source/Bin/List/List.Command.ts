/**
 * @file      List.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import { Command } from "@effect/cli";
import type { CommandList } from "./List.Command.Types.js";
import { GetDependencyNames } from "./List.Command.Internal.js";
import { GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
import type { PackageJsonParseError } from "@sorrell/utilities/npm";
import type { PlatformError } from "@effect/platform/Error";

/* eslint-disable @typescript-eslint/typedef */

export/**
       * For the package in which {@link process!cwd} resides, print
       * a list of installed providers to the terminal.
       */
const GetProviders = Effect.gen(function* ()
{
    /* eslint-enable @typescript-eslint/typedef */
    const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
    const Path: EffectPath.Path = yield* EffectPath.Path;

    const Dependencies: ReadonlyArray<string> = yield* GetDependencyNames;

    const NodeModulesDirectory: string = yield* GetNodeModulesDirectory();

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function GetDependencyProviderConfigPath(Dependency: string): string
    {
        return Path.resolve(
            NodeModulesDirectory,
            Dependency,
            "code-auger.provider.ts"
        );
    }

    const DependencyPaths: ReadonlyArray<string> =
        Dependencies.map(GetDependencyProviderConfigPath);

    const HasProviderConfig = (
        ProviderConfigPath: string,
        _Index: number
    ): Effect.Effect<boolean, PlatformError | PackageJsonParseError> =>
    {
        return Effect.gen(function* ()
        {
            return yield* Fs.exists(ProviderConfigPath);
        });
    };

    const Providers: ReadonlyArray<string> = yield* pipe(
        DependencyPaths,
        Effect.filter(HasProviderConfig)
    );

    // @TODO
    return;
});

/* eslint-disable @typescript-eslint/no-empty-object-type */

export/**
       * List provider packages that are currently installed in the package
       * in which {@link process!cwd} resides.
       */
// eslint-disable-next-line @typescript-eslint/typedef
const ListCommand: CommandList =
    Command.make(
        "ls",
        { },
        (_: { }) => GetProviders
    );

/* eslint-enable @typescript-eslint/no-empty-object-type */
