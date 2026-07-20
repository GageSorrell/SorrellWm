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
        effect: "./Source/Effect/index.ts",
        index: "./Source/index.ts"
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
