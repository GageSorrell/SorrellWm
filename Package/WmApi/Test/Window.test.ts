/**
 * Round-trip tests for the window automation schemas.
 *
 * @module @sorrell/wm-api/Test/Window
 *
 * @file      Window.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { FromWindowId, ToWindowId, WindowDetailSchema } from "../Source/Window.js";
import { Schema } from "effect";
import { describe, expect, it } from "vitest";

describe("WindowId", () =>
{
    it("round-trips a native handle through its portable string form", () =>
    {
        const Handle = 123_456_789n;
        expect(FromWindowId(ToWindowId(Handle))).toBe(Handle);
    });
});

describe("WindowDetailSchema", () =>
{
    it("decodes a complete window detail", () =>
    {
        const Encoded = {
            ApplicationName: "Notepad",
            Bounds: { Bottom: 100, Left: 0, Right: 200, Top: 0 },
            ExecutablePath: "C:\\Windows\\notepad.exe",
            Id: ToWindowId(42n),
            IsFocused: true,
            IsTiled: false,
            Path: undefined,
            Title: "Untitled - Notepad",
            WorkspaceId: undefined
        };

        const Decoded = Schema.decodeUnknownSync(WindowDetailSchema)(Encoded);
        expect(Decoded.Id).toBe(Encoded.Id);
        expect(Decoded.Title).toBe("Untitled - Notepad");
        expect(Decoded.IsTiled).toBe(false);
    });

    it("rejects a value missing required fields", () =>
    {
        expect(() => Schema.decodeUnknownSync(WindowDetailSchema)({ })).toThrow();
    });
});
