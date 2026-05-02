/**
 * @file      Init.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Options } from "@effect/cli";
import type { TConfig, TOptions } from "../Command/Command.Types.js";

export type FInitConfig =
    Omit<
        TConfig<{
            ConfigPath: Args.Args<string>;
            Out: Options.Options<string>;
        }>,
        "Project"
    >;

export type FInitOptions = Omit<TOptions<FInitConfig>, "Project">;
