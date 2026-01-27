/* File:      Event.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FIpcFrontendChannel,
    TIpcCallback,
    TIpcHandler,
    TRequestData,
    TResponseData } from "?/Event.Types";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const SendIpcEvent_DEPRECATED = <T extends FIpcFrontendChannel>(
    Channel: T,
    RequestData: TRequestData<T>,
    Callback: TIpcCallback<T>
): void =>
{
    window.electron.ipcRenderer.Once(Channel, (...Arguments: Array<unknown>): void =>
    {
        const ResponseData: TResponseData<T> | undefined = Arguments[0] as TResponseData<T> | undefined;
        Callback(ResponseData);
    });

    window.electron.ipcRenderer.Send(Channel, RequestData);
};

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const OnIpcEvent_DEPRECATED = <T extends FIpcFrontendChannel>(
    Channel: T,
    Callback: TIpcHandler<T>
): void =>
{
    const CallbackWrapper = async (
        _Event: Electron.Event,
        ...Arguments: Array<unknown>
    ): Promise<void> =>
    {
        const RequestData: TRequestData<T> = Arguments[0] as TRequestData<T>;
        const ResponseData: TResponseData<T> = await Callback(RequestData);
        window.electron.ipcRenderer.Send(Channel, ResponseData);
    };

    window.electron.ipcRenderer.on(Channel, CallbackWrapper);
};
