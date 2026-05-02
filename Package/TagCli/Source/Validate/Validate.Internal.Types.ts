/**
 * @file      Validate.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TConfig, TOptions } from "../Command/Command.Types.js";
import type { Args } from "@effect/cli";

export type FValidateConfig =
    TConfig<{
        Files: Args.Args<"" | Array<readonly [ Path: string, Content: string ]>>;
    }>;

export type FValidateOptions = TOptions<FValidateConfig>;

