/**
 * @file      IndexCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, Options } from "@effect/cli";
import type { BadArgument, PlatformError, SystemError } from "@effect/platform/Error";
import { CliConfig, MakeConfig } from "../Config/Config.js";
import { type ConfigError, Effect, Record } from "effect";
import { type Dirent, promises as Fs } from "fs";
import type { FIndexCommand, FIndexEffect, IndexConfig, TsExtension } from "./IndexCommand.Types.js";
import type { TLocalOptions, TOptions } from "../Options/Options.Types.js";
import { Code } from "@sorrell/cli-utilities/format";
import type { FCliConfigSchema } from "../Config/Config.Types.js";
import { FStepService } from "../Effect/Effect.js";
import { FileSystem } from "@effect/platform";
import { MakeCommand } from "../Command/Command.js";
import { resolve } from "path";

// @TODO Temporary.
/* eslint-disable jsdoc/require-jsdoc */

const Config: IndexConfig = MakeConfig({
    extension: Args.choice<TsExtension>(
        [ [ "none", "none" ], [ "js", "js" ], [ "ts", "ts" ], [ "from-config", "from-config" ] ],
        { name: "extension" }
    ).pipe(Args.withDefault("from-config")).pipe(Args.withDescription("")),
    internal: Options.boolean("internal"),
    name: Args.text({ name: "name" })
});

export/**
       * The `index` command of `@sorrell/cli`.
       */
const IndexCommand: FIndexCommand = MakeCommand("index", Config, Main);

function HandleFileCreation(
    { extension, internal, name }: TLocalOptions<IndexConfig>
): Effect.Effect<
    void,
    SystemError | BadArgument | ConfigError.ConfigError, FStepService | FileSystem.FileSystem
>
{
    return Effect.gen(function*()
    {
        const { Log } = yield* FStepService;
        const { Index: Header } = yield* CliConfig;

        function GetParsedHeader(FileName: string): string
        {
            const Base: string = (Array.isArray(Header)
                ? Header.join("\n")
                : Header || "") as string;

            return Base
                .replaceAll("${ CurrentYear }", (new Date().getFullYear()).toString())
                .replaceAll("${ FileName }", FileName);
        }

        function WriteFile(
            BaseName: string,
            BaseContents: string
        ): Effect.Effect<void, PlatformError>
        {
            return Effect.gen(function*()
            {
                const FileName: string = `${ BaseName }.ts`;
                Log(`Writing ${ FileName }...`);

                const Contents: string = GetParsedHeader(FileName) + BaseContents;
                yield* Fs.writeFileString(resolve(`./${ name }/${ FileName }`), Contents);
            });
        }

        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;

        const BaseNames: ReadonlyArray<string> =
            [
                name,
                `${ name }.Types`,
                "index",
                ...(internal ?
                    [
                        `${ name }.Internal`,
                        `${ name }.Internal.Types`
                    ] : [ ])
            ];

        const FileExtension: string = extension === "none"
            ? `.${ extension }`
            : "";

        const IndexContents: string = `export * from "./${ name }${ FileExtension }";`;

        const FilesWithContent: Record<string, string> =
            Record.fromIterableWith(BaseNames, (BaseName: string): [ string, string ] =>
            {
                const Contents: string = (BaseName === "index")
                    ? IndexContents
                    : "\n";

                return [ BaseName, Contents ] as const;
            });

        yield* Effect.all(Record.collect(FilesWithContent, WriteFile));
    });
}

function HandleDirectory(Name: TOptions<IndexConfig>["name"]): Effect.Effect<boolean, unknown, FStepService>
{
    return Effect.gen(function*()
    {
        const { Log } = yield* FStepService;
        Log(`Checking whether ${ Code(Name) } already exists...`);

        // const Fs = yield* FileSystem.FileSystem;
        function ReadDirectory(Path: string): Effect.Effect<Array<Dirent>, unknown, never>
        {
            type FOptions = Readonly<{
                encoding?: BufferEncoding | null | undefined;
                withFileTypes: true;
                recursive?: boolean | undefined;
            }>;
            const Options: FOptions =
                {
                    encoding: undefined,
                    recursive: false,
                    withFileTypes: true
                } as const;

            return Effect.tryPromise(() => Fs.readdir(Path, Options));
        }

        const Entries: Array<Dirent> = yield* ReadDirectory(resolve("."));

        const DirectoryExists: boolean = Entries.some(({ isDirectory, name }: Dirent): boolean =>
        {
            return (
                Name === name &&
                isDirectory()
            );
        });

        if (DirectoryExists)
        {
            Log(`Found directory ${ Code(Name) }; checking whether it is empty...`);
            const DirectoryEntries: Array<Dirent> = yield* ReadDirectory(resolve(`./${ Name }`));
            return DirectoryEntries.length === 0;
        }

        return true;
    });
}

function Main(InOptions: TOptions<IndexConfig>): FIndexEffect
{
    const { name } = InOptions;

    return Effect.gen(function*()
    {
        const Config: FCliConfigSchema = yield* CliConfig;

        const extension: TsExtension = (InOptions.extension === "from-config")
            ? (Config.Index.Extension || "js").toLowerCase() as TsExtension
            : InOptions.extension;

        const Options: TLocalOptions<IndexConfig> = { ...InOptions, extension };

        const { Log } = yield* FStepService;
        const DirectorySuccess: boolean = yield* HandleDirectory(name);
        if (!DirectorySuccess)
        {
            Log(`Directory ${ Code(name) } already exists and is nonempty.  Exiting...`);
            throw new Error();
        }

        yield* HandleFileCreation(Options);
    })
        .pipe(Effect.catchAll((_ErrorValue: unknown) => Effect.succeed(false)));
}

// 1. Create folder of given name
// 2. Create `index.ts` file in that directory that `exports * from "./${folder name}"`
//    and `exports * from "./${folder name}.Types"`
// 3. If the CWD contains modules with those file names, then move those files into the
//    new directory, otherwise create new files with those names in the new directory.
// 4. Include option to specify whether to create:
//     * `${ Name }.Internal.ts`,
//     * `${ Name }.Internal.Types.ts`,
//     * `index.${ Name }.Internal.ts`

// import type { FIndexCommandRequirements } from "./IndexCommand.Types.js";
// import { MakeCommand } from "../Effect/Effect.js";
// import type { CliCommand } from "../Effect/Effect.Types.js";
// import { Args, Options } from "@effect/cli";
// import type { TRequirementsArgument } from "../Options/Options.Types.Old.js";
// import { existsSync, promises as Fs } from "fs";
// import { NewListrTaskTensed, RunListr, type ListrTaskTensedResult, type ListrTaskWrapper } from "@sorrell/cli-utilities/listr";
// import { Listr, type ListrTask } from "listr2";
// import { basename, resolve } from "path";
// import { Code } from "@sorrell/cli-utilities/format";

// const PathArg = Args.directory({ exists: "yes", name: "path" }).pipe(Args.withDefault("."));
// const Internal = Options.boolean("internal").pipe(Options.withDefault(false));

// async function Index({ Internal, Path, Silent }: TRequirementsArgument<FIndexCommandRequirements>): Promise<void>
// {
//     type ContextType =
//         {
//             AlreadyExists: boolean;
//             IsNonempty: boolean;
//         };

//     const FileNames: Array<string> =
//         [
//             `${ basename(Path) }.ts`,
//             `${ basename(Path) }.Types.ts`,
//             ...(Internal ? [
//                 `${ basename(Path) }.Internal.ts`,
//                 `${ basename(Path) }.Internal.Types.ts`
//             ] : [ ])
//         ];

//     await RunListr<ContextType>([
//         NewListrTaskTensed({
//             task: async (Context: ContextType, _Task: ListrTaskWrapper<ContextType>, { Succeed }) =>
//             {
//                 Context.AlreadyExists = existsSync(Path);
//                 return Succeed();
//             },
//             title: "Checking whether the directory exists."
//         }),
//         NewListrTaskTensed({
//             enabled: (Context: ContextType) => Context.AlreadyExists,
//             task: async (Context: ContextType, _Task: ListrTaskWrapper<ContextType>, { Succeed }) =>
//             {
//                 Context.IsNonempty = Context.AlreadyExists
//                     ? (await Fs.readdir(Path, { withFileTypes: true })).length === 0
//                     : true;

//                 return Succeed();
//             },
//             title: "Checking whether the directory is nonempty."
//         }),
//         NewListrTaskTensed({
//             task: async (Context: ContextType, _Task: ListrTaskWrapper<ContextType>, { Fail, Succeed }) =>
//             {
//                 Context.AlreadyExists = existsSync(Path);
//                 if (Context.AlreadyExists)
//                 {
//                     const IsEmpty: boolean = (await Fs.readdir(Path, { withFileTypes: true })).length === 0;
//                     if (!IsEmpty)
//                     {
//                         return Fail({ Message: `The given directory is nonempty.`, Throws: true });
//                     }
//                 }

//                 return Succeed();
//             },
//             title: "Verifying that the directory is nonempty or does not exist."
//         }),
//         NewListrTaskTensed({
//             skip: (Context: ContextType) => Context.AlreadyExists,
//             task: async (_Context: ContextType, _Task: ListrTaskWrapper<ContextType>, { Fail, Succeed }) =>
//             {
//                 try
//                 {
//                     await Fs.mkdir(Path, { recursive: true });
//                     return Succeed();
//                 }
//                 catch
//                 {
//                     return Fail({ Message: "Could not create the given directory.", Throw: true });
//                 }
//             },
//             title: "Creating the directory."
//         }),
//         NewListrTaskTensed({
//             enabled: (Context: ContextType) => Context.IsNonempty,
//             task: async (_Context: ContextType, Task: ListrTaskWrapper<ContextType>, { NewListr, Fail, Succeed }) =>
//             {
//                 let Counter: number = 0;
//                 const GetTask = (FileName: string): ListrTask =>
//                 {
//                     return {
//                         task: async (_Context: ContextType, _Task: ListrTaskWrapper<ContextType>) =>
//                         {
//                             try
//                             {
//                                 await Fs.writeFile(resolve(Path, FileName), "\n", { encoding: "utf-8" });
//                                 Counter++;
//                                 if (Counter === 4)
//                                 {
//                                     return Succeed();
//                                 }
//                             }
//                             catch
//                             {
//                                 return Fail({ Message: `Failed to create ${ Code(FileName) }.`, Throw: true });
//                             }
//                         },
//                         title: Code(FileName)
//                     };
//                 }

//                 return Task.newListr(FileNames.map(GetTask), { exitOnError: true });
//             },
//             title: "Creating files in the new directory."
//         }),
//         NewListrTaskTensed({
//             enabled: (Context: ContextType) => Context.IsNonempty && Internal,
//             task: async (_Context: ContextType, _Task: ListrTaskWrapper<ContextType>, { Fail, Succeed }) =>
//             {
//                 const GetExportStatement = (FileName: string) => `export * from "${ FileName.replace(".ts", ".js") }";`;
//                 const Lines: Array<string> = FileNames.map(GetExportStatement);

//                 const Contents: string = Lines.join("\n") + "\n";

//                 try
//                 {
//                     await Fs.writeFile(Path, Contents, { encoding: "utf-8" });
//                     return Succeed();
//                 }
//                 catch
//                 {
//                     return Fail({ Throw: true });
//                 }
//             },
//             title: `Creating ${ Code("index.ts") } file in ${ basename(Path) }.`
//         })
//     ]);
// }

// export const IndexCommand: CliCommand<"index", FIndexCommandRequirements> =
//     MakeCommand("index", Index, { Internal, Path: PathArg });
