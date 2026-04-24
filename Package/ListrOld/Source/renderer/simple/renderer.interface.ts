/**
 * @file      renderer.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrLogLevels, ListrLoggerStyleMap, RendererLoggerOptions } from "@utils/index.js";
import type { ListrRendererCacheMap, ListrRendererTask } from "@interfaces/index.js";
import type { PresetTimer, RendererPresetTimer, RendererPresetTimestamp } from "@presets/index.js";
import type { SimpleRenderer } from "./renderer.js";

export type ListrSimpleRendererTask = ListrRendererTask<typeof SimpleRenderer>;

export interface ListrSimpleRendererOptions extends
    RendererPresetTimer,
    RendererPresetTimestamp,
    RendererLoggerOptions<ListrLogLevels>,
    ListrLoggerStyleMap<ListrLogLevels>
{
    /**
     * Show duration for the pauses.
     *
     * @default `PRESET_TIMER`
     */
    PausedTimer?: PresetTimer;
}

export interface ListrSimpleRendererTaskOptions extends RendererPresetTimer { }

export interface ListrSimpleRendererCache
{
    RendererOptions: ListrRendererCacheMap<ListrSimpleRendererOptions>
    RendererTaskOptions: ListrRendererCacheMap<ListrSimpleRendererTaskOptions>
}
