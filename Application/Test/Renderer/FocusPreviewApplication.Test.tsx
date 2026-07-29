/**
 * @module @sorrell/wm/Renderer/FocusPreviewApplicationTest
 *
 * @file      FocusPreviewApplication.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FocusPreviewApplication } from "../../Source/Renderer/FocusPreviewApplication.tsx";
import type { FocusPreviewPresentation } from "../../Source/Shared/FocusPreview.ts";

describe("FocusPreviewApplication", () =>
{
    let Publish: ((Presentation: FocusPreviewPresentation) => void) | undefined;

    beforeEach(() =>
    {
        Publish = undefined;
        vi.mocked(window.sorrell.focusPreview.onChanged).mockImplementation((
            Listener: (Presentation: FocusPreviewPresentation) => void
        ) =>
        {
            Publish = Listener;
            return (): void => undefined;
        });
    });

    it("renders an opaque centered icon over a translucent bordered fill", () =>
    {
        render(<FocusPreviewApplication />);

        act(() => Publish?.({ ExcludedRegions: [ ], Opacity: 75 }));

        const Fill = screen.getByTestId("focus-preview-fill");
        expect(Fill.querySelector("rect[mask]")).toHaveAttribute("fill", "rgb(96, 96, 96)");
        expect(Fill.querySelector("rect[mask]")).toHaveAttribute("fill-opacity", "0.75");
        expect(Fill.querySelector("rect[mask]")).toHaveAttribute("stroke", "rgb(96, 96, 96)");
        expect(Fill.querySelector("rect[mask]")).toHaveAttribute("stroke-width", "1");
        expect(screen.getByTestId("focus-preview").querySelector("svg")).not.toBeNull();
        expect(screen.getByTestId("focus-preview")).toHaveStyle({
            alignItems: "center",
            justifyContent: "center"
        });
    });

    it("clips the fill and border where an earlier same-application proxy is visible", () =>
    {
        render(<FocusPreviewApplication />);

        act(() => Publish?.({
            ExcludedRegions: [
                { Bottom: 240, Left: 0, Right: 160, Top: 40 }
            ],
            Opacity: 75
        }));

        const Mask = screen.getByTestId("focus-preview-fill").querySelector("mask");
        const Exclusion = Mask?.querySelector("rect[fill=black]");
        expect(Exclusion).toHaveAttribute("height", "200");
        expect(Exclusion).toHaveAttribute("width", "160");
        expect(Exclusion).toHaveAttribute("x", "0");
        expect(Exclusion).toHaveAttribute("y", "40");
    });

    it("renders the centered icon at one quarter of its former size", () =>
    {
        render(<FocusPreviewApplication />);

        act(() => Publish?.({ ExcludedRegions: [ ], Opacity: 75 }));

        const Icon = screen.getByTestId("focus-preview").lastElementChild;
        expect(Icon).toHaveStyle({
            maxHeight: "15%",
            maxWidth: "15%"
        });
        expect(Icon?.getAttribute("style")).toContain(
            "--focus-preview-icon-size: clamp(1rem, 6vmin, 2.5rem)"
        );
        expect(screen.getByTestId("focus-preview")).toHaveStyle({
            alignItems: "center",
            justifyContent: "center"
        });
    });

    it("renders an icon-free highlight in an explicit accent color", () =>
    {
        render(<FocusPreviewApplication />);

        act(() => Publish?.({
            Color: "#336699",
            ExcludedRegions: [ ],
            Opacity: 75,
            ShowIcon: false
        }));

        const Root = screen.getByTestId("focus-preview");
        const Fill = screen.getByTestId("focus-preview-fill")
            .querySelector("rect[mask]");
        expect(Fill).toHaveAttribute("fill", "#336699");
        expect(Fill).toHaveAttribute("fill-opacity", "0.75");
        expect(Fill).toHaveAttribute("stroke", "#336699");
        expect(Fill).toHaveAttribute("stroke-width", "1");
        expect(Root.children).toHaveLength(1);
    });
});
