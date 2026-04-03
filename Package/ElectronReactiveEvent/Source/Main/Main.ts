/* File:      Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// @TODO TEMPORARY.
/* eslint-disable jsdoc/require-jsdoc */

import { type IpcMain, type IpcMainEvent, type IpcMainInvokeEvent, ipcMain } from "electron";
import type { Callback } from "./Callback.Types";
import type { Channel } from "../Channel.Types";
import type { PackageKeys } from "../Internal";

type MainChannelOuter<PackageKey extends PackageKeys> = Channel.Any<PackageKey, "Main">;

export type IpcMainOnListener = (
    Event: IpcMainEvent,
    ...Arguments: Array<unknown>
) => void;

export type IpcMainHandleListener = (
    Event: IpcMainInvokeEvent,
    ...Arguments: Array<unknown>
) => unknown;

type HandleRegistration<PackageKey extends PackageKeys> =
    {
        Key: string;
        Callback: Callback<PackageKey, IpcMainInvokeEvent, MainChannelOuter<PackageKey>>;
    };

export type ReactiveIpcMainOptions =
    {
        allowMultipleCallbacksPerChannel?: boolean;
        throwOnCollision?: boolean;
    };

type MainCallbackOuter<
    PackageKey extends PackageKeys,
    ChannelType extends MainChannelOuter<PackageKey>
> = Callback<PackageKey, IpcMainEvent, ChannelType>;

type MainInvokeCallback<
    PackageKey extends PackageKeys,
    ChannelType extends MainChannelOuter<PackageKey>
> = Callback<PackageKey, IpcMainInvokeEvent, ChannelType>;

export type ReactiveIpcMainFunctionsWithKeys<PackageKey extends PackageKeys> =
    {
        RegisterOnListener<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Key: string,
            Callback: MainCallbackOuter<PackageKey, typeof Channel>
        ): void;

        UnregisterOnListener<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Key: string
        ): void;

        IsOnListenerRegistered<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Key: string
        ): boolean;

        RegisterHandleListener<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Key: string,
            Callback: MainInvokeCallback<PackageKey, typeof Channel>
        ): void;

        UnregisterHandleListener<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Key: string
        ): void;

        IsHandleListenerRegistered<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Key: string
        ): boolean;
    };

export type ReactiveIpcMainFunctionsNoKeys<PackageKey extends PackageKeys> =
    {
        RegisterOnListener<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Callback: MainCallbackOuter<PackageKey, typeof Channel>
        ): void;

        UnregisterOnListener<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType
        ): void;

        IsOnListenerRegistered<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType
        ): boolean;

        RegisterHandleListener<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Callback: MainInvokeCallback<PackageKey, typeof Channel>
        ): void;

        UnregisterHandleListener<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType
        ): void;

        IsHandleListenerRegistered<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType
        ): boolean;
    };

export type ReactiveIpcMainFunctionsSafe<PackageKey extends PackageKeys> =
    ReactiveIpcMainFunctionsWithKeys<PackageKey> &
    {
        RegisterOnListenerSafe<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Key: string,
            Callback: MainCallbackOuter<PackageKey, typeof Channel>
        ): void;

        RegisterHandleListenerSafe<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Key: string,
            Callback: MainInvokeCallback<PackageKey, typeof Channel>
        ): void;
    };

export type ReactiveIpcMainFunctionsNoKeysSafe<PackageKey extends PackageKeys> =
    ReactiveIpcMainFunctionsNoKeys<PackageKey> &
    {
        RegisterOnListenerSafe<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Callback: MainCallbackOuter<PackageKey, typeof Channel>
        ): void;

        RegisterHandleListenerSafe<ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Callback: MainInvokeCallback<PackageKey, typeof Channel>
        ): void;
    };

function IsIpcMainInstance(Value: unknown): Value is IpcMain
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate: Partial<IpcMain> = Value as Partial<IpcMain>;

    return (
        typeof Candidate.on === "function" &&
        typeof Candidate.off === "function" &&
        typeof Candidate.handle === "function" &&
        typeof Candidate.removeHandler === "function"
    );
}

type GetReactiveIpcMainReturnType<
    PackageKey extends PackageKeys,
    Options extends ReactiveIpcMainOptions | undefined,
    OverloadedArgument extends ReactiveIpcMainOptions | undefined | IpcMain = undefined
> =
    OverloadedArgument extends ReactiveIpcMainOptions
        ? GetReactiveIpcMainReturnType<PackageKey, Exclude<OverloadedArgument, IpcMain>>
        : Options extends object
            ? "allowMultipleCallbacksPerChannel" extends keyof Options
                ? Options["allowMultipleCallbacksPerChannel"] extends true
                    ? "throwOnCollision" extends keyof Options
                        ? Options["throwOnCollision"] extends true
                            ? ReactiveIpcMainFunctionsSafe<PackageKey>
                            : ReactiveIpcMainFunctionsWithKeys<PackageKey>
                        : ReactiveIpcMainFunctionsWithKeys<PackageKey>
                    : ReactiveIpcMainFunctionsNoKeys<PackageKey>
                : "throwOnCollision" extends keyof Options
                    ? Options["throwOnCollision"] extends true
                        ? ReactiveIpcMainFunctionsNoKeysSafe<PackageKey>
                        : ReactiveIpcMainFunctionsNoKeys<PackageKey>
                    : ReactiveIpcMainFunctionsNoKeys<PackageKey>
            : ReactiveIpcMainFunctionsNoKeys<PackageKey>;

// type OverloadedReturn<PackageKey extends PackageKeys> =
//     | ReactiveIpcMainFunctionsWithKeys<PackageKey>
//     | ReactiveIpcMainFunctionsSafe<PackageKey>;

// // ): ReactiveIpcMainFunctionsNoKeys<PackageKey>;
// export function getReactiveIpcMain<PackageKey extends PackageKeys>(
//     Options: ReactiveIpcMainOptions & { throwOnCollision?: false | undefined }
// ): GetReactiveIpcMainReturnType<PackageKey, typeof Options>;
// // ): ReactiveIpcMainFunctionsWithKeys<PackageKey>;
// export function getReactiveIpcMain<PackageKey extends PackageKeys>(
//     Options: ReactiveIpcMainOptions & { throwOnCollision: true }
// ): GetReactiveIpcMainReturnType<PackageKey, typeof Options>;
// // ): ReactiveIpcMainFunctionsSafe<PackageKey>;

export function getReactiveIpcMain<PackageKey extends PackageKeys>(
    Options?: ReactiveIpcMainOptions
): GetReactiveIpcMainReturnType<PackageKey, typeof Options>;
export function getReactiveIpcMain<PackageKey extends PackageKeys>(
    IpcMainInstance: IpcMain,
    Options?: ReactiveIpcMainOptions
): GetReactiveIpcMainReturnType<PackageKey, typeof Options>;
export function getReactiveIpcMain<PackageKey extends PackageKeys>(
    IpcMainOrOptions?: IpcMain | ReactiveIpcMainOptions,
    Options?: ReactiveIpcMainOptions
): GetReactiveIpcMainReturnType<PackageKey, typeof Options, typeof IpcMainOrOptions>
{
    type MainChannel = MainChannelOuter<PackageKey>;
    type MainCallback<ChannelType extends MainChannel> = MainCallbackOuter<PackageKey, ChannelType>;
    type InvokeCallback<ChannelType extends MainChannel> =
        Callback<PackageKey, IpcMainInvokeEvent, ChannelType>;
    type MainCallbackUnknown = MainCallback<MainChannel>;

    const EmptyKey: "EmptyKey" = "EmptyKey" as const;

    let IpcMainInstance: IpcMain = ipcMain;
    let ResolvedOptions: ReactiveIpcMainOptions | undefined = Options;

    if (IsIpcMainInstance(IpcMainOrOptions))
    {
        IpcMainInstance = IpcMainOrOptions;
    }
    else if (IpcMainOrOptions !== undefined)
    {
        ResolvedOptions = IpcMainOrOptions;
    }

    const AllowMultipleCallbacksPerChannel: boolean = (
        ResolvedOptions !== undefined &&
        "allowMultipleCallbacksPerChannel" in ResolvedOptions &&
        ResolvedOptions.allowMultipleCallbacksPerChannel === true
    );

    const ThrowOnCollision: boolean = (
        ResolvedOptions !== undefined &&
        "throwOnCollision" in ResolvedOptions &&
        ResolvedOptions.throwOnCollision === true
    );

    type CallbacksByChannel =
        Partial<{
            [ Key in MainChannel ]: Partial<Record<string, MainCallbackOuter<PackageKey, Key>>>;
        }>;

    type DispatchersByChannel =
        Partial<{
            [ Key in MainChannel ]:
                | MainCallbackUnknown
                | IpcMainOnListener;
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

        OnDispatchersByChannel[Channel] = Dispatcher;

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
            IpcMainInstance.off(Channel, Dispatcher as IpcMainOnListener);
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

    function IsOnListenerRegistered<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string
    ): boolean
    {
        return OnCallbacksByChannel[Channel]?.[Key] !== undefined;
    }

    function IsOnListenerRegisteredNoKeys<ChannelType extends MainChannel>(
        Channel: ChannelType
    ): boolean
    {
        return IsOnListenerRegistered(Channel, EmptyKey);
    }

    function IsHandleListenerRegistered<ChannelType extends MainChannel>(
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

    function IsHandleListenerRegisteredNoKeys<ChannelType extends MainChannel>(
        Channel: ChannelType
    ): boolean
    {
        return IsHandleListenerRegistered(Channel, EmptyKey);
    }

    function RegisterOnListener<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        const HasCollision: boolean = IsOnListenerRegistered(Channel, Key);

        if (HasCollision && ThrowOnCollision)
        {
            ThrowOnListenerCollisionError(Channel, Key);
        }

        if (OnCallbacksByChannel[Channel] === undefined)
        {
            OnCallbacksByChannel[Channel] = { };
        }

        EnsureOnDispatcher(Channel);

        OnCallbacksByChannel[Channel][Key] = Callback;
    }

    function RegisterOnListenerNoKeys<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        RegisterOnListener(Channel, EmptyKey, Callback);
    }

    function RegisterOnListenerSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        if (IsOnListenerRegistered(Channel, Key))
        {
            return;
        }

        RegisterOnListener(Channel, Key, Callback);
    }

    function RegisterOnListenerNoKeysSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: MainCallback<typeof Channel>
    ): void
    {
        RegisterOnListenerSafe(Channel, EmptyKey, Callback);
    }

    function UnregisterOnListener<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string
    ): void
    {
        const CallbacksForChannel: DispatchersByChannel | undefined =
            OnCallbacksByChannel[Channel];

        if (CallbacksForChannel === undefined)
        {
            return;
        }

        if ((CallbacksForChannel as Record<typeof Key, unknown>)[Key] === undefined)
        {
            return;
        }

        delete (CallbacksForChannel as Record<typeof Key, unknown>)[Key];

        RemoveOnDispatcherIfUnused(Channel);
    }

    function UnregisterOnListenerNoKeys<ChannelType extends MainChannel>(
        Channel: ChannelType
    ): void
    {
        UnregisterOnListener(Channel, EmptyKey);
    }

    function RegisterHandleListener<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: InvokeCallback<typeof Channel>
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
                Key
            };

        EnsureHandleDispatcher(Channel);
    }

    function RegisterHandleListenerNoKeys<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        RegisterHandleListener(Channel, EmptyKey, Callback);
    }

    function RegisterHandleListenerSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Key: string,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        if (HandleRegistrationsByChannel[Channel] !== undefined)
        {
            return;
        }

        RegisterHandleListener(Channel, Key, Callback);
    }

    function RegisterHandleListenerNoKeysSafe<ChannelType extends MainChannel>(
        Channel: ChannelType,
        Callback: InvokeCallback<typeof Channel>
    ): void
    {
        RegisterHandleListenerSafe(Channel, EmptyKey, Callback);
    }

    function UnregisterHandleListener<ChannelType extends MainChannel>(
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

    function UnregisterHandleListenerNoKeys<ChannelType extends MainChannel>(
        Channel: ChannelType
    ): void
    {
        UnregisterHandleListener(Channel, EmptyKey);
    }

    if (AllowMultipleCallbacksPerChannel)
    {
        if (ThrowOnCollision)
        {
            return {
                /* @ts-expect-error Foo. */
                IsHandleListenerRegistered,
                /* @ts-expect-error Foo. */
                IsOnListenerRegistered,
                /* @ts-expect-error Foo. */
                RegisterHandleListener,
                RegisterHandleListenerSafe,
                /* @ts-expect-error Foo. */
                RegisterOnListener,
                RegisterOnListenerSafe,
                /* @ts-expect-error Foo. */
                UnregisterHandleListener,
                /* @ts-expect-error Foo. */
                UnregisterOnListener
            };
        }
        else
        {
            return {
                /* @ts-expect-error Foo. */
                IsHandleListenerRegistered,
                /* @ts-expect-error Foo. */
                IsOnListenerRegistered,
                /* @ts-expect-error Foo. */
                RegisterHandleListener,
                /* @ts-expect-error Foo. */
                RegisterOnListener,
                /* @ts-expect-error Foo. */
                UnregisterHandleListener,
                /* @ts-expect-error Foo. */
                UnregisterOnListener
            };
        }
    }
    else
    {
        if (ThrowOnCollision)
        {
            return {
                IsHandleListenerRegistered: IsHandleListenerRegisteredNoKeys,
                IsOnListenerRegistered: IsOnListenerRegisteredNoKeys,
                RegisterHandleListener: RegisterHandleListenerNoKeys,
                /* @ts-expect-error Foo. */
                RegisterHandleListenerSafe: RegisterHandleListenerNoKeysSafe,
                RegisterOnListener: RegisterOnListenerNoKeys,
                RegisterOnListenerSafe: RegisterOnListenerNoKeysSafe,
                UnregisterHandleListener: UnregisterHandleListenerNoKeys,
                UnregisterOnListener: UnregisterOnListenerNoKeys
            };
        }
        else
        {
            return {
                IsHandleListenerRegistered: IsHandleListenerRegisteredNoKeys,
                IsOnListenerRegistered: IsOnListenerRegisteredNoKeys,
                RegisterHandleListener: RegisterHandleListenerNoKeys,
                RegisterOnListener: RegisterOnListenerNoKeys,
                UnregisterHandleListener: UnregisterHandleListenerNoKeys,
                UnregisterOnListener: UnregisterOnListenerNoKeys
            };
        }
    }
}
