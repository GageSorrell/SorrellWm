/**
 * @file      preset.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LoggerFieldFn } from "@utils/index.js";

export type PresetTimer = LoggerFieldFn<[ number ]>;

export interface RendererPresetTimer
{
    /**
     * Show duration for the tasks.
     */
    timer?: PresetTimer
}
