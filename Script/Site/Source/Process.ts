/**
 *
 *
 * @module @sorrell/site/Process
 *
 * @file      Process.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

export const ProcessTypeId = Symbol.for("@sorrell/site/Process");
export type ProcessTypeId = typeof ProcessTypeId;

/** Run a command with inherited output and fail on a non-zero exit. @category Process @since 1.0.0 */
export const RunCommand = (
    Executable: string,
    Arguments: ReadonlyArray<string>,
    WorkingDirectory: string
): Effect.Effect<void, Error, ChildProcessSpawner.ChildProcessSpawner> =>
    Effect.gen(function*()
    {
        const Spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
        const IsWindowsShim = process.platform === "win32" && Executable.endsWith(".cmd");
        const Command = IsWindowsShim ?
            ChildProcess.make([ Executable, ...Arguments ].map(Quote).join(" "), [], { cwd: WorkingDirectory, shell: true, stderr: "inherit", stdin: "inherit", stdout: "inherit" }) :
            ChildProcess.make(Executable, Arguments, { cwd: WorkingDirectory, stderr: "inherit", stdin: "inherit", stdout: "inherit" });
        const ExitCode = yield* Spawner.exitCode(Command);
        if (ExitCode !== 0) return yield* Effect.fail(new Error(`${ Executable } exited with code ${ ExitCode }.`));
    });

const Quote = (Value: string): string => /[\s&()<>|!"]/u.test(Value) ? `"${ Value.replaceAll('"', '""') }"` : Value;
