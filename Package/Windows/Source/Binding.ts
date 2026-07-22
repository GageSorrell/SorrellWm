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

import type { Handle, Subscription, Thread } from "./index.ts";
import type { Attempt } from "./Internal/index.ts";
import type { IntPoint } from "@sorrell/math";
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
    readonly Window:
    {
        readonly GetForegroundWindow: () => Attempt.Attempt<Handle.HWND>;
        readonly GetCursorPosition: () => Attempt.Attempt<IntPoint.IntPoint>;
    };
}

const Require: NodeJS.Require = createRequire(import.meta.url);

export/**
       * The exports of the native module.
       * @internal
       */
const Binding: NativeBinding =
    Require("../build/Release/SorrellWindows.node") as NativeBinding;
