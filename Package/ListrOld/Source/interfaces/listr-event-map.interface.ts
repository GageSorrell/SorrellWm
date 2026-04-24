/**
 * @file      listr-event-map.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { BaseEventMap } from "./event.interface.js";
import type { EventMap } from "./event.interface.js";
import { ListrEventType } from "@constants/index.js";

/**
 * Event map for Listr.
 *
 * @see {@link https://listr2.kilic.dev/listr/events.html}
 * @see {@link module:listr2.ListrEventType}
 */
export declare class ListrEventMap extends BaseEventMap implements EventMap<ListrEventType>
{
    [ListrEventType.SHOULD_REFRESH_RENDER]: never;
}
