/**
 *
 *
 * @module @sorrell/wm/Main/Theme
 *
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { AppSettings } from "./index.ts";
import { Effect } from "effect";
import { nativeTheme } from "electron";

export const TypeId = "~sorrell/wm/Main/Theme" as const;

export/** The token that represents the "light" mode. */
const Light: unique symbol = Symbol.for(`${ TypeId }!Light`);

export/** The token that represents the "dark" mode. */
const Dark: unique symbol = Symbol.for(`${ TypeId }!Dark`);

export/** The token that represents the system's current mode. */
const System: unique symbol = Symbol.for(`${ TypeId }!System`);

/** {@inheritDoc Light:var} */
export type Light = typeof Light;

/** {@inheritDoc Dark:var} */
export type Dark = typeof Dark;

/** {@inheritDoc System:var} */
export type System = typeof System;

/** The theme "mode" of the application. */
export type Theme =
    | Light
    | Dark
    | System;

/** The theme mode that the application is currently using. */
export type Resolved = Exclude<Theme, System>;

const _Light = Light;
const _Dark = Dark;
const _System = System;

export namespace Encoded
{
    export/** The token that represents the "light" mode. */
    const Light = "Light" as const;

    export/** The token that represents a "dark" mode. */
    const Dark = "Dark" as const;

    export/** The token that represents the system's current mode. */
    const System = "System" as const;

    export type Encoded =
        | typeof Light
        | typeof Dark
        | typeof System;

    export const Encoded = (Value: Theme): Encoded =>
    {
        switch (Value)
        {
            case _Light:
                return Light;
            case _Dark:
                return Dark;
            case _System:
                return System;
        }
    };

    export const Decoded = (Value: Encoded): Theme =>
    {
        switch (Value)
        {
            case Light:
                return _Light as Light;
            case Dark:
                return _Dark as Dark;
            case System:
                return _System as System;
        }
    };
}

export/** Get the current theme. */
const GetResolved = (): Resolved =>
{
    const ThemeSource = nativeTheme.themeSource;
    if (ThemeSource === "dark")
    {
        return Dark;
    }
    else if (ThemeSource === "light")
    {
        return Light;
    }
    else
    {
        return nativeTheme.shouldUseDarkColors
            ? Dark
            : Light;
    }
};

export const Synchronize = (ProposedSettings: AppSettings.AppSettings) => Effect.gen(function* ()
{
    const NewTheme = ProposedSettings.Theme.toLowerCase() as "dark" | "light" | "system";
    nativeTheme.themeSource = NewTheme;
});

export const GetTheme = Effect.fn("GetTheme", function* ()
{
    const Settings = yield* AppSettings.AppSettings;
    const EncodedTheme: Encoded.Encoded = yield* Settings.getSetting("Theme");
    return Encoded.Decoded(EncodedTheme);
});

export const SetTheme = Effect.fn("SetTheme", function* (NewTheme: Theme)
{
    const Settings = yield* AppSettings.AppSettings;
    return yield* Settings.setSetting("Theme", Encoded.Encoded(NewTheme));
});
