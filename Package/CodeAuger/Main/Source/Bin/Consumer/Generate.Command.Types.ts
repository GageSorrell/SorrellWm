/**
 * @file      Generate.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";
import type { GenerateConfig } from "./Generate.Command.js";
import type { SubCommand } from "../Shared/SubCommand.Types.js";

export type GenerateCommandEffect =
    Effect.Effect<
        void,
        never,
        never
    >;

export type GenerateCommandType = 
    SubCommand<
        "generate",
        typeof GenerateConfig,
        never,
        never
    >;
