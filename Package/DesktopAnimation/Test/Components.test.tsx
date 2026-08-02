/**
 * Rendering tests for desktop animations and their Fluent UI adapter.
 *
 * @module @sorrell/desktop-animation/Test/Components.test
 *
 * @file      Components.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AnimationTeachingPopover } from "../Source/AnimationTeachingPopover.js";
import { DesktopAnimation } from "../Source/DesktopAnimation.js";
import { CursorStep, DefineAnimation, Wait, WindowStep } from "../Source/Timeline.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/Test/Components.test" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

afterEach(cleanup);

const Animation = DefineAnimation({
    Canvas: { Height: 100, Width: 200 },
    Cursor: { Position: { X: 25, Y: 20 }, Type: "Pointer" },
    Label: "Window arrangement demonstration",
    Steps: [
        Wait(100),
        CursorStep.Drag("one", { X: 100, Y: 30 }, 400),
        WindowStep.Resize("one", { Height: 55, Width: 90 }, 250),
        CursorStep.Change("Text", 100),
        WindowStep.Destroy("one", 150)
    ],
    Windows: [
        {
            Content: "Content",
            Frame: { Height: 40, Width: 70, X: 20, Y: 10 },
            Id: "one",
            Title: "Window one"
        }
    ]
});

describe("DesktopAnimation", () =>
{
    it("renders responsive Windows-style windows and the compiled motion", () =>
    {
        const View = render(<DesktopAnimation Animation={ Animation } />);
        const Canvas = View.getByRole("img", { name: Animation.Label });
        const Window = Canvas.querySelector("[data-window-id=\"one\"]");
        const StyleSheet = Canvas.querySelector("style")?.textContent ?? "";

        expect(Canvas.getAttribute("style")).toContain("aspect-ratio: 200 / 100");
        expect(Window?.textContent).toContain("Window one");
        expect(Window?.getAttribute("style")).toContain("animation-duration: 1000ms");
        expect(StyleSheet).toContain("left: 50%");
        expect(StyleSheet).toContain("width: 45%");
        expect(StyleSheet).toContain("transform: scale(0.96)");
    });

    it("renders cursor shapes used by type changes and dragging", () =>
    {
        const View = render(<DesktopAnimation Animation={ Animation } />);

        expect(View.container.querySelector("[data-cursor-type=\"Pointer\"]")).not.toBeNull();
        expect(View.container.querySelector("[data-cursor-type=\"Grabbing\"]")).not.toBeNull();
        expect(View.container.querySelector("[data-cursor-type=\"Text\"]")).not.toBeNull();
    });

    it("animates a newly created window without requiring a cursor", () =>
    {
        const EntryAnimation = DefineAnimation({
            Canvas: { Height: 100, Width: 200 },
            Label: "Window creation demonstration",
            Steps: [
                Wait(100),
                WindowStep.Create({
                    Frame: { Height: 40, Width: 80, X: 15, Y: 15 },
                    Id: "created",
                    Title: "Created window"
                }, 200)
            ]
        });
        const View = render(<DesktopAnimation Animation={ EntryAnimation } />);
        const StyleSheet = View.container.querySelector("style")?.textContent ?? "";

        expect(View.getByText("Created window")).toBeTruthy();
        expect(View.container.querySelector("[data-cursor]")).toBeNull();
        expect(StyleSheet).toContain("opacity: 0");
        expect(StyleSheet).toContain("opacity: 1");
    });
});

describe("AnimationTeachingPopover", () =>
{
    it("places the animation in the body and the supplied child last on the surface", () =>
    {
        const View = render(
            <AnimationTeachingPopover
                Animation={ Animation }
                SurfaceChild={ <div data-surface-child>Footer</div> }
                Title={ <span>Arrange windows</span> }
            />
        );
        const Title = View.getByText("Arrange windows");
        const Surface = Title.closest("h2")?.parentElement?.parentElement;

        expect(View.getByRole("img", { name: Animation.Label })).toBeTruthy();
        expect(Surface?.lastElementChild?.hasAttribute("data-surface-child")).toBe(true);
    });
});
