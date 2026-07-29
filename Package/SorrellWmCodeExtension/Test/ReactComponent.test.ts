/**
 * Test the React component source templates.
 *
 * @module @sorrell/sorrell-wm-code-extension/ReactComponent.test
 * @internal
 *
 * @file      ReactComponent.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    CreateReactComponentFiles,
    type ReactComponentFile,
    ValidateReactComponentName
} from "../Source/ReactComponent.js";
import { describe, expect, it } from "vitest";

describe("React component names", (): void =>
{
    it("accepts PascalCase TypeScript identifiers", (): void =>
    {
        expect(ValidateReactComponentName("MyComponent")).toBeUndefined();
        expect(ValidateReactComponentName("HTML5Video")).toBeUndefined();
        expect(ValidateReactComponentName("Élément")).toBeUndefined();
    });

    it("rejects empty, non-identifier, and non-PascalCase names", (): void =>
    {
        expect(ValidateReactComponentName("")).toBe("Enter a component name.");
        expect(ValidateReactComponentName("My-Component")).toContain(
            "valid TypeScript identifier"
        );
        expect(ValidateReactComponentName("myComponent")).toContain("PascalCase");
        expect(ValidateReactComponentName("_MyComponent")).toContain("PascalCase");
        expect(ValidateReactComponentName("My_Component")).toContain("PascalCase");
    });
});

describe("React component files", (): void =>
{
    const Files = CreateReactComponentFiles("MyComponent");
    const ContentByName: ReadonlyMap<string, string> = new Map(
        Files.map((File: ReactComponentFile) => [ File.Name, File.Content ])
    );

    it("creates exactly the six requested files", (): void =>
    {
        expect(Files.map((File: ReactComponentFile) => File.Name)).toEqual([
            "MyComponent.tsx",
            "UseMyComponentState.ts",
            "UseMyComponentStyle.ts",
            "RenderMyComponent.tsx",
            "MyComponent.Types.ts",
            "index.ts"
        ]);
    });

    it("composes the component from its three stages", (): void =>
    {
        expect(ContentByName.get("MyComponent.tsx")).toBe([
            "import { RenderMyComponent } from \"./RenderMyComponent.js\";",
            "import { UseMyComponentState } from \"./UseMyComponentState.js\";",
            "import { UseMyComponentStyle } from \"./UseMyComponentStyle.js\";",
            "import { flow } from \"effect/Function\";",
            "",
            "export const MyComponent = flow(",
            "    UseMyComponentState,",
            "    UseMyComponentStyle,",
            "    RenderMyComponent",
            ");",
            ""
        ].join("\n"));
    });

    it("creates the state and style hooks", (): void =>
    {
        expect(ContentByName.get("UseMyComponentState.ts")).toContain(
            "(Props: MyComponentProps) => Omit<MyComponentState, \"Style\">"
        );
        expect(ContentByName.get("UseMyComponentState.ts")).toContain(
            "// @TODO\n    return {} as any;"
        );
        expect(ContentByName.get("UseMyComponentStyle.ts")).toContain(
            "const UseStyle = makeStyles({"
        );
        expect(ContentByName.get("UseMyComponentStyle.ts")).toContain(
            "const Style = UseStyle();"
        );
        expect(ContentByName.get("UseMyComponentStyle.ts")).toContain(
            "return { ...State, Style };"
        );
    });

    it("creates the renderer, types, and barrel exports", (): void =>
    {
        expect(ContentByName.get("RenderMyComponent.tsx")).toContain(
            "(State: MyComponentState) => React.JSX.Element"
        );
        expect(ContentByName.get("MyComponent.Types.ts")).toContain(
            "readonly Style: ReadonlyRecord<string, string>;"
        );
        expect(ContentByName.get("index.ts")).toBe([
            "export { MyComponent } from \"./MyComponent.js\";",
            "export type { MyComponentProps } from \"./MyComponent.Types.js\";",
            ""
        ].join("\n"));
    });

    it("rejects invalid names before interpolation", (): void =>
    {
        expect(() => CreateReactComponentFiles("not-valid")).toThrow(
            "valid TypeScript identifier"
        );
    });
});
