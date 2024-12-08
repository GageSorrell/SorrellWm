/* File:      NodeIpc.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FIpcCallback, FIpcCallbackSerialized } from "./NodeIpc.Types";
import { InitializeIpc } from "@sorrellwm/windows";

let NextListenerId: number = 0;
const Listeners: Map<number, FIpcCallbackSerialized> = new Map<number, FIpcCallbackSerialized>();

export const Subscribe = (Channel: string, Callback: FIpcCallback): number =>
{
    const Id: number = NextListenerId++;
    Listeners.set(Id, { Callback, Channel });
    return Id;
};

export const Unsubscribe = (Id: number): void =>
{
    Listeners.delete(Id);
};

function OnMessage(Channel: string, Message: unknown)
{
    Listeners.forEach((Callback: FIpcCallbackSerialized): void =>
    {
        if (Callback.Channel === Channel)
        {
            Callback.Callback(Message);
        }
    });
}

InitializeIpc(OnMessage);
