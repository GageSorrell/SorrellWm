export class TDispatcher<T = unknown>
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

    public const Dispatch = (Message: T): void =>
    {
        if (this.Listeners.size > 0)
        {
            this.Listeners.forEach((Callback: ((Argument: T) => void)): void =>
            {
                Callback(Message);
            });
        }
    }
};
