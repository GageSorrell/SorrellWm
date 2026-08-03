/**
 * Tests popup portal layout beneath the themed renderer root.
 *
 * @module @sorrell/wm/Renderer/RootPortalTest
 *
 * @file      RootPortal.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Root } from "../../Source/Renderer/Root.js";

describe("Root popup portals", () =>
{
    it("does not apply the renderer's viewport height to popup portal nodes", () =>
    {
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: vi.fn(() => ({
                addEventListener: vi.fn(),
                matches: true,
                removeEventListener: vi.fn()
            }))
        });
        window.history.replaceState({ }, "", "?window=Settings");
        render(<Root />);

        fireEvent.focus(screen.getByPlaceholderText("Search for settings"));

        const Portal = document.querySelector<HTMLElement>("[data-portal-node='true']");
        expect(Portal).not.toBeNull();
        expect(getComputedStyle(Portal!).minHeight).not.toBe("100vh");
    });
});
