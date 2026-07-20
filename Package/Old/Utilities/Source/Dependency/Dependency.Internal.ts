/**
 * @file      Dependency.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import Chalk from "chalk";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { IsRuntimeModeProduction } from "./Dependency.ts";
import type { TRuntimeModeProductionOptions } from "./Dependency.Types.ts";

/**
 * The default value of the `TruthyValues` argument of {@link IsRuntimeModeProduction}.
 */
const DefaultTruthyValues: ReadonlyArray<string> =
    [
        "true",
        "1",
        "yes",
        "y",
        "on"
    ] as const;

export /**
        * The default options of {@link IsRuntimeModeProduction}.
        */
const DefaultOptions: TRuntimeModeProductionOptions<boolean> =
    {
        TruthyValues: DefaultTruthyValues,
        UncertainValue: true
    };

/* eslint-disable jsdoc/require-example */

/**
 * Formats a given {@link Message} to look like a code snippet (or path, *etc.*).
 *
 * @param Message - The message to format.
 *
 * @returns {string} The {@link Message}, formatted to look like code (or a path, *etc.*).
 */
export function Code(Message: string): string
{
    return Chalk.reset.red(Message);
}

/* eslint-enable jsdoc/require-example */

/* eslint-disable-next-line jsdoc/require-jsdoc */
export function NormalizeLogMessage(Message: unknown): ReadonlyArray<unknown>
{
    if (Array.isArray(Message))
    {
        return Message;
    }

    return [ Message ];
}
