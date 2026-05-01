/**
 * @file      NodeIpc.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { FIpcCallback, FIpcCallbackSerialized } from "./NodeIpc.Types";
import { InitializeIpc } from "@sorrell/wm-windows";
import { RegisterInitializationFunction } from "../Initialize/Initialize";

let NextListenerId: number = 0;
const Listeners: TMap<number, FIpcCallbackSerialized> = new Map<number, FIpcCallbackSerialized>();

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

async function InitializeNodeIpc(): Promise<void>
{
    return Promise.resolve();
}

RegisterInitializationFunction("NodeIpc", InitializeNodeIpc);
