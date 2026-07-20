/**
 * @file      PseudoTerminal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IPty as IPtyOriginal } from "node-pty";

/**
 * The data that is supplied to the listener argument of
 * {@link IPtyOriginal!onExit | onExit}.
 */
export type OnExitData = Parameters<Parameters<IPty["onExit"]>[0]>[0];

/**
 * The {@link IPtyOriginal | IPty}, with an additional {@link Promise}
 * {@link OnExit}, which resolves to the {@link OnExitData} for the
 * given session.
 */
export interface IPty extends IPtyOriginal
{
    OnExit: Promise<OnExitData>;
}
