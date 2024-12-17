/* File:      Keyboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FKeyboardEvent } from "./Keyboard.Types";
import { Subscribe as IpcSubscribe } from "./NodeIpc";
import { IsVirtualKey } from "@/Domain/Common/Component/Keyboard/Keyboard";
import { TDispatcher } from "./Dispatcher";

class FKeyboard extends TDispatcher<FKeyboardEvent>
{
    public constructor()
    {
        super();
    }

    private IsKeyDown: boolean = false;

    /** Returns true if the `OnKey` should continue. */
    private Debounce = (State: FKeyboardEvent["State"]): boolean =>
    {
        if (State === "Down")
        {
            if (!this.IsKeyDown)
            {
                this.IsKeyDown = true;
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            this.IsKeyDown = false;
            return true;
        }
    };

    public OnKey = (...Data: Array<unknown>): void =>
    {
        const Event: FKeyboardEvent = Data[0] as FKeyboardEvent;
        const IsDebounced: boolean = this.Debounce(Event.State);
        if (IsDebounced && IsVirtualKey(Event.VkCode))
        {
            console.log(Event);
            this.Dispatch(Event);
        }
    };
}

export const Keyboard: FKeyboard = new FKeyboard();
IpcSubscribe("Keyboard", Keyboard.OnKey);
