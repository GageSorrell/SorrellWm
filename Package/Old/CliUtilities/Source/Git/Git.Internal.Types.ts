/**
 * @file      Git.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { RepoNotCleanError } from "./Git.js";

/** The data used in {@link RepoNotCleanError}. */
export type FRepoNotCleanErrorData =
    Readonly<{
        RepositoryPath: string;
        StatusOutput: string;
    }>;
