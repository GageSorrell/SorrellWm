/* File:      WinEvent.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { HWindow } from "@sorrellwm/windows";

export type FWinEventPayload =
{
    Event: number;
    Handle: HWindow;
    IdObject: number;
    IdChild: number;
    EventThread: number;
    EventTime: number;
};
