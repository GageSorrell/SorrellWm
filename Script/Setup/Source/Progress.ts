/**
 * Progress operations for local monorepo setup.
 *
 * @module @sorrell/wm-monorepo-setup/Progress
 * @internal
 *
 * @file      Progress.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, pipe } from "effect";
import type { Ora } from "ora";
import ora from "ora";

/**
 * Run an operation with interactive spinner output when verbosity is enabled.
 *
 * @param IsVerbose - Whether descriptive output should be displayed.
 * @param PendingMessage - The message shown while work is in progress.
 * @param CompleteMessage - The message shown after successful completion.
 * @param Operation - The Effect operation to execute.
 * @returns {Effect.Effect<Success, Failure, Requirements>} The original result.
 */
export function WithProgress<Success, Failure, Requirements>(
    IsVerbose: boolean,
    PendingMessage: string,
    CompleteMessage: string,
    Operation: Effect.Effect<Success, Failure, Requirements>
): Effect.Effect<Success, Failure, Requirements>
{
    if (!IsVerbose)
    {
        return Operation;
    }

    return Effect.gen(function*()
    {
        const Spinner: Ora = ora(PendingMessage).start();

        return yield* pipe(Operation, Effect.tap((): Effect.Effect<void> => Effect.sync((): void =>
            {
                Spinner.succeed(CompleteMessage);
            })),
            Effect.tapError((): Effect.Effect<void> => Effect.sync((): void =>
            {
                Spinner.fail(`${ PendingMessage } failed.`);
            })),
            Effect.ensuring(Effect.sync((): void =>
            {
                if (Spinner.isSpinning)
                {
                    Spinner.stop();
                }
            })));
    });
}
