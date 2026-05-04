/**
 * @file      Dependency.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ConsoleLogFunctionKey } from "./Dependency.Internal.Types";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { IsRuntimeModeProduction } from "./Dependency.ts";

export type DependencyLogger = Pick<typeof console, ConsoleLogFunctionKey>;

/**
 * The options argument of {@link IsRuntimeModeProduction}.
 * @property {string} DebugEnvironmentVariable - If specified, then this environment variable will be
 * checked for, in addition to the other checks performed by this function to guess whether the current
 * session is in *production mode*.
 *
 * @template UncertainType - The type of the {@link UncertainValue}.  By default, this is `boolean`.
 *
 * @property {ReadonlyArray<string>} TruthyValues - If {@link DebugEnvironmentVariable} is specified, and
 * if {@link process.env} has a property with key {@link DebugEnvironmentVariable}, then this will return
 * based on whether
 * ```typescript
 * TruthyValues.map(TruthyWord => TruthyWord.toLowerCase()).includes(DebugEnvironmentVariable.toLowerCase());
 * ```
 *
 * @property {UncertainType} UncertainValue - The value that is returned in Step 3—that is, if this function
 * is uncertain whether the current session is in *production mode.*  By default, this is `true`.
 */
export type TRuntimeModeProductionOptions<UncertainType = boolean> =
    Partial<{
        DebugEnvironmentVariable: string;
        UncertainValue: UncertainType;
        TruthyValues: ReadonlyArray<string>;
    }>;
