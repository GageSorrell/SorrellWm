/**
 *
 *
 * @module @sorrell/wm/Main/AppSettingsSynchronization
 *
 * @file      AppSettingsSynchronization.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "./AppSettings.js";
import * as BrowserWindow from "./BrowserWindow.js";
import * as _AppSettings from "@sorrell/app-settings";
import { Effect, Layer } from "effect";
import { MakeFnTracer } from "./Utility/Function.ts";
import { nativeTheme } from "electron";

const TypeId = "~sorrell/wm/Main/AppSettingsSynchronization" as const;
const Fn = MakeFnTracer(TypeId);

const SynchronizeTheme = Fn("SynchronizeTheme")(
    function* (Theme: AppSettings.AppSettings["Theme"])
    {
        nativeTheme.themeSource = Theme.toLowerCase() as "dark" | "light" | "system";
    });

const SynchronizeOverlayRoundedCorners = Fn("SynchronizeOverlayRoundedCorners")(
    function* (RoundedCorners: boolean)
    {
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;

        yield* BrowserWindows.ForceClose(BrowserWindow.Key.Overlay).pipe(
            Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
        );
        yield* BrowserWindows.Ensure(BrowserWindow.GetOverlayWindowSpec(RoundedCorners));
    });

export/** Long-lived reconciliation of committed settings with Electron state. */
const Live = Layer.mergeAll(
    _AppSettings.synchronizeSetting(AppSettings.AppSettings, "Theme", SynchronizeTheme),
    _AppSettings.synchronizeSetting(
        AppSettings.AppSettings,
        "OverlayRoundedCorners",
        (RoundedCorners: boolean) => SynchronizeOverlayRoundedCorners(RoundedCorners).pipe(
            Effect.retry({ times: 3 })
        )
    )
);
