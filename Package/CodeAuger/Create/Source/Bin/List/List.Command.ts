/**
 * @file      List.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Path as EffectPath, FileSystem } from "@effect/platform";
import { Command } from "@effect/cli";
import type { EGetProviders } from "./List.Command.Types.js";
import { Effect } from "effect";
import { GetDependencyNames } from "./List.Command.Internal.js";
import { GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";

export/**
       * For the package in which {@link process!cwd} resides, print
       * a list of installed providers to the terminal.
       */
const GetProviders: EGetProviders = Effect.gen(function* ()
{
    const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
    const Path: EffectPath.Path = yield* EffectPath.Path;

    const Dependencies: ReadonlyArray<string> = yield* GetDependencyNames;

    const NodeModulesDirectory: string = yield* GetNodeModulesDirectory();

    const DependencyPaths: ReadonlyArray<string> =
        Dependencies.map((Dependency: string): string => Path.resolve(
            NodeModulesDirectory,
            Dependency,
            "package.json"
        ));

    const 

});

/* eslint-disable @typescript-eslint/no-empty-object-type */

/** The type of the {@link ListCommand:var | list command}. */
type ListCommand =
    Command.Command<
        "ls",
        | EffectPath.Path
        | FileSystem.FileSystem,
        never,
        { }
    >;

export/**
       * List provider packages that are currently installed in the package
       * in which {@link process!cwd} resides.
       */
const ListCommand: ListCommand =
    Command.make(
        "ls",
        { },
        (_: { }): EGetProviders => GetProviders
    );

/* eslint-enable @typescript-eslint/no-empty-object-type */
