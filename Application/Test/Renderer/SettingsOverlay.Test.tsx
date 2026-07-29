/**
 * @module @sorrell/wm/Renderer/SettingsOverlayTest
 *
 * @file      SettingsOverlay.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { SettingsOverlay } from "../../Source/Renderer/SettingsOverlay.tsx";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("SettingsOverlay", () =>
{
    beforeEach(() =>
    {
        vi.mocked(window.sorrell.overlaySettings.get).mockResolvedValue({
            FocusPreviewOpacity: 75
        });
        vi.mocked(window.sorrell.overlaySettings.set).mockImplementation(async (Patch) => ({
            FocusPreviewOpacity: Patch.FocusPreviewOpacity ?? 75
        }));
    });

    it("shows the 75% default and persists changes", async () =>
    {
        render(<SettingsOverlay />);

        const Slider = await screen.findByRole("slider", {
            name: "Focus preview opacity"
        });
        expect(screen.getByText("75%")).toBeInTheDocument();

        fireEvent.change(Slider, { target: { value: "62" } });

        expect(window.sorrell.overlaySettings.set).toHaveBeenCalledWith({
            FocusPreviewOpacity: 62
        });
        expect(await screen.findByText("62%")).toBeInTheDocument();
    });
});
