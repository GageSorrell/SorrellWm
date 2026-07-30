/**
 * @module @sorrell/wm/Test/TrayIcon
 *
 * @file      TrayIcon.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ResolveTrayIconVariant, TrayIconVariant } from "../../Source/Main/TrayIcon.ts";
import { describe, expect, it } from "vitest";

describe("TrayIcon.ResolveTrayIconVariant", () =>
{
    it("uses the colorful icon whenever the simplified icon is disabled", () =>
    {
        expect(ResolveTrayIconVariant(false, false)).toBe(TrayIconVariant.Color);
        expect(ResolveTrayIconVariant(false, true)).toBe(TrayIconVariant.Color);
    });

    it("uses the light-stroke simplified icon in light mode", () =>
    {
        expect(ResolveTrayIconVariant(true, false)).toBe(TrayIconVariant.SimplifiedLight);
    });

    it("uses the dark-stroke simplified icon in dark mode", () =>
    {
        expect(ResolveTrayIconVariant(true, true)).toBe(TrayIconVariant.SimplifiedDark);
    });
});
