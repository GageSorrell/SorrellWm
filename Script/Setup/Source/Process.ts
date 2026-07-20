/**
 *
 *
 * @module @sorrell/wm-monorepo-setup/Process
 * @internal
 *
 * @file      Process.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";
import { Effect } from "effect";

/**
 * Determine whether an executable is a Windows command-script shim.
 *
 * Node cannot launch `.cmd` or `.bat` files directly on Windows. These files
 * must be passed through `cmd.exe`, which Effect enables with the `shell`
 * command option.
 *
 * @param CommandName - The executable that will be launched.
 * @returns {boolean} Whether the Windows command shell is required.
 */
function RequiresWindowsShell(CommandName: string): boolean
{
    return process.platform === "win32" && /\.(?:bat|cmd)$/iu.test(CommandName);
}

/**
 * Escape one argument for a Windows command-script invocation.
 *
 * @param Argument - The argument to escape.
 * @returns {string} The escaped command-line argument.
 */
function EscapeWindowsShellArgument(Argument: string): string
{
    const EscapedArgument: string = Argument
        .replaceAll("^", "^^")
        .replaceAll("%", "^%");

    return /[\s&()<>|!"]/u.test(EscapedArgument)
        ? `"${ EscapedArgument.replaceAll("\"", "\"\"") }"`
        : EscapedArgument;
}

/**
 * Create a platform-appropriate child-process command.
 *
 * @param CommandName - The executable that will be launched.
 * @param Arguments - The executable's arguments.
 * @param Options - Effect child-process options.
 * @returns {ChildProcess.StandardCommand} The command ready for the platform spawner.
 */
function MakeCommand(
    CommandName: string,
    Arguments: ReadonlyArray<string>,
    Options: ChildProcess.CommandOptions
): ChildProcess.StandardCommand
{
    if (!RequiresWindowsShell(CommandName))
    {
        return ChildProcess.make(CommandName, Arguments, Options);
    }

    const CommandLine: string = [ CommandName, ...Arguments ]
        .map(EscapeWindowsShellArgument)
        .join(" ");

    return ChildProcess.make(CommandLine, [], {
        ...Options,
        shell: true
    });
}

/**
 * A failed external command used by a setup feature.
 */
export class FSetupCommandError extends Error
{
    /**
     * Create an external command failure.
     *
     * @param CommandName - The executable that failed.
     * @param ExitCode - The process exit code.
     */
    public constructor(CommandName: string, ExitCode: number)
    {
        super(`${ CommandName } exited with code ${ ExitCode }.`);
        this.name = "FSetupCommandError";
    }
}

/**
 * Execute a child process without forwarding its output.
 *
 * @param CommandName - The executable to run.
 * @param Arguments - The executable's arguments.
 * @param WorkingDirectory - The command working directory.
 * @returns {Effect.Effect<void>} An effect that fails for a nonzero exit code.
 */
export function ExecuteQuietly(
    CommandName: string,
    Arguments: ReadonlyArray<string>,
    WorkingDirectory: string
): Effect.Effect<void, Error, ChildProcessSpawner.ChildProcessSpawner>
{
    return Effect.gen(function*()
    {
        const Spawner: ChildProcessSpawner.ChildProcessSpawner["Service"] =
            yield* ChildProcessSpawner.ChildProcessSpawner;
        const ExitCode: ChildProcessSpawner.ExitCode = yield* Spawner.exitCode(
            MakeCommand(CommandName, Arguments, {
                cwd: WorkingDirectory,
                stderr: "ignore",
                stdin: "ignore",
                stdout: "ignore"
            })
        );

        if (ExitCode !== 0)
        {
            return yield* Effect.fail(new FSetupCommandError(CommandName, ExitCode));
        }
    });
}

/**
 * Capture the standard output of a child process.
 *
 * @param CommandName - The executable to run.
 * @param Arguments - The executable's arguments.
 * @param WorkingDirectory - The command working directory.
 * @returns {Effect.Effect<string>} The command's standard output.
 */
export function CaptureOutput(
    CommandName: string,
    Arguments: ReadonlyArray<string>,
    WorkingDirectory: string
): Effect.Effect<string, Error, ChildProcessSpawner.ChildProcessSpawner>
{
    return Effect.gen(function*()
    {
        const Spawner: ChildProcessSpawner.ChildProcessSpawner["Service"] =
            yield* ChildProcessSpawner.ChildProcessSpawner;

        return yield* Spawner.string(MakeCommand(CommandName, Arguments, {
            cwd: WorkingDirectory,
            stderr: "ignore",
            stdin: "ignore"
        }));
    });
}
