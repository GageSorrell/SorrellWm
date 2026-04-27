/**
 * @file      Npm.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { promises as Fs, constants as FsConstants } from "fs";
import { PackageJsonParseError, RootDirectoryNotFoundError } from "./Npm.Error.ts";
import { dirname, join } from "path";
import type { IPackageJson } from "package-json-type";
import Process from "process";

/**
 * Get the `package.json` of the Node.js project in which the
 * given path, or the current working directory, resides.
 *
 * @param Path - The given path from which to look for a root directory.
 *
 * @throws {RootDirectoryNotFoundError | PackageJsonParseError} An error
 * describing either failure to identify a root directory, or failing to
 * parse the discovered `package.json`.
 *
 * @returns {Promise<IPackageJson>} The {@link IPackageJson} of {@link Path}
 * if provided, otherwise of `process.cwd()`.
 *
 * @example
 * Suppose `process.cwd() === "./MyPackage"`,
 * ```typescript
 * const PackageJson: IPackageJson = await GetPackageJson();
 * // `PackageJson` <- *The parsed `package.json` of `MyPackage`.*
 * ```
 */
export async function GetPackageJson(Path?: string): Promise<IPackageJson>
{
    const RootDirectory: string = await GetPackageRootDirectory(Path);
    const PackageJsonPath: string = join(RootDirectory, "package.json");

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
    });

    return PackageJson;
}

/**
 * Get the root directory of the Node.js project in which the
 * current working directory resides.
 *
 * @param Path - The given path from which to look for a root directory.
 *
 * @throws {RootDirectoryNotFoundError} An error iff the root directory
 * of a NodeJS package could not be found.
 *
 * @returns {Promise<string>} The path to the root directory of the package
 * containing {@link Path} if specified, otherwise containing `process.cwd()`.
 *
 * @example
 * Suppose `process.cwd()` is any one of the following,
 *   - `/home/alex/myPackage`,
 *   - `/home/alex/myPackage/src/MyModule`,
 *   - `/home/alex/myPackage/resource/Images`,
 *
 * then,
 *
 * ```typescript
 * const Root: string = await GetPackageRootDirectory();
 * // `Root` <- `"/home/alex/myPackage"`
 * ```
 *
 * @example
 * Suppose `TestPath === "/home/alex/Documents"` is *not* a NodeJS package root
 * (of course, neither are `/home/alex` or `/home`).  Then,
 *
 * ```typescript
 * const TestPath: string = "/home/alex/Documents";
 * let Root: string | undefined = undefined;
 * try
 * {
 *     Root = await GetPackageRootDirectory(TestPath);
 * }
 * catch (Error: unknown)
 * {
 *      // `Error instanceof RootDirectoryNotFound`
 * }
 *
 * // `Root` <- `undefined`
 * ```
 *
 * @example
 * Suppose `process.cwd() === /home/alex/Downloads`, which is *not* a NodeJS package
 * (of course, neither are `/home/alex` or `/home`).  Then,
 *
 * ```typescript
 * let Root: string | undefined = undefined;
 * try
 * {
 *     Root = await GetPackageRootDirectory();
 * }
 * catch (Error: unknown)
 * {
 *      // `Error instanceof RootDirectoryNotFound`
 * }
 * // `Root` <- `undefined`
 * ```
 */
export async function GetPackageRootDirectory(Path?: string): Promise<string>
{
    let CurrentDirectory: string = await Fs.realpath(Path ?? Process.cwd());

    while (true)
    {
        const PackageJsonPath: string = join(CurrentDirectory, "package.json");

        const PackageJsonExists: boolean = await (async (): Promise<boolean> =>
        {
            try
            {
                await Fs.access(PackageJsonPath, FsConstants.F_OK);
                return true;
            }
            catch
            {
                return false;
            }
        })();

        if (PackageJsonExists)
        {
            return CurrentDirectory;
        }

        const ParentDirectory: string = dirname(CurrentDirectory);

        if (ParentDirectory === CurrentDirectory)
        {
            throw new RootDirectoryNotFoundError({ Path });
        }

        CurrentDirectory = ParentDirectory;
    }
}
