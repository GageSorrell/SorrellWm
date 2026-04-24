/**
 * @file      listr-task-event-manager.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { EventManager } from "./event-manager.js";
import type { ListrTaskEventMap } from "@interfaces/index.js";
import type { ListrTaskEventType } from "@constants/index.js";

export class ListrTaskEventManager extends EventManager<ListrTaskEventType, ListrTaskEventMap>
{ }
