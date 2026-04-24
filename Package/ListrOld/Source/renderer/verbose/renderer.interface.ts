/**
 * @file      renderer.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrLogLevels, ListrLoggerStyleMap, RendererLoggerOptions } from "@utils/index.js";
import type { ListrRendererCacheMap, ListrRendererTask } from "@interfaces/index.js";
import type { PresetTimer, RendererPresetTimer, RendererPresetTimestamp } from "@presets/index.js";
import type { VerboseRenderer } from "./renderer.js";

export type ListrVerboseRendererTask = ListrRendererTask<typeof VerboseRenderer>;

export interface ListrVerboseRendererOptions extends
    RendererPresetTimer,
    RendererPresetTimestamp,
    RendererLoggerOptions<ListrLogLevels>,
    ListrLoggerStyleMap<ListrLogLevels>
{
    /**
     * Log the title changes of the task.
     *
     * @default `false`
     */
    LogTitleChange?: boolean

    /**
     * Show duration for the pauses.
     *
     * @default `PRESET_TIMER`
     */
    PausedTimer?: PresetTimer
}

export interface ListrVerboseRendererTaskOptions extends RendererPresetTimer { }

export interface ListrVerboseRendererCache
{
    RendererOptions: ListrRendererCacheMap<ListrVerboseRendererOptions>;
    RendererTaskOptions: ListrRendererCacheMap<ListrVerboseRendererTaskOptions>;
}
