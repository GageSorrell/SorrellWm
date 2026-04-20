/**
 * @file      EventNew.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { EventProvider, type FIpcRendererFunctions, MakeEventHooks } from "electron-reactive-event";
import type { IBackendEventRegistrar, IFrontendEventRegistrar } from "Source/Shared/Event/Event.Types";
import type { PropsWithChildren, ReactNode } from "react";

export const {
    UseSendEvent,
    UseSendEventDeferred,
    UseRegisterCallback,
    UseRegisterCallbackDeferred,
    UseRegisterCallbacks,
    UseRegisterCallbacksDeferred,
    UseUnregisterCallbackDeferred,
    UseUnregisterCallbacksDeferred
} = MakeEventHooks<IBackendEventRegistrar, IFrontendEventRegistrar>();

export const SorrellWmEventProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const value: FIpcRendererFunctions = window.electron.EventPreload;

    return (
        <EventProvider { ...{ value } }>
            { children }
        </EventProvider>
    );
};
