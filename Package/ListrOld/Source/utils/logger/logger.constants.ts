/**
 * @file      logger.constants.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { color, figures } from "@utils/index.js";
import type { ListrLoggerStyleMap } from "./logger.interface.js";

/** Default ListrLogLevels for the logger */
export enum ListrLogLevels {
    STARTED = "STARTED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    OUTPUT = "OUTPUT",
    TITLE = "TITLE",
    ROLLBACK = "ROLLBACK",
    RETRY = "RETRY",
    PROMPT = "PROMPT",
    PAUSED = "PAUSED"
}

export const LISTR_LOGGER_STYLE: ListrLoggerStyleMap<ListrLogLevels> =
    {
        color:
        {
            [ListrLogLevels.STARTED]: color.yellow,
            [ListrLogLevels.FAILED]: color.red,
            [ListrLogLevels.SKIPPED]: color.yellow,
            [ListrLogLevels.COMPLETED]: color.green,
            [ListrLogLevels.RETRY]: color.yellowBright,
            [ListrLogLevels.ROLLBACK]: color.redBright,
            [ListrLogLevels.PAUSED]: color.yellowBright
        },
        icon:
        {
            [ListrLogLevels.STARTED]: figures.pointer,
            [ListrLogLevels.FAILED]: figures.cross,
            [ListrLogLevels.SKIPPED]: figures.arrowDown,
            [ListrLogLevels.COMPLETED]: figures.tick,
            [ListrLogLevels.OUTPUT]: figures.pointerSmall,
            [ListrLogLevels.TITLE]: figures.arrowRight,
            [ListrLogLevels.RETRY]: figures.warning,
            [ListrLogLevels.ROLLBACK]: figures.arrowLeft,
            [ListrLogLevels.PAUSED]: figures.squareSmallFilled
        },
    };

export const LISTR_LOGGER_STDERR_LEVELS: Array<ListrLogLevels> =
    [
        ListrLogLevels.RETRY,
        ListrLogLevels.ROLLBACK,
        ListrLogLevels.FAILED
    ];
