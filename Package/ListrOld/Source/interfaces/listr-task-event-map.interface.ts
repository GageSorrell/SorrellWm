/**
 * @file      listr-task-event-map.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { BaseEventMap } from "./event.interface.js";
import type { EventMap } from "./event.interface.js";
import { ListrTaskEventType } from "@constants/index.js";
import type { ListrTaskMessage } from "./task.interface.js";
import type { ListrTaskState } from "@constants/index.js";
import type { Task } from "@lib/index.js";

/**
 * Event map for Task.
 *
 * @see {@link https://listr2.kilic.dev/task/events.html}
 * @see {@link module:listr2.ListrTaskEventType}
 */
export declare class ListrTaskEventMap extends BaseEventMap implements EventMap<ListrTaskEventType>
{
    [ListrTaskEventType.STATE]: ListrTaskState;
    [ListrTaskEventType.ENABLED]: boolean;
    [ListrTaskEventType.SUBTASK]: Array<Task<unknown, unknown, unknown>>;
    [ListrTaskEventType.TITLE]: string;
    [ListrTaskEventType.OUTPUT]: string;
    [ListrTaskEventType.MESSAGE]: ListrTaskMessage;
    [ListrTaskEventType.PROMPT]: string;
    [ListrTaskEventType.CLOSED]: never;
}
