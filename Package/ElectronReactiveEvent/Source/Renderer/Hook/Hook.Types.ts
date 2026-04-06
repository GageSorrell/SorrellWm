/* File:      Hook.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    UseInvokeEvent,
    UseInvokeEventDeferred,
    UseInvokeEvents,
    UseInvokeEventsDeferred,
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
    UseSendEventsDeferred} from "./Hook.Internal.Types";
import type { PackageKeys } from "../../Internal";

export type ReactiveEventHooks<PackageKey extends PackageKeys> = Readonly<{
    useInvokeEvent: UseInvokeEvent<PackageKey>;
    useInvokeEventDeferred: UseInvokeEventDeferred<PackageKey>;

    useInvokeEvents: UseInvokeEvents<PackageKey>;
    useInvokeEventsDeferred: UseInvokeEventsDeferred<PackageKey>;

    useOnEvent: UseOnEvent<PackageKey>;
    useOnEventDeferred: UseOnEventDeferred<PackageKey>;

    useOnEvents: UseOnEvents<PackageKey>;
    useOnEventsDeferred: UseOnEventsDeferred<PackageKey>;

    useOnceEvent: UseOnceEvent<PackageKey>;
    useOnceEventDeferred: UseOnceEventDeferred<PackageKey>;

    useOnceEvents: UseOnceEvents<PackageKey>;
    useOnceEventsDeferred: UseOnceEventsDeferred<PackageKey>;

    useOffEventDeferred: UseOnceEventDeferred<PackageKey>;
    useOffEventsDeferred: UseOffEventsDeferred<PackageKey>;

    useSendEvent: UseSendEvent<PackageKey>;
    useSendEventDeferred: UseSendEventDeferred<PackageKey>;

    useSendEvents: UseSendEvents<PackageKey>;
    useSendEventsDeferred: UseSendEventsDeferred<PackageKey>;
}>;
