/**
 * @file      esbuild.config.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { build as Build } from "esbuild";
import { rm as RemoveDirectory } from "node:fs/promises";
import Tsover from "tsover/plugin/esbuild";

const SourceEntryPoint: string = "Source/index.ts";
const DistributionDirectory: string = "Distribution";
const TypeScriptConfigPath: string = "tsconfig.esbuild.json";

function CreateSharedOptions()
{
    return {
        bundle: true,
        entryPoints:
        {
            index: "./Source/index.ts",

            array: "./Source/Array/index.ts",
            async: "./Source/Async/index.ts",
            complex: "./Source/Math/Complex.ts",
            effect: "./Source/Effect/index.ts",
            fs: "./Source/FileSystem/index.ts",
            functional: "./Source/Functional/index.ts",
            math: "./Source/Math/index.ts",
            misc: "./Source/Miscellaneous/index.ts",
            npm: "./Source/Npm/index.ts",
            path: "./Source/Path/index.ts"
        },
        logLevel: "info",
        packages: "external",
        platform: "neutral",
        plugins: [
            Tsover({
                tsconfigPath: TypeScriptConfigPath
            })
        ],
        sourcemap: true,
        target: [ "es2021" ],
        tsconfig: TypeScriptConfigPath,
    };
}

await RemoveDirectory(DistributionDirectory, {
    force: true,
    recursive: true
});

await Promise.all([
    Build({
        ...CreateSharedOptions(),
        format: "esm",
        outdir: "./Distribution/ESM/"
    }),

    Build({
        ...CreateSharedOptions(),
        format: "cjs",
        outdir: "./Distribution/CJS/"
    })
]);
