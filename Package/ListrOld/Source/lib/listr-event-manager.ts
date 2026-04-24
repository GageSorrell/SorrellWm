/**
 * @file      listr-event-manager.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { EventManager } from "./event-manager.js";
import type { ListrEventMap } from "@interfaces/index.js";
import type { ListrEventType } from "@constants/index.js";

export class ListrEventManager extends EventManager<ListrEventType, ListrEventMap>
{ }
