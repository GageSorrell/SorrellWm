/**
 *
 *
 * @module @sorrell/windows/Binding
 *
 * @file      Binding.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Box, IntPoint } from "@sorrell/math";
import type { Handle, Subscription, Thread } from "./index.ts";
import type { Attempt } from "./Internal/index.ts";
import { createRequire } from "node:module";

/**
 * The API surface of the native module.
 * @internal
 */
export interface NativeBinding
{
    readonly Keyboard:
    {
        readonly Subscribe: (
            Callback: Subscription.NativeCallback
        ) => Attempt.Attempt<Subscription.Id>;

        readonly Unsubscribe: (SubscriptionId: Subscription.Id) => Attempt.Attempt<void>;
    };
    readonly MessageLoop:
    {
        readonly Start: () => Attempt.Attempt<Thread.ThreadId>;
        readonly Stop: () => Attempt.Attempt<void>;
        readonly Subscribe: (
            Message: number,
            Callback: Subscription.NativeCallback
        ) => Attempt.Attempt<Subscription.Id>;
        readonly Unsubscribe: (
            SubscriptionId: Subscription.Id
        ) => Attempt.Attempt<void>;
    };
    readonly Theme:
    {
        readonly GetAccentColor: () => Attempt.Attempt<string>;
    };
    readonly Window:
    {
        readonly ClearWindowDimming: () => Attempt.Attempt<void>;
        readonly DimWindowsExcept: (
            ExcludedWindows: ReadonlyArray<Handle.HWND>
        ) => Attempt.Attempt<void>;
        readonly ShowBackdrop: (
            Window: Handle.HWND,
            Intensity: number,
            FadeDurationMilliseconds: number
        ) => Attempt.Attempt<void>;
        readonly GetCursorPosition: () => Attempt.Attempt<IntPoint.IntPoint>;
        readonly GetForegroundWindow: () => Attempt.Attempt<Handle.HWND>;
        readonly GetManageableTopLevelWindows: () =>
        Attempt.Attempt<ReadonlyArray<Handle.HWND>>;
        readonly GetWindowRect: (
            Window: Handle.HWND
        ) => Attempt.Attempt<Box.BoxArg<number>>;
        readonly GetWindowText: (Window: Handle.HWND) => Attempt.Attempt<string>;
        readonly GetWindowWorkArea: (
            Window: Handle.HWND
        ) => Attempt.Attempt<Box.BoxArg<number>>;
        readonly HasRoundedCorners: (Window: Handle.HWND) => Attempt.Attempt<boolean>;
        readonly SetForegroundWindow: (Window: Handle.HWND) => Attempt.Attempt<void>;
        readonly SetWindowRect: (
            Window: Handle.HWND,
            Bounds: Box.BoxArg<number>
        ) => Attempt.Attempt<void>;
    };
}

const Require: NodeJS.Require = createRequire(import.meta.url);

export/**
       * The exports of the native module.
       * @internal
       */
const Binding: NativeBinding =
    Require("../build/Release/SorrellWindows.node") as NativeBinding;
