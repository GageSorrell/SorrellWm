export type FIpcCallback = (...Data: Array<unknown>) => void;

export type FIpcCallbackSerialized =
{
    Channel: string;
    Callback: FIpcCallback;
};
