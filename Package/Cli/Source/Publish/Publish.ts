/**
 * @file      Publish.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// @TODO This command should also allow for (specifying via the config file only)
// specifying a map of ReadMe URLs, so that links to `ReadMe.md`'s and directories
// of other packages in the monorepo can be replaced with their respective URLs on
// https://npmjs.com

// import * as Semver from "semver";
// import {
//     type ChildProcess,
//     type ChildProcessByStdio,
//     spawn } from "child_process";
// import { type DefaultRenderer, Listr, type ListrTaskWrapper, type SimpleRenderer } from "listr2";
// import { type IPty, spawn as PtySpawn } from "node-pty";
// import Chalk from "chalk";
// import { Effect } from "effect";
// import { GetPackageJson } from "@sorrell/utilities/npm";
// import type { IPackageJson } from "package-json-type";
// import type { Readable } from "stream";

export const __DummyExport_Publish: "DummyExport" = "DummyExport" as const;

// type PublishResult =
//     | "Success"
//     | "MustLogIn"
//     | "PermissionsError"
//     | "UnknownError"
//     | "TimeoutError";

// type FRunCommandResult =
//     {
//         ExitCode: number;
//         StandardOutput: string;
//         StandardError: string;
//     };

// function GetNpmExecutableName(): string
// {
//     return process.platform === "win32" ? "npm.cmd" : "npm";
// }

// async function RunCommand(
//     Command: string,
//     Arguments: ReadonlyArray<string>
// ): Promise<FRunCommandResult>
// {
//     return await new Promise<FRunCommandResult>((
//         Resolve: ((Value: PromiseLike<FRunCommandResult> | FRunCommandResult) => void),
//         Reject: ((Reason: unknown) => void)
//     ): void =>
//     {
//         const TheChildProcess: ChildProcess = spawn(
//             [ Command, ...Arguments ].join(" "),
//             {
//                 cwd: process.cwd(),
//                 shell: true,
//                 stdio: "pipe"
//             }
//         );

//         let StandardOutput: string = "";
//         let StandardError: string = "";

//         TheChildProcess.stdout?.on("data", (Chunk: Buffer | string): void =>
//         {
//             StandardOutput += Chunk.toString();
//         });

//         TheChildProcess.stderr?.on("data", (Chunk: Buffer | string): void =>
//         {
//             StandardError += Chunk.toString();
//         });

//         TheChildProcess.on("error", (Error: Error): void =>
//         {
//             Reject(Error);
//         });

//         TheChildProcess.on("close", (ExitCode: number | null): void =>
//         {
//             Resolve({
//                 ExitCode: ExitCode ?? 1,
//                 StandardError,
//                 StandardOutput
//             });
//         });
//     });
// }

// async function GetLatestPublishedVersion(
//     PackageJson: IPackageJson
// ): Promise<string | undefined>
// {
//     const NpmExecutableName: string = GetNpmExecutableName();

//     const { name, version } = PackageJson;

//     if (name === undefined)
//     {
//         return undefined;
//     }

//     const Result: FRunCommandResult = await RunCommand(
//         NpmExecutableName,
//         [
//             "view",
//             `${ name }@latest`,
//             "version",
//             "--json"
//         ]
//     );

//     if (Result.ExitCode === 0)
//     {
//         return JSON.parse(Result.StandardOutput);
//     }

//     const CombinedOutput: string = `${ Result.StandardOutput }\n${ Result.StandardError }`.toLowerCase();

//     if (
//         CombinedOutput.includes("e404")
//         || CombinedOutput.includes("404")
//         || CombinedOutput.includes("no match found")
//     )
//     {
//         return undefined;
//     }

//     throw new Error(
//         [
//             `Failed while checking whether ${ name }@${ version } exists on the registry.`,
//             Result.StandardError.trim() || Result.StandardOutput.trim()
//         ]
//             .filter((Line: string) => Line.length > 0)
//             .join("\n")
//     );
// }

// async function RunNpmVersionPatch(): Promise<string | undefined>
// {
//     const NpmExecutableName: string = GetNpmExecutableName();

//     const Result: FRunCommandResult = await RunCommand(
//         NpmExecutableName,
//         [
//             "version",
//             "patch",
//             "--json"
//         ]
//     );

//     if (Result.ExitCode !== 0)
//     {
//         return undefined;
//     }
//     else
//     {
//         return Result.StandardOutput.replace("v", "");
//     }
// }

// function BeginNpmPublish(): Promise<PublishResult | { FinalPromise: Promise<PublishResult>; }>
// {
//     return new Promise<PublishResult | { FinalPromise: Promise<PublishResult>; }>((
//         Resolve: ((Value: PublishResult | { FinalPromise: Promise<PublishResult>; }) => void)
//     ): void =>
//     {
//         const TerminalProcess: IPty = PtySpawn(
//             GetNpmExecutableName(),
//             [ "publish", "--access", "public" ],
//             {
//                 cols: process.stdout.columns || 80,
//                 cwd: process.cwd(),
//                 env: process.env as Record<string, string>,
//                 name: "xterm-color",
//                 rows: process.stdout.rows || 30
//             }
//         );

//         let Buffer: string = "";
//         let EnterSent: boolean = false;
//         let HasLoggedPublishingStatement: boolean = false;
//         let Timer: NodeJS.Timeout | undefined = undefined;
//         const Beat = (): void =>
//         {
//             if (Timer !== undefined)
//             {
//                 clearTimeout(Timer);
//             }

//             Timer = setTimeout((): void =>
//             {
//                 TerminalProcess.kill();
//             }, 60_000);
//         };

//         let Result: PublishResult = "UnknownError";

//         let FinalResolve: ((Value: PublishResult) => void) | undefined = undefined;
//         const FinalPromise: Promise<PublishResult> = new Promise<PublishResult>((
//             InFinalPromise: (Value: PublishResult) => void
//         ): void =>
//         {
//             FinalResolve = InFinalPromise;
//         });

//         TerminalProcess.onData((Data: string) =>
//         {
//             Beat();
//             Buffer += Data;

//             if (Buffer.includes("This command requires you to be logged in to"))
//             {
//                 Resolve("MustLogIn");
//                 TerminalProcess.kill();
//             }

//             if (!HasLoggedPublishingStatement)
//             {
//                 HasLoggedPublishingStatement =
//                     Buffer.includes(
//                         "Authenticate your account at:"
//                     );

//                 if (HasLoggedPublishingStatement)
//                 {
//                     setTimeout((): void =>
//                     {
//                         const AuthPromptPart: string = "Press ENTER to open in the browser...";
//                         if (Buffer.includes(AuthPromptPart))
//                         {
//                             EnterSent = true;
//                             TerminalProcess.write("\r");
//                             Resolve({ FinalPromise });
//                         }
//                         else
//                         {
//                             Resolve({ FinalPromise });
//                         }
//                     }, 100);
//                 }
//             }
//         });

//         setTimeout((): void =>
//         {
//             if (!EnterSent)
//             {
//                 Result = "TimeoutError";
//                 TerminalProcess.kill();
//             }
//         }, 10_000);

//         setTimeout((): void =>
//         {
//             Result = "TimeoutError";
//             TerminalProcess.kill();
//         }, 60_000);

//         type OnExitParameter =
//             {
//                 exitCode: number;
//                 signal?: number;
//             };

//         TerminalProcess.onExit(({ exitCode: ExitCode }: OnExitParameter): void =>
//         {
//             FinalResolve?.(ExitCode === 0 ? "Success" : Result);
//         });
//     });
// }

// export async function PublishWithPatchOnVersionConflict({ Silent }: TRequirementsArgument<FPublishRequirements>): Promise<void>
// {
//     type Context =
//         {
//             PackageJson: IPackageJson;
//             NewVersion: string;
//         };

//     type TaskWrapper = ListrTaskWrapper<
//         Context,
//         typeof DefaultRenderer,
//         typeof SimpleRenderer
//     >;

//     let FinalPackageNameVersion: string = "";

//     await new Listr<Context>([
//         {
//             task: async (Context: Context, Task: TaskWrapper): Promise<void> =>
//             {
//                 try
//                 {
//                     Context.PackageJson = await Effect.runPromise(GetPackageJson());
//                     Task.title = `Found the ${ Chalk.red("package.json") } of the current project.`;
//                 }
//                 catch (Error: unknown)
//                 {
//                     Task.title = `Failed to find a ${ Chalk.red("package.json") }.`;
//                     throw Error;
//                 }
//             },
//             title: `Finding the ${ Chalk.red("package.json") } of the current project.`
//         },
//         {
//             task: async (Context: Context, Task: TaskWrapper): Promise<void> =>
//             {
//                 const { name, version } = Context.PackageJson;

//                 if (name === undefined || version === undefined)
//                 {
//                     const UndefinedProperties: string = (name === undefined)
//                         ? (version === undefined)
//                             ? "\"name\" and \"version\" properties were"
//                             : "\"name\" property was"
//                         : "\"version\" property was";

//                     Task.title = (
//                         `Failed to validate the package's ${ Chalk.red("package.json") } ` +
//                         `(${ UndefinedProperties } undefined).`
//                     );

//                     throw new Error();
//                 }

//                 Task.title = (
//                     `Validated the ${ Chalk.red("package.json") } file (has ${ Chalk.red("name") } ` +
//                     `and ${ Chalk.red("version") }) properties.`
//                 );
//             },
//             title: (
//                 `Validating the ${ Chalk.red("package.json") } file (${ Chalk.red("name") } and ` +
//                 `${ Chalk.red("version") }) properties.`)
//         },
//         {
//             task: async (Context: Context, Task: TaskWrapper): Promise<unknown> =>
//             {
//                 const LatestPublishedVersion: string | undefined =
//                     await GetLatestPublishedVersion(Context.PackageJson);

//                 if (LatestPublishedVersion === undefined)
//                 {
//                     Task.title =
//                         `No published version of ${ Chalk.red(Context.PackageJson.name) } was found.`;
//                     return;
//                 }

//                 const VersionComparison: -1 | 0 | 1 = Semver.compare(
//                     Context.PackageJson.version as string,
//                     LatestPublishedVersion
//                 );

//                 const LatestVersionFormatted: string = Chalk.red(LatestPublishedVersion);
//                 const LocalVersionFormatted: string = Chalk.red(Context.PackageJson.version);

//                 switch (VersionComparison)
//                 {
//                     case -1:
//                         Task.title = (
//                             `Found published version ${ LatestVersionFormatted }, greater than local ` +
//                             `version ${ LocalVersionFormatted }.`
//                         );

//                         throw new Error("Published version must not be greater than local version.");
//                     case 1:
//                         Task.title = (
//                             `Found published version ${ LatestVersionFormatted }, ` +
//                             `${ Chalk.italic("not") } bumping local version before publishing.`
//                         );
//                         Context.NewVersion = Context.PackageJson.version || "";
//                         return;
//                 }

//                 // VersionComparison === 0
//                 Task.title = (
//                     `Found published version ${ LatestVersionFormatted }, ` +
//                     "which matches the local version."
//                 );

//                 await Task.newListr([
//                     {
//                         task: async (Context: Context, Task: TaskWrapper): Promise<void> =>
//                         {
//                             const NewVersion: string | undefined = await RunNpmVersionPatch();
//                             if (NewVersion === undefined)
//                             {
//                                 Task.title = "Failed to bump local package version.";
//                                 throw new Error();
//                             }

//                             Context.NewVersion = NewVersion;
//                             Task.title =
//                                 `Bumped version to ${ Chalk.red(NewVersion) } before publishing.`;
//                         },
//                         title: "Bumping patch version before publishing."
//                     }
//                 ],
//                 {
//                     exitOnError: true
//                 }).run(Context);
//             },
//             title: "Fetching the published version number."
//         },
//         {
//             task: async (Context: Context, Task: TaskWrapper): Promise<void | Listr> =>
//             {
//                 FinalPackageNameVersion =
//                     Chalk.red(`${ Context.PackageJson.name }@${ Context.NewVersion }`);

//                 Task.title = `Publishing ${ FinalPackageNameVersion }.`;

//                 const FirstPublishResult: PublishResult | { FinalPromise: Promise<PublishResult>; } =
//                     await BeginNpmPublish();

//                 if (FirstPublishResult === "MustLogIn")
//                 {
//                     return Task.newListr([
//                         {
//                             task: async (_Context: Context, Task: TaskWrapper): Promise<void> =>
//                             {
//                                 const LoggedIn: boolean = await RunNpmLogin();
//                                 if (LoggedIn)
//                                 {
//                                     Task.title = "Logged into npm.";
//                                     return;
//                                 }
//                                 else
//                                 {
//                                     Task.title = "Failed to log into npm.";
//                                     throw new Error("🚨 Logging into npm was unsuccessful.");
//                                 }
//                             },
//                             title: "Logging into npm before publishing."
//                         },
//                         {
//                             task: async (_Context: Context, Task: TaskWrapper): Promise<void> =>
//                             {
//                                 const Result: PublishResult | { FinalPromise: Promise<PublishResult>; } =
//                                     await BeginNpmPublish();

//                                 if (
//                                     typeof Result === "object" &&
//                                     Result !== null &&
//                                     "FinalPromise" in Result
//                                 )
//                                 {
//                                     const ResultString: PublishResult = await Result.FinalPromise;
//                                     switch (ResultString)
//                                     {
//                                         /* eslint-disable @stylistic/max-len */
//                                         case "PermissionsError":
//                                             Task.title = `Failed to publish ${ FinalPackageNameVersion }.`;
//                                             throw new Error(
//                                                 "🚨 You are not currently logged into the account to which " +
//                                                 `${ Context.PackageJson.name } belongs.  Log in via ` +
//                                                 `${ Chalk.red("npm login") }, then run this command again.`
//                                             );
//                                         case "UnknownError":
//                                             Task.title = `Failed to publish ${ FinalPackageNameVersion }.`;
//                                             throw new Error(
//                                                 `Publishing ${ FinalPackageNameVersion } failed.  Try running ` +
//                                                 `${ Chalk.red("npm publish --access public") } to diagnose.`
//                                             );
//                                         case "TimeoutError":
//                                             Task.title = `Failed to publish ${ FinalPackageNameVersion }.`;
//                                             throw new Error(
//                                                 `Publishing ${ FinalPackageNameVersion } failed.  The publish command ` +
//                                                 `timed out.  Run ${ Chalk.red("npm publish --access public") } to diagnose.`
//                                             );
//                                         case "Success":
//                                             Task.title = `Published ${ FinalPackageNameVersion }.`;
//                                         /* eslint-enable @stylistic/max-len */
//                                     }
//                                 }
//                                 else
//                                 {
//                                     throw new Error(`Result is ${ Result }.`);
//                                 }
//                             },
//                             title: "Running publish command."
//                         }
//                     ],
//                     {
//                         exitOnError: true
//                     });
//                 }
//             },
//             title: "Publishing your package."
//         }
//     ],
//     {
//         exitOnError: true
//     }).run();

//     console.log(
//         `\n${ Chalk.green.bold("✓") } Successfully published ${ FinalPackageNameVersion } to npm!`
//     );

//     process.exit(0);
// }

// // /**
// //  * Publishes the npm package to which {@link process.cwd} resides.
// //  * If the current version is greater than
// //  *
// //  */

// function OpenUrlInDefaultBrowser(Url: string): void
// {
//     switch (process.platform)
//     {
//         case "win32":
//             spawn("cmd", [ "/c", "start", "", Url ], {
//                 detached: true,
//                 stdio: "ignore"
//             }).unref();
//             break;
//         case "darwin":
//             spawn("open", [ Url ], {
//                 detached: true,
//                 stdio: "ignore"
//             }).unref();
//             break;
//         default:
//             spawn("xdg-open", [ Url ], {
//                 detached: true,
//                 stdio: "ignore"
//             }).unref();
//     }
// }

// function RunNpmLogin(): Promise<boolean>
// {
//     return new Promise<boolean>((Resolve: ((Value: boolean) => void)): void =>
//     {
//         const ChildProcess: ChildProcessByStdio<null, Readable, Readable> = spawn(
//             [ GetNpmExecutableName(), "login", "--auth-type=web" ].join(" "),
//             {
//                 shell: true,
//                 stdio: [ "ignore", "pipe", "pipe" ]
//             }
//         );

//         ChildProcess.stdout.setEncoding("utf8");
//         ChildProcess.stderr.setEncoding("utf8");

//         let Buffer: string = "";
//         let HasOpenedBrowser: boolean = false;

//         setTimeout((): void =>
//         {
//             if (!HasOpenedBrowser)
//             {
//                 Resolve(false);
//             }
//         }, 10_000);

//         setTimeout((): void =>
//         {
//             Resolve(false);
//         }, 60_000);

//         const HandleChunk = (Chunk: string): void =>
//         {
//             // process.stdout.write(Chunk);
//             Buffer += Chunk;

//             if (!HasOpenedBrowser)
//             {
//                 const Lines: Array<string> = Buffer.split("\n");
//                 const LoginUrl: string | undefined = Lines.find((Line: string): boolean =>
//                 {
//                     return Line.startsWith("https://www.npmjs.com/login?");
//                 });

//                 if (LoginUrl !== undefined)
//                 {
//                     HasOpenedBrowser = true;
//                     OpenUrlInDefaultBrowser(LoginUrl);
//                 }
//             }
//         };

//         ChildProcess.stdout.on("data", HandleChunk);
//         ChildProcess.stderr.on("data", (Chunk: string) =>
//         {
//             // process.stderr.write(Chunk);
//             HandleChunk(Chunk);
//         });

//         ChildProcess.on("exit", (_Code: number | null) =>
//         {
//             Resolve(true);
//         });
//     });
// }

// export const PublishCommand: CliCommand<"publish", FPublishRequirements> =
//     MakeCommand("publish", PublishWithPatchOnVersionConflict);
