/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    Manifest,
    ModuleDecl,
    ModulesDecl,
    ModulesDeclArray,
    ModulesDeclRecord,
    ModuleOptions as ProviderModuleOptions
} from "../../Provider/Config/Config.Types.js";
import type { ManifestOptionsBase } from "../../Provider/Config/Config.Internal.Types.js";
import type { AnyProviderConfigs, ModulesConfigBasePart } from "./Config.Internal.Types.js";
import type { RecordUnknown, WithCustomOptions } from "../../Config/Config.Internal.Types.js";

/** The formatters supported by the {@link BaseConfig!DisableFormatter} feature. */
export type Formatter =
    | "eslint"
    | "ox"
    | "prettier";

/**
 * The base config type, which is used globally, and at the package and module level.
 *
 * @property {Formatter | Array<Formatter>} DisableFormatter - If specified, the
 * {@link Formatter | formatter(s)} to disable for the given modules by prepending a comment,
 * for each specified {@link Formatter} to each of the given modules that disables the respective
 * formatter.
 *
 * @property {boolean} GenerateOnSave - If specified and `true`, then while `code-auger generate --watch`
 * is running, saving a module included by the consumer's `tsconfig.json` will cause the given auto-generated
 * modules to be regenerated.
 *
 * @property {string | Array<string>} Prepended - If specified, lines to prepend to the given modules.
 * If this is an {@link Array}, then the `string`s will be joined with a newline.
 */
export type BaseConfig =
    ManifestOptionsBase &
    Readonly<{
        DisableFormatter?: Formatter | Array<Formatter>;
        Prepended?: string | Array<string>;
    }>;

/** The base type for options that can be specified for a module. */
export type ModuleOptionsBase =
    BaseConfig &
    Readonly<{
        Path?: string;
    }>;

/**
 * The options for a given module.
 *
 * @property {string} Path - If specified, then this is the path, relative to the path for the package
 * containing this module, to where this module will be written.  If not specified, then this is the
 * name of the module as labeled by the provider, with a `.ts` file extension.
 */
export type ModuleOptions<ProviderModuleOptionsType extends ProviderModuleOptions = never> =
    ModuleOptionsBase & ProviderModuleOptionsType;

// // export type ModuleOptions<CustomOptionsType extends RecordUnknown = never> =
// //     WithCustomOptions<ModuleOptionsBase, CustomOptionsType>;

/**
 * Options for configuring all providers and their respective modules.
 *
 * @property {string} OutDirectory - The root directory to where auto-generated modules will be written.
 */
export type GlobalOptions =
    BaseConfig &
    Readonly<Partial<{
        OutDirectory?: string;
    }>>;

/**
 * The consumer-facing type for setting base options for all modules in a given package.
 *
 * @property {string} BaseDirectory - This will be the base directory, relative
 * to {@link GlobalConfig!RootDirectory}, to which the paths of the auto-generated modules belonging
 * to the package having these options will be relative.  If not specified, then this will be the name of
 * the package.
 */
export type ProviderOptionsBase =
    BaseConfig &
    Readonly<{
        BaseDirectory?: string;
    }>;

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The config for all modules of a given provider.
 *
 * @template ModulesType - The union of all {@link ModuleDecl | module declaration types}
 * of the given provider.
 */
export type ModulesConfig<ModulesType extends ModulesDecl> =
    Readonly<{
        [ Module in Extract<ModulesType, string> ]: ModulesConfigBasePart;
    }> &
    ModulesType extends ModulesDeclArray
        ? Readonly<{
            [ Module in Extract<ModulesType, ModuleDecl> as Module["Name"] ]:
                Module["Options"] &
                ModulesConfigBasePart;
        }>
        : ModulesType extends ModulesDeclRecord
            ? Readonly<{
                [ Module in keyof ModulesType as
                ModulesType[Module] extends undefined ? never : Module
                ]: "Options" extends keyof ModulesType[Module]
                    ? (
                        ModulesType[Module]["Options"] &
                        ModulesConfigBasePart
                    )
                    : ModulesConfigBasePart;
            }>
            : never;

/**
 * The options type for a given provider.
 *
 * @template ManifestType - The {@link Manifest} of the provider that this configures.
 */
export type ProviderOptions<ManifestType extends Manifest> =
    ManifestType extends Manifest<infer CustomOptionsType>
        ? WithCustomOptions<ProviderOptionsBase, CustomOptionsType>
        : never;

/**
 * The consumer-facing type for setting options for a given package, and fine-grained options
 * for any of its modules.
 *
 * @template ManifestType - The {@link Manifest} of the provider that this configures.
 */
export type ProviderConfig<ManifestType extends Manifest> =
    Readonly<Partial<{
        Modules: ModulesConfig<ManifestType["Modules"]>;
        Options: ProviderOptions<ManifestType>;
    }>>;

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * The {@link Record} of provider
 *
 * @template ManifestsType - The union of {@link Manifest | manifests} of providers
 * in your package.
 */
export type ProviderConfigs<
    ProviderKeyType extends string = string,
    CustomOptionsType extends RecordUnknown = RecordUnknown,
    ManifestType extends Manifest<CustomOptionsType> = Manifest<CustomOptionsType>
> = Readonly<Record<ProviderKeyType, ProviderConfig<ManifestType>>>;

export type ProviderConfigsSafe<
    ProviderKeyType extends string,
    CustomOptionsType extends RecordUnknown,
    ManifestType extends Manifest<CustomOptionsType>
> =
    [ ProviderKeyType & CustomOptionsType & ManifestType ] extends [ never ]
        ? AnyProviderConfigs
        : ProviderConfigs<ProviderKeyType, CustomOptionsType, ManifestType>;

/**
 * The config that is exported by your `code-auger.config.ts` file.
 *
 * @note The value of the type parameter {@link ProviderConfigsType} is generated
 * for you with the `refresh` command.
 *
 * @template ProviderConfigsType - The type of configuration for the providers in your package.
 */
export type Config<ProviderConfigsType extends ProviderConfigs = AnyProviderConfigs> =
    Readonly<{
        Global: BaseConfig;
        Provider: ProviderConfigsType;
    }>;
