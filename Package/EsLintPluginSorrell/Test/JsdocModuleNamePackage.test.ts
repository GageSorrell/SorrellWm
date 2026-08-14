/**
 * Tests for the `jsdoc-module-name-package` rule.
 *
 * @module @sorrell/eslint-plugin/Test/JsdocModuleNamePackage
 *
 * @file      JsdocModuleNamePackage.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Path from "node:path";
import { describe, it } from "vitest";
import JsdocModuleNamePackage from "../Source/Rules/JsdocModuleNamePackage.js";
import { RuleTester } from "eslint";
import { fileURLToPath } from "node:url";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

/* Resolves to this package, whose name is `@sorrell/eslint-plugin`. */
const SampleFile: string =
    Path.join(Path.dirname(fileURLToPath(import.meta.url)), "..", "Source", "Sample.ts");

const Header = (ModuleValue: string): string =>
    [
        "/**",
        " * A module.",
        " *",
        " * @module " + ModuleValue,
        " */",
        "",
        "export const Value = 1;",
        ""
    ].join("\n");

const Tester: RuleTester = new RuleTester({
    languageOptions:
    {
        ecmaVersion: 2022,
        sourceType: "module"
    }
});

Tester.run("jsdoc-module-name-package", JsdocModuleNamePackage, {
    invalid:
    [
        {
            code: Header("@sorrell/other/Sample"),
            errors: [ { messageId: "mismatch" } ],
            filename: SampleFile,
            name: "reports a @module that does not begin with the package name"
        },
        {
            code: Header("@sorrell/eslint-pluginExtra"),
            errors: [ { messageId: "mismatch" } ],
            filename: SampleFile,
            name: "requires a path-segment boundary after the package name"
        }
    ],
    valid:
    [
        {
            code: Header("@sorrell/eslint-plugin"),
            filename: SampleFile,
            name: "accepts a @module equal to the package name"
        },
        {
            code: Header("@sorrell/eslint-plugin/Rules/Sample"),
            filename: SampleFile,
            name: "accepts a @module beneath the package namespace"
        },
        {
            code: "export const Value = 1;\n",
            filename: SampleFile,
            name: "ignores modules without a @module tag"
        },
        {
            code: Header("@sorrell/anything"),
            name: "ignores virtual files with no resolvable package"
        }
    ]
});
