/* File:      Callback.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Callback as CallbackBase, EventTypesFromOwner, InvokeResponse } from "../Callback/index.js";
import type { MainOwner, RendererOwner } from "../Decl.Types.js";
import type { BrowserWindow } from "electron";
import type { Channel } from "../Channel.Types";
import type { PackageKeys } from "../Internal/index.js";

/**
 * These are the types that your callbacks should return.
 * @module Main.Callback
 */

export type MainCallback<
    PackageKey extends PackageKeys,
    EventType extends EventTypesFromOwner<RendererOwner>,
    ChannelType extends Channel.Any<PackageKey, RendererOwner>
> = CallbackBase<PackageKey, RendererOwner, EventType, ChannelType>;

export type MainInvokeResponse<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, MainOwner>,
    BrowserWindowsArgumentType extends BrowserWindow | Array<BrowserWindow>
> = BrowserWindowsArgumentType extends Array<BrowserWindow>
    ? Array<InvokeResponse<PackageKey, MainOwner, ChannelType>>
    : InvokeResponse<PackageKey, MainOwner, ChannelType>;

