/**
 * Shared types for the package-initialization tool.
 *
 * @module @sorrell/wm-init-package/Types
 * @internal
 *
 * @file      Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * The author recorded in a generated package's package.json and License.md.
 */
export interface Author
{
    readonly Email: string;
    readonly Name: string;
    readonly Url?: string;
}

/**
 * One dependency contributed to a generated package's manifest by a selected
 * dependency choice.
 */
export interface DependencyEntry
{
    readonly Name: string;
    readonly Target: "Dependencies" | "DevDependencies";

    /**
     * A pinned semver range, or "Resolve" to look the version up from the
     * matching package under the monorepo's own `Package` directory.
     */
    readonly Version: string | "Resolve";
}

/**
 * One selectable row in the dependency multi-select prompt. A choice may
 * contribute more than one package (for example, React and its type
 * declarations) to the generated manifest.
 */
export interface DependencyChoice
{
    readonly Entries: ReadonlyArray<DependencyEntry>;
    readonly Selected: boolean;
    readonly Title: string;
}

/**
 * The resolved dependency and devDependency maps assembled from the
 * dependency prompt's selected choices.
 */
export interface ResolvedDependencies
{
    readonly Dependencies: Record<string, string>;
    readonly DevDependencies: Record<string, string>;
    readonly IncludesWindows: boolean;
}

/**
 * All answers collected from the interactive prompt flow.
 */
export interface Answers
{
    readonly Author: Author;
    readonly Dependencies: ResolvedDependencies;
    readonly Description: string;
    readonly DirectoryName: string;
    readonly Homepage: string;
    readonly IsPrivate: boolean;
    readonly Keywords: ReadonlyArray<string>;
    readonly PackageName: string;
}
