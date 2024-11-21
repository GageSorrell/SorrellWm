import { InitializeIpc } from "@sorrellwm/windows";
import type { FIpcCallback, FIpcCallbackSerialized } from "./NodeIpc.Types";

let NextListenerId: number = 0;
const Listeners: Map<number, FIpcCallbackSerialized> = new Map<number, FIpcCallbackSerialized>();

export const Subscribe = (Channel: string, Callback: FIpcCallback): number =>
{
    const Id: number = NextListenerId++;
    Listeners.set(Id, { Channel, Callback });
    return Id;
};

export const Unsubscribe = (Id: number): void =>
{
    Listeners.delete(Id);
};

function OnMessage(Channel: string, Message: unknown)
{
    console.log(`OnMessage: Received event on channel \`${ Channel }\`.`);
    console.log(`There are ${ Listeners.size }`);
    Listeners.forEach((Callback: FIpcCallbackSerialized): void =>
    {
        if (Callback.Channel === Channel)
        {
            Callback.Callback(Message);
        }
    });
}

InitializeIpc(OnMessage);
