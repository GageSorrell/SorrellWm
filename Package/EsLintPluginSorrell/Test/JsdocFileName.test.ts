/**
 * Tests for the `jsdoc-file-name` rule.
 *
 * @module @sorrell/eslint-plugin/Test/JsdocFileName
 *
 * @file      JsdocFileName.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, it } from "vitest";
import JsdocFileName from "../Source/Rules/JsdocFileName.js";
import { RuleTester } from "eslint";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const Tester: RuleTester = new RuleTester({
    languageOptions:
    {
        ecmaVersion: 2022,
        sourceType: "module"
    }
});

Tester.run("jsdoc-file-name", JsdocFileName, {
    invalid:
    [
        {
            code:
            [
                "/**",
                " * A module.",
                " *",
                " * @file Wrong.ts",
                " */",
                "",
                "export const Value = 1;",
                ""
            ].join("\n"),
            errors: [ { messageId: "mismatch" } ],
            filename: "/project/Source/Widget.ts",
            name: "reports and fixes a mismatched @file tag",
            output:
            [
                "/**",
                " * A module.",
                " *",
                " * @file Widget.ts",
                " */",
                "",
                "export const Value = 1;",
                ""
            ].join("\n")
        },
        {
            code:
            [
                "/**",
                " * A module.",
                " *",
                " * @file      Wrong.ts",
                " */",
                "",
                "export const Value = 1;",
                ""
            ].join("\n"),
            errors: [ { messageId: "mismatch" } ],
            filename: "/project/Source/Widget.ts",
            name: "preserves surrounding alignment when fixing",
            output:
            [
                "/**",
                " * A module.",
                " *",
                " * @file      Widget.ts",
                " */",
                "",
                "export const Value = 1;",
                ""
            ].join("\n")
        }
    ],
    valid:
    [
        {
            code:
            [
                "/**",
                " * A module.",
                " *",
                " * @file Widget.ts",
                " */",
                "",
                "export const Value = 1;",
                ""
            ].join("\n"),
            filename: "/project/Source/Widget.ts",
            name: "accepts an @file tag that matches the file name"
        },
        {
            code: "/**\n * A module.\n */\n\nexport const Value = 1;\n",
            filename: "/project/Source/Widget.ts",
            name: "ignores modules without an @file tag"
        },
        {
            code: "// @file Wrong.ts\nexport const Value = 1;\n",
            filename: "/project/Source/Widget.ts",
            name: "ignores line comments that are not JSDoc blocks"
        },
        {
            code: "/**\n * A module.\n *\n * @file Whatever.ts\n */\n",
            name: "ignores virtual files that have no real name"
        }
    ]
});
