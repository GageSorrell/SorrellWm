/**
 * @file      esbuild.config.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type FExports, Run } from "../../Configuration/esbuild.config.mts";

const EntryPoints: FExports =
    {
        index: "./Source/index.ts",

        array: "./Source/Array/index.ts",
        async: "./Source/Async/index.ts",
        complex: "./Source/Math/Complex.ts",
        dependency: "./Source/Dependency/index.ts",
        "dependency-effect": "./Source/Dependency/Index.Effect.ts",
        effect: "./Source/Effect/index.ts",
        fs: "./Source/FileSystem/index.ts",
        functional: "./Source/Functional/index.ts",
        "higher-kind": "./Source/HigherKind/index.ts",
        math: "./Source/Math/index.ts",
        misc: "./Source/Miscellaneous/index.ts",
        npm: "./Source/Npm/index.ts",
        "npm-effect": "./Source/Npm/Index.Effect.ts",
        path: "./Source/Path/index.ts",
        record: "./Source/Record/index.ts",
        string: "./Source/String/index.ts",
        tsconfig: "./Source/TsConfig/index.ts",
        tuple: "./Source/Tuple/index.ts",
        type: "./Source/Type/index.ts"
    } as const;

await Run(EntryPoints);
