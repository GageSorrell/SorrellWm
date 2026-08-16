/**
 * The selectable dependency catalog and workspace-version resolution for the
 * package-initialization tool.
 *
 * @module @sorrell/wm-init-package/Dependencies
 * @internal
 *
 * @file      Dependencies.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data, Effect, FileSystem } from "effect";
import type { DependencyChoice, DependencyEntry, ResolvedDependencies } from "./Types.js";
import { join } from "node:path";

/**
 * An error raised when a catalog entry's version could not be resolved from
 * the monorepo's own workspace packages.
 */
export class UnresolvedDependencyError extends Data.TaggedError("UnresolvedDependencyError")<{
    readonly PackageName: string;
}>
{
}

/**
 * The fixed catalog of dependency choices offered by the multi-select
 * prompt, in display order. Choices whose `Entries` version is `"Resolve"`
 * take their version from the matching package under the monorepo's own
 * `Package` directory at run time.
 */
export const DependencyChoices: ReadonlyArray<DependencyChoice> = [
    {
        Entries: [ { Name: "effect", Target: "Dependencies", Version: "^4.0.0-beta" } ],
        Selected: true,
        Title: "effect"
    },
    {
        Entries: [ { Name: "@effect/platform-node", Target: "Dependencies", Version: "^4.0.0-beta" } ],
        Selected: false,
        Title: "@effect/platform-node"
    },
    {
        Entries: [ { Name: "@sorrell/windows", Target: "Dependencies", Version: "Resolve" } ],
        Selected: false,
        Title: "@sorrell/windows"
    },
    {
        Entries: [
            { Name: "react", Target: "Dependencies", Version: "^19.2.7" },
            { Name: "@types/react", Target: "DevDependencies", Version: "19.2.17" }
        ],
        Selected: false,
        Title: "react (+ @types/react)"
    },
    {
        Entries: [ { Name: "react-dom", Target: "Dependencies", Version: "19.2.7" } ],
        Selected: false,
        Title: "react-dom"
    },
    {
        Entries: [
            { Name: "@fluentui/react-components", Target: "Dependencies", Version: "9.74.4" },
            { Name: "@fluentui/react-icons", Target: "Dependencies", Version: "2.0.333" }
        ],
        Selected: false,
        Title: "@fluentui/react-components (+ @fluentui/react-icons)"
    },
    {
        Entries: [ { Name: "ink", Target: "Dependencies", Version: "7.1.0" } ],
        Selected: false,
        Title: "ink"
    },
    {
        Entries: [ { Name: "@sorrell/react", Target: "Dependencies", Version: "Resolve" } ],
        Selected: false,
        Title: "@sorrell/react"
    },
    {
        Entries: [ { Name: "@sorrell/settings-ui", Target: "Dependencies", Version: "Resolve" } ],
        Selected: false,
        Title: "@sorrell/settings-ui"
    },
    {
        Entries: [ { Name: "@sorrell/windows-ui", Target: "Dependencies", Version: "Resolve" } ],
        Selected: false,
        Title: "@sorrell/windows-ui"
    },
    {
        Entries: [ { Name: "@sorrell/effect", Target: "Dependencies", Version: "Resolve" } ],
        Selected: true,
        Title: "@sorrell/effect"
    },
    {
        Entries: [ { Name: "@sorrell/log", Target: "Dependencies", Version: "Resolve" } ],
        Selected: false,
        Title: "@sorrell/log"
    },
    {
        Entries: [ { Name: "@sorrell/math", Target: "Dependencies", Version: "Resolve" } ],
        Selected: false,
        Title: "@sorrell/math"
    },
    {
        Entries: [ { Name: "typescript", Target: "DevDependencies", Version: "6.0.2" } ],
        Selected: true,
        Title: "typescript"
    },
    {
        Entries: [ { Name: "tsx", Target: "DevDependencies", Version: "4.23.1" } ],
        Selected: false,
        Title: "tsx"
    },
    {
        Entries: [ { Name: "@sorrell/tsconfig", Target: "DevDependencies", Version: "Resolve" } ],
        Selected: true,
        Title: "@sorrell/tsconfig"
    },
    {
        Entries: [ { Name: "@sorrell/eslint-config", Target: "DevDependencies", Version: "Resolve" } ],
        Selected: true,
        Title: "@sorrell/eslint-config"
    },
    {
        Entries: [ { Name: "cross-env", Target: "DevDependencies", Version: "10.1.0" } ],
        Selected: true,
        Title: "cross-env"
    }
];

/**
 * Read every `Package/*` `package.json` and build a lookup from package name
 * to its current version, used to resolve catalog entries marked `"Resolve"`.
 *
 * @param RepositoryRoot - The monorepo root directory.
 * @returns {Effect.Effect<Record<string, string>>} The name-to-version map.
 */
export function ResolveWorkspaceVersions(
    RepositoryRoot: string
): Effect.Effect<Record<string, string>, Error, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        const FileSystemService: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const ManifestPaths: ReadonlyArray<string> = yield* FileSystemService.glob("Package/*/package.json", {
            root: RepositoryRoot
        });
        const Versions: Record<string, string> = {};

        for (const ManifestPath of ManifestPaths)
        {
            const Content: string = yield* FileSystemService.readFileString(
                join(RepositoryRoot, ManifestPath)
            );
            const Parsed: unknown = JSON.parse(Content);

            if (
                typeof Parsed === "object"
                && Parsed !== null
                && "name" in Parsed
                && "version" in Parsed
                && typeof Parsed.name === "string"
                && typeof Parsed.version === "string"
            )
            {
                Versions[Parsed.name] = Parsed.version;
            }
        }

        return Versions;
    });
}

/**
 * Assemble the dependency and devDependency maps for the selected catalog
 * choices, resolving `"Resolve"` versions from the local workspace.
 *
 * @param RepositoryRoot - The monorepo root directory.
 * @param SelectedChoices - The choices selected in the multi-select prompt.
 * @returns {Effect.Effect<ResolvedDependencies>} The resolved dependency maps.
 */
export function ResolveDependencies(
    RepositoryRoot: string,
    SelectedChoices: ReadonlyArray<DependencyChoice>
): Effect.Effect<ResolvedDependencies, Error, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        const WorkspaceVersions: Record<string, string> = yield* ResolveWorkspaceVersions(RepositoryRoot);
        const Dependencies: Record<string, string> = {};
        const DevDependencies: Record<string, string> = {};
        let IncludesWindows: boolean = false;

        for (const Choice of SelectedChoices)
        {
            for (const Entry of Choice.Entries)
            {
                const ResolvedVersion: string = yield* ResolveEntryVersion(Entry, WorkspaceVersions);
                const Target: Record<string, string> = Entry.Target === "Dependencies"
                    ? Dependencies
                    : DevDependencies;

                Target[Entry.Name] = ResolvedVersion;

                if (Entry.Name === "@sorrell/windows")
                {
                    IncludesWindows = true;
                }
            }
        }

        return { Dependencies, DevDependencies, IncludesWindows };
    });
}

/**
 * Resolve one catalog entry's final version string.
 *
 * @param Entry - The catalog entry to resolve.
 * @param WorkspaceVersions - The name-to-version map read from `Package/*`.
 * @returns {Effect.Effect<string>} The pinned version to write into the manifest.
 */
function ResolveEntryVersion(
    Entry: DependencyEntry,
    WorkspaceVersions: Record<string, string>
): Effect.Effect<string, UnresolvedDependencyError>
{
    if (Entry.Version !== "Resolve")
    {
        return Effect.succeed(Entry.Version);
    }

    const Resolved: string | undefined = WorkspaceVersions[Entry.Name];

    if (Resolved === undefined)
    {
        return Effect.fail(new UnresolvedDependencyError({ PackageName: Entry.Name }));
    }

    return Effect.succeed(Resolved);
}
