/**
 * @file      Generate.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TConfig, TOptions } from "../Command/Command.Types.js";
import type { Options } from "@effect/cli";

export type FGenerateConfig =
    TConfig<{
        Out: Options.Options<string>;
    }>;

export type FGenerateOptions = TOptions<FGenerateConfig>;
