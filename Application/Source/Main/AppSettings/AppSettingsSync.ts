/**
 * Sync functions for the settings in {@link \@sorrell/wm/Main/AppSettings}.
 *
 * @module @sorrell/wm/Main/AppSettings/AppSettingsSync
 *
 * @file      AppSettingsSync.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "./AppSettings.ts";
import * as BrowserWindow from "../BrowserWindow.ts";
import * as OverlaySession from "../Overlay/Session.ts";
import * as _AppSettings from "@sorrell/app-settings";
import { Effect, Layer, pipe } from "effect";
import { AppApiChannel } from "../../Shared/Api.ts";
import { MakeFnTracer } from "../Utility/Function.ts";
import { nativeTheme } from "electron";

const TypeId = "~sorrell/wm/Main/AppSettings/AppSettingsSync" as const;
const Fn = MakeFnTracer(TypeId);

namespace Sync
{
    /* eslint-disable jsdoc/require-jsdoc */

    const Traced = (Label: string) => Fn("Sync", Label);

    export const Theme = Traced("Theme")(
        function* (Theme: AppSettings.AppSettings["Theme"])
        {
            nativeTheme.themeSource = Theme.toLowerCase() as "dark" | "light" | "system";
        });

    export const OverlayRoundedCorners = Traced("OverlayRoundedCorners")(
        function* (_RoundedCorners: boolean)
        {
            const BrowserWindows = yield* BrowserWindow.BrowserWindow;

            yield* BrowserWindows.ForceClose(BrowserWindow.Key.Overlay).pipe(
                Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
            );
            yield* BrowserWindows.Ensure(yield* BrowserWindow.OverlayWindowSpec);
        });

    export const Keybinds = Fn("Keybinds")(
        function* (_Keybinds: AppSettings.AppSettings["Keybinds"])
        {
            const BrowserWindows = yield* BrowserWindow.BrowserWindow;
            const Session = yield* OverlaySession.OverlaySession;
            const Screen = yield* Session.Snapshot;

            yield* BrowserWindows.Send(
                BrowserWindow.Key.Overlay,
                AppApiChannel.OverlayScreenChanged,
                Screen
            ).pipe(
                Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
            );
        });

    /* eslint-enable jsdoc/require-jsdoc */
}

export/** Long-lived reconciliation of committed settings with Electron state. */
const Live = Layer.mergeAll(
    _AppSettings.SyncSetting(AppSettings.AppSettings, "Keybinds", Sync.Keybinds),
    _AppSettings.SyncSetting(AppSettings.AppSettings, "Theme", Sync.Theme),
    _AppSettings.SyncSetting(
        AppSettings.AppSettings,
        "OverlayRoundedCorners",
        (RoundedCorners: boolean) => pipe(
            Sync.OverlayRoundedCorners(RoundedCorners),
            Effect.retry({ times: 3 })
        )
    )
);
