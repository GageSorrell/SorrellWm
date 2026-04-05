/* File:      Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

/* eslint-disable jsdoc/require-jsdoc */

import type { BrowserWindow, IpcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { EmptyRequestParameter, GetSendResponseChannel } from "../Callback/Callback.js";
import type { EmptyRequestParameterType, Request } from "../Callback/Callback.Types.js";
import type { MainCallback as MainCallbackBase, MainInvokeResponse } from "./Callback.Types.js";
import type { MainOwner, RendererOwner } from "../Decl.Types.js";
import type { Channel } from "../Channel.Types.js";
import type { PackageKeys } from "../Internal/index.js";
import type { RequestOverloadSafe } from "../Callback/Internal.Types.js";
import { ipcMain } from "electron";

type RendererChannelOuter<PackageKey extends PackageKeys> = Channel.Any<PackageKey, RendererOwner>;

type MainCallbackOuter<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannelOuter<PackageKey>
> = MainCallbackBase<PackageKey, IpcMainEvent, ChannelType>;

type MainInvokeCallback<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannelOuter<PackageKey>
> = MainCallbackBase<PackageKey, IpcMainInvokeEvent, ChannelType>;

type IpcMainOnListener = (
    Event: IpcMainEvent,
    ...Arguments: Array<unknown>
) => void;

type IpcMainHandleListener = (
    Event: IpcMainInvokeEvent,
    ...Arguments: Array<unknown>
) => unknown;

type HandleRegistration<PackageKey extends PackageKeys> =
    {
        Key: string;
        Once: boolean;
        Callback: MainCallbackBase<PackageKey, IpcMainInvokeEvent, RendererChannelOuter<PackageKey>>;
    };

type ListenerRegistration<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannelOuter<PackageKey>
> =
    {
        Once: boolean;
        Callback:
            | MainCallbackBase<PackageKey, IpcMainEvent, ChannelType>
            | IpcMainOnListener;
    };

type ReactiveIpcMainOptionsKeyedSafe =
    {
        /**
         * The default behavior allows at most one callback per channel to be registered
         * at any given point in time.  Specifying this property and setting it to `true`
         * will extend the functions to register callbacks to also accept a `Key: string`
         * argument, which is used for identifying callback functions.
         *
         * @default `false`
         */
        allowMultipleCallbacksPerChannel: true;
        ipcMain?: IpcMain;
        /**
         * If set to `true`, then if a callback is attempted to be registered for a given
         * `Channel` and `Key` for which another callback is already registered, then an
         * error will be thrown.
         *
         * In addition to the functions that are already returned for registering callbacks,
         * if this option is set to `true`, then additional `*Safe` functions will also be returned.
         * These `*Safe` functions are no-ops in the case of attempting to register a callback
         * for a `Channel` and `Key` for which a callback is already registered.
         *
         * @default `false`
         */
        throwOnCollision: true;
    };

type ReactiveIpcMainOptionsNotKeyedSafe =
    | {
        /**
         * The default behavior allows at most one callback per channel to be registered
         * at any given point in time.  Specifying this property and setting it to `true`
         * will extend the functions to register callbacks to also accept a `Key: string`
         * argument, which is used for identifying callback functions.
         *
         * @default `false`
         */
        allowMultipleCallbacksPerChannel: false;
        ipcMain?: IpcMain;
        /**
         * If set to `true`, then if a callback is attempted to be registered for a given
         * `Channel` and `Key` for which another callback is already registered, then an
         * error will be thrown.
         *
         * In addition to the functions that are already returned for registering callbacks,
         * if this option is set to `true`, then additional `*Safe` functions will also be returned.
         * These `*Safe` functions are no-ops in the case of attempting to register a callback
         * for a `Channel` and `Key` for which a callback is already registered.
         *
         * @default `false`
         */
        throwOnCollision: true;
    }
    | {
        ipcMain?: IpcMain;
        /**
         * If set to `true`, then if a callback is attempted to be registered for a given
         * `Channel` and `Key` for which another callback is already registered, then an
         * error will be thrown.
         *
         * In addition to the functions that are already returned for registering callbacks,
         * if this option is set to `true`, then additional `*Safe` functions will also be returned.
         * These `*Safe` functions are no-ops in the case of attempting to register a callback
         * for a `Channel` and `Key` for which a callback is already registered.
         *
         * @default `false`
         */
        throwOnCollision: true;
    };

type ReactiveIpcMainOptionsKeyed =
    | {
        /**
         * The default behavior allows at most one callback per channel to be registered
         * at any given point in time.  Specifying this property and setting it to `true`
         * will extend the functions to register callbacks to also accept a `Key: string`
         * argument, which is used for identifying callback functions.
         *
         * @default `false`
         */
        allowMultipleCallbacksPerChannel: true;
        ipcMain?: IpcMain;
        /**
         * If set to `true`, then if a callback is attempted to be registered for a given
         * `Channel` and `Key` for which another callback is already registered, then an
         * error will be thrown.
         *
         * In addition to the functions that are already returned for registering callbacks,
         * if this option is set to `true`, then additional `*Safe` functions will also be returned.
         * These `*Safe` functions are no-ops in the case of attempting to register a callback
         * for a `Channel` and `Key` for which a callback is already registered.
         *
         * @default `false`
         */
        throwOnCollision: false;
    }
    | {
        /**
         * The default behavior allows at most one callback per channel to be registered
         * at any given point in time.  Specifying this property and setting it to `true`
         * will extend the functions to register callbacks to also accept a `Key: string`
         * argument, which is used for identifying callback functions.
         *
         * @default `false`
         */
        allowMultipleCallbacksPerChannel: true;
        ipcMain?: IpcMain;
    };

type ReactiveIpcMainOptionsNotKeyed =
    | {
        /**
         * The default behavior allows at most one callback per channel to be registered
         * at any given point in time.  Specifying this property and setting it to `true`
         * will extend the functions to register callbacks to also accept a `Key: string`
         * argument, which is used for identifying callback functions.
         *
         * @default `false`
         */
        allowMultipleCallbacksPerChannel: false;

        /** The custom `IpcMain` instance, if you are using one. */
        ipcMain?: IpcMain;

        /**
         * If set to `true`, then if a callback is attempted to be registered for a given
         * `Channel` and `Key` for which another callback is already registered, then an
         * error will be thrown.
         *
         * In addition to the functions that are already returned for registering callbacks,
         * if this option is set to `true`, then additional `*Safe` functions will also be returned.
         * These `*Safe` functions are no-ops in the case of attempting to register a callback
         * for a `Channel` and `Key` for which a callback is already registered.
         *
         * @default `false`
         */
        throwOnCollision: false;
    }
    | {
        ipcMain?: IpcMain;
        /**
         * If set to `true`, then if a callback is attempted to be registered for a given
         * `Channel` and `Key` for which another callback is already registered, then an
         * error will be thrown.
         *
         * In addition to the functions that are already returned for registering callbacks,
         * if this option is set to `true`, then additional `*Safe` functions will also be returned.
         * These `*Safe` functions are no-ops in the case of attempting to register a callback
         * for a `Channel` and `Key` for which a callback is already registered.
         *
         * @default `false`
         */
        throwOnCollision: false;
    }
    | {
        /**
         * The default behavior allows at most one callback per channel to be registered
         * at any given point in time.  Specifying this property and setting it to `true`
         * will extend the functions to register callbacks to also accept a `Key: string`
         * argument, which is used for identifying callback functions.
         *
         * @default `false`
         */
        allowMultipleCallbacksPerChannel: false;
        ipcMain?: IpcMain;
    }
    | {
        ipcMain?: IpcMain;
    };

export type ReactiveIpcMainOptions =
    | ReactiveIpcMainOptionsKeyed
    | ReactiveIpcMainOptionsKeyedSafe
    | ReactiveIpcMainOptionsNotKeyed
    | ReactiveIpcMainOptionsNotKeyedSafe;

export type Invoke<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.NoRequest<PackageKey, MainOwner>>(
            browserWindows: BrowserWindow | Array<BrowserWindow>,
            channel: ChannelType
        ): Promise<MainInvokeResponse<PackageKey, ChannelType, typeof browserWindows>>;

        <ChannelType extends Channel.Request<PackageKey, MainOwner>>(
            browserWindows: BrowserWindow | Array<BrowserWindow>,
            channel: ChannelType,
            request: Request<PackageKey, MainOwner, ChannelType>
        ): Promise<MainInvokeResponse<PackageKey, ChannelType, typeof browserWindows>>;
    };

export namespace Keyed
{
    export type On<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Key: string,
                Callback: MainCallbackOuter<PackageKey, typeof Channel>
            ): void;
        };

    export type Off<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Key: string
            ): void;
        };

    export type HasListener<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Key?: string
            ): boolean;
        };

    export type HasHandler<PackageKey extends PackageKeys> = HasListener<PackageKey>;

    export type Once<PackageKey extends PackageKeys> = On<PackageKey>;

    export type Handle<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Key: string,
                Callback: MainInvokeCallback<PackageKey, typeof Channel>
            ): void;
        };

    export type HandleOnce<PackageKey extends PackageKeys> = Handle<PackageKey>;

    export type RemoveHandler<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Key: string
            ): void;
        };

    export type RemoveAllListeners<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                channel?: ChannelType
            ): void;
        };

    export type ReactiveIpcMainFunctions<PackageKey extends PackageKeys> =
        {
            handle: Handle<PackageKey>;
            handleOnce: HandleOnce<PackageKey>;
            removeHandler: RemoveHandler<PackageKey>;

            addListener: On<PackageKey>;
            removeListener: Off<PackageKey>;
            removeAllListeners: RemoveAllListeners<PackageKey>;

            off: Off<PackageKey>;
            on: On<PackageKey>;
            once: Once<PackageKey>;

            hasListener: HasListener<PackageKey>;
            hasHandler: HasHandler<PackageKey>;

            send: Invoke<PackageKey>;
        };

    export type AddListenerSafe<PackageKey extends PackageKeys> = On<PackageKey>;
    export type OnSafe<PackageKey extends PackageKeys> = On<PackageKey>;
    export type HandleSafe<PackageKey extends PackageKeys> = Handle<PackageKey>;
    export type HandleOnceSafe<PackageKey extends PackageKeys> = Handle<PackageKey>;

    export type SafePart<PackageKey extends PackageKeys> =
        {
            addListenerSafe: AddListenerSafe<PackageKey>;
            onSafe: OnSafe<PackageKey>;
            handleSafe: HandleSafe<PackageKey>;
            handleOnceSafe: HandleSafe<PackageKey>;
        };

    export type ReactiveIpcMainFunctionsSafe<PackageKey extends PackageKeys> =
        ReactiveIpcMainFunctions<PackageKey> &
        SafePart<PackageKey>;
}

export namespace NotKeyed
{
    export type On<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Callback: MainCallbackOuter<PackageKey, typeof Channel>
            ): void;
        };

    export type Off<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType,
            ): void;
        };

    export type HasListener<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType
            ): boolean;
        };

    export type HasHandler<PackageKey extends PackageKeys> = HasListener<PackageKey>;

    export type Once<PackageKey extends PackageKeys> = On<PackageKey>;

    export type Handle<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Callback: MainInvokeCallback<PackageKey, typeof Channel>
            ): void;
        };

    export type HandleOnce<PackageKey extends PackageKeys> = Handle<PackageKey>;

    export type RemoveHandler<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel: ChannelType
            ): void;
        };

    export type RemoveAllListeners<PackageKey extends PackageKeys> =
        {
            <ChannelType extends RendererChannelOuter<PackageKey>>(
                Channel?: ChannelType
            ): void;
        };

    export type ReactiveIpcMainFunctions<PackageKey extends PackageKeys> =
        {
            handle: Handle<PackageKey>;
            handleOnce: HandleOnce<PackageKey>;
            removeHandler: RemoveHandler<PackageKey>;

            addListener: On<PackageKey>;
            removeListener: Off<PackageKey>;
            removeAllListeners: RemoveAllListeners<PackageKey>;

            off: Off<PackageKey>;
            on: On<PackageKey>;
            once: Once<PackageKey>;

            hasListener: HasListener<PackageKey>;
            hasHandler: HasHandler<PackageKey>;

            send: Invoke<PackageKey>;
        };

    export type AddListenerSafe<PackageKey extends PackageKeys> = On<PackageKey>;
    export type OnSafe<PackageKey extends PackageKeys> = On<PackageKey>;
    export type HandleSafe<PackageKey extends PackageKeys> = Handle<PackageKey>;
    export type HandleOnceSafe<PackageKey extends PackageKeys> = Handle<PackageKey>;

    export type SafePart<PackageKey extends PackageKeys> =
        {
            addListenerSafe: AddListenerSafe<PackageKey>;
            onSafe: OnSafe<PackageKey>;
            handleSafe: HandleSafe<PackageKey>;
            handleOnceSafe: HandleSafe<PackageKey>;
        };

    export type ReactiveIpcMainFunctionsSafe<PackageKey extends PackageKeys> =
        ReactiveIpcMainFunctions<PackageKey> &
        SafePart<PackageKey>;
}

function TryGetCustomIpcMain(Options: ReactiveIpcMainOptions | undefined): IpcMain
{
    if (typeof Options === "object" && Options !== null && "ipcMain" in Options)
    {
        const Candidate: Partial<IpcMain> = Options.ipcMain as Partial<IpcMain>;

        const LikelyMatches: boolean = (
            typeof Candidate.on === "function" &&
            typeof Candidate.off === "function" &&
            typeof Candidate.handle === "function" &&
            typeof Candidate.removeHandler === "function"
        );

        return LikelyMatches
            ? Candidate as IpcMain
            : ipcMain;
    }

    return ipcMain;
}

type ReactiveIpcMainFunctions<
    PackageKey extends PackageKeys,
    OptionsType extends ReactiveIpcMainOptions | undefined
> =
    OptionsType extends undefined
        ? NotKeyed.ReactiveIpcMainFunctions<PackageKey>
        : OptionsType extends ReactiveIpcMainOptionsKeyed
            ? Keyed.ReactiveIpcMainFunctions<PackageKey>
            : OptionsType extends ReactiveIpcMainOptionsKeyedSafe
                ? Keyed.ReactiveIpcMainFunctionsSafe<PackageKey>
                : OptionsType extends ReactiveIpcMainOptionsNotKeyed
                    ? NotKeyed.ReactiveIpcMainFunctions<PackageKey>
                    : OptionsType extends ReactiveIpcMainOptionsNotKeyedSafe
                        ? NotKeyed.ReactiveIpcMainFunctionsSafe<PackageKey>
                        : never;

export function getReactiveIpcMain<PackageKey extends PackageKeys>(
): NotKeyed.ReactiveIpcMainFunctions<PackageKey>;
export function getReactiveIpcMain<PackageKey extends PackageKeys>(
    Options: ReactiveIpcMainOptionsNotKeyed
): NotKeyed.ReactiveIpcMainFunctions<PackageKey>;
export function getReactiveIpcMain<PackageKey extends PackageKeys>(
    Options: ReactiveIpcMainOptionsNotKeyedSafe
): NotKeyed.ReactiveIpcMainFunctionsSafe<PackageKey>;
export function getReactiveIpcMain<PackageKey extends PackageKeys>(
    Options: ReactiveIpcMainOptionsKeyedSafe
): Keyed.ReactiveIpcMainFunctionsSafe<PackageKey>;
export function getReactiveIpcMain<PackageKey extends PackageKeys>(
    Options: ReactiveIpcMainOptionsKeyed
): Keyed.ReactiveIpcMainFunctions<PackageKey>;
export function getReactiveIpcMain<PackageKey extends PackageKeys>(
    Options?: ReactiveIpcMainOptions
): ReactiveIpcMainFunctions<PackageKey, typeof Options>
{
    type MainChannel = RendererChannelOuter<PackageKey>;
    type MainCallback<ChannelType extends MainChannel> = MainCallbackOuter<PackageKey, ChannelType>;
    type InvokeCallback<ChannelType extends MainChannel> =
        MainCallbackBase<PackageKey, IpcMainInvokeEvent, ChannelType>;

    const EmptyKey: "EmptyKey" = "EmptyKey" as const;

    const IpcMainInstance: IpcMain = TryGetCustomIpcMain(Options);

    const ThrowOnCollision: boolean = (
        Options !== undefined &&
        "throwOnCollision" in Options &&
        Options.throwOnCollision === true
    );

    type CallbacksByChannel =
        Partial<{
            [ Key in MainChannel ]: Partial<Record<string, ListenerRegistration<PackageKey, Key>>>;
        }>;

    type DispatchersByChannel =
        Partial<{
            [ Key in MainChannel ]: ListenerRegistration<PackageKey, Key>;
        }>;

    const OnCallbacksByChannel: CallbacksByChannel = { };

    const OnDispatchersByChannel: DispatchersByChannel = { };

    type HandleRegistrationRecord = Record<string, HandleRegistration<PackageKey>>;
    const HandleRegistrationsByChannel: HandleRegistrationRecord = { };

    type HandleDispatchersByChannel =
        Partial<{
            [ Key in MainChannel ]: IpcMainHandleListener;
        }>;

    const HandleDispatchersByChannel: HandleDispatchersByChannel = { };

    function ThrowOnListenerCollisionError<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string
    ): never
    {
        // @TODO Replace with custom error class.
        /* eslint-disable-next-line @stylistic/max-len */
        throw new Error(`An ipcMain.on callback is already registered for channel "${ Channel }" and key "${ Key }".`);
    }

    function ThrowHandleListenerCollisionError<ChannelType extends MainChannel>(
        Channel: ChannelType,
        ExistingKey: string,
        IncomingKey: string
    ): never
    {
        // @TODO Replace with custom error class.
        /* eslint-disable-next-line @stylistic/max-len */
        throw new Error(`An ipcMain.handle callback is already registered for channel "${ Channel }". Existing key: "${ ExistingKey }". Incoming key: "${ IncomingKey }".`);
    }

    function EnsureOnDispatcher<ChannelType extends MainChannel>(Channel: ChannelType): void
    {
        if (OnDispatchersByChannel[Channel] !== undefined)
        {
            return;
        }

        const Dispatcher: IpcMainOnListener = (
            Event: IpcMainEvent,
            ...Arguments: Array<unknown>
        ): void =>
        {
            const CallbacksForChannel: DispatchersByChannel | undefined =
                OnCallbacksByChannel[Channel];

            if (CallbacksForChannel === undefined)
            {
                return;
            }

            for (const Callback of Object.values(CallbacksForChannel))
            {
                (Callback as IpcMainOnListener)(Event, ...Arguments);
            }
        };

        OnDispatchersByChannel[Channel] =
            {
                Callback: Dispatcher,
                Once: false
            };

        IpcMainInstance.on(Channel, Dispatcher);
    }

    function RemoveOnDispatcherIfUnused<ChannelType extends MainChannel>(Channel: ChannelType): void
    {
        const CallbacksForChannel: DispatchersByChannel | undefined =
            OnCallbacksByChannel[Channel];

        if (
            CallbacksForChannel !== undefined &&
            Object.keys(CallbacksForChannel).length > 0
        )
        {
            return;
        }

        type ThisDispatcher = typeof OnDispatchersByChannel[typeof Channel];
        const Dispatcher: ThisDispatcher | undefined = OnDispatchersByChannel[Channel];

        if (Dispatcher !== undefined)
        {
            IpcMainInstance.off(Channel, Dispatcher.Callback as IpcMainOnListener);
            delete OnDispatchersByChannel[Channel];
        }

        delete OnCallbacksByChannel[Channel];
    }

    function EnsureHandleDispatcher<ChannelType extends MainChannel>(Channel: ChannelType): void
    {
        if (HandleDispatchersByChannel[Channel] !== undefined)
        {
            return;
        }

        const Dispatcher: IpcMainHandleListener = async (
            Event: IpcMainInvokeEvent,
            ...Arguments: Array<unknown>
        ): Promise<unknown> =>
        {
            const Registration: HandleRegistration<PackageKey> | undefined =
                HandleRegistrationsByChannel[Channel];

            if (Registration === undefined)
            {
                throw new Error(`No handler is registered for channel "${ Channel }".`);
            }

            /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
            return await (Registration.Callback as Function)(Event, ...Arguments);
        };

        HandleDispatchersByChannel[Channel] = Dispatcher;

        IpcMainInstance.handle(Channel, Dispatcher);
    }

    function RemoveHandleDispatcherIfUnused<ChannelType extends MainChannel>(Channel: ChannelType): void
    {
        const Registration: HandleRegistration<PackageKey> | undefined =
            HandleRegistrationsByChannel[Channel];

        if (Registration !== undefined)
        {
            return;
        }

        if (HandleDispatchersByChannel[Channel] !== undefined)
        {
            IpcMainInstance.removeHandler(Channel);
            delete HandleDispatchersByChannel[Channel];
        }
    }

    // handle: Handle<PackageKey>;
    // handleOnce: HandleOnce<PackageKey>;
    // removeHandler: RemoveHandler<PackageKey>;

    // addListener: On<PackageKey>;
    // removeListener: Off<PackageKey>;
    // removeAllListeners: RemoveAllListeners<PackageKey>;

    // off: Off<PackageKey>;
    // on: On<PackageKey>;
    // once: Once<PackageKey>;

    // hasListener: HasListener<PackageKey>;

    function hasListenerKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string
    ): boolean
    {
        return OnCallbacksByChannel[Channel]?.[Key] !== undefined;
    }

    function hasListenerNotKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType
    ): boolean
    {
        return hasListenerKeyed(Channel, EmptyKey);
    }

    function hasHandlerKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string
    ): boolean
    {
        const Registration: HandleRegistration<PackageKey> | undefined =
            HandleRegistrationsByChannel[Channel];

        if (Registration === undefined)
        {
            return false;
        }

        return Registration.Key === Key;
    }

    function hasHandlerNotKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType
    ): boolean
    {
        return hasHandlerKeyed(Channel, EmptyKey);
    }

    function onKeyedBase<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: MainCallback<typeof Channel>,
        Once: boolean
    ): void
    {
        const HasCollision: boolean = hasListenerKeyed(Channel, Key);

        if (HasCollision && ThrowOnCollision)
        {
            ThrowOnListenerCollisionError(Channel, Key);
        }

        if (OnCallbacksByChannel[Channel] === undefined)
        {
            OnCallbacksByChannel[Channel] = { };
        }

        EnsureOnDispatcher(Channel);

        OnCallbacksByChannel[Channel][Key] =
            {
                Callback,
                Once
            };
    }

    function onceKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        onKeyedBase(Channel, Key, Callback, true);
    }

    function onceNotKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        onceKeyed(Channel, EmptyKey, Callback);
    }

    function onceKeyedSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        if (hasListenerKeyed(Channel, Key))
        {
            return;
        }

        onceKeyed(Channel, EmptyKey, Callback);
    }

    function onceNotKeyedSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        onceKeyedSafe(Channel, EmptyKey, Callback);
    }

    function onKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        onKeyedBase(Channel, Key, Callback, false);
    }

    function onNotKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        onKeyed(Channel, EmptyKey, Callback);
    }

    function onKeyedSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        if (hasListenerKeyed(Channel, Key))
        {
            return;
        }

        onKeyed(Channel, Key, Callback);
    }

    function onNotKeyedSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        onKeyedSafe(Channel, EmptyKey, Callback);
    }

    function offBase<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key?: string
    ): void
    {
        const DeleteKey = (InKey: string): void =>
        {
            const CallbacksForChannel: DispatchersByChannel | undefined =
                OnCallbacksByChannel[Channel];

            if (CallbacksForChannel === undefined)
            {
                return;
            }

            if ((CallbacksForChannel as Record<typeof InKey, unknown>)[InKey] === undefined)
            {
                return;
            }

            delete (CallbacksForChannel as Record<typeof InKey, unknown>)[InKey];
        };

        if (Key !== undefined)
        {
            DeleteKey(Key);
        }
        else if (OnCallbacksByChannel[Channel] !== undefined)
        {
            const Keys: Array<string> = Object.keys(OnCallbacksByChannel[Channel]);
            Keys.forEach(DeleteKey);
        }

        RemoveOnDispatcherIfUnused(Channel);
    }

    function offKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string
    ): void
    {
        offBase(Channel, Key);
    }

    function removeAllListeners<ChannelType extends MainChannel>(
        Channel?: ChannelType
    ): void
    {
        if (Channel !== undefined)
        {
            offBase(Channel);
        }
        else
        {
            const Channels: Array<string> = Object.keys(OnCallbacksByChannel);
            const OffBase = (Channel: string): void => offBase(Channel as MainChannel);
            Channels.forEach(OffBase);
        }
    }

    function offNotKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType
    ): void
    {
        offKeyed(Channel, EmptyKey);
    }

    function handleKeyedBase<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: InvokeCallback<typeof Channel>,
        Once: boolean
    ): void
    {
        const ExistingRegistration: HandleRegistration<PackageKey> | undefined =
            HandleRegistrationsByChannel[Channel];

        if (ExistingRegistration !== undefined && ThrowOnCollision)
        {
            ThrowHandleListenerCollisionError(
                Channel,
                ExistingRegistration.Key,
                Key
            );
        }

        HandleRegistrationsByChannel[Channel] =
            {
                Callback,
                Key,
                Once
            };

        EnsureHandleDispatcher(Channel);
    }

    function handleKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        handleKeyedBase(Channel, Key, Callback, false);
    }

    function handleOnceKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        handleKeyedBase(Channel, Key, Callback, true);
    }

    function handleOnceNotKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        handleKeyedBase(Channel, EmptyKey, Callback, true);
    }

    function handleOnceKeyedSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        if (HandleRegistrationsByChannel[Channel] !== undefined)
        {
            return;
        }

        handleKeyedBase(Channel, Key, Callback, true);
    }

    function handleOnceNotKeyedSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        if (HandleRegistrationsByChannel[Channel] !== undefined)
        {
            return;
        }

        handleKeyedBase(Channel, EmptyKey, Callback, true);
    }

    function handleNotKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        handleKeyed(Channel, EmptyKey, Callback);
    }

    function handleKeyedSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        if (HandleRegistrationsByChannel[Channel] !== undefined)
        {
            return;
        }

        handleKeyed(Channel, Key, Callback);
    }

    function handleNotKeyedSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        handleKeyedSafe(Channel, EmptyKey, Callback);
    }

    function removeHandlerKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string
    ): void
    {
        const ExistingRegistration: HandleRegistration<PackageKey> | undefined =
            HandleRegistrationsByChannel[Channel];

        if (ExistingRegistration === undefined)
        {
            return;
        }

        if (ExistingRegistration.Key !== Key)
        {
            return;
        }

        delete HandleRegistrationsByChannel[Channel];

        RemoveHandleDispatcherIfUnused(Channel);
    }

    function removeHandlerNotKeyed<ChannelType extends MainChannel>(
        Channel: ChannelType
    ): void
    {
        removeHandlerKeyed(Channel, EmptyKey);
    }

    /**
     * @TODO Remove the use of `GetSendResponseChannel` and associated
     * "invoke/handler-reverse" behavior.
     */
    async function send<ChannelType extends Channel.NoRequest<PackageKey, MainOwner>>(
        browserWindows: BrowserWindow | Array<BrowserWindow>,
        channel: ChannelType
    ): Promise<MainInvokeResponse<PackageKey, ChannelType, typeof browserWindows>>;
    async function send<ChannelType extends Channel.Request<PackageKey, MainOwner>>(
        browserWindows: BrowserWindow | Array<BrowserWindow>,
        channel: ChannelType,
        request: Request<PackageKey, MainOwner, typeof channel>
    ): Promise<MainInvokeResponse<PackageKey, ChannelType, typeof browserWindows>>;
    async function send<ChannelType extends MainChannel>(
        browserWindows: BrowserWindow | Array<BrowserWindow>,
        channel: ChannelType,
        request:
            | RequestOverloadSafe<PackageKey, MainOwner, typeof channel>
            | EmptyRequestParameterType = EmptyRequestParameter
    ): Promise<MainInvokeResponse<PackageKey, ChannelType, typeof browserWindows>>
    {
        type ThisReturnType = MainInvokeResponse<PackageKey, ChannelType, typeof browserWindows>;
        type ThisReturnTypeElement = ThisReturnType extends Array<infer ElementType>
            ? ElementType
            : ThisReturnType;

        const BrowserWindows: Array<BrowserWindow> = Array.isArray(browserWindows)
            ? browserWindows
            : [ browserWindows ];

        const ArgumentVector: Array<unknown> = request === EmptyRequestParameter
            ? [ ]
            : [ request ];

        const InvokeToBrowserWindow = (BrowserWindow: BrowserWindow): Promise<ThisReturnTypeElement> =>
        {
            type ResolveFunction = (Value: ThisReturnTypeElement) => void;
            type RejectFunction = (...ArgumentVector: Array<unknown>) => void;
            return new Promise<ThisReturnTypeElement>((
                Resolve: ResolveFunction,
                _Reject: RejectFunction
            ): void =>
            {
                IpcMainInstance.on(
                    GetSendResponseChannel(channel),
                    (_Event: IpcMainEvent, ...ArgumentVector: Array<unknown>): void =>
                    {
                        Resolve(ArgumentVector[0] as ThisReturnTypeElement);
                    }
                );

                BrowserWindow.webContents.send(channel, ...ArgumentVector);
            });
        };

        if (Array.isArray(browserWindows))
        {
            if (browserWindows.length === 0)
            {
                // @TODO Error handling.
            }

            const InvokePromises: Array<Promise<ThisReturnTypeElement>> =
                BrowserWindows.map(InvokeToBrowserWindow);

            return Promise.all(InvokePromises) as Promise<ThisReturnType>;
        }
        else
        {
            return InvokeToBrowserWindow(browserWindows) as Promise<ThisReturnType>;
        }
    }

    if (Options === undefined)
    {
        const Out: NotKeyed.ReactiveIpcMainFunctions<PackageKey> =
            {
            } as NotKeyed.ReactiveIpcMainFunctions<PackageKey>;

        return Out;
    }
    if (AreOptionsKeyed(Options))
    {
        const Out: Keyed.ReactiveIpcMainFunctions<PackageKey> =
            {
                addListener: onKeyed,
                handle: handleKeyed,
                handleOnce: handleOnceKeyed,
                hasHandler: hasHandlerKeyed,
                hasListener: hasListenerKeyed,
                off: offKeyed,
                on: onKeyed,
                once: onceKeyed,
                removeAllListeners,
                removeHandler: removeHandlerKeyed,
                removeListener: offKeyed
            } as Keyed.ReactiveIpcMainFunctions<PackageKey>;

        return Out;
    }
    else if (AreOptionsKeyedSafe(Options))
    {
        const Out: Keyed.ReactiveIpcMainFunctionsSafe<PackageKey> =
            {
                addListener: onKeyed,
                addListenerSafe: onKeyedSafe,
                handle: handleKeyedSafe,
                handleOnce: handleOnceKeyedSafe,
                handleOnceSafe: handleOnceKeyedSafe,
                handleSafe: handleKeyedSafe,
                hasHandler: hasHandlerKeyed,
                hasListener: hasListenerKeyed,
                off: offKeyed,
                on: onKeyed,
                onSafe: onKeyedSafe,
                once: onceKeyed,
                onceSafe: onceKeyedSafe,
                removeAllListeners,
                removeHandler: removeHandlerKeyed,
                removeListener: offKeyed,
                send
            } as Keyed.ReactiveIpcMainFunctionsSafe<PackageKey>;

        return Out;
    }
    else if (AreOptionsNotKeyed(Options))
    {
        const Out: NotKeyed.ReactiveIpcMainFunctions<PackageKey> =
            {
                addListener: onNotKeyed,
                handle: handleNotKeyed,
                handleOnce: handleOnceNotKeyed,
                hasHandler: hasHandlerNotKeyed,
                hasListener: hasListenerNotKeyed,
                off: offNotKeyed,
                on: onNotKeyed,
                once: onceNotKeyed,
                removeAllListeners,
                removeHandler: removeHandlerNotKeyed,
                removeListener: offNotKeyed
            } as NotKeyed.ReactiveIpcMainFunctions<PackageKey>;

        return Out;
    }
    else if (AreOptionsNotKeyedSafe(Options))
    {
        const Out: NotKeyed.ReactiveIpcMainFunctionsSafe<PackageKey> =
            {
                addListener: onNotKeyed,
                addListenerSafe: onNotKeyedSafe,
                handle: handleNotKeyed,
                handleOnce: handleOnceNotKeyed,
                handleOnceSafe: handleOnceNotKeyedSafe,
                handleSafe: handleNotKeyedSafe,
                hasHandler: hasHandlerNotKeyed,
                hasListener: hasListenerNotKeyed,
                off: offNotKeyed,
                on: onNotKeyed,
                onSafe: onNotKeyedSafe,
                once: onceNotKeyed,
                onceSafe: onceNotKeyedSafe,
                removeAllListeners,
                removeHandler: removeHandlerNotKeyed,
                removeListener: offNotKeyed,
                send
            } as NotKeyed.ReactiveIpcMainFunctionsSafe<PackageKey>;

        return Out;
    }
    else
    {
        throw new Error("oh no.");
    }
}

function IsKeyed(In: ReactiveIpcMainOptions | undefined): boolean
{
    return (
        typeof In === "object" &&
        In !== null &&
        "allowMultipleCallbacksPerChannel" in In &&
        In.allowMultipleCallbacksPerChannel === true
    );
}

function IsSafe(In: ReactiveIpcMainOptions | undefined): boolean
{
    return (
        typeof In === "object" &&
        In !== null &&
        "throwOnCollision" in In &&
        In.throwOnCollision === true
    );
}

function AreOptionsKeyed(
    In: ReactiveIpcMainOptions | undefined
): In is ReactiveIpcMainOptionsKeyed
{
    return IsKeyed(In) && !IsSafe(In);
}

function AreOptionsKeyedSafe(
    In: ReactiveIpcMainOptions | undefined
): In is ReactiveIpcMainOptionsKeyedSafe
{
    return IsKeyed(In) && IsSafe(In);
}

function AreOptionsNotKeyed(
    In: ReactiveIpcMainOptions | undefined
): In is ReactiveIpcMainOptionsNotKeyed
{
    return !IsKeyed(In) && !IsSafe(In);
}

function AreOptionsNotKeyedSafe(
    In: ReactiveIpcMainOptions | undefined
): In is ReactiveIpcMainOptionsNotKeyedSafe
{
    return !IsKeyed(In) && IsSafe(In);
}
