/**
 * @file      Init.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { TCommand, TSubCommandEffect } from "../Command/Command.Types.js";
import type { Args } from "@effect/cli/Args";
import { Data } from "effect";
import type { Options } from "@effect/cli/Options";
import type { TConfig } from "../Config/Config.Types.js";
import type { TOptions } from "../Options/Options.Types.js";

export type InitOptions = TOptions<InitConfig>;

export type PackageType =
    /** The given package is intended to be used with `electron`. */
    | "electron"

    /**
     * The given package is *not* intended to be used with `electron`
     * or as a script.
     */
    | "none"

    /** The given package is intended to be a script. */
    | "script";

/**
 * @property {Options<boolean>} internal - Whether the package should be created as a workspace.
 * @property {Options<boolean>} isPrivate - Whether the package should is intended only for use
 * within the monorepo.
 * @property {Args<string>} name - The name of the package.
 * @property {Args<PackageType>} packageType - The intended use case of the package.
 * @property {Options<boolean>} tsover - Whether `tsover` should be added.
 */
export type InitConfig =
    TConfig<{
        internal: Options<boolean>;
        name: Args<string>;
        isPrivate: Options<boolean>;
        packageType: Args<string>;
        tsover: Options<boolean>;
    }>;

export type InitEffect = TSubCommandEffect<InitError>;

export class InitRichError extends Data.TaggedError("InitRichError")<{
    Stringified: string;
}> { }

export class InitPlainError extends Data.TaggedError("InitPlainError")<{ }> { }

export type InitError =
    | InitPlainError
    | InitRichError;

export type InitCommandType = TCommand<
    "init",
    InitConfig,
    InitError
>;
