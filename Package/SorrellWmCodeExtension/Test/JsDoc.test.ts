/**
 * Tests JSDoc expansion behavior for the SorrellWm code extension.
 *
 * @module @sorrell/sorrell-wm-code-extension/JsDoc.test
 * @internal
 *
 * @file      JsDoc.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CreateJsDocExpansion, IsJsDocSourcePath } from "../Source/JsDoc.js";
import { describe, expect, it } from "vitest";

describe("JSDoc expansion", (): void =>
{
    it("expands an automatically closed comment to four lines", (): void =>
    {
        const Expansion = CreateJsDocExpansion("/***/", "1.2.3");

        expect(Expansion).toEqual({
            CursorCharacter: 3,
            CursorLineOffset: 1,
            Text: [
                "/**",
                " * ",
                " * @since 1.2.3",
                " */"
            ].join("\n")
        });
    });

    it("preserves indentation and CRLF newlines", (): void =>
    {
        const Expansion = CreateJsDocExpansion("    /** */", "4.5.6", "\r\n");

        expect(Expansion).toEqual({
            CursorCharacter: 7,
            CursorLineOffset: 1,
            Text: [
                "    /**",
                "     * ",
                "     * @since 4.5.6",
                "     */"
            ].join("\r\n")
        });
    });

    it("ignores non-standalone and ordinary block comments", (): void =>
    {
        expect(CreateJsDocExpansion("const Value = /***/", "1.0.0")).toBeUndefined();
        expect(CreateJsDocExpansion("/**/", "1.0.0")).toBeUndefined();
    });

    it("supports JavaScript, TypeScript, and C++ source paths", (): void =>
    {
        expect(IsJsDocSourcePath("Feature.js")).toBe(true);
        expect(IsJsDocSourcePath("Feature.mts")).toBe(true);
        expect(IsJsDocSourcePath("Feature.tsx")).toBe(true);
        expect(IsJsDocSourcePath("Feature.cpp")).toBe(true);
        expect(IsJsDocSourcePath("Feature.md")).toBe(false);
    });
});
