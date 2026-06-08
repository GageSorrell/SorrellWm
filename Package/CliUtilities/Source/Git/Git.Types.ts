/**
 * @file      Git.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { RepoNotCleanError, RequireCleanGitRepository } from "./Git.js";
import type { ChildProcessSpawner } from "@sorrell/effect/unstable/process/ChildProcessSpawner";
import type { Effect } from "@sorrell/effect";
import type { PlatformError } from "@sorrell/effect/PlatformError";

/** The {@link Effect.Effect | effect} returned by {@link RequireCleanGitRepository}. */
export type ERequireCleanRepo =
    Effect.Effect<
        void,
        | RepoNotCleanError
        | PlatformError,
        ChildProcessSpawner
    >;
