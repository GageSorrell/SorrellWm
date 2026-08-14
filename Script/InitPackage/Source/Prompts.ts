/**
 * Interactive prompt definitions for the package-initialization tool.
 *
 * @module @sorrell/wm-init-package/Prompts
 * @internal
 *
 * @file      Prompts.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { DependencyChoices } from "./Dependencies.js";
import { Effect, pipe } from "effect";
import { existsSync } from "node:fs";
import type { Author, DependencyChoice } from "./Types.js";
import type { GitIdentity } from "./GitAuthor.js";
import { join } from "node:path";
import { Prompt } from "effect/unstable/cli";

/**
 * The directory-name prompt: validates the name is filesystem-safe and that
 * `Package/<name>` does not already exist.
 *
 * @param RepositoryRoot - The monorepo root directory.
 * @returns {Prompt.Prompt<string>} The validated directory name.
 */
export function DirectoryNamePrompt(RepositoryRoot: string): Prompt.Prompt<string>
{
    return Prompt.text({
        message: "Directory name (created under Package):",
        validate: (Value: string): Effect.Effect<string, string> =>
        {
            const Trimmed: string = Value.trim();

            if (Trimmed.length === 0)
            {
                return Effect.fail("A directory name is required.");
            }

            if (!/^[A-Za-z0-9][A-Za-z0-9_.-]*$/u.test(Trimmed))
            {
                return Effect.fail(
                    "Use letters, digits, \".\", \"_\", or \"-\" only, starting with a letter or digit."
                );
            }

            if (existsSync(join(RepositoryRoot, "Package", Trimmed)))
            {
                return Effect.fail(`Package/${ Trimmed } already exists.`);
            }

            return Effect.succeed(Trimmed);
        }
    });
}

/**
 * The `"private"` field prompt, defaulting to `false`.
 */
export const PrivatePrompt: Prompt.Prompt<boolean> = Prompt.confirm({
    initial: false,
    message: "Should the package.json \"private\" field be true?"
});

/**
 * The package `"name"` field prompt.
 */
export const PackageNamePrompt: Prompt.Prompt<string> = Prompt.text({
    message: "Package name (the package.json \"name\" field):",
    validate: NonEmpty
});

/**
 * The package `"description"` field prompt.
 */
export const DescriptionPrompt: Prompt.Prompt<string> = Prompt.text({
    message: "Description:",
    validate: NonEmpty
});

/**
 * The optional keywords prompt: a comma-separated list, trimmed and emptied
 * when skipped.
 */
export const KeywordsPrompt: Prompt.Prompt<ReadonlyArray<string>> = pipe(
    Prompt.list({ default: "", delimiter: ",", message: "Keywords (comma-separated, optional):" }),
    Prompt.map((Keywords: ReadonlyArray<string>): ReadonlyArray<string> =>
        Keywords
            .map((Keyword: string): string => Keyword.trim())
            .filter((Keyword: string): boolean => Keyword.length > 0))
);

/**
 * The optional subdomain/GitHub-ReadMe choice, resolved into the package's
 * final `"homepage"` URL.
 *
 * @param DirectoryName - The new package's directory name under `Package`.
 * @returns {Prompt.Prompt<string>} The resolved homepage URL.
 */
export function HomepagePrompt(DirectoryName: string): Prompt.Prompt<string>
{
    return pipe(
        Prompt.confirm({
            initial: false,
            message: "Use a subdomain of https://sorrell.sh for the homepage, instead of the GitHub ReadMe?"
        }),
        Prompt.flatMap((UseSubdomain: boolean): Prompt.Prompt<string> =>
            UseSubdomain
                ? pipe(
                    Prompt.text({
                        message: "Subdomain (for example, \"wm\" for wm.sorrell.sh):",
                        validate: ValidateSubdomain
                    }),
                    Prompt.map((Subdomain: string): string => `https://${ Subdomain }.sorrell.sh`)
                )
                : Prompt.succeed(
                    `https://github.com/GageSorrell/SorrellWm/tree/Master/Package/${ DirectoryName }#ReadMe`
                ))
    );
}

/**
 * The author prompt, only ever run when the git-config lookup did not
 * resolve the current user's name as "Gage Sorrell".
 *
 * @param GitIdentity - The best-effort git identity used for prompt defaults.
 * @returns {Prompt.Prompt<Author>} The collected author.
 */
export function AuthorPrompt(GitIdentity: GitIdentity): Prompt.Prompt<Author>
{
    return pipe(
        Prompt.all({
            Email: Prompt.text({
                message: "Author email:",
                validate: NonEmpty,
                ...(GitIdentity.Email === undefined ? {} : { default: GitIdentity.Email })
            }),
            Name: Prompt.text({
                message: "Author name:",
                validate: NonEmpty,
                ...(GitIdentity.Name === undefined ? {} : { default: GitIdentity.Name })
            }),
            Url: Prompt.text({ default: "", message: "Author URL (optional):" })
        }),
        Prompt.map(({ Email, Name, Url }: { Email: string; Name: string; Url: string }): Author =>
        {
            const TrimmedUrl: string = Url.trim();

            return { Email, Name, ...(TrimmedUrl.length > 0 ? { Url: TrimmedUrl } : {}) };
        })
    );
}

/**
 * The dependency/devDependency multi-select prompt, seeded with the fixed
 * catalog's default selections.
 */
export const DependenciesPrompt: Prompt.Prompt<Array<DependencyChoice>> = Prompt.multiSelect({
    choices: DependencyChoices.map((Choice: DependencyChoice) => ({
        selected: Choice.Selected,
        title: Choice.Title,
        value: Choice
    })),
    message: "Select dependencies and devDependencies to install:"
});

/**
 * Require a non-empty, trimmed string.
 *
 * @param Value - The raw prompt input.
 * @returns {Effect.Effect<string, string>} The trimmed value, or a validation error.
 */
function NonEmpty(Value: string): Effect.Effect<string, string>
{
    const Trimmed: string = Value.trim();

    return Trimmed.length > 0 ? Effect.succeed(Trimmed) : Effect.fail("This field is required.");
}

/**
 * Validate a single DNS label suitable for use under `sorrell.sh`.
 *
 * @param Value - The raw prompt input.
 * @returns {Effect.Effect<string, string>} The normalized subdomain, or a validation error.
 */
function ValidateSubdomain(Value: string): Effect.Effect<string, string>
{
    const Trimmed: string = Value.trim().toLowerCase();

    return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/u.test(Trimmed)
        ? Effect.succeed(Trimmed)
        : Effect.fail(
            "Enter a valid subdomain label (letters, digits, hyphens; no leading or trailing hyphen)."
        );
}
