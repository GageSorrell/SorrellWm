/**
 * Tests WinUI scrollbar interaction and button placement.
 *
 * @module @sorrell/wm/Renderer/ScrollbarsTest
 *
 * @file      Scrollbars.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Scrollbars } from "../../../Package/WindowsUi/Source/Scrollbars.tsx";

const HoverAttribute = "data-sorrell-scrollbar-hovered";

describe("Scrollbars", () =>
{
    it("expands only while the cursor is inside a scrollbar gutter", () =>
    {
        render(
            <Scrollbars>
                <div
                    data-testid="scroller"
                    style={ { overflowY: "auto" } }>
                    Content
                </div>
            </Scrollbars>
        );
        const Scroller = screen.getByTestId("scroller");
        Object.defineProperties(Scroller, {
            clientHeight: { configurable: true, value: 88 },
            clientWidth: { configurable: true, value: 88 },
            scrollHeight: { configurable: true, value: 200 },
            scrollWidth: { configurable: true, value: 88 }
        });
        Scroller.getBoundingClientRect = () => ({
            bottom: 100,
            height: 100,
            left: 0,
            right: 100,
            toJSON: () => ({ }),
            top: 0,
            width: 100,
            x: 0,
            y: 0
        });

        fireEvent.mouseMove(Scroller, { clientX: 50, clientY: 50 });
        expect(Scroller).not.toHaveAttribute(HoverAttribute);

        fireEvent.mouseMove(Scroller, { clientX: 90, clientY: 50 });
        expect(Scroller).toHaveAttribute(HoverAttribute);

        fireEvent.mouseMove(Scroller, { clientX: 50, clientY: 50 });
        expect(Scroller).not.toHaveAttribute(HoverAttribute);

        fireEvent.mouseMove(Scroller, { clientX: 96, clientY: 50 });
        fireEvent.mouseLeave(Scroller.parentElement!);
        expect(Scroller).not.toHaveAttribute(HoverAttribute);
    });

    it("emits transparent tracks and one arrow button at each end", () =>
    {
        render(<Scrollbars>Content</Scrollbars>);

        const Css = Array.from(document.styleSheets)
            .flatMap((StyleSheet: CSSStyleSheet) =>
                Array.from(StyleSheet.cssRules))
            .map((Rule: CSSRule) => Rule.cssText)
            .join("\n");

        expect(Css).toContain(
            "::-webkit-scrollbar-button:vertical:decrement:start"
        );
        expect(Css).toContain(
            "::-webkit-scrollbar-button:vertical:increment:end"
        );
        expect(Css).toContain(
            "::-webkit-scrollbar-button:horizontal:decrement:start"
        );
        expect(Css).toContain(
            "::-webkit-scrollbar-button:horizontal:increment:end"
        );
        expect(Css).not.toContain(
            "--sorrell-scrollbar-track-color: var(--colorNeutralBackground1)"
        );
        expect(Css).toMatch(
            /scrollbar-button:vertical:decrement:start[^}]*background-image: url/
        );
        expect(Css).toMatch(
            /scrollbar-button[^}]*background-color: transparent/
        );
        expect(Css).not.toContain("-webkit-mask-image");
        expect(Css).toMatch(/scrollbar[^}]*width: 16px/);
        expect(Css).toContain("--sorrell-scrollbar-thumb-inset: 7px");
        expect(Css).toContain("--sorrell-scrollbar-thumb-inset: 5px");
        expect(Css).toContain(
            "--sorrell-scrollbar-thumb-border-radius: 0.5px"
        );
        expect(Css).toContain(
            "--sorrell-scrollbar-thumb-border-radius: 9999px"
        );
        expect(Css).toContain(
            "--sorrell-scrollbar-track-end-padding: var(--spacingVerticalXS)"
        );
        expect(Css).toContain("--sorrell-scrollbar-track-end-padding: 0px");
        expect(Css).toMatch(
            /scrollbar-track:vertical[^}]*margin-block: var\(--sorrell-scrollbar-track-end-padding\)/
        );
        expect(Css).toMatch(
            /scrollbar-track:horizontal[^}]*margin-inline: var\(--sorrell-scrollbar-track-end-padding\)/
        );
    });
});
