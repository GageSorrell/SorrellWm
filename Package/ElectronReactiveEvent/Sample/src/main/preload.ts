/**
 * @file      preload.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { exposeReactiveIpcUnsafe } from "electron-reactive-event/unsafe";

exposeReactiveIpcUnsafe();
