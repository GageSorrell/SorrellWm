/**
 * The Windows system tray icon: its context menu, double-click behavior, and its
 * reactive icon (colorful by default, or a simplified theme-aware glyph).
 *
 * @module @sorrell/wm/Main/Tray
 *
 * @file      Tray.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "./AppSettings/AppSettings.ts";
import * as Command from "./Command/index.ts";
import * as Logging from "./Log.ts";
import * as TrayIcon from "./TrayIcon.ts";
import { Context, Effect, Layer, Option, Stream, pipe } from "effect";
import { Tray as ElectronTray, Menu, app, nativeImage, nativeTheme } from "electron";
import type { NativeImage } from "electron";

const TypeId = "~sorrell/wm/Main/Tray" as const;

/** The running tray-icon controller. */
export interface TrayImpl
{
    readonly _tag: "Tray";
}

/** Supervise the system tray icon and its context menu. */
export class Tray extends
    Context.Service<Tray, TrayImpl>()(TypeId) { }

const LoadIcon = (Variant: TrayIcon.TrayIconVariant): NativeImage =>
    nativeImage.createFromPath(TrayIcon.GetTrayIconPath(Variant));

export/** Live tray-icon controller, backed by a real Electron `Tray`. */
const Live = Layer.effect(
    Tray,
    Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        const Executor = yield* Command.Executor.CommandExecutor;

        const RunEffect = (EffectValue: Effect.Effect<void>): void =>
        {
            void Effect.runPromise(EffectValue);
        };

        const OpenSettings = (): void => RunEffect(pipe(
            Executor.Execute(Command.Ui.UiCommand().OpenSettings({ Path: Option.none() })),
            Effect.catch((Cause: unknown) => Logging.LogError(
                "Tray",
                "Could not open the settings window from the tray.",
                Cause
            ))
        ));

        const InitialSettings = yield* Settings.Get;
        let CurrentUseSimplifiedTrayIcon = InitialSettings.UseSimplifiedTrayIcon;

        const ResolveCurrentIcon = (): NativeImage => LoadIcon(
            TrayIcon.ResolveTrayIconVariant(
                CurrentUseSimplifiedTrayIcon,
                nativeTheme.shouldUseDarkColors
            )
        );

        const TrayInstance = new ElectronTray(ResolveCurrentIcon());
        TrayInstance.setToolTip(`SorrellWm v${ app.getVersion() }`);
        TrayInstance.setContextMenu(Menu.buildFromTemplate([
            { click: OpenSettings, label: "Settings" },
            { click: (): void => app.quit(), label: "Close" }
        ]));
        TrayInstance.on("double-click", OpenSettings);

        const RefreshIcon = (): void =>
        {
            TrayInstance.setImage(ResolveCurrentIcon());
        };

        nativeTheme.on("updated", RefreshIcon);

        yield* pipe(
            Settings.Changes,
            Stream.runForEach((Current: AppSettings.AppSettings) => Effect.sync(() =>
            {
                if (Current.UseSimplifiedTrayIcon !== CurrentUseSimplifiedTrayIcon)
                {
                    CurrentUseSimplifiedTrayIcon = Current.UseSimplifiedTrayIcon;
                    RefreshIcon();
                }
            })),
            Effect.forkScoped({ startImmediately: true })
        );

        yield* Effect.addFinalizer(() => Effect.sync(() =>
        {
            nativeTheme.removeListener("updated", RefreshIcon);
            TrayInstance.removeListener("double-click", OpenSettings);
            TrayInstance.destroy();
        }));

        yield* Logging.LogDebug("Tray", "Tray icon initialized.");

        return { _tag: "Tray" } as const;
    })
);
