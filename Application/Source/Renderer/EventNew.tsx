/* File:      EventNew.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { EventProvider, type FIpcRendererFunctions, MakeEventHooks } from "@sorrellwm/event";
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
