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

import { Effect, Schema } from "effect";
import { AppSettings } from "@sorrell/app-settings";
import { Theme } from "./index.ts";

const SettingsSchema = Schema.Struct({
    RunAtStartup: Schema.Boolean,
    Theme: Schema.Literals([ Theme.Encoded.Dark, Theme.Encoded.Light, Theme.Encoded.System ])
});

type _AppSettings = typeof SettingsSchema.Type;

const _AppSettings = AppSettings.make(
    SettingsSchema,
    {
        initial:
        {
            RunAtStartup: true,
            Theme: Theme.Encoded.System
        },
        synchronize: (ProposedSettings: typeof SettingsSchema.Type) => Effect.gen(function* ()
        {
            yield* Effect.all([
                Theme.Synchronize(ProposedSettings)
            ]);
        })
    }
);

export { _AppSettings as AppSettings };

// const Live = Settings.layer.pipe(Layer.provide(NodeServices.layer));

// const Program = Effect.gen(function*()
// {
//     const Service = yield* Settings;

//     const Theme = yield* Service.getSetting("Theme");
//     yield* Effect.log(`Current theme: ${ Theme }`);

//     yield* Service.setSetting("Theme", "Dark");

//     // `changes` immediately emits the current value, then every update made
//     // through the service or loaded from an external file edit.
//     yield* Service.changes.pipe(
//         Stream.runForEach((Value) => Effect.log("Settings changed", Value)),
//         Effect.forkScoped
//     );
// });

// Effect.runPromise(Effect.scoped(Program).pipe(Effect.provide(Live)));
