/**
 * @file      Generate.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Consumer from "../../../Consumer/Config/Config.Types.js";
import type * as Provider from "../../../Provider/index.js";
import type { Effect } from "effect";
import type { GenerateConfig } from "./Generate.Command.js";
import type { Path } from "@effect/platform";
import type { PlatformError } from "@effect/platform/Error";
import type { Requirements } from "@sorrell/utilities/effect";
import type { RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import type { SubCommand } from "../../Shared/SubCommand.Types.js";

export type GenerateCommandEffect =
    Effect.Effect<
        void,
        any,
        Requirements.FsPath
    >;

export type GenerateCommandType =
    SubCommand<
        "generate",
        typeof GenerateConfig,
        Requirements.FsPath,
        any
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
        | PlatformError,
        Requirements.FsPath
    >;

export type GetOutPathFn = (PackageName: string) => Effect.Effect<string, never, Path.Path>;
