/**
 * Process operations for the package-initialization tool.
 *
 * Windows-shim handling (`RequiresWindowsShell`, `EscapeWindowsShellArgument`,
 * `MakeCommand`) mirrors `Script/Setup/Source/Process.ts`. That package has no
 * build output or `exports` field, so its module cannot be imported here; the
 * small helper is duplicated rather than shared.
 *
 * @module @sorrell/wm-init-package/Process
 * @internal
 *
 * @file      Process.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";
import { Effect, Stream } from "effect";

/**
 * A failed `npm install`, carrying its exit code and captured output so it
 * can be surfaced once the run is known to have failed.
 */
export class NpmInstallError extends Error
{
    /**
     * Create an `npm install` failure.
     *
     * @param CapturedOutput - The combined stdout/stderr captured from the run.
     * @param ExitCode - The process exit code.
     */
    public constructor(CapturedOutput: string, ExitCode: number)
    {
        super(`npm install exited with code ${ ExitCode }.\n\n${ CapturedOutput }`);
        this.name = "NpmInstallError";
    }
}

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
 * The platform-appropriate `npm` executable name.
 */
const NpmCommandName: string = process.platform === "win32" ? "npm.cmd" : "npm";

/**
 * Run `npm install` from the repository root with output suppressed.
 *
 * `stdin` is left disconnected (`"ignore"`), so any child process the
 * install spawns sees a non-TTY stdin. The monorepo's own `postinstall`
 * script (`Script/Setup/Source/index.ts`) already treats a non-TTY stdin as
 * a reason to silently skip its "run local setup now?" prompt, so this is
 * what satisfies that prompt being effectively answered "no" without any
 * literal input injection.
 *
 * @param RepositoryRoot - The monorepo root directory.
 * @returns {Effect.Effect<void>} An effect that fails with the captured
 * output when `npm install` exits non-zero.
 */
export function RunNpmInstallQuietly(
    RepositoryRoot: string
): Effect.Effect<void, Error, ChildProcessSpawner.ChildProcessSpawner>
{
    return Effect.scoped(Effect.gen(function*()
    {
        const Spawner: ChildProcessSpawner.ChildProcessSpawner["Service"] =
            yield* ChildProcessSpawner.ChildProcessSpawner;
        const Handle: ChildProcessSpawner.ChildProcessHandle = yield* Spawner.spawn(
            MakeCommand(NpmCommandName, [ "install" ], {
                cwd: RepositoryRoot,
                stdin: "ignore"
            })
        );
        const CapturedOutput: string = yield* Stream.mkString(Stream.decodeText(Handle.all));
        const ExitCode: ChildProcessSpawner.ExitCode = yield* Handle.exitCode;

        if (ExitCode !== 0)
        {
            return yield* Effect.fail(new NpmInstallError(CapturedOutput, ExitCode));
        }
    }));
}
