/**
 * File:   ./src/Renderer.Generated.ts
 * Author: `electron-reactive-event-cli`
 *
 * ********************************************
 *
 * Generated with the generate command.
 * Regenerate this file by running,
 *
 *    `npm exec electron-reactive-event declare-events`
 *
 * in this directory.
 *
 */

/* eslint-disable */
import type { PackageKey } from "./Reactive.Generated.ts";
import { getReactiveIpcHooks } from "electron-reactive-event/scoped";

const {
    useInvokeEvent: UseInvokeEvent,
    useInvokeEventDeferred: UseInvokeEventDeferred,
    useOnEvent: UseOnEvent,
    useOnEventDeferred: UseOnEventDeferred,
    useOnceEvent: UseOnceEvent,
    useOnceEventDeferred: UseOnceEventDeferred,
    useOffEventDeferred: UseOffEventDeferred,
    useSendEvent: UseSendEvent,
    useSendEventDeferred: UseSendEventDeferred
} = getReactiveIpcHooks<PackageKey>();

export const useInvokeEvent: typeof UseInvokeEvent = UseInvokeEvent;
export const useInvokeEventDeferred: typeof UseInvokeEventDeferred = UseInvokeEventDeferred;
export const useOnEvent: typeof UseOnEvent = UseOnEvent;
export const useOnEventDeferred: typeof UseOnEventDeferred = UseOnEventDeferred;
export const useOnceEvent: typeof UseOnceEvent = UseOnceEvent;
export const useOnceEventDeferred: typeof UseOnceEventDeferred = UseOnceEventDeferred;
export const useOffEventDeferred: typeof UseOffEventDeferred = UseOffEventDeferred;
export const useSendEvent: typeof UseSendEvent = UseSendEvent;
export const useSendEventDeferred: typeof UseSendEventDeferred = UseSendEventDeferred;
