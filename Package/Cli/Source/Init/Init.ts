/**
 * @file      Init.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, Command, Options } from "@effect/cli";
import type { FTsConfig, TMutable } from "@sorrell/utilities/misc";
import { promises as Fs, existsSync } from "fs";
import { GlobalOptions, MakeConfig } from "../Options/Options.js";
import {
    type InitCommandType,
    type InitConfig,
    type InitEffect,
    type InitError,
    type InitOptions,
    InitPlainError,
    InitRichError,
    type PackageType
} from "./Init.Types.js";
import { Code } from "@sorrell/cli-utilities/format";
import { Console } from "effect";
import { Effect } from "effect";
import type { IPackageJson } from "package-json-type";
import { Spawn } from "@sorrell/cli-utilities/pty";
import { resolve } from "path";

function GetLogStep(silent: InitOptions["silent"]): ((Message: string) => void)
{
    return silent
        ? function(_: string): void { }
        : function(Message: string): void
        {
            Console.log(Message);
        };
}

const Config: InitConfig = MakeConfig({
    internal: Options.boolean("internal"),
    isPrivate: Options.boolean("private"),
    name: Args.text({ name: "name" }),
    packageType: Args.choice([ [ "electron", "electron" ], [ "none", "none" ], [ "script", "script" ] ]),
    tsover: Options.boolean("tsover"),
    ...GlobalOptions
});

export/**
       * The `init` command of `@sorrell/cli`.
       */
const InitCommand: InitCommandType = Command.make("init", Config, CommandMain);

async function GetTsConfig({
    packageType,
    tsover
}: Omit<InitOptions, "internal" | "isPrivate" | "name" | "silent">): Promise<FTsConfig>
{
    const BaseBase: FTsConfig =
        {
            exclude: [ "Distribution", "node_modules" ],
            include: [ "Source/**/*" ]
        };

    const ScriptBase: FTsConfig =
        {
            compilerOptions:
            {
                declaration: true,
                declarationMap: true,
                exactOptionalPropertyTypes: true,
                isolatedModules: true,
                jsx: "react-jsx",
                lib: [ "ES2023" ],
                module: "nodenext",
                moduleResolution: "nodenext",
                noEmitOnError: true,
                noUncheckedIndexedAccess: true,
                outDir: "./Distribution",
                rootDir: "./Source",
                skipLibCheck: true,
                sourceMap: true,
                strict: true,
                target: "esnext",
                types: [ "node" ],
                useUnknownInCatchVariables: true,
                verbatimModuleSyntax: true
            },
            ...BaseBase
        };

    const ElectronBase: FTsConfig =
        {
            compilerOptions:
            {
                allowJs: true,
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
                incremental: true,
                jsx: "react-jsx",
                lib: [ "dom", "es2022" ],
                module: "node16",
                moduleResolution: "node16",
                outDir: ".erb/dll",
                resolveJsonModule: true,
                sourceMap: true,
                strict: true,
                target: "es2022"
            },
            ...BaseBase
        };

    const NoneBase: FTsConfig =
        {
            compilerOptions:
            {
                declaration: true,
                declarationMap: true,
                exactOptionalPropertyTypes: true,
                isolatedModules: true,
                jsx: "react-jsx",
                lib: [ "esnext" ],
                module: "nodenext",
                moduleDetection: "force",
                noUncheckedIndexedAccess: true,
                noUncheckedSideEffectImports: true,
                outDir: "./Distribution",
                rootDir: "./Source",
                skipLibCheck: true,
                sourceMap: true,
                strict: true,
                target: "esnext",
                types: [ ],
                verbatimModuleSyntax: true
            },
            ...BaseBase
        };

    const Bases: Record<PackageType, FTsConfig> =
        {
            electron: ElectronBase,
            none: NoneBase,
            script: ScriptBase
        };

    const Out: FTsConfig = Bases[packageType];

    if (tsover)
    {
        Out.compilerOptions = Out.compilerOptions || { };
        Out.compilerOptions.incremental = false;
        Out.compilerOptions.lib = [ "tsover", ...(Out.compilerOptions.lib || [ ]) ];
    }

    return Out;
}

async function GetPackageJson({
    internal,
    isPrivate,
    name,
    packageType,
    tsover
}: Omit<InitOptions, "silent">): Promise<IPackageJson>
{
    const MonorepoBaseUrl: string = "https://github.com/GageSorrell/SorrellWm";

    const Dependencies: IPackageJson = ((): IPackageJson =>
    {
        const dependencies: IPackageJson["dependencies"] = { };
        const devDependencies: IPackageJson["dependencies"] = { };

        if (internal && packageType === "script")
        {
            dependencies["@sorrellwm/script-utility"] = "workspace:^";
        }

        if (tsover)
        {
            devDependencies.typescript = "npm:tsover^6.0.0";
            devDependencies.tsover = "tsover^6.0.0";
            dependencies["tsover-runtime"] = "tsover-runtime@latest";
        }
        else
        {
            devDependencies.typescript = "typescript@^6.0.3";
        }

        if (packageType === "script")
        {
            dependencies["@sorrell/cli-utilities"] = "@sorrell/cli-utilities@latest";
            devDependencies["@types/node"] = "@types/node@24.14.0";
        }

        dependencies["@sorrell/utilities"] = "@sorrell/utilities@latest";

        return {
            dependencies,
            devDependencies
        };
    })();

    const overrides: IPackageJson["overrides"] | undefined =
        tsover
            ? {
                typescript: "npm:tsover@^6.0.0"
            }
            : undefined;

    const exports: IPackageJson["exports"] | undefined = ((): IPackageJson["exports"] | undefined =>
    {
        if (packageType === "script")
        {
            return undefined;
        }
        else
        {
            return tsover
                ? {
                    ".":
                    {
                        default: "./Distribution/ESM/index.js",
                        import: "./Distribution/ESM/index.js",
                        require: "./Distribution/CJS/index.js",
                        types: "./Distribution/Types/index.d.ts"
                    }
                }
                : {
                    ".": "./Distribution/index.js"
                };
        }
    })();

    const scripts: IPackageJson["scripts"] =
        tsover
            ? {
                build: "npm run build:js && npm run build:types",
                "build:js": "node esbuild.config.mts",
                "build:types": "tsc -p tsconfig.types.json"
            }
            : {
                build: "tsc -p ./tsconfig.json"
            };

    const Out: TMutable<IPackageJson, false> =
        {
            author: {
                email: "gage@sorrell.sh",
                name: "Gage Sorrell",
                url: "https://sorrell.sh"
            },
            bugs: {
                url: `${ MonorepoBaseUrl }/issues`
            },
            description: "@TODO",
            engines: {
                node: ">=24.14.0 <25"
            },
            files:
            [
                "./Distribution/**/*",
                "./ReadMe.md",
                "./package.json"
            ],
            homepage: MonorepoBaseUrl,
            keywords: [ "@TODO" ],
            license: "MIT",
            name,
            private: isPrivate,
            repository: {
                type: "git",
                url: `git+${ MonorepoBaseUrl }.git`
            },
            scripts,
            type: "module",
            types: "./Distribution/index.d.ts",
            version: "1.0.0",

            ...Dependencies,
            ...((exports !== undefined) ? { exports } : { }),
            ...((overrides !== undefined) ? { overrides } : { })
        };

    return Out;
}

async function WriteFile(Path: string, Contents: unknown): Promise<void>
{
    const OutContents: string = typeof Contents === "string"
        ? Contents
        : JSON.stringify(Contents);

    return Fs.writeFile(Path, OutContents, { encoding: "utf-8" });
}

function Main(AllOptions: InitOptions): () => Promise<void>
{
    const { silent, ...Options } = AllOptions;

    const LogStep: ((Message: string) => void) = GetLogStep(silent);

    return async function(): Promise<void>
    {
        // 1. Create `package.json`
        LogStep(`Writing ${ Code("package.json") }... `);
        const PackageJson: IPackageJson = await GetPackageJson(Options);
        const PackageJsonPath: string = resolve("./package.json");
        const AlreadyExists: boolean = existsSync(PackageJsonPath);
        if (AlreadyExists)
        {
            throw new InitRichError({
                Stringified: "package.json already exists in this directory."
            });
        }

        await WriteFile(PackageJsonPath, PackageJson);

        // 2. Create `Source` directory
        await Fs.mkdir(resolve("./Source"));

        // 3. Create `tsconfig.json`
        await WriteFile(
            resolve("./tsconfig.json"),
            await GetTsConfig(Options)
        );

        // 4. Create `.npmignore` if `!internal`
        if (!Options.internal)
        {
            if (!silent)
            {
                LogStep("Writing .npmignore...");
            }
            await Fs.writeFile(
                resolve("./.npmignore"),
                "!Distribution\nSource\nnode_modules",
                { encoding: "utf-8" }
            );
        }

        // 5. Run `yarn install`
        await Spawn("yarn", [ "install" ]).OnExit;

        // 6. Create ReadMe
        await Fs.writeFile(resolve("./ReadMe.md"), `# \`${ Options.name }\`\n`, { encoding: "utf-8" });
    };
}

function CommandMain(Options: InitOptions): InitEffect
{
    return Effect.gen(function*()
    {
        yield* Effect.fail(new InitRichError({ Stringified: "" }));

        yield* Effect.try<void, InitError>({
            catch(Cause: unknown): InitError
            {
                try
                {
                    return new InitRichError({
                        Stringified: JSON.stringify(Cause)
                    });
                }
                catch
                {
                    return new InitPlainError();
                }

            },
            try: Main(Options)
        });
    });
}
