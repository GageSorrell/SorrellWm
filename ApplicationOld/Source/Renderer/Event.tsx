/**
 * @file      EventNew.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { PropsWithChildren, ReactNode } from "react";
import { Identity } from "@sorrell/utilities/functional";

// export const {
//     UseSendEvent,
//     UseSendEventDeferred,
//     UseRegisterCallback,
//     UseRegisterCallbackDeferred,
//     UseRegisterCallbacks,
//     UseRegisterCallbacksDeferred,
//     UseUnregisterCallbackDeferred,
//     UseUnregisterCallbacksDeferred
// } = MakeEventHooks<IBackendEventRegistrar, IFrontendEventRegistrar>();

export const {
    UseRegisterCallback,
    UseRegisterCallbackDeferred,
    UseRegisterCallbacks,
    UseRegisterCallbacksDeferred,
    UseSendEvent,
    UseSendEventDeferred,
    UseUnregisterCallbackDeferred,
    UseUnregisterCallbacksDeferred
} = {
    UseRegisterCallback: Identity,
    UseRegisterCallbackDeferred: Identity,
    UseRegisterCallbacks: Identity,
    UseRegisterCallbacksDeferred: Identity,
    UseSendEvent: Identity,
    UseSendEventDeferred: Identity,
    UseUnregisterCallbackDeferred: Identity,
    UseUnregisterCallbacksDeferred: Identity
} as {
    UseRegisterCallback: (...Arguments: Array<any>) => any;
    UseRegisterCallbackDeferred: (...Arguments: Array<any>) => any;
    UseRegisterCallbacks: (...Arguments: Array<any>) => any;
    UseRegisterCallbacksDeferred: (...Arguments: Array<any>) => any;
    UseSendEvent: (...Arguments: Array<any>) => any;
    UseSendEventDeferred: (...Arguments: Array<any>) => any;
    UseUnregisterCallbackDeferred: (...Arguments: Array<any>) => any;
    UseUnregisterCallbacksDeferred: (...Arguments: Array<any>) => any;
};

export const SorrellWmEventProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    // const value: any = window.electron.EventPreload;

    return children;

    // return (
    //     <EventProvider { ...{ value } }>
    //         { children }
    //     </EventProvider>
    // );
};
