import { TDispatcher } from "./Dispatcher";
import type { FActivationKeyState } from "./Keyboard.Types";
import { Subscribe as IpcSubscribe } from "./NodeIpc";

// let IsKeyDown: boolean = true;

// function Dispatch(State: FActivationKeyState): void
// {
//     console.log(`Dispatched ${ State }.`);
// }

// function OnActivationKeyUp(): void
// {
//     IsKeyDown = false;
//     console.log("Going to dispatch...");
//     Dispatch("Up");
//     console.log("Finished dispatch");
// }

// function OnActivationKeyDown(): void
// {
//     if (!IsKeyDown)
//     {
//         IsKeyDown = true;
//         console.log("Going to dispatch...");
//         Dispatch("Down");
//         console.log("Finished dispatch");
//     }
// }

class FKeyboard extends TDispatcher<FActivationKeyState>
{
    public constructor()
    {
        super();

    }

    private IsKeyDown: boolean = false;

    public const OnActivationKeyUp = (): void =>
    {
        this.IsKeyDown = false;
        console.log("Going to dispatch...");
        this.Dispatch("Up");
        console.log("Finished dispatch");
    }

    public const OnActivationKeyDown = (): void =>
    {
        if (!this.IsKeyDown)
        {
            this.IsKeyDown = true;
            console.log("Going to dispatch...", this);
            this.Dispatch("Down");
            console.log("Finished dispatch");
        }
    }
}

export const Keyboard: FKeyboard = new FKeyboard();
IpcSubscribe("ActivationKeyDown", Keyboard.OnActivationKeyDown);
IpcSubscribe("ActivationKeyUp", Keyboard.OnActivationKeyUp);
