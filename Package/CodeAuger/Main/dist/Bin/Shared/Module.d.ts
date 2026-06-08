/**
 * @file      Module.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Effect } from "effect";
import type { ModuleGenerator } from "./Module.Types.js";
import type { UnknownError } from "effect/Cause";
export declare function GetModuleGenerator(Name: string, Path: string): Effect.Effect<ModuleGenerator, UnknownError, never>;
//# sourceMappingURL=Module.d.ts.map