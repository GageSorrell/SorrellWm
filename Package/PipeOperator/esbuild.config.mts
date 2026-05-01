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
            index: "./Source/index.ts"
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
        tsconfig: TypeScriptConfigPath
    };
}

await RemoveDirectory(
    DistributionDirectory,
    {
        force: true,
        recursive: true
    }
);

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
