/**
 * @file      PseudoTerminal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IPty, OnExitData } from "./PseudoTerminal.Types.js";
import {
    type IPtyForkOptions,
    type IPty as IPtyOriginal,
    type IWindowsPtyForkOptions,
    spawn } from "node-pty";
import type { TReject, TResolve } from "@sorrell/utilities/async";
import { GetCommandName } from "../Cli/Command/Command.js";

/**
 * This function wraps {@link spawn} and provides sensible default options.
 *
 * @param {string} Command - The name of the command to run.
 * @param {Array<string>} Arguments - The arguments to supply with the {@link Command}.
 * @param {IPtyForkOptions | IWindowsPtyForkOptions} Options - The options for the resulting
 * `node-pty` session.
 *
 * @returns {IPty} The session
 *
 * @example
 * Running `npm install @sorrell/cli-utilities` via a `node-pty` session,
 * ```typescript
 * const MySession: IPty = Spawn("npm", [ "install" ]);
 * ```
 */
export function Spawn(
    Command: string,
    Arguments: Array<string> = [ ],
    Options: IPtyForkOptions | IWindowsPtyForkOptions = { }
): IPty
{
    const DefaultOptions: IPtyForkOptions | IWindowsPtyForkOptions =
        {
            cols: process.stdout.columns || 80,
            cwd: process.cwd(),
            env: process.env as Record<string, string>,
            name: "xterm-color",
            rows: process.stdout.rows || 30
        };

    const OutOptions: IPtyForkOptions | IWindowsPtyForkOptions =
        {
            ...DefaultOptions,
            ...Options
        };

    const Out: IPtyOriginal = spawn(
        GetCommandName(Command),
        Arguments,
        OutOptions
    );

    let OnExitResolve: TResolve<OnExitData>;

    const OnExit: IPty["OnExit"] = new Promise<OnExitData>((
        Resolve: TResolve<OnExitData>,
        _Reject: TReject
    ): void =>
    {
        OnExitResolve = Resolve;
    });

    Out.onExit((Data: OnExitData): void =>
    {
        OnExitResolve(Data);
    });

    return {
        ...Out,
        OnExit
    };
}
