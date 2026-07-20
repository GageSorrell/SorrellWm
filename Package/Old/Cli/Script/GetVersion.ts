/**
 * @file      GetVersion.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import Chalk from "chalk";
import { Code } from "@sorrell/cli-utilities/format";
import { promises as Fs } from "fs";
import { resolve } from "path";

/* eslint-disable no-console */

/**
 * All CLI commands have `version` that is this package's version.
 *
 * @throws {Error} If it cannot find or get a valid semver from this package's `package.json`.
 *
 * @returns {Promise<string>} The version of this package, prepended with a `"v"`.
 */
async function GetVersion(): Promise<string>
{
    console.log(resolve("."));
    const PackageJsonPath: string = resolve(".", "package.json");

    const FileContents: string = await Fs.readFile(PackageJsonPath, "utf-8");

    const PackageJson: IPackageJson = await (async (): Promise<IPackageJson> =>
    {
        try
        {
            return JSON.parse(FileContents) as IPackageJson;
        }
        catch (Cause: unknown)
        {
            throw new PackageJsonParseError({ Cause, Path: PackageJsonPath });
        }
    })();

    return "v" + (PackageJson.version || "");
};

/**
 * Updates the `Version` constant in {@link ../Source/Bin/Bin.ts}.
 */
async function Main(): Promise<void>
{
    console.log(`Reading ${ Code("package.json") } to find the current version...`);
    const Version: string = await GetVersion();
    if (Version === "")
    {
        console.error(
            `${ Chalk.redBright.bold("✘") } Did not find a valid ${ Code("version") } in the package's ` +
            `${ Code("package.json") }.  Exiting...`
        );

        process.exit(1);
    }

    console.log(
        `${ Chalk.green.bold("✓") } Found version ${ Code(Version) } listed in the ` +
        `package's ${ Code("package.json") }!`
    );
    console.log(`Reading ${ Code("Bin.ts") }...`);
    const BinModulePath: string = resolve("Source", "Bin", "Bin.ts");
    const BinLines: Array<string> = [ ];

    try
    {
        BinLines.push(...(await Fs.readFile(
            BinModulePath,
            { encoding: "utf-8" }
        )).split("\n"));
    }
    catch
    {
        console.error(
            `${ Chalk.redBright.bold("✘") } Could not read ${ Code("Bin.ts") } module.  Exiting...`
        );
        process.exit(1);
    }

    const VersionDeclarationStart: string = "const version: string =";

    const VersionLineIndex: number = BinLines.findIndex((Line: string): boolean =>
    {
        return Line.includes(VersionDeclarationStart);
    });

    if (VersionLineIndex === -1)
    {
        console.error(
            `${ Chalk.redBright.bold("✘") } Could not find line in ${ Code("Bin.ts") } where ` +
            `${ Code("version") } is defined.  Exiting...`
        );

        process.exit(1);
    }
    else
    {
        console.log(
            `${ Chalk.green.bold("✓") } Found ${ Code("version") } declaration ` +
            `at line ${ VersionLineIndex }!`
        );
    }

    const NewVersionDeclaration: string = `    const version: string = "${ Version }";`;

    BinLines.splice(VersionLineIndex, 1, NewVersionDeclaration);

    console.log(`Writing updated ${ Code(`version === ${ Version }`) } to ${ Code("Bin.ts") }...`);

    try
    {
        await Fs.writeFile(BinModulePath, BinLines.join("\n"), { encoding: "utf-8" });
    }
    catch
    {
        console.error(
            `${ Chalk.redBright.bold("✘") } Failed to write new ${ Code("version") } declaration ` +
            `in ${ Code("Bin.ts") } module.  Exiting...`
        );

        process.exit(1);
    }

    console.log(
        `${ Chalk.green.bold("✓") } Wrote updated ${ Code("version") } declaration ` +
        `to ${ Code("Bin.ts") } module.`
    );
}

Main();
