/**
 * Windows API types and operations for screen.
 *
 * @module @sorrell/windows/Screen
 *
 * @file      Screen.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { File, type Handle } from "./index.js";
import { Option, Result, pipe } from "effect";
import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.js";
import { Box } from "@sorrell/math";

/* This public type intentionally retains the requested Win32-style name. */
/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Extended information for a display monitor and the handle that identifies it.
 *
 * This models the useful output fields of `MONITORINFOEXW` paired with the
 * `HMONITOR` supplied during enumeration.
 */
export interface MonitorInfo
{
    /** The monitor's friendly device name, such as `DELL U2723QE`. */
    readonly DeviceName: string;

    /** The positive display number shown for this monitor in Windows Settings. */
    readonly DisplayId: number;

    /** The raw `MONITORINFOEXW.dwFlags` value. */
    readonly Flags: number;

    /** The handle identifying the monitor for the current display topology. */
    readonly Handle: Handle.HMONITOR;

    /** Whether `MONITORINFOF_PRIMARY` is present in {@link Flags}. */
    readonly IsPrimary: boolean;

    /** The monitor rectangle in virtual-screen coordinates. */
    readonly Monitor: Box.Box;

    /** The usable work-area rectangle in virtual-screen coordinates. */
    readonly WorkArea: Box.Box;
}

/* eslint-enable @typescript-eslint/naming-convention */

type NativeMonitorInformation =
    & Omit<MonitorInfo, "Monitor" | "WorkArea">
    & {
        readonly Monitor: Box.BoxArg<number>;
        readonly WorkArea: Box.BoxArg<number>;
    };

export/**
       * Capture the parts of the user's screens within the supplied bounds as a
       * raw base64-encoded PNG string.
       */
const Capture = (Bounds: Box.Box): Option.Option<File.Png> =>
{
    if (typeof Binding.Screen?.Capture === "function")
    {
        const { Value } = Binding.Screen.Capture(Bounds);
        if (File.Png.IsPng(Value))
        {
            return Option.some(Value);
        }
    }

    return Option.none();
};

export/**
       * Get the monitor manufacturer's brand name when its device metadata
       * provides one.
       */
const GetMonitorBrand = (
    Monitor: MonitorInfo | Handle.HMONITOR
): Option.Option<string> =>
    typeof Binding.Screen?.GetMonitorBrand !== "function"
        ? Option.none()
        : Attempt.AsOption(Binding.Screen.GetMonitorBrand(
            typeof Monitor === "bigint" ? Monitor : Monitor.Handle
        ));

export/**
       * Get extended information for every display monitor in the current
       * desktop topology.
       */
const GetMonitors = (): Attempt.Attempt<
    ReadonlyArray<MonitorInfo>
> => typeof Binding.Screen?.GetMonitors === "function"
    ? pipe(
        Binding.Screen.GetMonitors(),
        Attempt.AsResult,
        Result.map((Monitors: ReadonlyArray<NativeMonitorInformation>) =>
            Monitors.map((Monitor: NativeMonitorInformation): MonitorInfo => ({
                ...Monitor,
                Monitor: Box.Box(
                    Monitor.Monitor.Top,
                    Monitor.Monitor.Right,
                    Monitor.Monitor.Bottom,
                    Monitor.Monitor.Left
                ),
                WorkArea: Box.Box(
                    Monitor.WorkArea.Top,
                    Monitor.WorkArea.Right,
                    Monitor.WorkArea.Bottom,
                    Monitor.WorkArea.Left
                )
            })))
    )
    : Result.fail(new Attempt.NativeError({
        Message: "The loaded native addon does not export Screen.GetMonitors."
    }));
