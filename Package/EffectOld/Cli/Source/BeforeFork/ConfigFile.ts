/** @module @sorrell/effect-cli/ConfigFile */

/**
 * @file      ConfigFile.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * from "@effect/cli/ConfigFile";

import * as ConfigFile from "@effect/cli/ConfigFile";
import { type Config, Effect } from "effect";
import type { ConfigProvider } from "effect/ConfigProvider";
import { Path as EffectPath } from "@effect/platform";

/**
 * Load a configuration file of a given {@link name} in a given {@link directory}, given the
 * {@link config} that describes the configuration in the file.
 *
 * @template A - The type underlying the given {@link config}.
 *
 * @param name - The extensionless name to search for in the given directory.
 * @param directory - The directory that contains the desired config file.
 * @param config - The {@link Config!Config} modeled by the {@link directory | file}.
 *
 * @returns The configuration of the given {@link config} stored at the given {@link directory}.
 */
export const load = <A>(
    name: string,
    directory: string,
    config: Config.Config<A>
) =>
    Effect.gen(function* ()
    {
        const PathService: EffectPath.Path = yield* EffectPath.Path;

        const ParsedPath: EffectPath.Path.Parsed = PathService.parse(directory);
        const Directory: string = ParsedPath.dir === "" ? "." : ParsedPath.dir;
        const FileNameWithoutExtension: string = ParsedPath.name;

        const Provider: ConfigProvider = yield* ConfigFile.makeProvider(
            FileNameWithoutExtension,
            {
                searchPaths: [ Directory ]
            }
        );

        return yield* Effect.withConfigProvider(Provider)(
            Effect.gen(function* ()
            {
                return yield* config;
            })
        );
    });

/* eslint-disable @typescript-eslint/typedef */

/** The extensions of the file formats supported by {@link \@sorrell/effect-cli/ConfigFile}. */
export const supportedFileExtensions =
    [
        "json",
        "yml",
        "yaml",
        "tml",
        "toml",
        "ini"
    ] as const;

/** The extensions of the file formats supported by {@link \@sorrell/effect-cli/ConfigFile}. */
export type FileExtension = typeof supportedFileExtensions[number];

/* eslint-enable @typescript-eslint/typedef */
