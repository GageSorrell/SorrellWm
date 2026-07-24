/**
 * Display component tests.
 *
 * @module @sorrell/ink-ui/Test/Display
 *
 * @file      Display.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { render } from "ink-testing-library";
import {
    Badge,
    CenterText,
    Checkbox,
    DefaultTheme,
    GradientBadge,
    HeaderBar,
    HeaderTable,
    JumpBadge,
    StatusBar,
    ThemeProvider,
    Tips,
    Toast,
    ValidationNotice
} from "../Source/index.js";

const Render = (Value: React.ReactElement): string =>
    render(<ThemeProvider>{ Value }</ThemeProvider>).lastFrame() ?? "";

describe("display components", () =>
{
    it("Badge renders its content", () =>
    {
        expect(Render(<Badge>Ready</Badge>)).toContain("Ready");
    });

    it("GradientBadge renders every character", () =>
    {
        expect(Render(<GradientBadge Text="Gradient" />)).toContain("Gradient");
    });

    it("Checkbox renders checked state", () =>
    {
        expect(Render(<Checkbox Checked
            Label="Enabled" />)).toContain("[x] Enabled");
    });

    it("CenterText renders its children", () =>
    {
        expect(Render(<CenterText Width={ 20 }>Centered</CenterText>)).toContain("Centered");
    });

    it("HeaderBar renders its title", () =>
    {
        expect(Render(<HeaderBar Title="Heading" />)).toContain("Heading");
    });

    it("HeaderTable renders name-value rows", () =>
    {
        expect(Render(<HeaderTable Rows={ [ { Name: "Name", Value: "Value" } ] } />))
            .toContain("Name │ Value");
    });

    it("JumpBadge renders its hint", () =>
    {
        expect(Render(<JumpBadge Hint="g" />)).toContain("[g]");
    });

    it("StatusBar renders every item", () =>
    {
        expect(Render(<StatusBar Items={ [ { Label: "READY" }, { Label: "ONLINE" } ] } />))
            .toContain("READY ONLINE");
    });

    it("Toast renders its message", () =>
    {
        expect(Render(<Toast DurationMilliseconds={ 60_000 }
            Message="Saved" />))
            .toContain("Saved");
    });

    it("Tips renders the selected tip", () =>
    {
        expect(Render(<Tips Index={ 0 }
            Tips={ [ "Use arrows." ] } />))
            .toContain("Tip: Use arrows.");
    });

    it("ValidationNotice renders a supplied error", () =>
    {
        expect(Render(<ValidationNotice Message="Invalid value" />))
            .toContain("Invalid value");
    });

    it("ThemeProvider renders descendants with a custom theme", () =>
    {
        const Frame = render(
            <ThemeProvider Theme={ { ...DefaultTheme, Name: "Test" } }>
                <Badge>Themed</Badge>
            </ThemeProvider>
        ).lastFrame();

        expect(Frame).toContain("Themed");
    });
});
