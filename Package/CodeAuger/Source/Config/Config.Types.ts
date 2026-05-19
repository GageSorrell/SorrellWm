/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

/** The formatters supported by the {@link BaseConfig!DisableFormatter} feature. */
export type Formatter =
    | "eslint"
    | "ox"
    | "prettier";

// WHERE TO PICK BACK UP:
//
// ONLY ALLOW CUSTOM OPTIONS AT THE PACKAGE LEVEL.

/**
 * The base config type, which is used globally, and at the package and module level.
 *
 * @property {Formatter | Array<Formatter>} DisableFormatter - If specified, the
 * {@link Formatter | formatter(s)} to disable for the given modules by prepending a comment,
 * for each specified {@link Formatter} to each of the given modules that disables the respective
 * formatter.
 * @property {boolean} GenerateOnSave - If specified and `true`, then while `code-auger generate --watch`
 * is running, saving a module included by the consumer's `tsconfig.json` will cause the given auto-generated
 * modules to be regenerated.
 * @property {string | Array<string>} Prepended - If specified, lines to prepend to the given modules.
 * If this is an {@link Array}, then the `string`s will be joined with a newline.
 */
export type BaseConfig =
    Readonly<{
        DisableFormatter?: Formatter | Array<Formatter>;
        GenerateOnSave?: boolean;
        Prepended?: string | Array<string>;
    }>;

/**
 * The options for a given module.
 *
 * @property {string} Path - If specified, then this is the path, relative to the path for the package
 * containing this module, to where this module will be written.  If not specified, then this is the
 * name of the module as labeled by the provider, with a `.ts` file extension.
 */
export type ModuleOptions<OptionsType extends Record<string, unknown> = never> =
    BaseConfig &
    Readonly<{
        Path?: string;
    } &
    ([ OptionsType ] extends [ never ]
        /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
        ? { }
        : {
            CustomOptions?: OptionsType;
        }
    )>;

/**
 * Options for configuring all providers and their respective modules.
 *
 * @property {string} OutDirectory - The root directory to where auto-generated modules will be written.
 */
export type GlobalConfig =
    BaseConfig &
    Readonly<Partial<{
        OutDirectory?: string;
    }>>;

export type ModuleDeclarationRecord<OptionsType extends Record<string, unknown> = never> =
    Readonly<{
        Name: string;
        DefaultOptions?: Omit<ModuleOptions, "Path">;
    } &
    ([ OptionsType ] extends [ never ]
        /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
        ? { }
        : {
            CustomOptions?: OptionsType;
        }
    )>;

/**
 * The consumer-facing type for setting base options for all modules in a given package.
 *
 * @property {string} BaseDirectory - This will be the base directory, relative
 * to {@link GlobalConfig!RootDirectory}, to which the paths of the auto-generated modules belonging
 * to the package having these options will be relative.  If not specified, then this will be the name of
 * the package.
 */
export type ProviderOptions<CustomOptionsType extends Record<string, unknown> = never> =
    BaseConfig &
    Readonly<{
        BaseDirectory?: string;
    } & (
        [ CustomOptionsType ] extends [ never ]
            /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
            ? { }
            : {
                Custom: CustomOptionsType;
            }
    )>;

/**
 * The consumer-facing type for setting options for a given package, and fine-grained options
 * for any of its modules.
 */
export type ProviderConfig<CustomOptionsType extends Record<string, unknown> = never> =
    Readonly<{
        Options?: ProviderOptions<CustomOptionsType>;
        Modules?: Record<string, ModuleOptions>;
    }>;

export type ProviderDeclaration<
    ProviderOptionsType extends Record<string, unknown> = never,
    ModuleOptionsType extends ModuleOptions = ModuleOptions
> =
    Readonly<{
        DefaultOptions?: ProviderOptions<ProviderOptionsType>;
        Modules: ReadonlyArray<string | ModuleDeclarationRecord<ModuleOptionsType>>;
    }>;

/**
 * @template ProviderConfigType - The {@link Record} that maps each provider's name
 * to its {@link ProviderConfig}.
 */
export type Config<ProviderConfigType extends Record<string, ProviderConfig>> =
    Readonly<{
        Global: GlobalConfig;
        Provider: ProviderConfigType;
    }>;
