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

/**
 * This is the entrypoint of `electron-reactive-event` in the `renderer`.
 * To use these functions, you must wrap the part of your application in which
 * you wish to use `electron-reactive-event` in a {@link ReactiveEventProvider}
 * (to which you must supply the necessary
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer functions}).
 *
 *
 * @returns The hooks provided by `electron-reactive-event`, scoped to your {@link PackageKey}.
 */
export function getReactiveHooks(): ReactiveIpcHooks
{
    return {
        useInvokeEvent: useInvokeEvent as UseInvokeEvent,
        useInvokeEventDeferred: useInvokeEventDeferred as UseInvokeEventDeferred,

        useOnEvent: useOnEvent as UseOnEvent,
        useOnEventDeferred: useOnEventDeferred as UseOnEventDeferred,

        useOnceEvent: useOnceEvent as UseOnceEvent,
        useOnceEventDeferred: useOnceEventDeferred as UseOnceEventDeferred,

        useOffEventDeferred: useOffEventDeferred as UseOffEventDeferred,

        useSendEvent: useSendEvent as UseSendEvent,
        useSendEventDeferred: useSendEventDeferred as UseSendEventDeferred
    } as const;
}
