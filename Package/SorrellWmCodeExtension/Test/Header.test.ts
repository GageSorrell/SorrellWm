/**
 *
 *
 * @module @sorrell/sorrell-wm-code-extension/Header.test
 * @internal
 *
 * @file      Header.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    CreateHeader,
    DeriveModuleName,
    HasGeneratedHeader,
    IsSupportedSourcePath
} from "../Source/Header.js";
import { describe, expect, it } from "vitest";
import { join } from "node:path";

describe("source headers", (): void =>
{
    it("generates the expected public header", (): void =>
    {
        const Header: string = CreateHeader(
            join("Package", "Example", "Source", "Feature", "Widget.tsx"),
            "@sorrell/example/Feature/Widget",
            2030
        );

        expect(Header).toBe([
            "/**",
            " *",
            " *",
            " * @module @sorrell/example/Feature/Widget",
            " *",
            " * @file      Widget.tsx",
            " * @author    Gage Sorrell <gage@sorrell.sh>",
            " * @copyright (c) 2030 Gage Sorrell",
            " * @license   MIT",
            " */"
        ].join("\n"));
    });

    it("places internal immediately after module for an Internal path", (): void =>
    {
        const Header: string = CreateHeader(
            join("Source", "Internal", "Native.ts"),
            "@sorrell/example/Internal/Native",
            2030
        );
        const Lines: Array<string> = Header.split("\n");
        const ModuleIndex: number = Lines.indexOf(
            " * @module @sorrell/example/Internal/Native"
        );

        expect(Lines[ModuleIndex + 1]).toBe(" * @internal");
    });

    it("does not treat differently cased internal paths as internal", (): void =>
    {
        const Header: string = CreateHeader(
            join("Source", "internal", "Native.ts"),
            "@sorrell/example/internal/Native",
            2030
        );

        expect(Header).not.toContain(" * @internal");
    });

    it("derives module paths from Source and src directories", (): void =>
    {
        const PackageRoot: string = join("workspace", "Package", "Example");

        expect(DeriveModuleName(
            join(PackageRoot, "Source", "Feature", "Widget.ts"),
            PackageRoot,
            "@sorrell/example"
        )).toBe("@sorrell/example/Feature/Widget");
        expect(DeriveModuleName(
            join(PackageRoot, "src", "Renderer", "Window.tsx"),
            PackageRoot,
            "@sorrell/application"
        )).toBe("@sorrell/application/Renderer/Window");
        expect(DeriveModuleName(
            join(PackageRoot, "Source", "Native", "Windows.cc"),
            PackageRoot,
            "@sorrell/windows"
        )).toBe("@sorrell/windows/Native/Windows");
    });

    it("omits a trailing index segment from derived module paths", (): void =>
    {
        const PackageRoot: string = join("workspace", "Package", "Example");

        expect(DeriveModuleName(
            join(PackageRoot, "Source", "index.ts"),
            PackageRoot,
            "@sorrell/example"
        )).toBe("@sorrell/example");
        expect(DeriveModuleName(
            join(PackageRoot, "Source", "Feature", "index.ts"),
            PackageRoot,
            "@sorrell/example"
        )).toBe("@sorrell/example/Feature");
        expect(DeriveModuleName(
            join(PackageRoot, "Source", "Feature", "Index.tsx"),
            PackageRoot,
            "@sorrell/example"
        )).toBe("@sorrell/example/Feature");
    });

    it("recognizes supported paths and existing generated headers", (): void =>
    {
        expect(IsSupportedSourcePath("View.tsx")).toBe(true);
        expect(IsSupportedSourcePath("Types.ts")).toBe(true);
        expect(IsSupportedSourcePath("Types.d.ts")).toBe(true);
        expect(IsSupportedSourcePath("Windows.cc")).toBe(true);
        expect(IsSupportedSourcePath("Windows.cpp")).toBe(true);
        expect(IsSupportedSourcePath("Windows.cxx")).toBe(true);
        expect(IsSupportedSourcePath("Windows.h")).toBe(true);
        expect(IsSupportedSourcePath("Windows.hpp")).toBe(true);
        expect(IsSupportedSourcePath("Windows.ixx")).toBe(true);
        expect(IsSupportedSourcePath("Windows.cppm")).toBe(true);
        expect(IsSupportedSourcePath("Windows.tpp")).toBe(true);
        expect(IsSupportedSourcePath("View.jsx")).toBe(false);
        expect(IsSupportedSourcePath("Windows.c")).toBe(false);
        expect(IsSupportedSourcePath(
            join("Package", "Example", "node_modules", "Dependency", "Index.ts")
        )).toBe(false);
        expect(IsSupportedSourcePath(
            "node_modules/Dependency/Source/Index.tsx"
        )).toBe(false);
        expect(IsSupportedSourcePath(
            join("Package", "my_node_modules_thing", "Widget.ts")
        )).toBe(true);
        expect(HasGeneratedHeader(
            "/**\n * @module Example\n * @file      Example.ts\n */\n"
        )).toBe(true);
        expect(HasGeneratedHeader("export const Value = 1;\n")).toBe(false);
    });
});
