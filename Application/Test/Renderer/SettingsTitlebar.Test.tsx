/**
 * Tests the settings titlebar search interaction.
 *
 * @module @sorrell/wm/Test/SettingsTitlebar
 *
 * @file      SettingsTitlebar.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Setting, SettingControlsProvider, UseSettingControls } from "@sorrell/settings-ui";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GridRegular } from "@fluentui/react-icons";
import { SettingsApplication } from "../../Source/Renderer/Settings.tsx";
import { SettingsTitlebar } from "../../Source/Renderer/SettingsTitlebar.tsx";

vi.mock("../../Source/Renderer/SettingsSidebar.tsx", () => ({
    SettingsSidebar: (): null => null
}));

const SettingsTitlebarRegistrationHarness = (): React.JSX.Element =>
{
    const { Controls } = UseSettingControls();

    return (
        <>
            <SettingsTitlebar
                Controls={ Controls }
                IsSidebarOpen={ true }
                IsSidebarPinned={ true }
                OnSelectResult={ vi.fn() }
                OnToggleSidebar={ vi.fn() } />
            <Setting
                Icon={ GridRegular }
                Id="General"
                Title="General" />
        </>
    );
};

describe("SettingsTitlebar", () =>
{
    it("focuses the settings search without recursively updating", () =>
    {
        render(
            <SettingsTitlebar
                Controls={ { General: { Icon: GridRegular, Title: "General" } } }
                IsSidebarOpen={ true }
                IsSidebarPinned={ true }
                OnSelectResult={ vi.fn() }
                OnToggleSidebar={ vi.fn() } />
        );

        const Search = screen.getByPlaceholderText("Search for settings");

        expect(() => act(() => Search.focus())).not.toThrow();
        expect(() => act(() => Search.click())).not.toThrow();
        expect(Search).toHaveFocus();

        fireEvent.change(Search, { target: { value: "General" } });

        const SearchResult = screen.getByRole("option", { name: "General" });
        expect(SearchResult.querySelector(".fui-Option__checkIcon")).toBeNull();
    });

    it("opens the settings window and focuses its search without recursively updating", async () =>
    {
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: vi.fn(() => ({
                addEventListener: vi.fn(),
                matches: true,
                removeEventListener: vi.fn()
            }))
        });

        expect(() => render(<SettingsApplication />)).not.toThrow();
        await screen.findByText("Resize Recovery Strategy");

        const Search = screen.getByPlaceholderText("Search for settings");

        expect(() => act(() => Search.focus())).not.toThrow();
        expect(() => act(() => Search.click())).not.toThrow();
        expect(Search).toHaveFocus();
    });

    it("remains stable when search controls register", async () =>
    {
        render(
            <SettingControlsProvider>
                <SettingsTitlebarRegistrationHarness />
            </SettingControlsProvider>
        );

        await act(async () => undefined);
        expect(screen.getByText("General")).toBeVisible();
    });
});
