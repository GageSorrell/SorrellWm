/**
 * Layout component tests.
 *
 * @module @sorrell/ink-ui/Test/Layout
 *
 * @file      Layout.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { Text } from "ink";
import { render } from "ink-testing-library";
import {
    Frame,
    ScrollArea,
    Tabs,
    ThemeProvider
} from "../Source/index.js";

const Render = (Value: React.ReactElement): string =>
    render(<ThemeProvider>{ Value }</ThemeProvider>).lastFrame() ?? "";

describe("layout components", () =>
{
    it("Frame renders a title and content", () =>
    {
        const Value = Render(<Frame Title="Panel">Content</Frame>);
        expect(Value).toContain("Panel");
        expect(Value).toContain("Content");
    });

    it("ScrollArea renders only its visible rows", () =>
    {
        const Value = Render(
            <ScrollArea
                Active={ false }
                Height={ 2 }
                Items={ [ "one", "two", "three" ] }
                RenderItem={ (Item: string) => <Text>{ Item }</Text> } />
        );
        expect(Value).toContain("one");
        expect(Value).toContain("two");
        expect(Value).not.toContain("three");
    });

    it("Tabs marks and renders the active tab", () =>
    {
        expect(Render(<Tabs
            Active={ false }
            Items={ [
                { Id: "one", Label: "One" },
                { Id: "two", Label: "Two" }
            ] }
            Value="two" />)).toContain("One  Two");
    });
});
