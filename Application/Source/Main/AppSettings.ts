/**
 *
 *
 * @module @sorrell/wm/Main/AppSettings
 *
 * @file      AppSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "./Hotkey.js";
import * as _AppSettings from "@sorrell/app-settings";
import { Effect, Schema, pipe } from "effect";

export/** The application-settings module identifier used for tracing. */
const TypeId = "~sorrell/wm/Main/AppSettings" as const;
/** The type of the application-settings module identifier. */
export type TypeId = typeof TypeId;

const SettingsSchema = Schema.Struct({
    Keybinds: pipe(
        Schema.Array(Hotkey.KeybindSettingSchema),
        Schema.withDecodingDefaultKey(Effect.succeed(Hotkey.DefaultKeybindSettings))
    ),
    OverlayBackdropIntensity: pipe(
        Schema.Int,
        Schema.check(
            Schema.isGreaterThanOrEqualTo(0),
            Schema.isLessThanOrEqualTo(100)
        ),
        Schema.withDecodingDefaultKey(Effect.succeed(50))
    ),
    OverlayRoundedCorners: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(true))
    ),
    RunAtStartup: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(true))
    ),
    Theme: pipe(
        Schema.Literals([ "Dark", "Light", "System" ]),
        Schema.withDecodingDefaultKey(Effect.succeed("System" as const))
    )
});

/** The complete validated application settings value. */
export type AppSettings = typeof SettingsSchema.Type;

/** The operations exposed by the application settings service. */
export type Service = _AppSettings.Service<AppSettings>;

export/**
       * The service that yields the application's settings and related tools.
       *
       * @since 0.1.0
       */
const AppSettings = _AppSettings.make(
    SettingsSchema,
    {
        initial:
        {
            Keybinds: Array.from(Hotkey.DefaultKeybindSettings),
            OverlayBackdropIntensity: 2,
            OverlayRoundedCorners: true,
            RunAtStartup: true,
            Theme: "System"
        }
    }
);
