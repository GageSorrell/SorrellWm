/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Manifest } from "../../Provider/Manifest/Manifest.Types.js";

export type CodeFormatter =
    | "eslint"
    | "ox"
    | "prettier";

/**
 * The options for a given module offered by a provider.
 *
 * @property {boolean} Enabled - Whether the module should be generated when `code-auger generate` is run.
 *
 * @property {string} Path - The path to where the module will be written.  If this is a directory, then
 * the module will be placed there, and the file name will be the module's name.
 */
export type ModuleConfig =
    Partial<{
        Enabled: boolean;
        Path: string;
    }>;

export type ProviderConfig<ManifestType extends Manifest> =
    {
        Modules: Readonly<Record<keyof ManifestType["Modules"], ModuleConfig>>;
    };

export type ProvidersConfig<ManifestRecordType extends Record<string, Manifest>> =
    {
        [ Name in keyof ManifestRecordType ]: ProviderConfig<ManifestRecordType[Name]>;
    };

export type Config<ManifestRecordType extends Record<string, Manifest>> =
    Partial<{
        BasePath: string;
        DisableFormatters: ReadonlyArray<CodeFormatter>;
        Providers: ProvidersConfig<ManifestRecordType>;
    }>;
