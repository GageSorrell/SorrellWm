/**
 * @file      Dependency.Effect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Layer, Logger, pipe } from "@sorrell/effect";
import { Code } from "../Dependency.Internal.ts";
import { IsRuntimeModeProduction } from "../Dependency.ts";

/* eslint-disable jsdoc/require-example */

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
export function CreateDependencyLoggerLayer(
    PackageName: string,
    SuppressLoggerFrequency: number = 12,
    SuppressLogEnvironmentVariable: string | undefined = undefined
): Layer.Layer<never, never, never>
{
    const IsProductionMode: boolean = SuppressLogEnvironmentVariable !== undefined
        ? IsRuntimeModeProduction({ DebugEnvironmentVariable: SuppressLogEnvironmentVariable })
        : IsRuntimeModeProduction();

    if (IsProductionMode)
    {
        return Layer.empty;
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

    const HandleStatement = (Line: string) =>
    {
        LoggedStatementCount++;

        const PrefixedLine: string = `${ Prefix } ${ Line }`;

        if (
            SuppressLoggerFrequency > 0 &&
            LoggedStatementCount % SuppressLoggerFrequency === 0
        )
        {
            return `${ PrefixedLine }\n${ LogSuppressionStatement }`;
        }

        return PrefixedLine;
    };

    const PrefixedLogger: Logger.Logger<unknown, void> = pipe(
        Logger.formatSimple,
        Logger.map(HandleStatement),
        Logger.withLeveledConsole
    );

    return Logger.layer([ PrefixedLogger ]);
}
