/**
 * @module @sorrell/wm/Renderer/InsertTargetApplicationTest
 *
 * @file      InsertTargetApplication.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InsertTargetApplication } from
    "../../Source/Renderer/InsertTargetApplication.js";
import type { InsertTargetPresentation } from
    "../../Source/Shared/InsertTarget.js";

describe("InsertTargetApplication", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.mocked(window.sorrell.insertTarget.get).mockResolvedValue({
            CaptureNextWindow: false,
            DragActive: false
        });
    });

    it("offers capture, window selection, cancellation, and Escape", async () =>
    {
        render(<InsertTargetApplication />);

        expect(await screen.findByText(
            /Drag a floating window over this target/u
        )).toBeInTheDocument();
        const Capture = screen.getByRole("checkbox", {
            name: "Tile the next eligible window created"
        });
        fireEvent.click(Capture);
        expect(window.sorrell.insertTarget.setCaptureNext).toHaveBeenCalledWith(true);

        fireEvent.click(screen.getByRole("button", {
            name: "Choose from floating windows"
        }));
        expect(window.sorrell.insertTarget.chooseWindow).toHaveBeenCalledOnce();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(window.sorrell.insertTarget.cancel).toHaveBeenCalledOnce();

        fireEvent.keyDown(window, { key: "Escape" });
        expect(window.sorrell.insertTarget.cancel).toHaveBeenCalledTimes(2);
    });

    it("replaces controls with a pulsing dashed outline during a drag", async () =>
    {
        let Changed:
            | ((Presentation: InsertTargetPresentation) => void)
            | undefined;
        vi.mocked(window.sorrell.insertTarget.onChanged).mockImplementation(
            (Listener: (Presentation: InsertTargetPresentation) => void) =>
            {
                Changed = Listener;
                return (): void => undefined;
            }
        );

        const Rendered = render(<InsertTargetApplication />);
        await screen.findByRole("button", { name: "Cancel" });
        act(() => Changed?.({
            CaptureNextWindow: false,
            DragActive: true
        }));

        expect(Rendered.container.querySelector(
            ".sorrell-insert-target-drop-outline"
        )).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Cancel" }))
            .not.toBeInTheDocument();
        expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });
});
