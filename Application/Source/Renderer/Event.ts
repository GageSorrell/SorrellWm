/* File:      Event.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FIpcBackendEvents, TEventCallback } from "?/Event";

/** Receive an event sent by Main. */
export const UseIpcEffect = <T extends keyof FIpcBackendEvents>(
    Channel: T,
    Callback: TEventCallback<FIpcBackendEvents[T]>
): void =>
{

};
