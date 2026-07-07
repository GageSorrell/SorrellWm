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

import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Proc from "effect/unstable/process";
import type * as Prompt from "./Prompt.ts";

export const TypeIdKey: string = "~sorrell/effect-ink/Prompt";
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

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
}

export namespace Terminal
{
    export const None: Terminal =
        {
            Flush: Effect.void,
            Suspend: (Use: unknown) => Use
        };
}

export class UserCompletionRequiredError extends Data.TaggedError("UserCompletionRequiredError")<{
    readonly ProgramName: string;
    readonly FilePath: string;
}> { }

export class ProgramExitCodeError extends Data.TaggedError("ProgramExitCodeError")<{
    readonly ProgramName: string;
    readonly ExitCode: Proc.ChildProcessSpawner.ExitCode;
}> { }

export interface Program
{
    readonly [ TypeId ]: TypeId;

    readonly Name: string;
    readonly Presentation: Presentation;
    readonly Done: Done;

    /** Defaults to accepting only exit code 0. */
    readonly IsSuccessfulExitCode: (ExitCode: Proc.ChildProcessSpawner.ExitCode) => boolean;

    readonly GetCommand: (FilePath: string) => ProgramEffect<Proc.ChildProcess.Command>;
}

const ExternalPresentation: unique symbol = Symbol.for(`${ TypeIdKey }!Presentation!External`);
const TerminalPresentation: unique symbol = Symbol.for(`${ TypeIdKey }!Presentation!Terminal`);

export const Presentation: Readonly<{
    External: typeof ExternalPresentation;
    Terminal: typeof TerminalPresentation;
}> =
    {
        External: ExternalPresentation,
        Terminal: TerminalPresentation
    } as const;

export type Presentation = typeof Presentation[keyof typeof Presentation];

export type ProgramEffect<A = void> = Effect.Effect<A, never, Prompt.Environment>;

export type AwaitDoneCallback = (Context: AwaitDoneContext) => ProgramEffect<void>;

export type Done = Data.TaggedEnum<{
    readonly ProcessExit: { };
    readonly UserConfirmation: { };
    readonly AwaitDone: { readonly Callback: AwaitDoneCallback; };
}>;

export const Done: Data.TaggedEnum.Constructor<Done> = Data.taggedEnum<Done>();

export interface AwaitDoneContext
{
    readonly FilePath: string;
    readonly ProgramName: string;
}

export interface Options
    extends Omit<Program, TypeId | "Presentation" | "Done" | "IsSuccessfulExitCode">,
    Partial<Pick<Program, "Presentation" | "Done" | "IsSuccessfulExitCode">> { };

export interface CommandOptions extends Options
{
    readonly ProgramCommand: string;
    readonly GetArguments: (FilePath: string) => ReadonlyArray<string>;

    readonly ChildProcessOptions?: Proc.ChildProcess.CommandOptions;

    readonly Configure?: (
        CommandValue: Proc.ChildProcess.Command
    ) => Proc.ChildProcess.Command;
}

export const Program = (Options: Options): Program =>
{
    return {
        [ TypeId ]: TypeId,

        Done: Options.Done ?? { _tag: "ProcessExit" },
        GetCommand: Options.GetCommand,
        IsSuccessfulExitCode: Options.IsSuccessfulExitCode ?? ((ExitCode) =>
        {
            return ExitCode === Proc.ChildProcessSpawner.ExitCode(0);
        }),
        Name: Options.Name,
        Presentation: Options.Presentation ?? Presentation.External
    };
};

/**
 * For terminal-taking commands, v4 `Process.ChildProcess` does not use the old
 * `Command.stdin("inherit")` style. Instead, stdio is supplied through the
 * command options object.
 */
export const WithInheritedTerminal = (
    InCommand: Proc.ChildProcess.Command
): Proc.ChildProcess.Command =>
{
    if (InCommand._tag === "StandardCommand")
    {
        return Proc.ChildProcess.make(
            InCommand.command,
            InCommand.args,
            {
                ...InCommand.options,
                stderr: "inherit",
                stdin: "inherit",
                stdout: "inherit"
            }
        );
    }

    /**
     * Pipelines are usually not what you want for an interactive terminal
     * program. Leave them alone rather than corrupting the pipe topology.
     */
    return InCommand;
};

export const CommandProgram = (Options: CommandOptions): Program =>
{
    return Program({
        Done: Options.Done ?? Done.ProcessExit(),
        GetCommand: (FilePath: string) => Effect.gen(function* ()
        {
            const BaseCommand: Proc.ChildProcess.StandardCommand = Proc.ChildProcess.make(
                Options.ProgramCommand,
                Options.GetArguments(FilePath),
                Options.ChildProcessOptions
            );

            const PresentedCommand: Proc.ChildProcess.Command =
                Options.Presentation === Presentation.Terminal
                    ? WithInheritedTerminal(BaseCommand)
                    : BaseCommand;

            return Options.Configure === undefined
                ? PresentedCommand
                : Options.Configure(PresentedCommand);
        }),
        IsSuccessfulExitCode: Options.IsSuccessfulExitCode ?? Function.constTrue,
        Name: Options.Name,
        Presentation: Options.Presentation ?? Presentation.External
    });
};
