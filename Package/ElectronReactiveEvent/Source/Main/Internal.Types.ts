/* File:      Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";
import type { Callback } from "./Callback.Types";
import type { Channel } from "../Channel.Types";
import type { MainOwner } from "../Decl.Types";
import type { PackageKeys } from "../Internal";
import type { ReactiveMainOptions } from "./Main.Types";

export type RemoveHandler<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Any<PackageKey, MainOwner>>(
            Channel: ChannelType
        ): void;
    };

export type GetAllowMultipleCallbacksPerChannel<Options extends ReactiveMainOptions> =
    "allowMultipleCallbacksPerChannel" extends keyof Options
        ? Options["allowMultipleCallbacksPerChannel"] extends undefined
            ? false
            : Options["allowMultipleCallbacksPerChannel"]
        : false;

export type MainFunctionsBase<PackageKey extends PackageKeys> =
    {
        removeHandler: RemoveHandler<PackageKey>;
    };

export type MainHandleCallbacksPlural<PackageKey extends PackageKeys> =
    {
        addListener: On<PackageKey, true>;
        handle: Handle<PackageKey,  true>;
        handleOnce: Handle<PackageKey, true>;
        off: Off<PackageKey, true>;
        on: On<PackageKey, true>;
        once: On<PackageKey, true>;
        removeAllListeners<
            ChannelType extends Channel.Any<PackageKey, MainOwner> = Channel.Any<PackageKey, MainOwner>
        >(
            Channel?: ChannelType
        ): void;
        removeListener: Off<PackageKey, true>;
    };

export type MainHandleCallbacksSingular<PackageKey extends PackageKeys> =
    {
        addListener: On<PackageKey, false>;
        handle: Handle<PackageKey,  false>;
        handleOnce: Handle<PackageKey, false>;
        off: Off<PackageKey, false>;
        on: On<PackageKey, false>;
        once: On<PackageKey, false>;
        removeListener: Off<PackageKey, false>;
    };

type Off<
    PackageKey extends PackageKeys,
    AllowsMultipleCallbacksPerChannel extends boolean
> =
    AllowsMultipleCallbacksPerChannel extends true
        ? {
            <ChannelType extends Channel.Any<PackageKey, MainOwner>>(
                Channel: ChannelType,
                Key: string
            ): void;
        }
        : {
            <ChannelType extends Channel.Any<PackageKey, MainOwner>>(
                Channel: ChannelType
            ): void;
        };

type On<
    PackageKey extends PackageKeys,
    AllowsMultipleCallbacksPerChannel extends boolean
> =
    AllowsMultipleCallbacksPerChannel extends true
        ? {
            <ChannelType extends Channel.Any<PackageKey, MainOwner>>(
                Channel: ChannelType,
                Key: string,
                Callback: Callback<PackageKey, IpcMainEvent, ChannelType>
            ): void;
        }
        : {
            <ChannelType extends Channel.Any<PackageKey, MainOwner>>(
                Channel: ChannelType,
                Callback: Callback<PackageKey, IpcMainEvent, ChannelType>
            ): void;
        };

type Handle<
    PackageKey extends PackageKeys,
    AllowsMultipleCallbacksPerChannel extends boolean
> =
    AllowsMultipleCallbacksPerChannel extends true
        ? {
            <ChannelType extends Channel.Any<PackageKey, MainOwner>>(
                Channel: ChannelType,
                Key: string,
                Callback: Callback<PackageKey, IpcMainInvokeEvent, ChannelType>
            ): void;
        }
        : {
            <ChannelType extends Channel.Any<PackageKey, MainOwner>>(
                Channel: ChannelType,
                Callback: Callback<PackageKey, IpcMainInvokeEvent, ChannelType>
            ): void;
        };

// export type InnerCallbacksRecord<
//     PackageKey extends PackageKeys,
//     EventType extends IpcMainEvent | IpcMainInvokeEvent,
//     ChannelType extends Channel.Any<PackageKey, MainOwner>
// > = Record<string, Callback<PackageKey, EventType, ChannelType>>;

// export type CallbacksRecord<
//     PackageKey extends PackageKeys,
//     EventType extends IpcMainEvent | IpcMainInvokeEvent,
//     ChannelType extends Channel.Any<PackageKey, MainOwner>
// > =
//     Partial<{
//       [ EventName in ChannelType ]: InnerCallbacksRecord<PackageKey, EventType, EventName>;
//     }>;
