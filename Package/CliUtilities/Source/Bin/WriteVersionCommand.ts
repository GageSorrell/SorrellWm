/**
 * @file      WriteVersionCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, Command } from "@effect/cli";
import { Console, Effect, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import Chalk from "chalk";
import { Code } from "../Format/Format.js";
import { GetPackageJson } from "@sorrell/utilities/npm/effect";
import type { IPackageJson } from "package-json-type";
import type { PlatformError } from "@effect/platform/Error";

const DefaultModuleName: string = "Version.ts";

const WriteVersionConfig: { Out: Args.Args<string>; } =
    {
        Out: pipe(
            Args.file({ exists: "either", name: "out" }),
            Args.withDefault(`./${ DefaultModuleName }`),
            Args.withDescription(
                `The path to where the exported version ${ Code("string") } will be written.`
            )
        )
    };

type Options =
    Readonly<{
        Out: string;
    }>;

type HandleWriteVersionEffect =
    Effect.Effect<
        void,
        | PackageJsonParseError
        | RootDirectoryNotFoundError
        | PlatformError,
        | EffectPath.Path
        | FileSystem.FileSystem
    >;

/* eslint-disable-next-line jsdoc/require-jsdoc */
function HandleWriteVersion({ Out }: Options): HandleWriteVersionEffect
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const HasTsExtension: boolean =
            [ ".ts", ".mts", ".cts" ].some((Extension: string) => Out.endsWith(Extension));

        const NormalizedOutPath: string = yield* Effect.gen(function* ()
        {
            const OutAbsolute: string = Path.resolve(process.cwd(), Out);

            return HasTsExtension
                ? OutAbsolute
                : Path.resolve(OutAbsolute, DefaultModuleName);
        });

        const DirectoryExists: boolean = yield* Fs.exists(Path.dirname(NormalizedOutPath));

        if (!DirectoryExists)
        {
            yield* Fs.makeDirectory(Path.dirname(NormalizedOutPath), { recursive: true });
        }

        const PackageJson: IPackageJson = yield* GetPackageJson();

        if (!("version" in PackageJson) || PackageJson.version === undefined)
        {
            return yield* Effect.dieMessage(
                `Your ${ Code("package.json") } does not have a ${ Code("\"version\"") } property.`
            );
        }

        const PackageVersion: string = PackageJson.version;

        const ModuleContents: string = `/* eslint-disable */

export const Version: string = "v${ PackageVersion }";
`;

        yield* Fs.writeFileString(NormalizedOutPath, ModuleContents);

        Console.log(
            `${ Chalk.green("✔") } Successfully wrote version v${ PackageVersion } ` +
            `to ${ Path.basename(NormalizedOutPath) }.`
        );
    });
}

type WriteVersionCommand =
    Command.Command<
        "write-version",
        | EffectPath.Path
        | FileSystem.FileSystem,
        | PackageJsonParseError
        | RootDirectoryNotFoundError
        | PlatformError,
        { readonly Out: string; }
    >;

export/**
       * Write a module at a given path that exports a `const Version: string` that
       * is the `"version"` property of the package's `package.json`.
       */
const WriteVersionCommand: WriteVersionCommand =
    Command.make("write-version", WriteVersionConfig, HandleWriteVersion);
