/**
 * @file      preset.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { PresetTimer } from "./preset.interface.js";
import { color } from "@utils/index.js";
import { parseTimer } from "./parser.js";

export const PRESET_TIMER: PresetTimer =
    {
        condition: true,
        field: parseTimer,
        format: () => color.dim
    };
