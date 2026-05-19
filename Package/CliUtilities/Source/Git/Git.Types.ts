/**
 * @file      Git.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CommandExecutor, Error } from "@effect/platform";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { RepoNotCleanError, RequireCleanGitRepository } from "./Git.js";
import type { Effect } from "effect";

/** The {@link Effect.Effect | effect} returned by {@link RequireCleanGitRepository}. */
export type ERequireCleanRepo =
    Effect.Effect<
        void,
        RepoNotCleanError | Error.PlatformError,
        CommandExecutor.CommandExecutor
    >;
