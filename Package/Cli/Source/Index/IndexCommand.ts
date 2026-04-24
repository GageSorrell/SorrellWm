/**
 * @file      IndexCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const __DummyExport_Index: "DummyExport" = "DummyExport" as const;

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
