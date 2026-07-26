/**
 * Storybook-style showcase tests.
 *
 * @module @sorrell/ink-ui/Test/Showcase
 *
 * @file      Showcase.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { ComponentPage } from "../Showcase/Documentation/Page.js";
import type { ComponentStory } from "../Showcase/Story.js";
import { Focusable, InteractionProvider } from "../Source/Interaction/index.js";
import { MouseProvider } from "../Source/Mouse/index.js";
import { ThemeProvider } from "../Source/Theme.js";

const Preview = (): React.ReactElement => (
    <Focusable>
        { ({ Focused }) => <Ink.Text>{ Focused ? ">" : " " }Rendered example</Ink.Text> }
    </Focusable>
);
const Story: ComponentStory = {
    Basic: { Code: "<Preview />", Preview, Title: "Basic" },
    Description: "A documented component.",
    Examples: [ { Code: "<Preview mode=\"alternate\" />", Preview, Title: "Alternate" } ],
    Name: "Preview",
    Props: [ {
        DefaultValue: "false",
        Description: "Enables the alternate presentation.",
        Name: "alternate",
        Required: false,
        Type: "boolean"
    } ]
};
const BoxStory: ComponentStory = {
    ...Story,
    Description: "Ink's layout primitive.",
    Name: "Box"
};

function Providers({ children }: React.PropsWithChildren): React.ReactElement
{
    return (
        <ThemeProvider>
            <InteractionProvider ShowFooter={ false }>
                <MouseProvider IsEnabled={ false }>{ children }</MouseProvider>
            </InteractionProvider>
        </ThemeProvider>
    );
}

describe("ComponentPage", () =>
{
    it("uses preview-first tabs when narrow and side-by-side code when wide", () =>
    {
        const Page = (Width: number): React.ReactElement => (
            <Providers>
                <ComponentPage
                    AvailableWidth={ Width }
                    BasicExample={ Story.Basic }
                    Description={ Story.Description }
                    Examples={ Story.Examples }
                    Name={ Story.Name }
                    Props={ Story.Props } />
            </Providers>
        );
        const App = render(Page(60));
        expect(App.lastFrame()).toContain("Preview");
        expect(App.lastFrame()).toContain("Code");
        expect(App.lastFrame()).toContain("Rendered example");
        expect(App.lastFrame()).not.toContain("<Preview mode=\"alternate\" />");

        App.rerender(Page(100));
        expect(App.lastFrame()).toContain("<Preview mode=\"alternate\" />");
    });
});

describe("Showcase", () =>
{
    it("searches the component catalog and opens the selected documentation page", async () =>
    {
        vi.doMock("../Showcase/Stories/index.js", () => ({
            Stories: [ Story, BoxStory ]
        }));
        const { Showcase } = await import("../Showcase/Showcase.js");
        const App = render(<Providers><Showcase /></Providers>);
        expect(App.lastFrame()).toContain("@sorrell/ink-ui");
        expect(App.lastFrame()).toContain("Description");

        App.stdin.write("/");
        await vi.waitFor(() => expect(App.lastFrame()).toContain("components▌"));
        App.stdin.write("box");
        await vi.waitFor(() => expect(App.lastFrame()).toContain("Components (1)"));
        App.stdin.write("\r");
        await vi.waitFor(() => expect(App.lastFrame()).toContain(
            "Ink's layout primitive"
        ));
        expect(App.lastFrame()).toContain("content");

        App.stdin.write("\u001B[Z");
        await vi.waitFor(() => expect(App.lastFrame()?.trimEnd().endsWith("navigation")).toBe(true));
        App.stdin.write("\t");
        await vi.waitFor(() => expect(App.lastFrame()?.trimEnd().endsWith("content")).toBe(true));

        App.stdin.write("\t");
        await new Promise((Resolve) => setImmediate(Resolve));
        App.stdin.write("\t");
        await vi.waitFor(() => expect(App.lastFrame()).toContain(">Rendered example"));

        App.stdin.write("\u001B[Z");
        await vi.waitFor(() => expect(App.lastFrame()).toContain("›  Preview"));
        App.stdin.write("\u001B[C");
        await vi.waitFor(() => expect(App.lastFrame()).toContain("<Preview />"));

        App.stdin.write("/");
        await vi.waitFor(() => expect(App.lastFrame()).toContain("box▌"));
        expect(App.lastFrame()?.trimEnd().endsWith("navigation")).toBe(true);
    });
});
