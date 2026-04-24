/**
 * @file      preset.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { PresetTimestamp } from "./preset.interface.js";
import { color } from "@utils/index.js";
import { parseTimestamp } from "./parser.js";

export const PRESET_TIMESTAMP: PresetTimestamp =
    {
        condition: true,
        field: parseTimestamp,
        format: () => color.dim
    };
