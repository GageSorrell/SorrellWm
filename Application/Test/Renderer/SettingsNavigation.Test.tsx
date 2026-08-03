/**
 * @module @sorrell/wm/Test/SettingsNavigation
 *
 * @file      SettingsNavigation.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsApplication } from "../../Source/Renderer/Settings.tsx";

describe("SettingsApplication navigation", () =>
{
    let Navigate: (Path: string | null) => void = () => undefined;

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.mocked(window.sorrell.settings.onNavigate).mockImplementation((
            Listener: (Path: string | null) => void
        ) =>
        {
            Navigate = Listener;
            return (): void => undefined;
        });
    });

    it.each([ true, false ])(
        "keeps the settings shell mounted when opening per-app settings (pinned: %s)",
        async (IsPinned: boolean) =>
        {
            Object.defineProperty(window, "matchMedia", {
                configurable: true,
                value: vi.fn(() => ({
                    addEventListener: vi.fn(),
                    matches: IsPinned,
                    removeEventListener: vi.fn()
                }))
            });
            render(<SettingsApplication />);

            act(() => Navigate("PerAppSettings?Name=Notepad"));

            expect(await screen.findByText(
                "Configure how SorrellWm manages Notepad"
            )).toBeVisible();
            expect(screen.queryByText("Per-app settings have not been created"))
                .not.toBeInTheDocument();
        }
    );

    it("shows the missing-settings message only for an overlay-targeted executable", async () =>
    {
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: vi.fn(() => ({
                addEventListener: vi.fn(),
                matches: true,
                removeEventListener: vi.fn()
            }))
        });
        render(<SettingsApplication />);

        act(() => Navigate(
            "PerAppSettings?Name=Notepad&ExecutablePath="
            + "C%3A%5CWindows%5Cnotepad.exe&Source=Overlay"
        ));
        await waitFor(() => expect(document.body).toHaveTextContent(
            "Per-app settings have not been created"
        ));
    });
});
