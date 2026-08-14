/**
 * Git-config-backed author lookup for the package-initialization tool.
 *
 * @module @sorrell/wm-init-package/GitAuthor
 * @internal
 *
 * @file      GitAuthor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, pipe } from "effect";
import { type SimpleGit, simpleGit } from "simple-git";

/**
 * The subset of a user's git identity this tool cares about. Either field
 * may be absent when git is unavailable or the value was never configured.
 */
export interface GitIdentity
{
    readonly Email?: string;
    readonly Name?: string;
}

/**
 * Look up the current user's `user.name` and `user.email`, preferring the
 * repository's local config and falling back to the global config. Never
 * fails: any git error (missing executable, unset values, running outside a
 * repository) resolves to an identity with the corresponding field absent.
 *
 * @param RepositoryRoot - The monorepo root directory to run git within.
 * @returns {Effect.Effect<GitIdentity>} The best-effort local git identity.
 */
export function LookupGitIdentity(RepositoryRoot: string): Effect.Effect<GitIdentity>
{
    return pipe(
        Effect.tryPromise(async (): Promise<GitIdentity> =>
        {
            const Git: SimpleGit = simpleGit(RepositoryRoot);
            const Email: string | undefined = await ReadConfigValue(Git, "user.email");
            const Name: string | undefined = await ReadConfigValue(Git, "user.name");

            return {
                ...(Email === undefined ? { } : { Email }),
                ...(Name === undefined ? { } : { Name })
            };
        }),
        Effect.orElseSucceed((): GitIdentity => ({ }))
    );
}

/**
 * Read one git config key, trying the local scope before the global scope.
 *
 * @param Git - The `simple-git` client rooted at the monorepo.
 * @param Key - The git config key to read (for example, `user.name`).
 * @returns {Promise<string | undefined>} The configured value, if any.
 */
async function ReadConfigValue(Git: SimpleGit, Key: string): Promise<string | undefined>
{
    const LocalValue: string | undefined = await TryReadConfigScope(Git, "--local", Key);

    if (LocalValue !== undefined)
    {
        return LocalValue;
    }

    return TryReadConfigScope(Git, "--global", Key);
}

/**
 * Read one git config key within a single scope, tolerating the key being
 * unset in that scope.
 *
 * @param Git - The `simple-git` client rooted at the monorepo.
 * @param Scope - The `git config` scope flag (`--local` or `--global`).
 * @param Key - The git config key to read.
 * @returns {Promise<string | undefined>} The configured value, if set.
 */
async function TryReadConfigScope(
    Git: SimpleGit,
    Scope: "--global" | "--local",
    Key: string
): Promise<string | undefined>
{
    try
    {
        const Value: string = (await Git.raw([ "config", Scope, Key ])).trim();

        return Value.length > 0 ? Value : undefined;
    }
    catch
    {
        return undefined;
    }
}
