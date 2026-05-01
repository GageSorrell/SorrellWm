/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { NoOptions } from "./Utility.Internal.ts";
import type TypeScript from "typescript";

/**
 * @deprecated Use {@link TMutable} instead.
 *
 * Defines a type that corresponds to {@link RecordLike}, such that every
 * `readonly` modifier is removed, recursively.
 *
 * @template RecordLike - The type to make writeable.
 */
export type TDeepWriteable<RecordLike> =
    {
        -readonly [ Key in keyof RecordLike ]: TDeepWriteable<RecordLike[Key]>;
    };

/**
 * Defines a type that corresponds to {@link RecordLike}, such that every
 * `readonly` modifier is removed, recursively.
 *
 * @template RecordLike - The type to make writeable.
 * @template ShallowOption - Whether the `readonly` modifier should be stripped recursively.
 * If `true` (the default), then only the properties of the given type will have the `readonly`
 * modifier stripped (that is, if any of these properties is a {@link Record} type with `readonly`
 * modifiers, then those will *not* be removed if {@link ShallowOption} is `true`).
 */
export type TMutable<RecordLike, ShallowOption extends boolean = true> =
    ShallowOption extends false
        ? {
            -readonly [ Key in keyof RecordLike ]: RecordLike[Key];
        }
        : ShallowOption extends true
            ? {
                -readonly [ Key in keyof RecordLike ]: TMutable<RecordLike[Key]>;
            }
            : never;

/**
 * Given a {@link RecordLike | record-like type}, this type is the union
 * of the values of all properties in the {@link RecordLike | record-like type}.
 *
 * @template RecordLike - The record-like type from which this type extracts value types.
 */
export type TValues<RecordLike> = RecordLike[keyof RecordLike];

/**
 * The element type of the return value of `Object.entries()`.
 *
 * @template RecordLike - The record-like type of the argument of `Object.entries()`.
 * @template KeyType - The subset of keys used by this type.
 */
export type TEntry<
    RecordLike,
    KeyType extends keyof RecordLike = keyof RecordLike
> = [ KeyType, RecordLike[KeyType] ];

/** The type used in `OptionsType`s when no options are specified. */
export type NoOptions = typeof NoOptions;

/**
 * Define options for a given type as a union of `unique symbol` types.
 * All options must be *optional* by the type that uses these options.
 * The type that uses these options should have a type parameter `OptionsType`
 * defined with `OptionsType extends TOptions = NoOptions`.  You will have to import
 * {@link NoOptions}, but this should be done anyway, since making all options types
 * optional should be optional.  For this reason {@link NoOptions} is exported from the
 * same module as this type.
 *
 * @template OptionsType - The `unique symbol` types that act as options.
 *
 * @example * See the {@link Array.Options:type} type as an example.
 */
export type TOptions<OptionsType extends symbol = NoOptions> =
    | OptionsType
    | NoOptions;

export type TNullable<Type> =
    | Type
    | null
    | undefined;

/** An error that is thrown in default implementations of `abstract` `class`es. */
export class AbstractMethodCallError extends Error
{
    public constructor(ClassName?: string)
    {
        super(ClassName);
    }
}

/** The type corresponding to the schema of `tsconfig.json`. */
export interface FTsConfig
{
    extends?: string | Array<string>;
    files?: Array<string>;
    include?: Array<string>;
    exclude?: Array<string>;
    references?: Array<TypeScript.ProjectReference>;
    compilerOptions?: FCompilerOptions;
    watchOptions?: TypeScript.WatchOptions;
    typeAcquisition?: TypeScript.TypeAcquisition;
    compileOnSave?: boolean;
}

type FOverriddenCompilerOptions =
    | "jsx"
    | "lib"
    | "module"
    | "moduleResolution"
    | "target";

type FCompilerOptions =
    Omit<TypeScript.server.protocol.CompilerOptions, FOverriddenCompilerOptions> &
    Partial<{
        jsx: JsxEmit;
        lib: Array<string>;
        module: FModuleKind;
        moduleResolution: FModuleResolutionKind;
        target: FTarget;
    }>;

type JsxEmit =
    | "none"
    | "preserve"
    | "react-native"
    | "react"
    | "react-jsx"
    | "react-jsxdev";

type FModuleKind =
    | "none"
    | "commonjs"
    | "amd"
    | "umd"
    | "system"
    | "es6"
    | "es2015"
    | "es2020"
    | "es2022"
    | "esnext"
    | "node16"
    | "node18"
    | "node20"
    | "nodenext"
    | "preserve";

type FModuleResolutionKind =
    | "classic"
    | "node"
    | "node"
    | "node10"
    | "node16"
    | "nodenext"
    | "bundler";

type FTarget =
    | "es3"
    | "es5"
    | "es6"
    | "es2015"
    | "es2016"
    | "es2017"
    | "es2018"
    | "es2019"
    | "es2020"
    | "es2021"
    | "es2022"
    | "es2023"
    | "es2024"
    | "es2025"
    | "esnext"
    | "json"
    | "esnext"
    | "es2025";

/**
 * Maps a given {@link RecordLike} type to an identical {@link Record} type, but
 * the properties are wrapped with {@link NonNullable}.
 *
 * @template RecordLike - The `Record`-like type from which this type is defined.
 */
export type TRecordNonNullable<RecordLike> =
    {
        [ Key in keyof RecordLike ]: NonNullable<RecordLike[Key]>;
    };
