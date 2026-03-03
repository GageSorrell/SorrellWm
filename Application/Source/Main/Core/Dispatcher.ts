/* File:      Dispatcher.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export type TSubscriptionHandle<Type> =
{
    Subscribe(Callback: ((Argument: Type) => void)): number;
    Unsubscribe(Id: number): void;
};

export class TDispatcher<Type>
{
    private NextListenerId: number = 0;

    private Listeners: Map<number, (Argument: Type) => void> = new Map<number, (Argument: Type) => void>();

    public GetHandle = (): TSubscriptionHandle<Type> =>
    {
        const Subscribe = (Callback: ((Argument: Type) => void)): number =>
        {
            const Id: number = this.NextListenerId++;
            this.Listeners.set(Id, Callback);
            return Id;
        };

        const Unsubscribe = (Id: number): void =>
        {
            this.Listeners.delete(Id);
        };

        return {
            Subscribe,
            Unsubscribe
        };
    };

    public Dispatch = (Message: Type): void =>
    {
        if (this.Listeners.size > 0)
        {
            this.Listeners.forEach((Callback: ((Argument: Type) => void)): void =>
            {
                Callback(Message);
            });
        }
    };
}

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export class TDispatcher_DEPRECATED<Type = unknown>
{
    private NextListenerId: number = 0;

    private Listeners: Map<number, (Argument: Type) => void> = new Map<number, (Argument: Type) => void>();

    public Subscribe(Callback: ((Argument: Type) => void)): number
    {
        const Id: number = this.NextListenerId++;
        this.Listeners.set(Id, Callback);
        return Id;
    }

    public Unsubscribe(Id: number): void
    {
        this.Listeners.delete(Id);
    }

    public Dispatch = (Message: Type): void =>
    {
        if (this.Listeners.size > 0)
        {
            this.Listeners.forEach((Callback: ((Argument: Type) => void)): void =>
            {
                Callback(Message);
            });
        }
    };
}
