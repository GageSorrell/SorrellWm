/**
 * `package.json` assembly for the package-initialization tool.
 *
 * @module @sorrell/wm-init-package/PackageManifest
 * @internal
 *
 * @file      PackageManifest.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Answers, Author } from "./Types.js";

/**
 * Assemble the generated package's `package.json` object from the collected
 * answers. The result should be serialized with `JSON.stringify(_, undefined, 4)`
 * plus a trailing newline, matching every other manifest in the monorepo.
 *
 * @param Answers - The collected prompt answers.
 * @returns {Record<string, unknown>} The assembled `package.json` object.
 */
export function CreatePackageManifest(Answers: Answers): Record<string, unknown>
{
    const Author: Record<string, string> = {
        email: Answers.Author.Email,
        name: Answers.Author.Name,
        ...(Answers.Author.Url === undefined ? {} : { url: Answers.Author.Url })
    };
    const Manifest: Record<string, unknown> = {
        name: Answers.PackageName,

        version: "1.0.0-beta.1",

        private: Answers.IsPrivate,

        description: Answers.Description,

        keywords: Answers.Keywords,

        homepage: Answers.Homepage,

        license: "MIT",

        bugs: {
            url: "https://github.com/GageSorrell/SorrellWm/issues"
        },

        repository: {
            directory: `Package/${ Answers.DirectoryName }`,
            type: "git",
            url: "git+https://github.com/GageSorrell/SorrellWm.git"
        },

        author: Author,

        ...(Answers.Dependencies.IncludesWindows ? { os: [ "win32" ] } : {}),

        type: "module",

        scripts: {
            build: "tsc -p ./tsconfig.json",
            lint: "eslint --config ./eslint.config.js \"Source/**/*.ts\""
        },

        exports: {
            ".": {
                import: "./Distribution/index.js",
                types: "./Distribution/index.d.ts"
            },
            "./package.json": "./package.json"
        },

        dependencies: Answers.Dependencies.Dependencies,

        devDependencies: Answers.Dependencies.DevDependencies
    };

    return Manifest;
}

/**
 * Resolve the author recorded on a generated package: Gage Sorrell's fixed
 * identity when the git-config lookup matched him, otherwise the values
 * collected from the author prompt.
 *
 * @param GitName - The name read from git config, if any.
 * @param PromptedAuthor - The author collected from the author prompt, when shown.
 * @returns {Author} The author to record on the generated package.
 */
export function ResolveAuthor(GitName: string | undefined, PromptedAuthor: Author | undefined): Author
{
    if (GitName === "Gage Sorrell")
    {
        return { Email: "gage@sorrell.sh", Name: "Gage Sorrell", Url: "https://sorrell.sh" };
    }

    if (PromptedAuthor !== undefined)
    {
        return PromptedAuthor;
    }

    return { Email: "gage@sorrell.sh", Name: "Gage Sorrell", Url: "https://sorrell.sh" };
}
