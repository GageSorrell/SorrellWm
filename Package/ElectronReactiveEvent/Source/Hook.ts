/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    FactoryContextRef,
    type Callback,
    type CallbackRecord,
    type EventContext,
    type EventHooks,
    type IMainRegistrarBase,
    type IRendererRegistrarBase,
    type NoRequestChannel,
    type RendererCallback,
    type Request,
    type RequestChannel,
    type UseEventCallbackDeferred,
    type UseEventCallbacksDeferred,
    type UseSendEventDeferred,
    type UseSendEventReturn,
    type UseUnregisterCallbackDeferred,
    type UseUnregisterCallbacksDeferred } from "./index.js";
import { type Context, useContext } from "react";
import type { Channel } from "./Internal/index.js";

export class EventHookError extends Error
{
    public constructor(HookName: string)
    {
        super(`The ${ HookName } hook was undefined in the EventContext.`);
        this.name = "EventHookError";
    }
}

export class EventProviderError extends Error
{
    public constructor()
    {
        super("EventContext was undefined.  Ensure that your app contains an <EventProvider>.");
        this.name = "EventProviderError";
    }
}

/** Call this once, and export its result a module, to use in components. */
export function MakeEventHooks<MainRegistrar extends IMainRegistrarBase, RendererRegistrar extends IRendererRegistrarBase>(
): EventHooks<MainRegistrar, RendererRegistrar>
{
    type ThisEventContext = EventContext<MainRegistrar, RendererRegistrar>;

    function WrapHook<HookNameType extends keyof ThisEventContext>(
        HookName: HookNameType,
        ...ArgumentVector: Array<unknown>
    ): unknown
    {
        const EventContext: ThisEventContext =
            useContext<ThisEventContext>(FactoryContextRef.Ref as Context<ThisEventContext>);

        if (EventContext !== undefined)
        {
            if (EventContext[HookName] !== undefined)
            {
                /* TypeScript is unconvinced that an overload is satisfied *
                 * when passing the optional arguments, so the arguments   *
                 * and return value are both cast here.                    */
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
                return (EventContext[HookName] as Function)(
                    ...(ArgumentVector as Array<unknown>)
                ) as unknown;
            }
            else
            {
                throw new EventHookError("UseSendEvent");
            }
        }

        throw new EventProviderError();
    }

    function useSendEvent<ChannelType extends RequestChannel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: Request<typeof Channel, RendererRegistrar>,
        Suspend?: boolean
    ): UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends NoRequestChannel<RendererRegistrar>>(
        Channel: ChannelType
    ): UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends NoRequestChannel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends Channel<RendererRegistrar>>(
        Channel: ChannelType,
        Request?: Request<typeof Channel, RendererRegistrar>,
        Suspend?: boolean
    ): UseSendEventReturn<typeof Channel, RendererRegistrar>
    {
        return WrapHook(
            "useSendEvent",
            Channel as unknown as NoRequestChannel<RendererRegistrar>,
            Request as undefined,
            Suspend as boolean
        ) as unknown as UseSendEventReturn<ChannelType, RendererRegistrar>;
    }

    function useSendEventDeferred(): ReturnType<UseSendEventDeferred<RendererRegistrar>>
    {
        type ThisReturnType = ReturnType<UseSendEventDeferred<RendererRegistrar>>;
        return WrapHook("useSendEventDeferred") as ThisReturnType;
    }

    function useEventCallback<ChannelType extends Channel<MainRegistrar>>(
        Channel: ChannelType,
        Callback: RendererCallback<ChannelType, MainRegistrar>
    ): void
    {
        WrapHook("useEventCallback", Channel, Callback);
    }

    function useEventCallbacks<ChannelType extends Channel<MainRegistrar>>(
        Record: CallbackRecord<ChannelType, "Renderer", MainRegistrar>
    ): void
    {
        WrapHook("useEventCallbacks", Record);
    }

    type ThisUseCallbackDeferredReturnType =
        ReturnType<UseEventCallbackDeferred<MainRegistrar>>;
    function useEventCallbackDeferred(): ThisUseCallbackDeferredReturnType
    {
        return WrapHook("useEventCallbackDeferred") as ThisUseCallbackDeferredReturnType;
    }

    type ThisUseCallbacksDeferredReturnType =
        ReturnType<UseEventCallbacksDeferred<MainRegistrar>>;
    function useEventCallbacksDeferred(): ThisUseCallbacksDeferredReturnType
    {
        return WrapHook("useEventCallbacksDeferred") as ThisUseCallbacksDeferredReturnType;
    }

    type ThisUseUnregisterCallbacksDeferredReturnType =
        ReturnType<UseUnregisterCallbacksDeferred<MainRegistrar>>;
    function useUnregisterCallbacksDeferred(): ThisUseUnregisterCallbacksDeferredReturnType
    {
        return WrapHook("useUnregisterCallbacksDeferred") as ThisUseUnregisterCallbacksDeferredReturnType;
    }

    type ThisUseUnregisterCallbackDeferredReturnType =
        ReturnType<UseUnregisterCallbackDeferred<MainRegistrar>>;
    function useUnregisterCallbackDeferred(): ThisUseUnregisterCallbackDeferredReturnType
    {
        return WrapHook("useUnregisterCallbackDeferred") as ThisUseUnregisterCallbackDeferredReturnType;
    }

    return {
        useEventCallback,
        useEventCallbackDeferred,
        useEventCallbacks,
        useEventCallbacksDeferred,
        useSendEvent,
        useSendEventDeferred,
        useUnregisterCallbackDeferred,
        useUnregisterCallbacksDeferred
    } as const;
};
