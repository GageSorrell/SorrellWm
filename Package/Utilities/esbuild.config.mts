/**
 * @file      esbuild.config.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { build as Build, type BuildOptions } from "esbuild";
import { rm as RemoveDirectory, writeFile as WriteFile } from "node:fs/promises";
import Tsover from "tsover/plugin/esbuild";

const DistributionDirectory: string = "Distribution";
const TypeScriptConfigPath: string = "tsconfig.esbuild.json";

const EntryPoints: Record<string, string> =
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
        "npm-effect": "./Source/Npm/Index.Effect.ts",
        path: "./Source/Path/index.ts",
        record: "./Source/Record/index.ts"
    } as const;

type FPackageExport =
    {
        import:
        {
            types: string;
            default: string;
        };

        require:
        {
            types: string;
            default: string;
        };
    };

function CreateSharedOptions(): BuildOptions
{
    return {
        bundle: true,
        entryNames: "[name]",
        entryPoints: EntryPoints,
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

function CreatePackageExportPath(EntryPointName: string): string
{
    if (EntryPointName === "index")
    {
        return ".";
    }

    return `./${EntryPointName}`;
}

function CreatePackageExports(OutputDirectoryPrefix: string): Record<string, FPackageExport>
{
    const PackageExports: Record<string, FPackageExport> = { };

    for (const EntryPointName of Object.keys(EntryPoints))
    {
        const ExportPath: string = CreatePackageExportPath(EntryPointName);

        PackageExports[ExportPath] = {
            import: {
                default: `${OutputDirectoryPrefix}/${EntryPointName}.js`,
                types: `${OutputDirectoryPrefix}/${EntryPointName}.d.mts`
            },

            require: {
                default: `${OutputDirectoryPrefix}/${EntryPointName}.cjs`,
                types: `${OutputDirectoryPrefix}/${EntryPointName}.d.cts`
            }
        };
    }

    return PackageExports;
}

await RemoveDirectory(DistributionDirectory, {
    force: true,
    recursive: true
});

await Promise.all([
    Build({
        ...CreateSharedOptions(),
        format: "esm",
        outdir: DistributionDirectory
    }),

    Build({
        ...CreateSharedOptions(),
        format: "cjs",
        outExtension: {
            ".js": ".cjs"
        },
        outdir: DistributionDirectory
    })
]);

await WriteFile(
    `${DistributionDirectory}/PackageExports.Generated.json`,
    `${JSON.stringify(CreatePackageExports("./Distribution"), undefined, 4)}\n`
);
