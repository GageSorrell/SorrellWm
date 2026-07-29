/**
 * Renderer structured logging bridge tests.
 *
 * @module @sorrell/wm/Test/RendererLogging
 *
 * @file      Logging.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "../../Source/Renderer/Logging.ts";
import { describe, expect, it, vi } from "vitest";

describe("Renderer Logging", () =>
{
    it("forwards structured errors through the preload bridge", () =>
    {
        Logging.Error("Settings", "Could not save settings.", new Error("disk failure"));

        expect(window.sorrell.log.write).toHaveBeenCalledWith({
            Category: "Settings",
            Details: expect.stringContaining("disk failure"),
            Level: "Error",
            Message: "Could not save settings."
        });
    });

    it("reports rejected promises without throwing", () =>
    {
        const Report = Logging.ReportRejection("Overlay", "Command failed.");

        expect(() => Report(new Error("native failure"))).not.toThrow();
        expect(vi.mocked(window.sorrell.log.write)).toHaveBeenCalledWith(
            expect.objectContaining({
                Category: "Overlay",
                Level: "Error",
                Message: "Command failed."
            })
        );
    });
});
