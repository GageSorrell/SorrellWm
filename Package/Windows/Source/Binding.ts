/**
 * The API surface of the native module.
 *
 * @module @sorrell/windows/Binding
 * @internal
 *
 * @file      Binding.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Box, IntPoint } from "@sorrell/math";
import type { File, Handle, Subscription, Thread, VK } from "./index.ts";
import type { Attempt } from "./Internal/index.ts";
import { createRequire } from "node:module";

/**
 * The API surface of the native module.
 * @internal
 *
 * @category Native
 * @since 1.0.0
 */
export interface NativeBinding
{
    readonly Screen?:
    {
        readonly Capture?: (Bounds: Box.Box) => Attempt.NativeAttempt<File.Png>;
        readonly GetMonitorBrand?: (
            Monitor: Handle.HMONITOR
        ) => Attempt.NativeAttempt<string>;
        readonly GetMonitors?: () => Attempt.NativeAttempt<ReadonlyArray<{
            readonly DeviceName: string;
            readonly Flags: number;
            readonly Handle: Handle.HMONITOR;
            readonly IsPrimary: boolean;
            readonly Monitor: Box.BoxArg<number>;
            readonly WorkArea: Box.BoxArg<number>;
        }>>;
    };
    readonly Keyboard:
    {
        readonly Subscribe: (
            Callback: Subscription.NativeCallback
        ) => Attempt.NativeAttempt<Subscription.Id>;

        readonly Unsubscribe: (SubscriptionId: Subscription.Id) => Attempt.NativeAttempt<void>;

        readonly SetSuppressedKeys: (
            Keys: ReadonlyArray<VK.VK>
        ) => Attempt.NativeAttempt<void>;
    };
    readonly MessageLoop:
    {
        readonly Start: () => Attempt.NativeAttempt<Thread.ThreadId>;
        readonly Stop: () => Attempt.NativeAttempt<void>;
        readonly Subscribe: (
            Message: number,
            Callback: Subscription.NativeCallback
        ) => Attempt.NativeAttempt<Subscription.Id>;
        readonly Unsubscribe: (
            SubscriptionId: Subscription.Id
        ) => Attempt.NativeAttempt<void>;
    };
    readonly Theme:
    {
        readonly GetAccentColor: () => Attempt.NativeAttempt<string>;
    };
    readonly Window:
    {
        readonly GetApplicationName?: (
            Window: Handle.HWND
        ) => Attempt.NativeAttempt<string>;
        readonly Capture?: (
            Window: Handle.HWND
        ) => Attempt.NativeAttempt<string>;
        readonly ClearIsolation?: () => Attempt.NativeAttempt<void>;
        readonly ShowIsolation?: (
            ExcludedWindows: ReadonlyArray<Handle.HWND>
        ) => Attempt.NativeAttempt<void>;
        readonly ClearWindowDimming: () => Attempt.NativeAttempt<void>;
        readonly DimWindowsExcept: (
            ExcludedWindows: ReadonlyArray<Handle.HWND>
        ) => Attempt.NativeAttempt<void>;
        readonly ShowBackdrop: (
            Window: Handle.HWND,
            Intensity: number,
            FadeDurationMilliseconds: number
        ) => Attempt.NativeAttempt<void>;
        readonly GetCursorPosition: () => Attempt.NativeAttempt<IntPoint.IntPoint>;
        readonly GetForegroundWindow: () => Attempt.NativeAttempt<Handle.HWND>;
        readonly GetHoveredMaximizeButton?: () => Attempt.NativeAttempt<{
            readonly Bounds: Box.BoxArg<number>;
            readonly Window: Handle.HWND;
        }>;
        readonly GetIcon?: (
            Window: Handle.HWND
        ) => Attempt.NativeAttempt<string>;
        readonly GetManageableTopLevelWindows: () =>
        Attempt.NativeAttempt<ReadonlyArray<Handle.HWND>>;
        readonly GetMouseHoverTime?: () => Attempt.NativeAttempt<number>;
        readonly GetRefreshRate?: (
            Window: Handle.HWND
        ) => Attempt.NativeAttempt<number>;
        readonly GetWindowRect: (
            Window: Handle.HWND
        ) => Attempt.NativeAttempt<Box.BoxArg<number>>;
        readonly GetWindowText: (Window: Handle.HWND) => Attempt.NativeAttempt<string>;
        readonly GetWindowWorkArea: (
            Window: Handle.HWND
        ) => Attempt.NativeAttempt<Box.BoxArg<number>>;
        readonly HasRoundedCorners: (Window: Handle.HWND) => Attempt.NativeAttempt<boolean>;
        readonly IsCurrentProcessElevated?: () => Attempt.NativeAttempt<boolean>;
        readonly IsSnapLayoutsOnHoverEnabled?: () => Attempt.NativeAttempt<boolean>;
        readonly IsSnapWindowsEnabled?: () => Attempt.NativeAttempt<boolean>;
        readonly IsWindowElevated?: (Window: Handle.HWND) => Attempt.NativeAttempt<boolean>;
        readonly IsWindowObscured?: (
            Window: Handle.HWND,
            ExcludedWindows: ReadonlyArray<Handle.HWND>
        ) => Attempt.NativeAttempt<boolean>;
        readonly SetForegroundWindow: (Window: Handle.HWND) => Attempt.NativeAttempt<void>;
        readonly SetWindowRect: (
            Window: Handle.HWND,
            Bounds: Box.BoxArg<number>
        ) => Attempt.NativeAttempt<void>;
    };
}

const Require: NodeJS.Require = createRequire(import.meta.url);

export/**
       * The exports of the native module.
       *
       * @internal
       */
const Binding: NativeBinding =
    Require("../build/Release/SorrellWindows.node") as NativeBinding;
