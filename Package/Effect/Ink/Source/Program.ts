/**
 * Define programs to open via {@link Prompt.TempFile:var | temporary file prompts}.
 *
 * @module @sorrell/effect-ink/Program
 *
 * @file      Program.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Data from "effect/Data";
import * as Internal from "./Internal/Program.ts";
import * as Prompt from "./Prompt.ts";
i

export const TypeIdKey: string = "~sorrell/effect-ink/Prompt";
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Options
{
    readonly
}

export interface CommandOptions
{
    readonly Foo: string;
}

export interface ExecutableOptions
{
    readonly Bar: string;
}

// export interface Command
// {

// }

export interface Executable
{

}

const CommandConstructor = (Options: CommandOptions): Program =>
{

};

export type ProgramDefinitions = Data.TaggedEnum<{
    readonly Command: CommandOptions;
    readonly Executable: ExecutableOptions;
}>;

import { Effect, FileSystem } from "effect";
import type * as PlatformError from "effect/PlatformError";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

/**
 * A small abstraction over Ink's terminal suspension behavior.
 *
 * In Ink, implement this with:
 *
 * - `useApp().waitUntilRenderFlush`
 * - `useApp().suspendTerminal`
 *
 * Keep this out of the core prompt service so the temp-file logic does not
 * directly depend on React hooks.
 */
export interface Terminal
{
    readonly Flush: Effect.Effect<void>;

    readonly Suspend: <Value, Error, Requirements>(
        Use: Effect.Effect<Value, Error, Requirements>
    ) => Effect.Effect<Value, Error, Requirements>;
}

export namespace Terminal
{
    export const None: Terminal = {
        Flush: Effect.void,
        Suspend: (Use) => Use
    };
}

export class UserCompletionRequiredError extends Error
{
    public readonly _tag = "UserCompletionRequiredError" as const;
    public readonly ProgramName: string;
    public readonly FilePath: string;

    public constructor(Options: {
        readonly ProgramName: string;
        readonly FilePath: string;
    })
    {
        super(`${Options.ProgramName} requires user confirmation before reading the temp file.`);

        this.ProgramName = Options.ProgramName;
        this.FilePath = Options.FilePath;
    }
}

export class ProgramExitCodeError extends Error
{
    public readonly _tag = "ProgramExitCodeError" as const;
    public readonly ProgramName: string;
    public readonly ExitCode: ChildProcessSpawner.ExitCode;

    public constructor(Options: {
        readonly ProgramName: string;
        readonly ExitCode: ChildProcessSpawner.ExitCode;
    })
    {
        super(`${Options.ProgramName} exited with code ${Options.ExitCode}.`);

        this.ProgramName = Options.ProgramName;
        this.ExitCode = Options.ExitCode;
    }
}

export interface Program<E = never>
{
    readonly _tag: "Program";
    readonly Name: string;
    readonly Presentation: Program.Presentation;
    readonly Done: Program.Done<E, Prompt.Environment>;

    /** Defaults to accepting only exit code 0. */
    readonly IsSuccessfulExitCode: (ExitCode: ChildProcessSpawner.ExitCode) => boolean;

    readonly MakeCommand: (FilePath: string) => Effect.Effect<ChildProcess.Command, E, Prompt.Environment>;
}

export const Presentation: Readonly<{ External: string; Terminal: string; }> =
    {
        External: `${ TypeIdKey }!Presentation!External`,
        Terminal: `${ TypeIdKey }!Presentation!Terminal`,
    } as const;

export type Presentation = typeof Presentation[keyof typeof Presentation];

export type ProgramEffect<A = void, E = never> = Effect.Effect<A, E, Prompt.Environment>;

export type AwaitDoneCallback = <E = never>(
    Context: AwaitDoneContext
) => ProgramEffect<void, E>;

export type Done = Data.TaggedEnum<{
    readonly ProcessExit: { };
    readonly UserConfirmation: { };
    readonly AwaitDone: { readonly Callback: AwaitDoneCallback };
}>;

export interface AwaitDoneContext
{
    readonly FilePath: string;
    readonly ProgramName: string;
}

export interface Options<Error, Requirements>
{
    readonly Name: string;
    readonly Presentation?: Presentation;
    readonly Done?: Done<Error, Requirements>;

    readonly IsSuccessfulExitCode?: (
        ExitCode: ChildProcessSpawner.ExitCode
    ) => boolean;

    readonly MakeCommand: (
        FilePath: string
    ) => Effect.Effect<ChildProcess.Command, Error, Requirements>;
}

export interface CommandOptions<Error = never, Requirements = never>
{
    readonly Name: string;
    readonly ProgramCommand: string;
    readonly MakeArguments: (FilePath: string) => ReadonlyArray<string>;

    readonly Presentation?: Presentation;
    readonly Done?: Done<Error, Requirements>;

    readonly ChildProcessOptions?: ChildProcess.CommandOptions;

    readonly IsSuccessfulExitCode?: (
        ExitCode: ChildProcessSpawner.ExitCode
    ) => boolean;

    readonly Configure?: (
        CommandValue: ChildProcess.Command
    ) => ChildProcess.Command;
}

export const MakeProgram = <Error = never, Requirements = never>(
    Options: Program.Options<Error, Requirements>
): Program<Error, Requirements> =>
{
    return {
        _tag: "Program",
        Name: Options.Name,
        Presentation: Options.Presentation ?? "External",
        Done: Options.Done ?? { _tag: "ProcessExit" },
        IsSuccessfulExitCode: Options.IsSuccessfulExitCode ?? ((ExitCode) =>
        {
            return ExitCode === ChildProcessSpawner.ExitCode(0);
        }),
        MakeCommand: Options.MakeCommand
    };
};

/**
 * For terminal-taking commands, v4 `ChildProcess` does not use the old
 * `Command.stdin("inherit")` style. Instead, stdio is supplied through the
 * command options object.
 */
export const WithInheritedTerminal = (
    CommandValue: ChildProcess.Command
): ChildProcess.Command =>
{
    if (CommandValue._tag === "StandardCommand")
    {
        return ChildProcess.make(
            CommandValue.command,
            CommandValue.args,
            {
                ...CommandValue.options,
                stdin: "inherit",
                stdout: "inherit",
                stderr: "inherit"
            }
        );
    }

    /**
     * Pipelines are usually not what you want for an interactive terminal
     * program. Leave them alone rather than corrupting the pipe topology.
     */
    return CommandValue;
};

export const MakeCommandProgram = <E = never>(
    Options: Program.CommandOptions<E, Prompt.Environment>
): Program<E> =>
{
    return MakeProgram({
        Name: Options.Name,
        Presentation: Options.Presentation,
        Done: Options.Done,
        IsSuccessfulExitCode: Options.IsSuccessfulExitCode,
        MakeCommand: (FilePath) =>
        {
            return Effect.sync(() =>
            {
                const BaseCommand = ChildProcess.make(
                    Options.ProgramCommand,
                    Options.MakeArguments(FilePath),
                    Options.ChildProcessOptions
                );

                const PresentedCommand =
                    Options.Presentation === "Terminal"
                        ? WithInheritedTerminal(BaseCommand)
                        : BaseCommand;

                return Options.Configure === undefined
                    ? PresentedCommand
                    : Options.Configure(PresentedCommand);
            });
        }
    });
};
