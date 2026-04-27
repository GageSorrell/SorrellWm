/**
 * @file      PackageConfig.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Config, Schema } from "effect";
import { ConfigProviderPathPatch, Effect, ConfigProvider as EffectConfigProvider } from "effect";
import type { ELoadResolvedProvider, FSettingsRecord } from "./PackageConfig.Internal.Types.js";
import { BuildResolvedProviderEffect } from "./PackageConfig.Internal.js";

/**
 * Allow dependents to provide configuration, with two supported workflows,
 *
 * 1. Check for a JSON file {@link DefaultFileName} in the root of the dependent,
 * if a {@link DefaultFileName} is given.
 *
 * 2. Check the dependent's `package.json#config` for a `string` property with name
 * {@link PackageName}, whose value is a path to a JSON file, relative to the
 * dependent's root directory.
 *
 * Method (2) is attempted only if method (1) fails.
 *
 * @param PackageName - The name of your package.  It is recommended, but not enforced,
 * for this to match your package's name exactly.
 * @param SettingsSchema - The schema against which the found settings will be validated.
 * @param DefaultFileName - The default name of the settings file for which this function
 * will look, if specified.
 *
 * @returns {EffectConfigProvider.ConfigProvider} The {@link EffectConfigProvider.ConfigProvider}
 * containing the desired {@link SettingsType}.
 *
 * @example @TODO
 */
export function ConfigProvider<
    SettingsType extends FSettingsRecord,
    EncodedType
>(
    PackageName: string,
    SettingsSchema: Schema.Schema<SettingsType, EncodedType, never>,
    DefaultFileName?: `${ string }.json`
): EffectConfigProvider.ConfigProvider
{
    const LoadResolvedProvider: ELoadResolvedProvider =
        BuildResolvedProviderEffect(
            PackageName,
            SettingsSchema,
            DefaultFileName
        );

    return EffectConfigProvider.make(
        {
            load: <Value>(Configuration: Config.Config<Value>) =>
            {
                return LoadResolvedProvider.pipe(
                    Effect.flatMap((Provider: EffectConfigProvider.ConfigProvider) =>
                        Provider.load(Configuration))
                );
            },

            flattened: EffectConfigProvider.makeFlat(
                {
                    patch: ConfigProviderPathPatch.empty,

                    load: <Value>(
                        PathSegments: ReadonlyArray<string>,
                        Configuration: Config.Config.Primitive<Value>,
                        Split: boolean
                    ) =>
                    {
                        return LoadResolvedProvider.pipe(
                            Effect.flatMap((Provider: EffectConfigProvider.ConfigProvider) =>
                                Provider.flattened.load(PathSegments, Configuration, Split)
                            )
                        );
                    },

                    enumerateChildren: (PathSegments: ReadonlyArray<string>) =>
                    {
                        return LoadResolvedProvider.pipe(
                            Effect.flatMap((Provider: EffectConfigProvider.ConfigProvider) =>
                                Provider.flattened.enumerateChildren(PathSegments)
                            )
                        );
                    }
                }
            )
        }
    );
}
