/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    UseInvoke,
    UseInvokeDeferred,
    UseOffEventDeferred,
    UseOnceEvent,
    UseOnceEventDeferred,
    UseOnEvent,
    UseOnEventDeferred,
    UseSendEvent,
    UseSendEventDeferred} from "./Hook.Internal.Types";
import {
    useInvoke,
    useInvokeDeferred,
    useOnceEvent,
    useOnceEventDeferred,
    useOnEvent,
    useOnEventDeferred,
    useSendEvent,
    useSendEventDeferred } from "./Hook.Internal";
import type { PackageKeys } from "../Internal";
import type { ReactiveEventHooks } from "./Hook.Types";

/* eslint-disable @typescript-eslint/typedef, jsdoc/require-jsdoc */

export function getReactiveEventHooks<PackageKey extends PackageKeys>(): ReactiveEventHooks<PackageKey>
{
    return {
        useInvoke: useInvoke as UseInvoke<PackageKey>,
        useInvokeDeferred: useInvokeDeferred as UseInvokeDeferred<PackageKey>,
        useOffEventDeferred: useOnEventDeferred as UseOffEventDeferred<PackageKey>,
        useOnEvent: useOnEvent as UseOnEvent<PackageKey>,
        useOnEventDeferred: useOnEventDeferred as UseOnEventDeferred<PackageKey>,
        useOnceEvent: useOnceEvent as UseOnceEvent<PackageKey>,
        useOnceEventDeferred: useOnceEventDeferred as UseOnceEventDeferred<PackageKey>,
        useSendEvent: useSendEvent as UseSendEvent<PackageKey>,
        useSendEventDeferred: useSendEventDeferred as UseSendEventDeferred<PackageKey>,
        useSendSync: useSendSyncEvent as UseSendSyncEvent<PackageKey>,
        useSendSyncDeferred: useSendSyncEventDeferred as UseSendSyncEventDeferred<PackageKey>
    } as const;
}
