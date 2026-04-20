/**
 * @file      NodeIpc.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

export type FIpcCallback = (...Data: TArray<unknown>) => void;

export type FIpcCallbackSerialized =
{
    Channel: string;
    Callback: FIpcCallback;
};
