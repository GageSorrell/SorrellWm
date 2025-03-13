/* File:      Dispatcher.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

export type TSubscriptionHandle<T> =
{
    Subscribe(Callback: ((Argument: T) => void)): number;
    Unsubscribe(Id: number): void;
};

export class TDispatcher<T>
{
    private NextListenerId: number = 0;

    private Listeners: Map<number, (Argument: T) => void> = new Map<number, (Argument: T) => void>();

    public GetHandle = (): TSubscriptionHandle<T> =>
    {
        const Subscribe = (Callback: ((Argument: T) => void)): number =>
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
    }

    public Dispatch = (Message: T): void =>
    {
        if (this.Listeners.size > 0)
        {
            this.Listeners.forEach((Callback: ((Argument: T) => void)): void =>
            {
                Callback(Message);
            });
        }
    };
};

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export class TDispatcher_DEPRECATED<T = unknown>
{
    private NextListenerId: number = 0;

    private Listeners: Map<number, (Argument: T) => void> = new Map<number, (Argument: T) => void>();

    public Subscribe(Callback: ((Argument: T) => void)): number
    {
        const Id: number = this.NextListenerId++;
        this.Listeners.set(Id, Callback);
        return Id;
    }

    public Unsubscribe(Id: number): void
    {
        this.Listeners.delete(Id);
    }

    public Dispatch = (Message: T): void =>
    {
        if (this.Listeners.size > 0)
        {
            this.Listeners.forEach((Callback: ((Argument: T) => void)): void =>
            {
                Callback(Message);
            });
        }
    };
};
