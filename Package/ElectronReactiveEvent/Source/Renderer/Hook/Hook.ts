/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    UseInvokeEvent,
    UseInvokeEventDeferred,
    UseOffEventDeferred,
    UseOnEvent,
    UseOnEventDeferred,
    UseOnceEvent,
    UseOnceEventDeferred,
    UseSendEvent,
    UseSendEventDeferred } from "./Hook.Internal.Types";
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
import type { ReactiveEventHooks } from "./Hook.Types";

export function getReactiveEventHooks<PackageKey extends PackageKeys>(): ReactiveEventHooks<PackageKey>
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
