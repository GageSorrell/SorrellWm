/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { RecordUnknown, WithCustomOptions } from "../../Config/Config.Internal.Types.js";
import type { BaseConfig } from "../../Consumer/Config/Config.Types.js";
import type { ManifestOptionsBase } from "./Config.Internal.Types.js";
import type { TSafeIntersection } from "@sorrell/utilities/misc";

/**
 * The options for a given module, possibly having {@link CustomOptionsType | custom options}.
 *
 * @template CustomOptionsType - The {@link Record} that defines custom options
 * for the given module.
 */
export type ModuleOptions<CustomOptionsType extends RecordUnknown = never> =
    WithCustomOptions<BaseConfig, CustomOptionsType>;

/**
 * The {@link Record} that defines a module, with default options and possibly
 * {@link CustomOptionsType | custom options}.
 *
 * @template CustomOptionsType - The {@link Record} that defines custom options
 * for the given module.
 */
export type ModuleDecl<CustomOptionsType extends RecordUnknown = never> =
    Readonly<{
        Name: string;
        Options: ModuleOptions<CustomOptionsType>;
    }>;

/**
 * The data used to declare an auto-generated module such that this is the value
 * of a property in a {@link Record}, whose key is the name of the module.
 *
 * For convenience, if you wish to use a {@link ModulesDeclRecord} to declare
 * your modules, but not all of your modules have options, then you may use
 * `undefined` in place of a {@link ModuleDeclProperty}.
 *
 * @template CustomOptionsType - The custom options that the provider specifies
 * for this module, if any (otherwise, `never`).
 */
export type ModuleDeclProperty<CustomOptionsType extends RecordUnknown = never> =
    Omit<ModuleDecl<CustomOptionsType>, "Name">;

/**
 * The options for a given provider.
 *
 * @template CustomOptionsType - The custom options that the provider specifies
 * for this provider, if any (otherwise, `never`).
 */
export type ManifestOptions<CustomOptionsType extends RecordUnknown = never> =
    WithCustomOptions<ManifestOptionsBase, CustomOptionsType>;

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A {@link Record} that declares the auto-generated modules of a given provider,
 * such that the keys are the names of the modules.
 */
export type ModulesDeclRecord = Readonly<Record<string, ModuleDeclProperty<any> | undefined>>;

export type ModulesDeclArray<
    ElementType extends string | ModuleDecl<any> = string | ModuleDecl<any>
> = ReadonlyArray<ElementType>;

/**
 * The declaration of auto-generated modules that a given provider can generate.
 * It can be a {@link ReadonlyArray}, or a {@link ModulesDeclRecord}.  Both types
 * allow for any mix of modules that do or do not have options.
 *
 * @template ElementType - If this is a {@link ReadonlyArray}, then this is the type
 * of the elements within the {@link ReadonlyArray}.  If a given module does not specify
 * any options, then this may just be the `string` name of the module, otherwise the element
 * must be a {@link ModuleDecl}.  This {@link ReadonlyArray} may mix both element types.
 */
export type ModulesDecl<
    ElementType extends string | ModuleDecl<any> = string | ModuleDecl<any>
> =
    | ModulesDeclArray<ElementType>
    | ModulesDeclRecord;

/**
 * The type used to specify default values for options of a given manifest.
 *
 * @template CustomOptionsType - The custom options for the given manifest, if any.
 * If there are custom options, then a default value *must* be provided (the
 * {@link ManifestOptionsBase | base options}, however, do *not* require default values).
 */
export type ManifestDefaultOptions<
    CustomOptionsType extends RecordUnknown = never
> =
    Readonly<TSafeIntersection<
        ManifestOptionsBase,
        Required<CustomOptionsType>
    >>;

/**
 * The {@link Record} that declares all information needed by `code-auger` to generate code
 * from that provider.
 */
export type Manifest<CustomOptionsType extends RecordUnknown = never> =
    Readonly<{
        DefaultOptions: ManifestDefaultOptions<CustomOptionsType>;
        Modules: ModulesDecl;
    }>;

/* eslint-enable @typescript-eslint/no-explicit-any */
