/**
 * @file      WinEvent.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { HWindow } from "@sorrell/wm-windows";

export type FWinEventPayload =
{
    Event: number;
    Handle: HWindow;
    IdObject: number;
    IdChild: number;
    EventThread: number;
    EventTime: number;
};
