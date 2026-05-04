/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

import type { LogLevel, LogOptions, LogStatements } from "./Log.Types";
import { GetElectron } from "./Electron";
import { IsRuntimeModeProduction } from "@sorrell/utilities/dependency";
import type { app } from "electron";

/**
 * Determines whether the dependent package is currently running in production mode.
 *
 * @returns {boolean} Whether the dependent package is currently running in production mode.
 */
function IsDependentModeProduction(): boolean
{
    const App: typeof app | undefined = GetElectron("app");

    return (
        App !== undefined &&
        App.isPackaged &&
        IsRuntimeModeProduction("ELECTRON_REACTIVE_EVENT_DEBUG")
    );
}

const DefaultLogOptions: LogOptions =
    {
        Level: "Info"
    };

/**
 * Log statements regarding `reactive-event`.
 * Logging is disabled when {@link IsDependentModeProduction} returns `true`.
 *
 * @param Options - The {@link LogOptions} object that customizes the behavior of this log operation.
 * @param Statements - The statements to log.
 */
export function Log(Options: Partial<LogOptions>, ...Statements: LogStatements): void;

/**
 * Log statements regarding `reactive-event`.
 * Logging is disabled when {@link IsDependentModeProduction} returns `true`.
 *
 * @param Statements - The statements to log.
 */
export function Log(...Statements: LogStatements): void;

/**
 * Log statements regarding `reactive-event`.
 * It is first determined whether the zeroth element of the {@link ArgumentVector}, if one exists,
 * is a {@link LogOptions} object.  If the zeroth element *is* a {@link LogOptions} object, then
 * this will be used to customize the behavior of this log operation.
 *
 * Logging is disabled when {@link IsDependentModeProduction} returns `true`.
 *
 * @param ArgumentVector - The statements to log, and possibly a {@link LogOptions} at index `0`.
 */
export function Log(...ArgumentVector: Array<unknown>): void
{
    if (IsDependentModeProduction())
    {
        return;
    }

    let IsLogOptionsInArgumentVector: boolean = false;
    const Options: LogOptions = ((): LogOptions =>
    {
        const ZerothArgument: unknown = ArgumentVector[0];
        const Keys: Array<string> = (typeof ZerothArgument === "object" && ZerothArgument !== null)
            ? Object.keys(ZerothArgument)
            : [ ];

        /* eslint-disable-next-line jsdoc/require-jsdoc */
        function IsLogOptions(In: unknown): In is LogOptions
        {
            const LogOptionsKeys: Array<string> = Object.keys(DefaultLogOptions);
            return (
                ZerothArgument === "object" &&
                Keys.every((Key: string) => LogOptionsKeys.includes(Key))
            );
        }

        IsLogOptionsInArgumentVector = IsLogOptions(ZerothArgument);

        return IsLogOptions(ZerothArgument)
            ? ZerothArgument
            : DefaultLogOptions;
    })();

    const Statements: Array<unknown> = ((): Array<unknown> =>
    {
        if (IsLogOptionsInArgumentVector)
        {
            const [ _ /* Options */, ...Statements ] = ArgumentVector;
            return Statements;
        }
        else
        {
            return ArgumentVector;
        }
    })();

    const FormattedStatements: Array<unknown> = Statements.flatMap((
        Statement: unknown,
        Index: number
    ): Array<unknown> =>
    {
        const PackagePrefix: string = "[reactive-event]";
        if (typeof Statement === "string")
        {
            return [ `${ PackagePrefix } ${ Statement }` ];
        }
        else if (Index > 0)
        {
            const PreviousStatementHasPrefix: boolean = ((): boolean =>
            {
                const PreviousStatement: unknown = Statements[Index - 1];

                return (
                    typeof PreviousStatement === "string" &&
                    PreviousStatement.startsWith(PackagePrefix)
                );
            })();

            if (PreviousStatementHasPrefix)
            {
                return [ Statement ];
            }
        }

        return [ PackagePrefix, Statement ];
    });

    const LogLevel: Lowercase<LogLevel> = Options.Level.toLowerCase() as Lowercase<LogLevel>;

    console[LogLevel](...FormattedStatements);

    const StatementsPhrase: string = FormattedStatements.length > 1
        ? "statements were"
        : "statement was";
    const LogSuppressionStatement: string =
        `[reactive-event] The above ${ StatementsPhrase } ` +
        " because it was determined that the current app is not running in production mode.  " +
        "To suppress logs from reactive-event, set ELECTRON_REACTIVE_EVENT_LOG === \"0\" " +
        "or set one of the other conditions described in the FAQ " +
        "(https://link.sorrell.sh/reactive-disable-logging).";

    console.info(LogSuppressionStatement);
}
