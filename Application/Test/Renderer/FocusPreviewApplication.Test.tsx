/**
 * @module @sorrell/wm/Renderer/FocusPreviewApplicationTest
 *
 * @file      FocusPreviewApplication.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { act, render, screen } from "@testing-library/react";
import type { FocusPreviewPresentation } from "../../Source/Shared/FocusPreview.ts";
import { FocusPreviewApplication } from "../../Source/Renderer/FocusPreviewApplication.tsx";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("FocusPreviewApplication", () =>
{
    let Publish: ((Presentation: FocusPreviewPresentation) => void) | undefined;

    beforeEach(() =>
    {
        Publish = undefined;
        vi.mocked(window.sorrell.focusPreview.onChanged).mockImplementation((Listener) =>
        {
            Publish = Listener;
            return (): void => undefined;
        });
    });

    it("renders an opaque centered icon over a translucent bordered fill", () =>
    {
        render(<FocusPreviewApplication />);

        act(() => Publish?.({ Opacity: 75 }));

        const Fill = screen.getByTestId("focus-preview-fill");
        expect(Fill).toHaveStyle({
            backgroundColor: "rgba(96, 96, 96, 0.75)",
            border: "1px solid rgb(96, 96, 96)"
        });
        expect(screen.getByTestId("focus-preview").querySelector("svg")).not.toBeNull();
        expect(screen.getByTestId("focus-preview")).toHaveStyle({
            alignItems: "center",
            justifyContent: "center"
        });
    });
});
