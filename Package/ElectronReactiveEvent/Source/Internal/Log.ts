/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LogLevel, LogOptions, LogStatements } from "./Log.Types";
import { GetElectron } from "./Electron";
import type { app } from "electron";

function IsDependentModeProduction(): boolean
{
    const App: typeof app | undefined = GetElectron("app");

    const DebugEnvVar: "ELECTRON_REACTIVE_EVENT_DEBUG" = "ELECTRON_REACTIVE_EVENT_DEBUG" as const;
    const NodeEnvVar: "NODE_ENV" = "NODE_ENV" as const;

    return (
        !(
            DebugEnvVar in process.env &&
            process.env[DebugEnvVar] === "1"
        ) &&
        !(
            NodeEnvVar in process.env &&
            (
                process.env[NodeEnvVar] === "1" ||
                process.env[NodeEnvVar]?.toLowerCase() === "production" ||
                process.env[NodeEnvVar]?.toLowerCase() === "prod"
            )
        ) &&
        App !== undefined &&
        App.isPackaged
    );
}

const DefaultLogOptions: LogOptions =
    {
        Level: "Info"
    };

export function Log(Options: Partial<LogOptions>, ...Statements: LogStatements): void;
export function Log(...Statements: LogStatements): void;
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
        const PackagePrefix: string = "[electron-reactive-event]";
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
        `[electron-reactive-event] The above ${ StatementsPhrase } ` +
        " because it was determined that the current app is not running in production mode.  " +
        "To suppress logs from electron-reactive-event, set ELECTRON_REACTIVE_EVENT_LOG === \"0\" " +
        "or set one of the other conditions described in the FAQ " +
        "(https://link.sorrell.sh/reactive-disable-logging).";

    console.info(LogSuppressionStatement);
}
