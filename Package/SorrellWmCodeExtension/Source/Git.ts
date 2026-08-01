/**
 * Git-backed workspace file classification.
 *
 * @module @sorrell/sorrell-wm-code-extension/Git
 * @internal
 *
 * @file      Git.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ExecFileException } from "node:child_process";
import { dirname } from "node:path";
import { execFile } from "node:child_process";

export/**
       * The type identifier for this module.
       *
       * @category Constant
       * @since 0.1.0
       */
const TypeId = "~sorrell/sorrell-wm-code-extension/Git" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

const GitCheckTimeoutMilliseconds = 5_000;

export/**
       * Determines whether Git ignores a file.
       *
       * # Details
       *
       * Files outside a Git worktree and unavailable or failed Git processes are
       * treated as not ignored so ordinary non-Git workspaces retain header insertion.
       *
       * @category Predicate
       * @since 0.1.0
       */
const IsGitIgnored = (FilePath: string): Promise<boolean> =>
    new Promise((Resolve: (Value: boolean) => void): void =>
    {
        execFile(
            "git",
            [ "check-ignore", "--quiet", "--", FilePath ],
            {
                cwd: dirname(FilePath),
                timeout: GitCheckTimeoutMilliseconds,
                windowsHide: true
            },
            (Error: ExecFileException | null): void =>
            {
                Resolve(Error === null);
            }
        );
    });
