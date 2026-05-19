/**
 * @file      Git.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data, Effect } from "effect";
import { Command } from "@effect/platform";
import type { ERequireCleanRepo } from "./Git.Types.js";
import type { FRepoNotCleanErrorData } from "./Git.Internal.Types.js";

/** The error that is thrown when the current `git` repo must be clean, but is not. */
export class RepoNotCleanError extends Data.TaggedError("RepoNotCleanError")<FRepoNotCleanErrorData> { };

/* eslint-disable jsdoc/require-example */

/**
 * Get an {@link Effect.Effect | effect} that causes the program to fail if a given `git`
 * repo is not clean.
 *
 * @param RepositoryPath - The *optional* path to a directory in the repository.  If no path is specified,
 * then the current working directory is used.
 *
 * @returns {ERequireCleanRepo} An {@link Effect.Effect | effect} that causes the program to fail
 * if the `git` repo at the given {@link RepositoryPath} (or CWD if no {@link RepositoryPath} is specified)
 * is not clean.
 */
export function RequireCleanGitRepository(RepositoryPath?: string): ERequireCleanRepo
{
    return Effect.gen(function* ()
    {
        if (RepositoryPath === undefined)
        {
            RepositoryPath = process.cwd();
        }

        const StatusCommand: Command.Command =
            Command
                .make("git", "status", "--porcelain=v1")
                .pipe(Command.workingDirectory(RepositoryPath));

        const StatusOutput: string = yield* Command.string(StatusCommand);

        if (StatusOutput.trim().length > 0)
        {
            return yield* Effect.fail(
                new RepoNotCleanError({
                    RepositoryPath,
                    StatusOutput
                })
            );
        }
    });
}

/* eslint-enable jsdoc/require-example */
