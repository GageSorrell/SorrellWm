/**
 * @file      esbuild.config.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Run, type FExports } from "../../Configuration/esbuild.config.mts";

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
        math: "./Source/Math/index.ts",
        misc: "./Source/Miscellaneous/index.ts",
        npm: "./Source/Npm/index.ts",
        "npm-effect": "./Source/Npm/Index.Effect.ts",
        path: "./Source/Path/index.ts",
        record: "./Source/Record/index.ts"
    } as const;

await Run(EntryPoints);
