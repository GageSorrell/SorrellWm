/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    ReactiveEventHooks as ReactiveIpcHooks,
    UseInvokeEvent,
    UseInvokeEventDeferred,
    UseOffEventDeferred,
    UseOnEvent,
    UseOnEventDeferred,
    UseOnceEvent,
    UseOnceEventDeferred,
    UseSendEvent,
    UseSendEventDeferred } from "./Hook.Types";
import {
    useInvokeEvent,
    useInvokeEventDeferred,
    useOffEventDeferred,
    useOnEvent,
    useOnEventDeferred,
    useOnceEvent,
    useOnceEventDeferred,
    useSendEvent,
    useSendEventDeferred } from "./Hook.Internal";
import type { PackageKeys } from "../../Internal";

/**
 * This is the entrypoint of `electron-reactive-event` in the `renderer`.
 * To use these functions, you must wrap the part of your application in which
 * you wish to use `electron-reactive-event` in a {@link ReactiveEventProvider}
 * (to which you must supply the necessary
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer functions}).
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 *
 * @returns The hooks provided by `electron-reactive-event`, scoped to your {@link PackageKey}.
 */
export function getReactiveHooks<PackageKey extends PackageKeys>(): ReactiveIpcHooks<PackageKey>
{
    return {
        useInvokeEvent: useInvokeEvent as UseInvokeEvent<PackageKey>,
        useInvokeEventDeferred: useInvokeEventDeferred as UseInvokeEventDeferred<PackageKey>,

        useOnEvent: useOnEvent as UseOnEvent<PackageKey>,
        useOnEventDeferred: useOnEventDeferred as UseOnEventDeferred<PackageKey>,

        useOnceEvent: useOnceEvent as UseOnceEvent<PackageKey>,
        useOnceEventDeferred: useOnceEventDeferred as UseOnceEventDeferred<PackageKey>,

        useOffEventDeferred: useOffEventDeferred as UseOffEventDeferred<PackageKey>,

        useSendEvent: useSendEvent as UseSendEvent<PackageKey>,
        useSendEventDeferred: useSendEventDeferred as UseSendEventDeferred<PackageKey>
    } as const;
}
