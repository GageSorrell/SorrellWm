/**
 * @file      Dependency.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example, jsdoc/match-description */

import type { DependencyLogger, TRuntimeModeProductionOptions } from "./Dependency.Types.ts";
import { type InspectOptions, format } from "node:util";
import { Code } from "./Dependency.Internal.ts";
import { DefaultOptions } from "./Dependency.Internal.ts";

/**
 * Guess whether the current session is in *production mode* by,
 *
 * 1. If the function did not already return in Step 1, then {@link process.env} is checked for
 * a property with key `"NODE_ENV"`.
 *     - If there exists a property with this key, and if `process.env["NODE_ENV"] === "production"`
 *       (or similar; see below), then this returns `true`.
 * 2. If the function did not already return in Step 2, then `true` is returned.
 *
 * @note If Step 2 is executed, then this returns `true` when `process.env["NODE_ENV"].toLowerCase()`
 * is any one of,
 * - `"production"`
 * - `"prod"`
 *
 * @returns {boolean} Whether the current session is likely in *production mode*, or,
 * if unsure, `true` is returned.
 */
export function IsRuntimeModeProduction(): boolean;

/**
 * Guess whether the current session is in *production mode* by,
 *
 * 1. If a {@link DebugEnvironmentVariable} is given, then {@link process.env}
 * is checked for the existence of a property having this key.
 *     - If the property exists and is in {@link TruthyValues}, then this function returns `true`.
 *     - If the property exists but is in {@link TruthyValues}, then this returns `false`.
 * 2. If the function did not already return in Step 1, then {@link process.env} is checked for
 * a property with key `"NODE_ENV"`.
 *     - If there exists a property with this key, and if `process.env["NODE_ENV"] === "production"`
 *       (or similar; see below), then this returns `true`.
 * 3. If the function did not already return in Step 2, then {@link UncertainValue} is returned.
 * By default, this is `true`, but any value of any type can be used.
 *
 * @template UncertainType - The type of the {@link UncertainValue}.  By default, this is `boolean`.
 *
 * @param Options - The {@link TRuntimeModeProductionOptions} options object.  All properties are optional.
 *
 * @note If Step 2 is executed, then this returns `true` when `process.env["NODE_ENV"].toLowerCase()`
 * is any one of,
 * - `"production"`
 * - `"prod"`
 *
 * @returns {boolean | typeof UncertainValue} Whether the current session is likely in *production mode*, or,
 * if unsure, the given {@link UncertainValue} is returned (by default, this is `true`).
 */
export function IsRuntimeModeProduction<UncertainType = boolean>(
    Options: TRuntimeModeProductionOptions<UncertainType>
): boolean | Exclude<typeof Options.UncertainValue, undefined>;

export function IsRuntimeModeProduction<UncertainType = boolean>(
    Options: TRuntimeModeProductionOptions<UncertainType> =
        (DefaultOptions as TRuntimeModeProductionOptions<UncertainType>)
): boolean | typeof Options.UncertainValue
{
    const {
        DebugEnvironmentVariable,
        UncertainValue,
        TruthyValues
    } = {
        ...DefaultOptions,
        ...Options
    } as Required<TRuntimeModeProductionOptions<UncertainType>>;

    if (DebugEnvironmentVariable !== undefined)
    {
        if (DebugEnvironmentVariable in process.env)
        {
            const IsDebugTruthy: boolean = TruthyValues
                .map((TruthyWord: string) => TruthyWord.toLowerCase())
                .includes(DebugEnvironmentVariable.toLowerCase());

            return IsDebugTruthy;
        }
    }

    const NodeEnvKey: "NODE_ENV" = "NODE_ENV" as const;

    if (NodeEnvKey in process.env && typeof process.env[NodeEnvKey] === "string")
    {
        return [ "production", "prod" ].includes(process.env[NodeEnvKey].toLowerCase());
    }

    return UncertainValue;
}

/**
 * This patches the default logger so that the statements that are logged by your dependency package
 * do not overwhelm or annoy the consuming developer.
 *
 * {@link IsDependentModeProduction} is used to determine whether to return a no-op
 * (iff `true`), or a function that wraps {@link Console} (iff `false`).
 *
 * @param PackageName - The name of your package.  It is strongly recommended, but not *enforced*,
 * that this is exactly the `name` in your `package.json`.  Statements logged under this
 * {@link Layer.Layer | Layer} are prefixed with `[${ PackageName }]`.
 *
 * @param SuppressLoggerFrequency - When {@link SuppressLoggerFrequency} statements have been logged,
 * a short message is *also* logged, explaining how to suppress output from your package.
 *
 * @param SuppressLogEnvironmentVariable - If specified, this is the environment variable name passed to
 * {@link IsDependentModeProduction} to determine whether the logger will be a no-op.
 *
 * @returns {Layer.Layer} A {@link Layer.Layer | Layer} that provides the {@link DependencyLogger}
 * with the {@link PackageName}.
 */
export function GetDependencyLogger(
    PackageName: string,
    SuppressLoggerFrequency: number = 12,
    SuppressLogEnvironmentVariable: string | undefined = undefined
): DependencyLogger
{
    const IsProductionMode: boolean = SuppressLogEnvironmentVariable !== undefined
        ? IsRuntimeModeProduction({ DebugEnvironmentVariable: SuppressLogEnvironmentVariable })
        : IsRuntimeModeProduction();

    if (IsProductionMode)
    {
        return {
            debug(..._Statements: Array<unknown>): void { },
            dir(_InObject: unknown, _Options: InspectOptions | undefined): void { },
            error(..._Statements: Array<unknown>): void { },
            info(..._Statements: Array<unknown>): void { },
            log(..._Statements: Array<unknown>): void { },
            warn(..._Statements: Array<unknown>): void { }
        } as const;
    }

    const Prefix: string = `[${ PackageName }]`;

    const LogSuppressionStatement: string =
        `[${ PackageName }] To suppress logs from ${ PackageName }, set the env. variable ` +
        `${ Code("NODE_ENV") } to ${ Code("\"production\"") }` + (
            SuppressLogEnvironmentVariable !== undefined
                ? `, or set the env. variable ${ Code(SuppressLogEnvironmentVariable) } to ` +
                `${ Code("\"false\"") }.`
                : "."
        );

    let LoggedStatementCount: number = 0;
    function OnStatementLogged(): boolean
    {
        LoggedStatementCount++;

        const Out: boolean = (
            SuppressLoggerFrequency > 0 &&
            LoggedStatementCount % SuppressLoggerFrequency === 0
        );

        if (Out)
        {
            LoggedStatementCount = 0;
        }

        return Out;
    }

    function PrintLogSuppressionStatement(): void
    {
        console.log(LogSuppressionStatement);
    }

    function OnStatementLoggedManual(): void
    {
        if (OnStatementLogged())
        {
            PrintLogSuppressionStatement();
        }
    }

    function GetFormattedStatements(...Statements: Array<unknown>): ReadonlyArray<string>
    {
        return Statements
            .flatMap((Statement: unknown): Array<string> =>
            {
                const OutStatement: string = `${ Prefix } ${ format(Statement) }`;

                return OnStatementLogged()
                    ? [ OutStatement, LogSuppressionStatement ]
                    : [ OutStatement ];
            });
    };

    return {
        debug(...Statements: Array<unknown>): void
        {
            console.debug(...GetFormattedStatements(Statements));
        },
        dir(InObject: unknown, Options: InspectOptions | undefined): void
        {
            console.dir(InObject, Options);
            OnStatementLoggedManual();
        },
        error(...Statements: Array<unknown>): void
        {
            console.error(...GetFormattedStatements(Statements));
        },
        info(...Statements: Array<unknown>): void
        {
            console.info(...GetFormattedStatements(...Statements));
        },
        log(...Statements: Array<unknown>): void
        {
            console.log(...GetFormattedStatements(...Statements));
        },
        warn(...Statements: Array<unknown>): void
        {
            console.warn(...GetFormattedStatements(...Statements));
        }
    } as const;
}
