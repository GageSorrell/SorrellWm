/**
 * @file      CleanRepo.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import * as Path from "path";
import { spinner as CreateSpinner, log } from "@clack/prompts";
import { type Dirent, promises as FileSystem, type Stats } from "fs";
import type {
    FDeleteNodeGeneratedArtifactsOptions,
    FNodeGeneratedArtifactKind,
    FNodeGeneratedArtifactTarget
} from "./CleanRepo.Types.js";
import { DeleteWithProgress } from "@sorrell/cli-utilities/fs";

/**
 * Recursively find all node-generated artifacts that this module deletes.
 *
 * This intentionally does not descend into any directory named `node_modules`.
 * Once such a directory is found, the whole directory is added as a deletion
 * target instead.
 *
 * @param RootPath - The path whose descendants should be searched.
 * @param Options - The options controlling the search.
 *
 * @returns {Promise<Array<FNodeGeneratedArtifactTarget>>} The targets that should be deleted.
 */
async function FindNodeGeneratedArtifactTargets(
    RootPath: string,
    Options: Pick<FDeleteNodeGeneratedArtifactsOptions, "OnTargetDiscovered" | "Signal"> = { }
): Promise<Array<FNodeGeneratedArtifactTarget>>
{
    const Targets: Array<FNodeGeneratedArtifactTarget> = [ ];
    const ResolvedRootPath: string = Path.resolve(RootPath);

    function AddTarget(Target: FNodeGeneratedArtifactTarget): void
    {
        Targets.push(Target);
        Options.OnTargetDiscovered?.(Target);
    }

    async function Visit(CurrentPath: string): Promise<void>
    {
        Options.Signal?.throwIfAborted();

        let CurrentStats: Stats;

        try
        {
            CurrentStats = await FileSystem.lstat(CurrentPath);
        }
        catch (ErrorValue)
        {
            if (IsMissingFileError(ErrorValue))
            {
                return;
            }

            throw ErrorValue;
        }

        const BaseName: string = Path.basename(CurrentPath);

        if (CurrentStats.isDirectory() && BaseName === "node_modules")
        {
            AddTarget({
                Kind: "NodeModules",
                TargetPath: CurrentPath
            });

            return;
        }

        if (!CurrentStats.isDirectory())
        {
            const TargetKind: FNodeGeneratedArtifactKind | null = GetFileTargetKind(BaseName);

            if (TargetKind !== null)
            {
                AddTarget({
                    Kind: TargetKind,
                    TargetPath: CurrentPath
                });
            }

            return;
        }

        const Children: ReadonlyArray<Dirent> = await FileSystem.readdir(
            CurrentPath,
            { withFileTypes: true }
        );

        for (const Child of Children)
        {
            Options.Signal?.throwIfAborted();

            const ChildPath: string = Path.join(CurrentPath, Child.name);

            if (Child.name === "node_modules" && (Child.isDirectory() || Child.isSymbolicLink()))
            {
                AddTarget({
                    Kind: "NodeModules",
                    TargetPath: ChildPath
                });

                continue;
            }

            if (Child.isDirectory())
            {
                await Visit(ChildPath);
                continue;
            }

            if (Child.isFile())
            {
                const TargetKind: FNodeGeneratedArtifactKind | null = GetFileTargetKind(Child.name);

                if (TargetKind !== null)
                {
                    AddTarget({
                        Kind: TargetKind,
                        TargetPath: ChildPath
                    });
                }
            }
        }
    }

    await Visit(ResolvedRootPath);

    return Targets;
}

/**
 * Recursively find and delete all `node_modules` directories, `*.tsbuildinfo`
 * files, and `package-lock.json` files under a given path.
 *
 * @param RootPath - The path whose descendants should be searched and cleaned.
 * @param Options - The options controlling the deletion.
 *
 * @returns {Promise<Array<FNodeGeneratedArtifactTarget>>} The targets that were selected for deletion.
 */
async function DeleteNodeGeneratedArtifacts(
    RootPath: string,
    Options: FDeleteNodeGeneratedArtifactsOptions = { }
): Promise<Array<FNodeGeneratedArtifactTarget>>
{
    const ShouldRenderTerminalProgress: boolean = Options.ShouldRenderTerminalProgress !== false;
    const DiscoverySpinner: ReturnType<typeof CreateSpinner> | null = ShouldRenderTerminalProgress
        ? CreateSpinner({ indicator: "timer" })
        : null;
    let FoundTargetCount: number = 0;
    let Targets: Array<FNodeGeneratedArtifactTarget>;

    try
    {
        DiscoverySpinner?.start(`Searching ${ Path.resolve(RootPath) }`);

        Targets = await FindNodeGeneratedArtifactTargets(
            RootPath,
            {
                OnTargetDiscovered(Target: FNodeGeneratedArtifactTarget): void
                {
                    FoundTargetCount += 1;
                    DiscoverySpinner?.message(
                        `Found ${ FoundTargetCount } target` +
                        `${ FoundTargetCount === 1 ? "" : "s" }: ${ Target.TargetPath }`
                    );
                    Options.OnTargetDiscovered?.(Target);
                },
                Signal: Options.Signal
            }
        );
    }
    catch (ErrorValue)
    {
        DiscoverySpinner?.error(CreateErrorMessage(ErrorValue));
        throw ErrorValue;
    }

    Options.OnTargetsDiscovered?.([ ...Targets ]);

    if (Targets.length === 0)
    {
        DiscoverySpinner?.stop("No node-generated artifacts found.");
        return Targets;
    }

    DiscoverySpinner?.stop(
        `Found ${ Targets.length } node-generated artifact${ Targets.length === 1 ? "" : "s" }.`
    );

    for (const [ TargetIndex, Target ] of Targets.entries())
    {
        Options.Signal?.throwIfAborted();

        if (ShouldRenderTerminalProgress)
        {
            log.step(
                `Deleting ${ TargetIndex + 1 }/${ Targets.length }: ` +
                `${ FormatTargetKind(Target.Kind) } at ${ Target.TargetPath }`
            );
        }

        await DeleteWithProgress(
            Target.TargetPath,
            {
                ...Options,
                ShouldRenderTerminalProgress
            }
        );
    }

    if (ShouldRenderTerminalProgress)
    {
        log.success(
            `Deleted ${ Targets.length } node-generated artifact${ Targets.length === 1 ? "" : "s" }.`
        );
    }

    return Targets;
}

function GetFileTargetKind(BaseName: string): FNodeGeneratedArtifactKind | null
{
    if (BaseName === "package-lock.json")
    {
        return "PackageLock";
    }

    if (BaseName.endsWith(".tsbuildinfo"))
    {
        return "TsBuildInfo";
    }

    return null;
}

function FormatTargetKind(Kind: FNodeGeneratedArtifactKind): string
{
    switch (Kind)
    {
        case "NodeModules":
            return "node_modules directory";

        case "PackageLock":
            return "package-lock.json file";

        case "TsBuildInfo":
            return "*.tsbuildinfo file";
    }
}

function IsMissingFileError(ErrorValue: unknown): boolean
{
    return (
        typeof ErrorValue === "object" &&
        ErrorValue !== null &&
        "code" in ErrorValue &&
        ErrorValue.code === "ENOENT"
    );
}

function CreateErrorMessage(ErrorValue: unknown): string
{
    if (ErrorValue instanceof Error)
    {
        return `Failed to delete node-generated artifacts: ${ ErrorValue.message }`;
    }

    return "Failed to delete node-generated artifacts.";
}

export async function Main(): Promise<void>
{
    await DeleteNodeGeneratedArtifacts(Path.resolve(__dirname, "..", ".."));
}
