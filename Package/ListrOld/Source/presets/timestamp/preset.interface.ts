/**
 * @file      preset.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LoggerFieldFn } from "@utils/index.js";

export type PresetTimestamp = LoggerFieldFn;

export interface RendererPresetTimestamp
{
    /**
     * Show timestamp for each event that has been logged.
     */
    timestamp?: PresetTimestamp;
}
