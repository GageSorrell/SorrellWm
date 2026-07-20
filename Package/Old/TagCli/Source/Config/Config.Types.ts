/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FCliConfigSchema } from "./Config.Internal.Types.js";

export type FCliConfig = Omit<FCliConfigSchema, "$schema">;
