/**
 * @file      IndexCommand.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Options } from "@effect/cli";
import type { TRequirements } from "../Options/Options.Types.js";

export type FIndexCommandRequirements = TRequirements<{
    Path: Args.Args<string>;
    Internal: Options.Options<boolean>;
}>;
