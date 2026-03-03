/* File:      WinEvent.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

// import { type FBox, GetWindowLocationAndSize, InitializeWinEvents } from "@sorrellwm/windows";
// import { type FLogger, GetLogger } from "./Development";
// import { IsWindowTiled, Publish } from "./Tree";
// import type { FWinEventPayload } from "./WinEvent.Types";
// import { Subscribe } from "./NodeIpc";
// import { TDispatcher } from "./Core/Dispatcher";

import type { FWinEventPayload } from "./WinEvent.Types";
import { InitializeWinEvents } from "@sorrellwm/windows";
import { IsWindowTiled } from "./Tree";
import { Subscribe } from "./NodeIpc";
import { TDispatcher } from "./Core/Dispatcher";

// const Log: FLogger = GetLogger("WinEvent");

export const WinEvent: TDispatcher<undefined> = new TDispatcher<undefined>();

InitializeWinEvents();

// const WindowInitialRect: Map<string, FBox> = new Map<string, FBox>();

Subscribe("WinEvent", (...Arguments: Array<unknown>): void =>
{
    // const { Event, Handle, IdObject }: FWinEventPayload = Arguments[0] as FWinEventPayload;
    const { Handle, IdObject }: FWinEventPayload = Arguments[0] as FWinEventPayload;
    // const ResizeEvent: number = 32772;
    // const MouseMoveEvent: number = 32779;
    // const MoveSizeStartEvent: number = 10;
    // const MoveSizeEndEvent: number = 11;
    /* eslint-disable-next-line @stylistic/max-len */
    /* (For now) prevent windows from being moved by dragging the cursor by moving tiled windows back to where they "should" be under SorrellWm. */
    const IsWindowEvent: boolean = IdObject === 0 && Handle !== undefined && IsWindowTiled(Handle);
    if (IsWindowEvent)
    {
        // @TODO Temporary.
        return;
        // const InitialBounds: FBox = GetWindowLocationAndSize(Handle);
        // if (Event === MoveSizeStartEvent)
        // {
        //     WindowInitialRect.set(Handle.Handle, InitialBounds);
        // }
        // else if (Event === MoveSizeEndEvent)
        // {
        //     const InitialBounds: FBox | undefined = WindowInitialRect.get(Handle.Handle);
        //     if (InitialBounds !== undefined)
        //     {
        //         const FinalBounds: FBox = GetWindowLocationAndSize(Handle);
        //         const WindowWasResizedByDragging: boolean =
        //             InitialBounds.Height === FinalBounds.Height &&
        //             InitialBounds.Width === FinalBounds.Width;

        //         if (WindowWasResizedByDragging)
        //         {
        //             Log("!! Window Was Resized By Dragging !!");
        //             Publish();
        //         }
        //     }
        // }
    }

    // if (Event !== MouseMoveEvent)
    // {
    //     Log(`WinEvent Event value is ${ Event }.`);
    // }
});
