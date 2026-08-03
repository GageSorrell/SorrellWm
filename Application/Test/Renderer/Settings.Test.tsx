/**
 * Tests the settings renderer surface and its responsive layout.
 *
 * @module @sorrell/wm/Test/Settings
 *
 * @file      Settings.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsApplication } from "../../Source/Renderer/Settings.tsx";

vi.mock("../../Source/Renderer/SettingsSidebar.tsx", () => ({
    SettingsSidebar: (): null => null
}));

vi.mock("../../Source/Renderer/SettingsTitlebar.tsx", () => ({
    SettingsTitlebar: (): null => null
}));

describe("SettingsApplication", () =>
{
    let Navigate: (Path: string | null) => void = () => undefined;
    const ScrollIntoView = vi.fn();

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.mocked(window.sorrell.settings.onNavigate).mockImplementation((Listener) =>
        {
            Navigate = Listener;
            return (): void => undefined;
        });
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: vi.fn(() => ({
                addEventListener: vi.fn(),
                matches: true,
                removeEventListener: vi.fn()
            }))
        });
        Object.defineProperty(Element.prototype, "scrollIntoView", {
            configurable: true,
            value: ScrollIntoView
        });
        vi.stubGlobal("requestAnimationFrame", (Callback: FrameRequestCallback): number =>
            window.setTimeout(() => Callback(0), 0));
        vi.stubGlobal("cancelAnimationFrame", window.clearTimeout);
    });

    it("scrolls to and highlights a setting named by the navigation path", async () =>
    {
        render(<SettingsApplication />);

        act(() => Navigate("General?Highlight=ResizeRecoveryStrategy"));

        await screen.findByText("Resize Recovery Strategy");
        await waitFor(() => expect(ScrollIntoView).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "center"
        }));
    });
});
