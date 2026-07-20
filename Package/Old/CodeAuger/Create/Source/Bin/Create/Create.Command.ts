/**
 * @file      Create.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import * as PseudoTerminal from "node-pty";
import * as TypeScript from "typescript";
import {
    applyEdits as ApplyJsoncEdits,
    type EditResult,
    type FormattingOptions as JsoncFormattingOptions,
    modify as ModifyJsonc
} from "jsonc-parser";
import { Console, Data, Effect, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import { cancel, confirm, intro, isCancel, outro, text } from "@clack/prompts";
import { Code } from "@sorrell/cli-utilities/format";
import { Command } from "@sorrell/effect/unstable/cli";
import type { PlatformError } from "@effect/platform/Error";
import type { Requirements } from "@sorrell/utilities/effect";

const GetJsoncFormattingOptions = (Text: string): JsoncFormattingOptions =>
{
    const EndOfLine: "\r\n" | "\n" = Text.includes("\r\n")
        ? "\r\n"
        : "\n";

    const IndentationMatch: RegExpMatchArray | null = Text.match(/\n([ \t]+)"/u);
    const Indentation: string | undefined = IndentationMatch?.[1];

    if (Indentation !== undefined && Indentation.startsWith("\t"))
    {
        return {
            eol: EndOfLine,
            insertSpaces: false,
            tabSize: 4
        };
    }

    return {
        eol: EndOfLine,
        insertSpaces: true,
        tabSize: Indentation?.length ?? 4
    };
};

const AddIncludePatternToTsConfigText = (
    TsConfigText: string,
    IncludePropertyExists: boolean,
    IncludePattern: string
): string =>
{
    const FormattingOptions: JsoncFormattingOptions = GetJsoncFormattingOptions(TsConfigText);

    const Edits: EditResult = IncludePropertyExists
        ? ModifyJsonc(
            TsConfigText,
            [ "include", -1 ],
            IncludePattern,
            {
                formattingOptions: FormattingOptions,
                isArrayInsertion: true
            }
        )
        : ModifyJsonc(
            TsConfigText,
            [ "include" ],
            [ IncludePattern ],
            {
                formattingOptions: FormattingOptions
            }
        );

    return ApplyJsoncEdits(TsConfigText, Edits);
};

export class PromptError extends Data.TaggedError("PromptError")<{
    readonly Message: string;
}> { }

export class PromptCanceledError extends Data.TaggedError("PromptCanceledError")<{
    readonly Message: string;
}> { }

export class FileSystemOperationError extends Data.TaggedError("FileSystemOperationError")<{
    readonly Message: string;
}> { }

export class PseudoTerminalSpawnError extends Data.TaggedError("PseudoTerminalSpawnError")<{
    readonly Message: string;
}> { }

export class NpmInstallError extends Data.TaggedError("NpmInstallError")<{
    readonly Message: string;
    readonly ExitCode: number;
    readonly Signal: number | undefined;
    readonly Output: string;
}> { }

export class TsConfigParseError extends Data.TaggedError("TsConfigParseError")<{
    readonly Message: string;
}> { }

export class TsConfigShapeError extends Data.TaggedError("TsConfigShapeError")<{
    readonly Message: string;
}> { }

interface TerminalCommandResult
{
    readonly ExitCode: number;
    readonly Signal: number | undefined;
    readonly Output: string;
}

interface TsConfigJson
{
    readonly include?: unknown;
    readonly [ Key: string ]: unknown;
}

const PlaceholderConfigFileContents: string = `// TODO: Add your code-auger configuration here.

export default {};
`;

const StringifyUnknown = (Value: unknown): string =>
{
    if (Value instanceof Error)
    {
        return `${Value.name}: ${Value.message}`;
    }

    const JsonValue: string = JSON.stringify(Value);

    return JsonValue ?? String(Value);
};

const PromptBoolean = (Message: string, InitialValue: boolean = true) =>
{
    return Effect.gen(function*()
    {
        const Result: boolean | symbol = yield* Effect.tryPromise({
            catch: (UnknownError: unknown) =>
            {
                return new PromptError({
                    Message: StringifyUnknown(UnknownError)
                });
            },
            try: () =>
            {
                return confirm({
                    initialValue: InitialValue,
                    message: Message
                });
            }
        });

        if (isCancel(Result))
        {
            yield* Effect.sync(() =>
            {
                cancel("Operation canceled.");
            });

            return yield* Effect.fail(new PromptCanceledError({
                Message: "The user canceled the prompt."
            }));
        }

        return Result;
    });
};

const PromptText = (Message: string, DefaultValue: string) =>
{
    return Effect.gen(function*()
    {
        const Result: string | symbol = yield* Effect.tryPromise({
            catch: (UnknownError: unknown) =>
            {
                return new PromptError({
                    Message: StringifyUnknown(UnknownError)
                });
            },
            try: () =>
            {
                return text({
                    defaultValue: DefaultValue,
                    initialValue: DefaultValue,
                    message: Message,
                    validate: (Value: string | undefined) =>
                    {
                        if (Value === undefined || Value.trim().length === 0)
                        {
                            return "A value is required.";
                        }

                        return undefined;
                    }
                });
            }
        });

        if (isCancel(Result))
        {
            yield* Effect.sync(() =>
            {
                cancel("Operation canceled.");
            });

            return yield* Effect.fail(new PromptCanceledError({
                Message: "The user canceled the prompt."
            }));
        }

        return Result.trim();
    });
};

const RunTerminalCommand = (
    Command: string,
    CommandArguments: ReadonlyArray<string>,
    WorkingDirectory: string
) =>
{
    type ResumeArgument = (_: Effect.Effect<TerminalCommandResult, PseudoTerminalSpawnError, never>) => void;
    return Effect.async<TerminalCommandResult, PseudoTerminalSpawnError>((Resume: ResumeArgument) =>
    {
        let Output: string = "";
        let ProcessWasDisposed: boolean = false;
        let PseudoTerminalProcess: PseudoTerminal.IPty;

        try
        {
            PseudoTerminalProcess = PseudoTerminal.spawn(Command, [ ...CommandArguments ], {
                cols: 120,
                cwd: WorkingDirectory,
                env: process.env,
                name: "xterm-color",
                rows: 30
            });
        }
        catch (UnknownError)
        {
            Resume(Effect.fail(new PseudoTerminalSpawnError({
                Message: StringifyUnknown(UnknownError)
            })));

            return;
        }

        const DataDisposable: PseudoTerminal.IDisposable = PseudoTerminalProcess.onData((Data: string) =>
        {
            Output += Data;
        });

        type ExitArgument = Parameters<Parameters<typeof PseudoTerminalProcess.onExit>[0]>[0];
        const ExitDisposable: PseudoTerminal.IDisposable = PseudoTerminalProcess.onExit(
            (ExitEvent: ExitArgument) =>
            {
                if (!ProcessWasDisposed)
                {
                    ProcessWasDisposed = true;
                    DataDisposable.dispose();
                    ExitDisposable.dispose();

                    Resume(Effect.succeed({
                        ExitCode: ExitEvent.exitCode,
                        Output: Output,
                        Signal: ExitEvent.signal
                    }));
                }
            }
        );

        return Effect.sync(() =>
        {
            if (!ProcessWasDisposed)
            {
                ProcessWasDisposed = true;
                DataDisposable.dispose();
                ExitDisposable.dispose();
                PseudoTerminalProcess.kill();
            }
        });
    });
};

const InstallCodeAugerDevDependency = (RootDirectory: string) =>
{
    return Effect.gen(function*()
    {
        const Command: string = process.platform === "win32"
            ? "cmd.exe"
            : "npm";

        const CommandArguments: Array<string> = process.platform === "win32"
            ? [ "/d", "/s", "/c", "npm install --save-dev code-auger" ]
            : [ "install", "--save-dev", "code-auger" ];

        const Result: TerminalCommandResult =
            yield* RunTerminalCommand(Command, CommandArguments, RootDirectory);

        if (Result.ExitCode !== 0)
        {
            const ErrorOutput: string = Result.Output.trimEnd().length > 0
                ? Result.Output.trimEnd()
                : `npm failed with exit code ${Result.ExitCode}.`;

            yield* Console.error(ErrorOutput);

            return yield* Effect.fail(new NpmInstallError({
                ExitCode: Result.ExitCode,
                Message:
                    `${ Code("npm") } failed to install ${ Code("code-auger") } ` +
                    `as a ${ Code("devDependency") }.`,
                Output: Result.Output,
                Signal: Result.Signal
            }));
        }
    });
};

const ReadOptionalTextFile = (FilePath: string) =>
{
    return pipe(
        Effect.gen(function* ()
        {
            const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
            if (yield* Fs.exists(FilePath))
            {
                return yield* Fs.readFileString(FilePath);
            }
            else
            {
                return undefined;
            }
        }),
        Effect.catchAll((In: unknown) =>
            new FileSystemOperationError({
                Message: `Failed to read ${ FilePath }: ${ StringifyUnknown(In) }`
            }))
    );
};

const WriteTextFile = (FilePath: string, Contents: string) =>
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        yield* pipe(
            Effect.all([
                Fs.makeDirectory(Path.dirname(FilePath), { recursive: true }),
                Fs.writeFileString(FilePath, Contents)
            ], { concurrency: 1 }),
            Effect.catchAll((In: unknown) =>
                new FileSystemOperationError({
                    Message: `Failed to write ${ FilePath }: ${ StringifyUnknown(In) }`
                }))
        );
    });
};

const EnsureDirectoryExists = (DirectoryPath: string) =>
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;

        yield* pipe(
            Fs.makeDirectory(DirectoryPath, { recursive: true }),
            Effect.catchAll((In: unknown) =>
                new FileSystemOperationError({
                    Message: `Failed to create ${ DirectoryPath }: ${ StringifyUnknown(In) }`
                })
            )
        );
    });
};

const NormalizeTsConfigPath = (PathValue: string): string =>
{
    const NormalizedPath: string = PathValue
        .replaceAll("\\", "/")
        .replace(/\/+$/u, "")
        .replace(/^\.\//u, "");

    return NormalizedPath.length === 0
        ? "."
        : NormalizedPath;
};

const GetRelativeTsConfigDirectoryPath = (
    RootDirectory: string,
    DirectoryPath: string
): Effect.Effect<string, PlatformError, EffectPath.Path> =>
{
    return Effect.gen(function* ()
    {
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const AbsoluteDirectoryPath: string = Path.isAbsolute(DirectoryPath)
            ? DirectoryPath
            : Path.resolve(RootDirectory, DirectoryPath);

        const RelativeDirectoryPath: string =
            Path.relative(RootDirectory, AbsoluteDirectoryPath);

        return NormalizeTsConfigPath(RelativeDirectoryPath);
    });
};

const GetTsConfigIncludePattern = (
    RootDirectory: string,
    DirectoryPath: string
): Effect.Effect<string, PlatformError, EffectPath.Path> =>
{
    return Effect.gen(function* ()
    {
        const RelativeDirectoryPath: string =
            yield* GetRelativeTsConfigDirectoryPath(RootDirectory, DirectoryPath);

        if (RelativeDirectoryPath === ".")
        {
            return "**/*";
        }

        return `${ RelativeDirectoryPath }/**/*`;
    });
};

const GetIncludeBaseBeforeGlob = (IncludePattern: string): string =>
{
    const NormalizedIncludePattern: string = NormalizeTsConfigPath(IncludePattern);
    const GlobIndex: number = NormalizedIncludePattern.search(/[*?[{]/u);

    if (GlobIndex === -1)
    {
        return NormalizedIncludePattern;
    }

    return NormalizeTsConfigPath(NormalizedIncludePattern.slice(0, GlobIndex));
};

const DoesIncludeCoverDirectory = (IncludePattern: string, RelativeDirectoryPath: string): boolean =>
{
    const NormalizedIncludePattern: string = NormalizeTsConfigPath(IncludePattern);
    const NormalizedRelativeDirectoryPath: string = NormalizeTsConfigPath(RelativeDirectoryPath);

    if (
        NormalizedIncludePattern === "**" ||
        NormalizedIncludePattern === "**/*" ||
        NormalizedIncludePattern === "**/*.ts" ||
        NormalizedIncludePattern === "**/*.tsx" ||
        NormalizedIncludePattern === "."
    )
    {
        return true;
    }

    const IncludeBasePath: string = GetIncludeBaseBeforeGlob(NormalizedIncludePattern);

    if (IncludeBasePath === ".")
    {
        return true;
    }

    return (
        NormalizedRelativeDirectoryPath === IncludeBasePath ||
        NormalizedRelativeDirectoryPath.startsWith(`${IncludeBasePath}/`)
    );
};

const IsOutputDirectoryIncluded = (
    RootDirectory: string,
    OutputDirectory: string,
    IncludePatterns: ReadonlyArray<string>
): Effect.Effect<boolean, PlatformError, EffectPath.Path> =>
{
    return Effect.gen(function* ()
    {
        const RelativeOutputDirectory: string =
            yield* GetRelativeTsConfigDirectoryPath(RootDirectory, OutputDirectory);

        const IncludesCover = (IncludePattern: string): boolean =>
        {
            return DoesIncludeCoverDirectory(IncludePattern, RelativeOutputDirectory);
        };

        return IncludePatterns.some(IncludesCover);
    });
};

const UpdateTsConfigIncludeIfRequested = (
    RootDirectory: string,
    TsConfigPath: string,
    OutputDirectory: string
) =>
{
    return Effect.gen(function*()
    {
        const TsConfigText: string | undefined = yield* ReadOptionalTextFile(TsConfigPath);

        if (TsConfigText === undefined)
        {
            return;
        }

        /* eslint-disable-next-line @typescript-eslint/typedef */
        const ParseResult = TypeScript.parseConfigFileTextToJson(TsConfigPath, TsConfigText);

        if (ParseResult.error !== undefined)
        {
            const Message: string = TypeScript.flattenDiagnosticMessageText(
                ParseResult.error.messageText,
                "\n"
            );

            return yield* Effect.fail(new TsConfigParseError({
                Message: `Failed to parse ${ TsConfigPath }: ${ Message }`
            }));
        }

        const ParsedTsConfig: TsConfigJson = ParseResult.config as TsConfigJson;
        const IncludeValue: unknown = ParsedTsConfig.include;

        if (
            IncludeValue !== undefined &&
            (
                !Array.isArray(IncludeValue) ||
                !IncludeValue.every((Value: unknown) => typeof Value === "string")
            )
        )
        {
            return yield* Effect.fail(new TsConfigShapeError({
                Message: `${TsConfigPath} has an include property, but it is not a string array.`
            }));
        }

        const IncludePatterns: Array<string> = IncludeValue === undefined
            ? [ ]
            : IncludeValue;

        if (IsOutputDirectoryIncluded(RootDirectory, OutputDirectory, IncludePatterns))
        {
            return;
        }

        const ShouldAddOutputDirectory: boolean = yield* PromptBoolean(
            `The output directory is not included in ${ Code("tsconfig.json") }.  ` +
            `Add it to ${ Code("\"include\"") }?`,
            true
        );

        if (!ShouldAddOutputDirectory)
        {
            return;
        }

        const NextIncludePattern: string = yield* GetTsConfigIncludePattern(RootDirectory, OutputDirectory);

        const NextTsConfigText: string = AddIncludePatternToTsConfigText(
            TsConfigText,
            IncludeValue !== undefined,
            NextIncludePattern
        );

        yield* WriteTextFile(TsConfigPath, NextTsConfigText);
    });
};

type CreateEffect =
    Effect.Effect<
        void,
        | PlatformError
        | PromptCanceledError
        | PromptError
        | NpmInstallError
        | PseudoTerminalSpawnError
        | FileSystemOperationError
        | TsConfigParseError
        | TsConfigShapeError,
        Requirements.FsPath
    >;

/* eslint-disable-next-line @typescript-eslint/typedef */
const CreateHandler = Effect.gen(function*()
{
    const Path: EffectPath.Path = yield* EffectPath.Path;

    const RootDirectory: string = process.cwd();
    const TsConfigFileName: string = "tsconfig.json";
    const TsConfigPath: string = Path.resolve(RootDirectory, TsConfigFileName);

    intro("create-code-auger");

    const ShouldInstallCodeAuger: boolean = yield* PromptBoolean(
        `Install ${ Code("code-auger") } as a ${ Code("devDependency") }?`,
        true
    );

    if (ShouldInstallCodeAuger)
    {
        yield* InstallCodeAugerDevDependency(RootDirectory);
    }

    const ShouldCreateConfigFile: boolean = yield* PromptBoolean(
        `Create a ${ Code("code-auger") } config file?`,
        true
    );

    if (!ShouldCreateConfigFile)
    {
        return;
    }

    const ConfigFilePathText: string = yield* PromptText(
        "Where should the config file be created?",
        "code-auger.config.ts"
    );

    const ConfigFilePath: string = Path.resolve(RootDirectory, ConfigFilePathText);

    yield* WriteTextFile(ConfigFilePath, PlaceholderConfigFileContents);

    const OutputDirectoryText: string = yield* PromptText(
        `Where should modules generated by ${ Code("code-auger") } be written?`,
        "./Intermediate"
    );

    const OutputDirectory: string = Path.resolve(RootDirectory, OutputDirectoryText);

    yield* EnsureDirectoryExists(OutputDirectory);

    yield* UpdateTsConfigIncludeIfRequested(
        RootDirectory,
        TsConfigPath,
        OutputDirectory
    );

    outro("🥳 Enjoy!");
});

/* eslint-disable-next-line @typescript-eslint/typedef */
export const CreateCommand = Command.make("create-code-auger", { }, (_: { }) => CreateHandler);
