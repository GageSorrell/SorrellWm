/**
 * @file      Keyboard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { FKeyboardEvent } from "./Keyboard.Types";
import { Subscribe as IpcSubscribe } from "#/Event/NodeIpc";
import { IsVirtualKey } from "../../Shared";
import { TDispatcher_DEPRECATED } from "#/Event";
import { RegisterInitializationFunction } from "#/Initialize";

class FKeyboard extends TDispatcher_DEPRECATED<FKeyboardEvent>
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

    public OnKey = (...Data: TArray<unknown>): void =>
    {
        const Event: FKeyboardEvent = Data[0] as FKeyboardEvent;
        const IsDebounced: boolean = this.Debounce(Event.State);
        if (IsDebounced && IsVirtualKey(Event.VkCode))
        {
            this.Dispatch(Event);
        }
    };
}

export const Keyboard: FKeyboard = new FKeyboard();

async function InitializeKeyboard(): Promise<void>
{
    IpcSubscribe("Keyboard", Keyboard.OnKey);
}

RegisterInitializationFunction("Keyboard", InitializeKeyboard);
