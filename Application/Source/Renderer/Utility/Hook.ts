/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import {
    type Dispatch,
    type MutableRefObject,
    type SetStateAction,
    useEffect,
    useRef,
    useState } from "react";
import type {
    FIpcChannel,
    TIpcBackendPayload,
    TIpcFrontendFunction,
    TIpcFrontendPayload } from "#/Event.Types";

type FUseIndexReturnValue = Readonly<[
    Value: number,
    Increment: () => void,
    Decrement: () => void,
    SetIndex: Dispatch<SetStateAction<number>>
]>;

export const UseIndex = (
    InitialValue: number = 0,
    Minimum: number = 0,
    Maximum?: number
): FUseIndexReturnValue =>
{
    const [ Index, SetIndex ] = useState<number>(InitialValue || 0);

    const Increment = (): void =>
    {
        SetIndex((Old: number): number =>
        {
            return Maximum !== undefined && Old === Maximum
                ? Minimum
                : Old + 1;
        });
    };

    const Decrement = (): void =>
    {
        SetIndex((Old: number): number =>
        {
            return Old === Minimum
                ? Maximum !== undefined
                    ? Maximum
                    : Minimum
                : Old - 1;
        });
    };

    return [ Index, Increment, Decrement, SetIndex ] as const;
};

/**
 * When the component mounts, send a message on `Channel` with `Data` and handle
 * a response from the backend via `Callback`.
 *
 * This function wraps `useEffect`, so you should provide a `Dependency` array.
 *
 * @param Channel      - The channel to send and receive the message over.
 * @param Data         - The data to send (typically `undefined`).
 * @param Callback     - The callback to run when the backend responds.
 * @param Dependencies - The `useEffect` dependency array.
 */
export const UseIpcEffect = <T extends FIpcChannel>(
    Channel: T,
    Callback: TIpcFrontendFunction<T>,
    Data: TIpcFrontendPayload<T>,
    Dependencies?: Array<unknown>
): void =>
{
    const HasRunOnceRef: MutableRefObject<boolean> = useRef<boolean>(false);
    useEffect((): void =>
    {
        if (HasRunOnceRef.current)
        {
            return;
        }

        HasRunOnceRef.current = true;

        window.electron.ipcRenderer.On(Channel, Callback);
        window.electron.ipcRenderer.Send(Channel, Data);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, Dependencies);
};

/**
 * `useState`, but initialize via calling an IPC channel.
 * @param Channel
 * @param Callback
 * @param Data
 * @param Dependencies
 * @returns
 */
export const UseIpcState = <T extends FIpcChannel>(
    Channel: T,
    Data: TIpcFrontendPayload<T>
): Readonly<[
    TIpcBackendPayload<T> | undefined,
    Dispatch<SetStateAction<TIpcBackendPayload<T>> | undefined>
]> =>
{
    const [ Value, SetValue ] = useState<TIpcBackendPayload<T> | undefined>(undefined);

    UseIpcEffect(
        Channel,
        async (...Arguments: Array<unknown>): Promise<void> =>
        {
            SetValue((Old: TIpcBackendPayload<T> | undefined): TIpcBackendPayload<T> =>
            {
                return Arguments;
            });
        },
        Data,
        [ SetValue ]
    );

    return [ Value, SetValue ] as const;
};
