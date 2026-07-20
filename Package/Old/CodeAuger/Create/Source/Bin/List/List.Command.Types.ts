/**
 * @file      List.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FileSystem, Path } from "@effect/platform";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import type { Command } from "@sorrell/effect/unstable/cli";
import type { Effect } from "effect";
import type { PlatformError } from "@effect/platform/Error";
import type { Requirements } from "@sorrell/utilities/effect";

export type EGetProviders =
    Effect.Effect<
        void,
        | PackageJsonParseError
        | RootDirectoryNotFoundError
        | PlatformError,
        Requirements.FsPath
    >;

/** The type of the `ls` command. */
export type CommandList =
    Command.Command<
        "ls",
        | Path.Path
        | FileSystem.FileSystem,
        | PackageJsonParseError
        | RootDirectoryNotFoundError
        | PlatformError,
                { }
    >;
