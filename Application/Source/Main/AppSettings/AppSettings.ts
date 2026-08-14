/**
 * Application-wide settings via `@sorrell/app-settings`.
 *
 * @module @sorrell/wm/Main/AppSettings/AppSettings
 *
 * @file      AppSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "../Input/Hotkey.ts";
import * as _AppSettings from "@sorrell/app-settings";
import { Effect, Schema, pipe } from "effect";
import type {
    NewWindowBehavior,
    ResizeRecoveryStrategy,
    TiledResizeBehavior
} from "../../Shared/AppSettings.js";
import {
    NewWindowBehaviors,
    TiledResizeBehaviors
} from "../../Shared/AppSettings.js";
// import { L10n } from "../../Shared/index.ts";

export/** The type identifier for this module. */
const TypeId = "~sorrell/wm/Main/AppSettings/AppSettings" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

const NewWindowBehaviorSchema = Schema.Literals(NewWindowBehaviors);
const TiledResizeBehaviorSchema = Schema.Literals(TiledResizeBehaviors);
const ResizeRecoveryThresholdSchema = pipe(
    Schema.UndefinedOr(pipe(
        Schema.Int,
        Schema.check(Schema.isGreaterThanOrEqualTo(0))
    )),
    Schema.withDecodingDefaultKey(Effect.succeed(undefined))
);
const ResizeRecoveryStrategySchema = Schema.TaggedUnion({
    Cancel: { },
    Continue:
    {
        Threshold: ResizeRecoveryThresholdSchema
    },
    Ignore:
    {
        Threshold: ResizeRecoveryThresholdSchema
    }
});

/** The behavior applied when an application creates a new window. */
export type { NewWindowBehavior };
export type { ResizeRecoveryStrategy };
export type { TiledResizeBehavior };

export/** Settings that override window-manager behavior for one executable. */
const PerAppSettings = Schema.Struct({
    IgnoreModal: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(true))
    ),
    NewWindowBehavior: pipe(
        NewWindowBehaviorSchema,
        Schema.withDecodingDefaultKey(Effect.succeed("FloatCenter" as const))
    )
});

/** Validated settings that override window-manager behavior for one executable. */
export type PerAppSettings = typeof PerAppSettings.Type;

const SettingsSchema = Schema.Struct({
    FocusPreviewOpacity: pipe(
        Schema.Int,
        Schema.check(
            Schema.isGreaterThanOrEqualTo(0),
            Schema.isLessThanOrEqualTo(100)
        ),
        Schema.withDecodingDefaultKey(Effect.succeed(75))
    ),
    IgnoreActivationKeybindInFullscreen: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(true))
    ),
    Keybinds: pipe(
        Schema.Array(Hotkey.KeybindSettingSchema),
        Schema.withDecodingDefaultKey(Effect.succeed(Hotkey.DefaultKeybindSettings))
    ),
    McpServerEnabled: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(false))
    ),
    McpServerPort: pipe(
        Schema.Int,
        Schema.check(
            Schema.isGreaterThanOrEqualTo(1),
            Schema.isLessThanOrEqualTo(65_535)
        ),
        Schema.withDecodingDefaultKey(Effect.succeed(7_920))
    ),
    MoveFineSpeed: pipe(
        Schema.Number,
        Schema.check(Schema.isGreaterThan(0)),
        Schema.withDecodingDefaultKey(Effect.succeed(16))
    ),
    MoveStepPrimary: pipe(
        Schema.Int,
        Schema.check(Schema.isGreaterThan(0)),
        Schema.withDecodingDefaultKey(Effect.succeed(20))
    ),
    MoveStepPrimarySpeedFactor: pipe(
        Schema.Number,
        Schema.check(Schema.isGreaterThan(0)),
        Schema.withDecodingDefaultKey(Effect.succeed(4))
    ),
    MoveStepSecondary: pipe(
        Schema.Int,
        Schema.check(Schema.isGreaterThan(0)),
        Schema.withDecodingDefaultKey(Effect.succeed(50))
    ),
    MoveStepSecondarySpeedFactor: pipe(
        Schema.Number,
        Schema.check(Schema.isGreaterThan(0)),
        Schema.withDecodingDefaultKey(Effect.succeed(4))
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
    PerAppSettings: pipe(
        Schema.Record(Schema.String, PerAppSettings),
        Schema.withDecodingDefaultKey(Effect.succeed({ }))
    ),
    ResizeRecoveryStrategy: pipe(
        ResizeRecoveryStrategySchema,
        Schema.withDecodingDefaultKey(Effect.succeed({
            Threshold: 128,
            _tag: "Continue" as const
        }))
    ),
    RunAtStartup: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(true))
    ),
    ShowStackPanelMinimizeFlyout: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(true))
    ),
    ShowTitlebarFlyout: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(true))
    ),
    Theme: pipe(
        Schema.Literals([ "Dark", "Light", "System" ]),
        Schema.withDecodingDefaultKey(Effect.succeed("System" as const))
    ),
    TileExistingWindowsOnStartup: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(false))
    ),
    TiledResizeBehavior: pipe(
        TiledResizeBehaviorSchema,
        Schema.withDecodingDefaultKey(Effect.succeed("PreserveRatios" as const))
    ),
    TiledWindowDetachDistance: pipe(
        Schema.Int,
        Schema.check(Schema.isGreaterThanOrEqualTo(0)),
        Schema.withDecodingDefaultKey(Effect.succeed(128))
    ),
    TiledWindowGap: pipe(
        Schema.Int,
        Schema.check(Schema.isGreaterThanOrEqualTo(0)),
        Schema.withDecodingDefaultKey(Effect.succeed(8))
    ),
    UseSimplifiedTrayIcon: pipe(
        Schema.Boolean,
        Schema.withDecodingDefaultKey(Effect.succeed(false))
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
const AppSettings = _AppSettings.Make(
    SettingsSchema,
    {
        // ApplicationName: L10n.Common.AppName,
        ApplicationName: "SorrellWm",
        Initial:
        {
            FocusPreviewOpacity: 75,
            IgnoreActivationKeybindInFullscreen: true,
            Keybinds: Array.from(Hotkey.DefaultKeybindSettings),
            McpServerEnabled: false,
            McpServerPort: 7_920,
            MoveFineSpeed: 16,
            MoveStepPrimary: 20,
            MoveStepPrimarySpeedFactor: 4,
            MoveStepSecondary: 50,
            MoveStepSecondarySpeedFactor: 4,
            OverlayBackdropIntensity: 2,
            OverlayRoundedCorners: true,
            PerAppSettings: { },
            ResizeRecoveryStrategy:
            {
                Threshold: 128,
                _tag: "Continue"
            },
            RunAtStartup: true,
            ShowStackPanelMinimizeFlyout: true,
            ShowTitlebarFlyout: true,
            Theme: "System",
            TileExistingWindowsOnStartup: false,
            TiledResizeBehavior: "PreserveRatios",
            TiledWindowDetachDistance: 128,
            TiledWindowGap: 8,
            UseSimplifiedTrayIcon: false
        }
    }
);
