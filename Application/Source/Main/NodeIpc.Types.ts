/* File:      NodeIpc.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export type FIpcCallback = (...Data: Array<unknown>) => void;

export type FIpcCallbackSerialized =
{
    Channel: string;
    Callback: FIpcCallback;
};
