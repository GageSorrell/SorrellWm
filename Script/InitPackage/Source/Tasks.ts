/**
 * `listr2` task-list wiring for the package-initialization tool.
 *
 * `listr2` is promise-based and Effect is fiber-based, so this module is the
 * single seam between them: it exposes plain `async` functions that build
 * and run `Listr` instances, bridging into Effect (via `Effect.runPromise`,
 * providing `NodeServices.layer` per call) only where existing monorepo
 * convention already does so (`LookupGitIdentity`, `RunNpmInstallQuietly`).
 * File-system work that has no existing Effect-based counterpart to reuse
 * uses `node:fs/promises` directly, since the surrounding code is already
 * promise-based.
 *
 * @module @sorrell/wm-init-package/Tasks
 * @internal
 *
 * @file      Tasks.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Listr,
    ListrDefaultRendererLogLevels,
    type ListrDefaultRendererOptions,
    type ListrTask,
    type ListrTaskWrapper
} from "listr2";
import { type GitIdentity, LookupGitIdentity } from "./GitAuthor.js";
import { dirname, join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { Effect } from "effect";
import { NodeServices } from "@effect/platform-node";
import { RunNpmInstallQuietly } from "./Process.js";

/**
 * Renderer overrides that pin the completed-task icon to the bold ballot
 * checkmark "✔", overriding listr2's Windows-console fallback (the square root
 * "√"), while leaving its default green color intact — `icon` and `color` are
 * independent maps, so overriding one does not affect the other.
 */
const CompletedIconRendererOptions: ListrDefaultRendererOptions = {
    icon: {
        [ListrDefaultRendererLogLevels.COMPLETED]: "✔"
    }
};

/**
 * One file to be written as part of package creation.
 */
export interface GeneratedFile
{
    readonly Content: string;

    /**
     * The file's path relative to the new package's own directory.
     */
    readonly RelativePath: string;
}

/**
 * Inputs to {@link RunCreationTasks}.
 */
export interface CreationTasksInput
{
    readonly DirectoryName: string;
    readonly Files: ReadonlyArray<GeneratedFile>;
    readonly RepositoryRoot: string;
}

/**
 * Run a single listr2 task that looks up the current user's git identity.
 *
 * @param RepositoryRoot - The monorepo root directory to run git within.
 * @returns {Promise<GitIdentity>} The best-effort local git identity.
 */
export async function RunGitIdentityLookup(RepositoryRoot: string): Promise<GitIdentity>
{
    const TaskList: Listr<{ Identity: GitIdentity }> = new Listr(
        [
            {
                task: async (Context: { Identity: GitIdentity }): Promise<void> =>
                {
                    Context.Identity = await Effect.runPromise(LookupGitIdentity(RepositoryRoot));
                },
                title: "Looking up your name and email from git."
            }
        ],
        { concurrent: false, rendererOptions: CompletedIconRendererOptions }
    );
    const Result: { Identity: GitIdentity } = await TaskList.run({ Identity: {} });

    return Result.Identity;
}

/**
 * Write every generated file, register the new package as an npm workspace,
 * and run `npm install`, each step reported as its own listr2 task.
 *
 * @param Input - The files to write and the paths needed to register/install.
 * @returns {Promise<void>} Resolves once every step has completed.
 */
export async function RunCreationTasks(Input: CreationTasksInput): Promise<void>
{
    const PackageDirectory: string = join(Input.RepositoryRoot, "Package", Input.DirectoryName);
    const FileTasks: Array<ListrTask> = Input.Files.map((File: GeneratedFile): ListrTask => ({
        task: async (): Promise<void> =>
        {
            const AbsolutePath: string = join(PackageDirectory, File.RelativePath);

            await mkdir(dirname(AbsolutePath), { recursive: true });
            await writeFile(AbsolutePath, File.Content, "utf8");
        },
        title: File.RelativePath
    }));
    const TaskList: Listr = new Listr(
        [
            {
                task: (_Context: unknown, ParentTask: ListrTaskWrapper<unknown, any, any>): Listr =>
                    ParentTask.newListr(FileTasks, { concurrent: false }),
                title: "Writing package files"
            },
            {
                task: async (): Promise<void> => RegisterWorkspace(Input.RepositoryRoot, Input.DirectoryName),
                title: "Registering the new workspace in the root package.json"
            },
            {
                task: async (): Promise<void> =>
                    Effect.runPromise(Effect.provide(
                        RunNpmInstallQuietly(Input.RepositoryRoot),
                        NodeServices.layer
                    )),
                title: "Running npm install…"
            }
        ],
        { concurrent: false, rendererOptions: CompletedIconRendererOptions }
    );

    await TaskList.run();
}

/**
 * Insert the new package's workspace path into the root `package.json`,
 * immediately after the last existing `Package/...` entry.
 *
 * @param RepositoryRoot - The monorepo root directory.
 * @param DirectoryName - The new package's directory name under `Package`.
 * @returns {Promise<void>} Resolves once the root manifest has been rewritten.
 */
async function RegisterWorkspace(RepositoryRoot: string, DirectoryName: string): Promise<void>
{
    const RootManifestPath: string = join(RepositoryRoot, "package.json");
    const RawText: string = await readFile(RootManifestPath, "utf8");
    const NewEntry: string = `Package/${ DirectoryName }`;

    if (RawText.includes(`"${ NewEntry }"`))
    {
        return;
    }

    const LineEnding: string = RawText.includes("\r\n") ? "\r\n" : "\n";
    const Lines: Array<string> = RawText.split(/\r?\n/u);
    const WorkspacesStartIndex: number = Lines.findIndex(
        (Line: string): boolean => /"workspaces"\s*:/u.test(Line)
    );

    if (WorkspacesStartIndex === -1)
    {
        throw new Error("Could not find a \"workspaces\" field in the root package.json.");
    }

    let LastPackageLineIndex: number = -1;

    for (let Index: number = WorkspacesStartIndex; Index < Lines.length; Index += 1)
    {
        const Line: string | undefined = Lines[Index];

        if (Line === undefined || /^\s*\]/u.test(Line))
        {
            break;
        }

        if (/"Package\//u.test(Line))
        {
            LastPackageLineIndex = Index;
        }
    }

    if (LastPackageLineIndex === -1)
    {
        throw new Error(
            "Could not find any \"Package/...\" entries in the root package.json's workspaces array."
        );
    }

    const ReferenceLine: string = Lines[LastPackageLineIndex] ?? "";
    const Indent: string = /^\s*/u.exec(ReferenceLine)?.[0] ?? "";
    const IsLastArrayElement: boolean = !ReferenceLine.trimEnd().endsWith(",");

    if (IsLastArrayElement)
    {
        Lines[LastPackageLineIndex] = `${ ReferenceLine.trimEnd() },`;
    }

    Lines.splice(
        LastPackageLineIndex + 1,
        0,
        `${ Indent }"${ NewEntry }"${ IsLastArrayElement ? "" : "," }`
    );

    await writeFile(RootManifestPath, Lines.join(LineEnding), "utf8");
}
