/**
 * @file      Options.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Options } from "@effect/cli";
import type { Config, FGlobalRequirements, TRequirementsArgument } from "./Options.Types.js";

/**
 * @module Options
 * Options shared by multiple commands.
 */

export const Silent: Options.Options<boolean> = Options.boolean("silent")
    .pipe(Options.withAlias("s"));

export const GlobalOptions: Config<FGlobalRequirements> =
    {
        Silent
    };

export const DefaultGlobalOptions: TRequirementsArgument<FGlobalRequirements> =
    {
        Silent: false
    };


