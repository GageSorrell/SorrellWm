/**
 * Test Git-backed workspace file classification.
 *
 * @module @sorrell/sorrell-wm-code-extension/Git.test
 * @internal
 *
 * @file      Git.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { IsGitIgnored } from "../Source/Git.js";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("Git ignore classification", (): void =>
{
    let RepositoryPath: string;

    beforeEach((): void =>
    {
        RepositoryPath = mkdtempSync(join(tmpdir(), "sorrell-wm-code-extension-git-"));
        execFileSync("git", [ "init", "--quiet" ], {
            cwd: RepositoryPath,
            windowsHide: true
        });
    });

    afterEach((): void =>
    {
        rmSync(RepositoryPath, { force: true, recursive: true });
    });

    it("recognizes a newly created file matched by a Git ignore rule", async (): Promise<void> =>
    {
        const IgnoredDirectory: string = join(RepositoryPath, "Generated");
        const IgnoredFile: string = join(IgnoredDirectory, "Ignored.ts");
        mkdirSync(IgnoredDirectory);
        writeFileSync(join(RepositoryPath, ".gitignore"), "Generated/\n");
        writeFileSync(IgnoredFile, "export const Ignored = true;\n");

        await expect(IsGitIgnored(IgnoredFile)).resolves.toBe(true);
    });

    it("keeps generating headers for files not ignored by Git", async (): Promise<void> =>
    {
        const SourceDirectory: string = join(RepositoryPath, "Source");
        const SourceFile: string = join(SourceDirectory, "Included.ts");
        mkdirSync(SourceDirectory);
        writeFileSync(join(RepositoryPath, ".gitignore"), "Generated/\n");
        writeFileSync(SourceFile, "export const Included = true;\n");

        await expect(IsGitIgnored(SourceFile)).resolves.toBe(false);
    });

    it("keeps generating headers outside Git worktrees", async (): Promise<void> =>
    {
        const NonRepositoryPath: string = mkdtempSync(
            join(tmpdir(), "sorrell-wm-code-extension-non-git-")
        );
        const SourceFile: string = join(NonRepositoryPath, "Included.ts");
        writeFileSync(SourceFile, "export const Included = true;\n");

        try
        {
            await expect(IsGitIgnored(SourceFile)).resolves.toBe(false);
        }
        finally
        {
            rmSync(NonRepositoryPath, { force: true, recursive: true });
        }
    });
});
