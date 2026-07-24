/**
 *
 *
 * @module @sorrell/wm/Renderer/Test/Setup
 *
 * @file      Setup.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

Object.defineProperty(globalThis, "NodeFilter", {
    configurable: true,
    value: window.NodeFilter
});

Object.defineProperty(window, "sorrell", {
    configurable: true,
    value:
    {
        backdrop:
        {
            onShow: vi.fn(() => (): void => undefined)
        },
        overlay:
        {
            back: vi.fn(() => Promise.resolve()),
            get: vi.fn(() => Promise.resolve({
                CanGoBack: false,
                Commands: [ ],
                Id: "Home"
            })),
            invoke: vi.fn(() => Promise.resolve()),
            onChanged: vi.fn(() => (): void => undefined),
            preview: vi.fn(() => Promise.resolve())
        },
        ping: vi.fn<() => Promise<string>>(() => Promise.resolve("pong")),
        platform: "win32",
        theme:
        {
            get: vi.fn(() => Promise.resolve({ AccentColor: null, ColorScheme: "Dark" })),
            onChanged: vi.fn(() => (): void => undefined)
        },
        versions:
        {
            chrome: "test",
            electron: "test",
            node: "test"
        }
    }
});
