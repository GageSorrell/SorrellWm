/**
 * @file      PackageConfig.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ConfigError, Effect, ConfigProvider as EffectConfigProvider } from "effect";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { ConfigProvider } from "./PackageConfig.js";
import type { IPackageJson } from "package-json-type";

/**
 * The base type for the `Record-like` of the desired
 * {@link ConfigProvider!SettingsType | SettingsType}.
 */
export type FSettingsRecord = Readonly<Record<string, unknown>>;

/* eslint-disable-next-line jsdoc/require-jsdoc */
export type ELoadResolvedProvider =
    Effect.Effect<
        EffectConfigProvider.ConfigProvider,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        any,
        never
    >;

/* eslint-disable-next-line jsdoc/require-jsdoc */
export type EReadPackageJson =
    Effect.Effect<
        IPackageJson,
        ConfigError.ConfigError
    >;
