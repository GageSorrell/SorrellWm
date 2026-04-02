/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type * as Hook from "./Hook.Types.js";
import type { Callback, Channel, Event } from "../../index.js";
import { type Context, useContext } from "react";
import { Provider } from "../index.js";
import type { Shared } from "../../Shared/index.js";

/* eslint-disable @typescript-eslint/naming-convention */

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
export function MakeEventHooks<
    MainRegistrar extends Shared.Registrar.IMainRegistrarBase,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(
): Provider.EventHooks<MainRegistrar, RendererRegistrar>
{
    type ThisEventContext = Provider.EventContext<MainRegistrar, RendererRegistrar>;

    function WrapHook<HookNameType extends keyof ThisEventContext>(
        HookName: HookNameType,
        ...ArgumentVector: Array<unknown>
    ): unknown
    {
        const EventContext: ThisEventContext =
            useContext<ThisEventContext>(Provider.FactoryContextRef.Ref as Context<ThisEventContext>);

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

    function useSendEvent<ChannelType extends Channel.Request<RendererRegistrar>>(
        Channel: ChannelType,
        Request: Event.Request<typeof Channel, RendererRegistrar>,
        Suspend?: boolean
    ): Hook.Send.UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends Channel.NoRequest<RendererRegistrar>>(
        Channel: ChannelType
    ): Hook.Send.UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends Channel.NoRequest<RendererRegistrar>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): Hook.Send.UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends Channel.Channel<RendererRegistrar>>(
        Channel: ChannelType,
        Request?: Event.Request<typeof Channel, RendererRegistrar>,
        Suspend?: boolean
    ): Hook.Send.UseSendEventReturn<typeof Channel, RendererRegistrar>
    {
        return WrapHook(
            "useSendEvent",
            Channel as unknown as Channel.NoRequest<RendererRegistrar>,
            Request as undefined,
            Suspend as boolean
        ) as unknown as Hook.Send.UseSendEventReturn<ChannelType, RendererRegistrar>;
    }

    function useSendEventDeferred(): ReturnType<Hook.Send.UseSendEventDeferred<RendererRegistrar>>
    {
        type ThisReturnType = ReturnType<Hook.Send.UseSendEventDeferred<RendererRegistrar>>;
        return WrapHook("useSendEventDeferred") as ThisReturnType;
    }

    function useEventCallback<ChannelType extends Channel.Channel<MainRegistrar>>(
        Channel: ChannelType,
        Callback: Callback.Renderer<ChannelType, MainRegistrar>
    ): void
    {
        WrapHook("useEventCallback", Channel, Callback);
    }

    function useEventCallbacks<ChannelType extends Channel.Channel<MainRegistrar>>(
        Record: Callback.EventRecord<ChannelType, MainRegistrar>
    ): void
    {
        WrapHook("useEventCallbacks", Record);
    }

    type ThisUseCallbackDeferredReturnType =
        ReturnType<Hook.Register.UseEventCallbackDeferred<MainRegistrar>>;
    function useEventCallbackDeferred(): ThisUseCallbackDeferredReturnType
    {
        return WrapHook("useEventCallbackDeferred") as ThisUseCallbackDeferredReturnType;
    }

    type ThisUseCallbacksDeferredReturnType =
        ReturnType<Hook.Register.UseEventCallbacksDeferred<MainRegistrar>>;
    function useEventCallbacksDeferred(): ThisUseCallbacksDeferredReturnType
    {
        return WrapHook("useEventCallbacksDeferred") as ThisUseCallbacksDeferredReturnType;
    }

    type ThisUseUnregisterCallbacksDeferredReturnType =
        ReturnType<Hook.Register.UseUnregisterCallbacksDeferred<MainRegistrar>>;
    function useUnregisterCallbacksDeferred(): ThisUseUnregisterCallbacksDeferredReturnType
    {
        return WrapHook("useUnregisterCallbacksDeferred") as ThisUseUnregisterCallbacksDeferredReturnType;
    }

    type ThisUseUnregisterCallbackDeferredReturnType =
        ReturnType<Hook.Register.UseUnregisterCallbackDeferred<MainRegistrar>>;
    function useUnregisterCallbackDeferred(): ThisUseUnregisterCallbackDeferredReturnType
    {
        return WrapHook("useUnregisterCallbackDeferred") as ThisUseUnregisterCallbackDeferredReturnType;
    }

    return {
        useEventCallback,
        useEventCallbackDeferred,
        // @ts-ignore @TODO Fix this.
        useEventCallbacks,
        useEventCallbacksDeferred,
        useSendEvent,
        useSendEventDeferred,
        useUnregisterCallbackDeferred,
        useUnregisterCallbacksDeferred
    } as const;
};
