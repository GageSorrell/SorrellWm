/**
 * @file      Init.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, Command } from "@effect/cli";
import { Effect, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import type { PackageJsonParseError, RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import { GetPackageJson } from "@sorrell/utilities/npm/effect";
import type { IPackageJson } from "../../Provider/Utility/PackageJson.Types.js";
import type { Mutable } from "@sorrell/utilities/record";
import type { PlatformError } from "@effect/platform/Error";

const DefaultManifestFileName: string = "code-auger.manifest.ts";
const DefaultManifestPath: string = `./${ DefaultManifestFileName }`;

const InitConfig: { Out: Args.Args<string>; } =
    {
        Out: pipe(
            Args.file({ exists: "no", name: "out" }),
            Args.withDefault(DefaultManifestPath),
            Args.withDescription("The path to where your empty manifest will be written.")
        )
    };

type InitOptions =
    Readonly<{
        Out: string;
    }>;

function HandleInit({ Out }: InitOptions)
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const ManifestExists: boolean = yield* Fs.exists(Path.resolve(process.cwd(), Out));

        if (ManifestExists)
        {
            return yield* Effect.dieMessage(`The manifest file ${ Out } already exists!`);
        }

        const EmptyManifest: string = `import { Manifest } from "code-auger/provider";

export const Manifest =
    {
        Modules: [ ]
    };\n`;

        yield* Fs.writeFileString(Path.resolve(Out), EmptyManifest);

        if (Out !== DefaultManifestPath)
        {
            const PackageJson: Mutable<IPackageJson> = yield* GetPackageJson();

            if (!("config" in PackageJson))
            {
                PackageJson.config = { };
            }

            if (!("code-auger" in PackageJson.config))
            {
                PackageJson.config["code-auger"] = { };
            }

            PackageJson.config["code-auger"].manifest = Path.relative(Out, process.cwd());

            yield* Fs.writeFileString(process.cwd(), "package.json");
        }
    });
}

type InitCommand =
    Command.Command<
        "init",
        | FileSystem.FileSystem
        | EffectPath.Path,
        | PlatformError
        | PackageJsonParseError
        | RootDirectoryNotFoundError,
        Readonly<{ Out: string; }>
    >;

export const InitCommand: InitCommand = Command.make("init", InitConfig, HandleInit);
