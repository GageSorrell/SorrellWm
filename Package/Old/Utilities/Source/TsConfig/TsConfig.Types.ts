/**
 * @file      TsConfig.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type TypeScript from "typescript";

/* eslint-disable jsdoc/require-jsdoc */

export type FOverriddenCompilerOptions =
    | "jsx"
    | "lib"
    | "module"
    | "moduleResolution"
    | "target";

export type FCompilerOptions =
    Omit<TypeScript.server.protocol.CompilerOptions, FOverriddenCompilerOptions> &
    Partial<{
        jsx: JsxEmit;
        lib: Array<string>;
        module: FModuleKind;
        moduleResolution: FModuleResolutionKind;
        target: FTarget;
    }>;

export type JsxEmit =
    | "none"
    | "preserve"
    | "react-native"
    | "react"
    | "react-jsx"
    | "react-jsxdev";

export type FModuleKind =
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

export type FModuleResolutionKind =
    | "classic"
    | "node"
    | "node"
    | "node10"
    | "node16"
    | "nodenext"
    | "bundler";

export type FTarget =
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

/* eslint-enable jsdoc/require-jsdoc */

/** The type corresponding to the schema of `tsconfig.json`. */
export interface TsConfigSchema
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
