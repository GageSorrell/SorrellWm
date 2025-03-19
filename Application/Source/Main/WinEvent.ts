/* File:      WinEvent.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FWinEventPayload } from "./WinEvent.Types";
import { InitializeWinEvents } from "@sorrellwm/windows";
import { Log } from "./Development";
import { Subscribe } from "./NodeIpc";
import { TDispatcher } from "./Dispatcher";

export const WinEvent: TDispatcher<undefined> = new TDispatcher<undefined>();

InitializeWinEvents();

Subscribe("WinEvent", (...Arguments: Array<unknown>): void =>
{
    const { Event }: FWinEventPayload = Arguments[0] as FWinEventPayload;
    const ResizeEvent: number = 32772;
    const MouseMoveEvent: number = 32779;
    if (Event !== MouseMoveEvent)
    {
        Log(`WinEvent Event value is ${ Event }.`);
    }
});
