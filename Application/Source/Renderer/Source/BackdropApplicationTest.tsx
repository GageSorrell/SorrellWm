/**
 *
 *
 * @module @sorrell/wm/Renderer/Source/BackdropApplicationTest
 *
 * @file      BackdropApplicationTest.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BackdropApplication } from "./BackdropApplication.js";
import type { BackdropPresentation } from "../../Shared/Backdrop.js";

describe("BackdropApplication", () =>
{
    beforeEach(() =>
    {
        vi.mocked(window.sorrell.backdrop.onShow).mockReset();
    });

    it("transitions its CSS background to the requested intensity", () =>
    {
        let Show: ((Presentation: BackdropPresentation) => void) | undefined;
        vi.mocked(window.sorrell.backdrop.onShow).mockImplementation((
            Listener: (Presentation: BackdropPresentation) => void
        ) =>
        {
            Show = Listener;
            return (): void => undefined;
        });

        render(<BackdropApplication />);
        const Backdrop = screen.getByTestId("backdrop");

        expect(Backdrop).toHaveStyle({
            backgroundColor: "rgba(0, 0, 0, 0)",
            transitionDuration: "0ms"
        });

        act(() => Show?.({ DurationMilliseconds: 200, Intensity: 73 }));

        expect(Backdrop).toHaveStyle({
            backgroundColor: "rgba(0, 0, 0, 0.73)",
            transitionDuration: "200ms"
        });
    });
});
