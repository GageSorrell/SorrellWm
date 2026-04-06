/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type {
    UseInvokeEvent,
    UseInvokeEventDeferred,
    UseInvokeEvents,
    UseInvokeEventsDeferred,
    UseOffEventDeferred,
    UseOffEventsDeferred,
    UseOnEvent,
    UseOnEventDeferred,
    UseOnEvents,
    UseOnEventsDeferred,
    UseOnceEvent,
    UseOnceEventDeferred,
    UseOnceEvents,
    UseOnceEventsDeferred,
    UseSendEvent,
    UseSendEventDeferred,
    UseSendEvents,
    UseSendEventsDeferred } from "./Hook.Internal.Types";
import {
    useInvokeEvent,
    useInvokeEventDeferred,
    useInvokeEvents,
    useOffEventDeferred,
    useOffEventsDeferred,
    useOnEvent,
    useOnEventDeferred,
    useOnEvents,
    useOnceEvent,
    useOnceEventDeferred } from "./Hook.Internal";
import type { PackageKeys } from "../../Internal";
import type { ReactiveEventHooks } from "./Hook.Types";
import { useOnEventsDeferred } from "../Hook.Internal.ts.old";

export function getReactiveEventHooks<PackageKey extends PackageKeys>(): ReactiveEventHooks<PackageKey>
{
    return {
        useInvokeEvent: useInvokeEvent as UseInvokeEvent<PackageKey>,
        useInvokeEventDeferred: useInvokeEventDeferred as UseInvokeEventDeferred<PackageKey>,

        useInvokeEvents: useInvokeEvents as UseInvokeEvents<PackageKey>,
        useInvokeEventsDeferred: useInvokeEventsDeferred as UseInvokeEventsDeferred<PackageKey>,

        useOnEvent: useOnEvent as UseOnEvent<PackageKey>,
        useOnEventDeferred: useOnEventDeferred as UseOnEventDeferred<PackageKey>,

        useOnEvents: useOnEvents as UseOnEvents<PackageKey>,
        useOnEventsDeferred: useOnEventsDeferred as UseOnEventsDeferred<PackageKey>,

        useOnceEvent: useOnceEvent as UseOnceEvent<PackageKey>,
        useOnceEventDeferred: useOnceEventDeferred as UseOnceEventDeferred<PackageKey>,

        useOnceEvents: useOnceEvents as UseOnceEvents<PackageKey>,
        useOnceEventsDeferred: useOnceEventsDeferred as UseOnceEventsDeferred<PackageKey>,

        useOffEventDeferred: useOffEventDeferred as UseOffEventDeferred<PackageKey>,
        useOffEventsDeferred: useOffEventsDeferred as UseOffEventsDeferred<PackageKey>,

        useSendEvent: useSendEvent as UseSendEvent<PackageKey>,
        useSendEventDeferred: useSendEventDeferred as UseSendEventDeferred<PackageKey>,

        useSendEvents: useSendEvents as UseSendEvents<PackageKey>,
        useSendEventsDeferred: useSendEventsDeferred as UseSendEventsDeferred<PackageKey>
    } as const;
}
