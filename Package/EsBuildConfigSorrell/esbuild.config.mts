/**
 * This module provides full configuration for {@link https://www.npmjs.com/package/esbuild | ESBuild},
 * for the packages in this monorepo that provide exports for `CommonJS` *and* `ESM` packages, *and*
 * types, which are provided in *both* `*.d.cts` and `*.d.mts` form.
 *
 *
 * @module @sorrell/esbuild-config
 *
 * @file      esbuild.config.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { build as Build, type BuildOptions } from "esbuild";
import { promises as Fs, existsSync } from "node:fs";
import Tsover from "tsover/plugin/esbuild";
import { resolve } from "node:path";

export type FTsModulePath = `${ string }.ts`;

export type FExports = Record<string, FTsModulePath>;

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

export type FSorrellBuildOptions =
    {
        OutDir: string;
        TypeScriptConfigPath: string;
    };

export type FBuildOptions =
    FSorrellBuildOptions &
    BuildOptions;

export const DefaultOptions: Readonly<FBuildOptions> =
    {
        OutDir: "Distribution",
        TypeScriptConfigPath: "tsconfig.esbuild.json"
    } as const;

function CreateSharedOptions(
    TypeScriptConfigPath: string,
    Exports: FExports,
    BuildOptions: FBuildOptions
): BuildOptions
{
    return {
        bundle: true,
        entryNames: "[name]",
        entryPoints: Exports,
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
        ...BuildOptions
    };
}

function CreatePackageExports(
    OutputDirectoryPrefix: string,
    Exports: FExports
): Record<string, FPackageExport>
{
    const PackageExports: Record<string, FPackageExport> = { };

    for (const ExportPath of Object.keys(Exports))
    {
        PackageExports[ExportPath] = {
            import: {
                default: `${ OutputDirectoryPrefix }/${ ExportPath }.js`,
                types: `${ OutputDirectoryPrefix }/${ ExportPath }.d.mts`
            },

            require: {
                default: `${ OutputDirectoryPrefix }/${ ExportPath }.cjs`,
                types: `${ OutputDirectoryPrefix }/${ ExportPath }.d.cts`
            }
        };
    }

    return PackageExports;
}

async function CheckExports(Exports: FExports): Promise<boolean>
{
    const PackageJsonPath: string = resolve("./package.json");

    if (!existsSync(PackageJsonPath))
    {
        throw new Error("Could not find package.json!  Exiting...");
    }

    const PackageJsonContents: string =
        await Fs.readFile(resolve("./package.json"), { encoding: "utf-8" });

    const PackageJsonParsed: Record<string, unknown> = JSON.parse(PackageJsonContents);

    if (!(PackageJsonParsed !== null && "exports" in PackageJsonParsed))
    {
        throw new Error("No exports property was found in package.json!  Exiting...");
    }

    const ExportsRecord: Record<string, unknown> = PackageJsonParsed.exports as Record<string, unknown>;

    // const PackageJsonExports: ReadonlyArray<string> = Object.keys(PackageJsonParsed.exports);
    const PackageJsonExports: ReadonlyArray<string> = ((): ReadonlyArray<string> =>
    {
        const Raw: Array<string> = Object.keys(ExportsRecord);
        Raw.splice(Raw.indexOf("."), 1, "index");

        return Raw.map((RawKey: string): string =>
        {
            return (RawKey.startsWith("./")
                ? RawKey.slice(2)
                : RawKey).replaceAll("/", "-");
        });
    })();

    const ExportsKeys: ReadonlyArray<string> = Object.keys(Exports);

    const ExportsMatch: boolean = (
        ExportsKeys.length === PackageJsonExports.length &&
        ExportsKeys.every((Export: string) => PackageJsonExports.includes(Export))
    );

    if (!ExportsMatch)
    {
        const Mismatches: Array<string> = ExportsKeys.filter((ExportKey: string): boolean =>
        {
            return !PackageJsonExports.includes(ExportKey);
        });

        const OtherMismatches: Array<string> = PackageJsonExports.filter((PackageJsonExport: string): boolean =>
        {
            return !ExportsKeys.includes(PackageJsonExport);
        });

        throw new Error(
            "The exports declared in this ESBuild config did not match the package's package.json!\n\n" +
            (Mismatches.length > 0
                ? "Mismatches were,\n\n" + Mismatches.map(M => `  * "${ M }"`).join("\n") + "\n\n"
                : ""
            ) +
            "Missing PackageJsonExports were,\n\n" + OtherMismatches.map(M => `  * "${ M }"`).join("\n")
        );

        // throw new Error(
        //     "The exports declared in this ESBuild config did not match the package's package.json!\n\n" +
        //     (Mismatches.length > 0
        //         ? "The mismatches are,\n  * " + Mismatches.map(Mismatch => `"${ Mismatch }"`).join("\n  * ")
        //         : "Ther "
        //     ) +
        //     "\n  * " +
        //      +
        //     "\nAnd ExportsKeys were,\n  * " +
        //     ExportsKeys.join("\n  * ") + "\nExiting..."
        // );
    }

    return true;
}

/**
 * Provides full configuration for {@link https://www.npmjs.com/package/esbuild | ESBuild},
 * for the packages in this monorepo that provide exports for `CommonJS` *and* `ESM` packages, *and*
 * types, which are provided in *both* `*.d.cts` and `*.d.mts` form.
 *
 * @param Exports - The named exports.  There must exist an entry for each named export in the
 * package's `package.json`.
 *
 * @param Options - Other options for building the package.
 */
export async function Run(
    Exports: FExports,
    Options: Partial<FBuildOptions> = DefaultOptions
): Promise<void>
{
    const { OutDir, TypeScriptConfigPath, ...InBuildOptions } = { ...DefaultOptions, ...Options };

    const BuildOptions: FSorrellBuildOptions = InBuildOptions as FSorrellBuildOptions;

    await Fs.rm(
        OutDir,
        {
            force: true,
            recursive: true
        }
    );

    const AreExportsValid: boolean = await CheckExports(Exports);

    if (!AreExportsValid)
    {
        throw new Error(
            "The exports passed to this function did not match the exports in " +
            "the package's package.json!  Exiting..."
        );
    }

    await Promise.all([
        Build({
            ...CreateSharedOptions(TypeScriptConfigPath, Exports, BuildOptions),
            format: "esm",
            outdir: OutDir
        }),

        Build({
            ...CreateSharedOptions(TypeScriptConfigPath, Exports, BuildOptions),
            format: "cjs",
            outExtension:
                {
                    ".js": ".cjs"
                },
            outdir: OutDir
        })
    ]);

    const OutPath: string = `${ OutDir }/PackageExports.Generated.json`;
    const OutContents: string =
        `${ JSON.stringify(CreatePackageExports("./Distribution", Exports), undefined, 4) }\n`;

    await Fs.writeFile(OutPath, OutContents);
}
