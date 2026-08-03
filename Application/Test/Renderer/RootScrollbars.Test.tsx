/**
 * Tests WinUI scrollbar coverage across renderer windows.
 *
 * @module @sorrell/wm/Renderer/RootScrollbarsTest
 *
 * @file      RootScrollbars.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Root } from "../../Source/Renderer/Root.js";

const WindowNames = [
    "Backdrop",
    "FocusPreviewDown",
    "FocusPreviewLeft",
    "FocusPreviewRight",
    "FocusPreviewUp",
    "InsertTarget",
    "Overlay",
    "Settings",
    "TiledFocusPanelPreview",
    "TiledMovePanelPreview"
] as const;

describe("Root scrollbars", () =>
{
    beforeEach(() =>
    {
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: vi.fn(() => ({
                addEventListener: vi.fn(),
                matches: false,
                removeEventListener: vi.fn()
            }))
        });
    });

    it.each(WindowNames)("wraps the %s window", (WindowName: string) =>
    {
        window.history.replaceState({ }, "", `?window=${ WindowName }`);

        render(<Root />);

        expect(screen.getByTestId("window-scrollbars")).not.toBeEmptyDOMElement();
    });
});
