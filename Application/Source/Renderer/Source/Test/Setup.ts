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

import { vi } from "vitest";

Object.defineProperty(window, "sorrell", {
    configurable: true,
    value:
    {
        ping: vi.fn<() => Promise<string>>(() => Promise.resolve("pong")),
        platform: "win32",
        versions:
        {
            chrome: "test",
            electron: "test",
            node: "test"
        }
    }
});
