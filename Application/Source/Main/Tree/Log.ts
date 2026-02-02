/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type FLogFunction, type FLogger, GetLogger } from "#/Development";

const LogBase: FLogger = GetLogger("Tree");

/**
 * Intercept log statements, and abbreviate/format some data
 * specific to the `Tree` collection of modules.
 */
const FormatTreeLogStatements: FLogFunction = (...Statements: Array<unknown>): void =>
{
    LogBase(Statements.map((Statement: unknown): unknown =>
    {
        /* Quick-and-dirty check to see if the object is an `FAnnotatedPanel` *
         * whose `Screenshot` property is not `undefined`.                    */
        const HasScreenshotProperty: boolean = (
            typeof Statement === "object" &&
            Statement !== null &&
            "Screenshot" in Statement
        );

        if (HasScreenshotProperty)
        {
            const { Screenshot: _, ...RemainingStatement } = Statement as Record<string, unknown>;
            return RemainingStatement;
        }
        else
        {
            return Statement;
        }
    }));
};

const LogInterim: FLogger = LogBase as FLogger;
LogInterim.Error   = (...Statements: Array<unknown>) => LogBase.Error(  FormatTreeLogStatements(Statements));
LogInterim.Verbose = (...Statements: Array<unknown>) => LogBase.Verbose(FormatTreeLogStatements(Statements));
LogInterim.Warn    = (...Statements: Array<unknown>) => LogBase.Warn(   FormatTreeLogStatements(Statements));

/**
 * Log statements for the `Tree` collection of modules.
 * This function, which returns the logger, is exported
 * (rather than exporting the logger directly) to be
 * consistent with how the logger is typically retrieved
 * (retrieved at the top of each module).
 */
export const GetTreeLogger: (() => FLogger) = (): FLogger => LogInterim;
