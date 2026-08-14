/**
 * File-content templates for the package-initialization tool.
 *
 * @module @sorrell/wm-init-package/Templates
 * @internal
 *
 * @file      Templates.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Author } from "./Types.js";

/**
 * Build the MIT `License.md` contents, matching the wording used by every
 * other package in the monorepo.
 *
 * @param AuthorName - The copyright holder's name.
 * @param CurrentYear - The copyright year.
 * @returns {string} The complete `License.md` contents.
 */
export function CreateLicense(AuthorName: string, CurrentYear: number): string
{
    return `The MIT License (MIT)

Copyright (c) ${ CurrentYear } ${ AuthorName }

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

/**
 * Build the `ReadMe.md` contents from the package's assembled manifest data.
 *
 * @param PackageName - The package's `"name"` field.
 * @param Description - The package's `"description"` field.
 * @param AuthorName - The copyright holder's name.
 * @param CurrentYear - The copyright year.
 * @returns {string} The complete `ReadMe.md` contents.
 */
export function CreateReadMe(
    PackageName: string,
    Description: string,
    AuthorName: string,
    CurrentYear: number
): string
{
    const CopyrightLine: string = `<span style="font-size: 12px;">&copy; ${ CurrentYear } ${ AuthorName }.  `
        + "Provided under the [MIT License](./License.md).</span>";

    return `${ CopyrightLine }

# \`${ PackageName }\`

**Purpose.**&ensp;${ Description }
`;
}

/**
 * The generated package's `.gitignore` contents.
 */
export const GitIgnoreContent: string = `Distribution
node_modules
*.tsbuildinfo
`;

/**
 * The generated package's `.npmignore` contents, used only when the package
 * is not `"private"`.
 */
export const NpmIgnoreContent: string = `!Distribution
Source
`;

/**
 * The generated package's `tsconfig.json` contents.
 */
export const TsConfigContent: string = `${ JSON.stringify(
    {
        extends: "@sorrell/tsconfig",

        compilerOptions: {
            noEmit: false,
            outDir: "Distribution",
            rootDir: "Source"
        },

        include: [ "Source" ]
    },
    undefined,
    4
) }\n`;

/**
 * The generated package's `eslint.config.js` contents, matching the current
 * monorepo convention of importing the shared flat config.
 */
export const EslintConfigContent: string = `import { defineConfig } from "eslint/config";
import MonorepoConfig from "../../Configuration/eslint.config.js";

export default defineConfig(MonorepoConfig);
`;

/**
 * Build the generated package's `Source/index.ts` contents: the monorepo's
 * standard JSDoc header (mirroring
 * `Package/SorrellWmCodeExtension/Source/Header.ts`'s `CreateHeader`, with
 * the description and author filled in rather than left blank) and nothing
 * else, per the initialization plan.
 *
 * @param PackageName - The package's `"name"` field; also its module name,
 * since a package root's `Source/index.ts` always collapses to just the
 * package name under `DeriveModuleName`'s rules.
 * @param Description - The package's `"description"` field.
 * @param Author - The resolved package author.
 * @param CurrentYear - The copyright year.
 * @returns {string} The complete `Source/index.ts` contents.
 */
export function CreateSourceIndex(
    PackageName: string,
    Description: string,
    Author: Author,
    CurrentYear: number
): string
{
    return `/**
 * ${ Description }
 *
 * @module ${ PackageName }
 *
 * @file      index.ts
 * @author    ${ Author.Name } <${ Author.Email }>
 * @copyright (c) ${ CurrentYear } ${ Author.Name }
 * @license   MIT
 */
`;
}
