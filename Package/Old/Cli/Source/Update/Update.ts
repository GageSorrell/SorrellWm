/**
 * @file      Update.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

// @TODO Temporary.
/* eslint-disable jsdoc/require-jsdoc */

export const UpdateExport: string = "";

// import * as Process from "node:process";
// import * as PseudoTerminal from "node-pty";
// import { Args, Command, Options } from "@sorrell/effect/unstable/cli";
// import { Console, Effect, pipe } from "effect";
// import { FilterDefined, type TArray } from "@sorrell/utilities/array";
// import { InvalidSaveModeError, NpmError } from "./Update.Internal.js";
// import type {
//     NpmCommandEffect,
//     NpmConfig,
//     NpmInstallCommandFactory,
//     NpmUninstallCommandFactory,
//     UpdateCommandResult,
//     UpdateEffect
// } from "./Update.Internal.Types.js";
// import type { SaveOptions, UpdateCommandType, UpdateConfig, UpdateOptions } from "./Update.Types.js";
// import type { TReject, TResolve } from "@sorrell/utilities/async";
// import type { FGlobalOptions } from "../Options/Options.Types.js";
// import { GlobalOptions } from "../Options/Options.js";

// // @TODO
// // This command should accept a package name, and optionally a semver or tag, then should run,
// //     * npm uninstall --save ${ package }
// //     * npm cache clean --force
// //     * npm install --save ${ package }
// // and should also accept at most one of the following,
// //     * --save
// //     * --save-prod
// //     * --save-dev
// //     * --save-optional
// //     * --save-peer
// //     * --no-save
// // such that the flag has the same effect that it does when used with `npm install`.
// // It should also take the optional flag `--node-modules` (`-nm`), which recursively
// // and forcefully deletes the `node_modules` directory.  This should support workspaces,
// // which it will do by,
// //     1. Checking for `node_modules` in the root directory of the given package
// //     2. Check the parent directory (and keep going up as needed) for a `package.json`
// //        which,
// //            * has a `workspaces` property
// //            * has an entry in this property which captures the given package.

// const PackageSpecificationArgument: Args.Args<string> = Args.text({ name: "package" });

// export namespace SaveOption
// {
//     export/** Equivalent of `--save` flag of `npm install`. */
//     const Default: Options.Options<boolean> = Options.boolean("save");

//     export/** Equivalent of `--save-prod` flag of `npm install`. */
//     const Prod: Options.Options<boolean> = Options.boolean("save-prod");

//     export/** Equivalent of `--save-dev` flag of `npm install`. */
//     const Dev: Options.Options<boolean> = Options.boolean("save-dev");

//     export/** Equivalent of `--save-optional` flag of `npm install`. */
//     const Optional: Options.Options<boolean> = Options.boolean("save-optional");

//     export/** Equivalent of `--save-peer` flag of `npm install`. */
//     const Peer: Options.Options<boolean> = Options.boolean("save-peer");

//     export/** Equivalent of `--no-save` flag of `npm install`. */
//     const NoSave: Options.Options<boolean> = Options.boolean("no-save");
// }

// /**
//  * Description.
//  *
//  * @param root0 - Foo bar.
//  * @param root0.Save - Foo bar.
//  * @param root0.SaveProd - Foo bar.
//  * @param root0.SaveDev - Foo bar.
//  * @param root0.SaveOptional - Foo bar.
//  * @param root0.SavePeer - Foo bar.
//  * @param root0.NoSave - Foo bar.
//  *
//  * @returns {Effect.Effect<string | undefined, InvalidSaveModeError>} Foo bar.
//  */
// function GetSelectedSaveFlag({
//     NoSave,
//     Save,
//     SaveProd,
//     SaveDev,
//     SaveOptional,
//     SavePeer
// }: SaveOptions): Effect.Effect<string, InvalidSaveModeError>
// {
//     return Effect.gen(function* ()
//     {
//         const SelectedFlags: TArray<string> =
//             FilterDefined([
//                 Save ? "--save" : undefined,
//                 SaveProd ? "--save-prod" : undefined,
//                 SaveDev ? "--save-dev" : undefined,
//                 SaveOptional ? "--save-optional" : undefined,
//                 SavePeer ? "--save-peer" : undefined,
//                 NoSave ? "--no-save" : undefined
//             ]);

//         if (SelectedFlags.length > 1)
//         {
//             const Message: string = (
//                 "Please specify at most one of --save, --save-prod, " +
//                 "--save-dev, --save-optional, --save-peer, or --no-save."
//             );

//             return yield* Effect.fail(
//                 new InvalidSaveModeError({ Message })
//             );
//         }
//         return SelectedFlags?.[0] || "--save";
//     });
// }

// function BuildNpmInstallArguments(
//     PackageSpecification: string,
//     SaveFlag: string
// ): ReadonlyArray<string>
// {
//     const InstallArguments: TArray<string> =
//         [
//             "install",
//             PackageSpecification
//         ];

//     if (SaveFlag !== undefined)
//     {
//         InstallArguments.push(SaveFlag);
//     }

//     return InstallArguments;
// }

// function GetNpmExecutableName(): string
// {
//     return Process.platform === "win32" ? "npm.cmd" : "npm";
// }

// function MaybeLogStep(
//     Silent: boolean,
//     Message: string
// ): Effect.Effect<void>
// {
//     if (Silent)
//     {
//         return Effect.void;
//     }

//     return Console.log(Message);
// }

// function RunNpmCommand(Arguments: ReadonlyArray<string>): NpmCommandEffect
// {
//     return Effect.tryPromise({
//         catch: (ErrorValue: unknown) =>
//         {
//             return (ErrorValue instanceof Error)
//                 ? ErrorValue
//                 : new Error(String(ErrorValue));
//         },
//         try: () =>
//             new Promise<UpdateCommandResult>((
//                 Resolve: TResolve<UpdateCommandResult>,
//                 Reject: TReject
//             ): void =>
//             {
//                 let CombinedOutput: string = "";

//                 try
//                 {
//                     const PseudoTerminalProcess: PseudoTerminal.IPty = PseudoTerminal.spawn(
//                         GetNpmExecutableName(),
//                         [ ...Arguments ],
//                         {
//                             name: "xterm-color",

//                             cols: 80,
//                             rows: 30,

//                             cwd: Process.cwd(),
//                             env: Process.env as Record<string, string>
//                         }
//                     );

//                     PseudoTerminalProcess.onData((Chunk: string): void =>
//                     {
//                         CombinedOutput += Chunk;
//                     });

//                     type FPseudoTerminalEvent =
//                         {
//                             exitCode: number;
//                             signal?: number;
//                         };

//                     PseudoTerminalProcess.onExit((Event: FPseudoTerminalEvent): void =>
//                     {
//                         Resolve({
//                             ExitCode: Event.exitCode,
//                             Output: CombinedOutput
//                         });
//                     });
//                 }
//                 catch (ErrorValue)
//                 {
//                     Reject(
//                         ErrorValue instanceof Error
//                             ? ErrorValue
//                             : new Error(String(ErrorValue))
//                     );
//                 }
//             })
//     });
// }

// function ClearCache({ silent: Silent }: FGlobalOptions): NpmCommandEffect
// {
//     return Effect.gen(function* ()
//     {
//         yield* MaybeLogStep(Silent, "Clearing npm cache...");

//         return yield* RunNpmCommand([ "cache", "clean", "--force" ]);
//     });
// }

// function InstallPackage({ Package, silent: Silent }: NpmConfig): NpmInstallCommandFactory
// {
//     return Effect.gen(function* ()
//     {
//         yield* MaybeLogStep(Silent, "Clearing npm cache...");

//         return yield* RunNpmCommand([ "cache", "clean", "--force" ]);
//     });
// }

// function UninstallPackage({ Package, SaveFlag, silent: Silent }: NpmConfig): NpmUninstallCommandFactory
// {
//     type ThisEffect = Effect.Effect<void, NpmError, never>;
//     const Foo: ThisEffect = Effect.gen(function* ()
//     {
//         yield* MaybeLogStep(Silent, `Uninstalling "${ Package }"...`);

//         const InstallArguments: ReadonlyArray<string> =
//             BuildNpmInstallArguments(Package, SaveFlag);

//         yield* MaybeLogStep(
//             Silent,
//             `Starting npm install in a pseudo terminal: ${ InstallArguments.join(" ") }`
//         );

//         const Result: UpdateCommandResult =
//             yield* RunNpmCommand([
//                 "uninstall",
//                 "--save",
//                 Package
//             ]);

//         if (Result.ExitCode !== 0)
//         {
//             if (!Silent)
//             {
//                 // yield* Console.error("npm uninstall failed.");

//                 if (Result.Output.trim().length > 0)
//                 {
//                     // yield* Console.error(Result.Output);
//                 }
//             }

//             return yield* Effect.fail<NpmError>(
//                 new NpmError({
//                     ExitCode: Result.ExitCode,
//                     Output: Result.Output
//                 })
//             );
//         }

//         yield* MaybeLogStep(Silent, `Uninstalled ${ Package } successfully!`);
//     });
// }

// const Config: UpdateConfig =
//     {
//         NoSave: SaveOption.NoSave,
//         Package: PackageSpecificationArgument,
//         Save: SaveOption.Default,
//         SaveDev: SaveOption.Dev,
//         SaveOptional: SaveOption.Optional,
//         SavePeer: SaveOption.Peer,
//         SaveProd: SaveOption.Prod,
//         ...GlobalOptions
//     };

// export /**
//         * For a given NodeJS project and *installed* dependency (and optionally with a
//         * semver or tag),
//         *     1. uninstall the given package
//         *     2. clean the `npm` cache
//         *     3. install the package, with the given semver or tag (if specified).
//         *
//         * Optionally, any of the `--save*` flags supported by `npm` can be used here.
//         *
//         * This command will first determine whether the given project is a workspace.
//         * This information is used with the options below.
//         * All features of this command are compatible with workspaces.
//         *
//         * Another option is the `--node-modules` (-nm) flag, which if specified and `true`,
//         * will cause this command to also delete the project's `node_modules` directory,
//         * if one is present.  If the project is a workspace, then the root `node_modules`
//         * directory will *also* be deleted, *unless* `--local` is also specified.
//         *
//         * The command will fail if the given package is not installed (that is, listed in
//         * the project's `package.json`; it does *not* need to be present in the project's
//         * `node_modules` directory).
//         */
// const UpdateCommand: UpdateCommandType = Command.make("update", Config, Main);

// function Main(_Options: UpdateOptions): UpdateEffect
// {
//     // const { Package, silent: Silent, ...SaveOptions } = Options;

//     // return pipe(
//     //     UninstallPackage({ Package, silent: Silent }),
//     //     ClearCache({ silent: Silent }),
//     //     Effect.andThen(
//     //         GetSelectedSaveFlag(SaveOptions),
//     //         InstallPackage(Options)
//     //     )
//     // );

//     // return Effect.gen(function* ()
//     // {
//     //     yield* MaybeLogStep(Silent, `Preparing npm install for "${ Package }"...`);

//     //     const InstallArguments: ReadonlyArray<string> =
//     //         BuildNpmInstallArguments(Package, SaveFlag);

//     //     yield* MaybeLogStep(
//     //         Silent,
//     //         `Starting npm install in a pseudo terminal: ${ InstallArguments.join(" ") }`
//     //     );

//     //     const Result: UpdateCommandResult =
//     //         yield* RunNpmCommand(InstallArguments);

//     //     if (Result.ExitCode !== 0)
//     //     {
//     //         if (!Silent)
//     //         {
//     //             yield* Console.error("npm install failed.");

//     //             if (Result.Output.trim().length > 0)
//     //             {
//     //                 yield* Console.error(Result.Output);
//     //             }
//     //         }

//     //         return yield* Effect.fail(
//     //             new NpmError({
//     //                 ExitCode: Result.ExitCode,
//     //                 Output: Result.Output
//     //             })
//     //         );
//     //     }

//     //     yield* MaybeLogStep(Silent, "npm install completed successfully.");
//     // });
// }
