/**
 *
 *
 * @module @sorrell/wm/Renderer/Source/ThemeTest
 *
 * @file      ThemeTest.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CreateBrandVariants, CreateFluentTheme } from "../../Source/Renderer/Theme.ts";
import { describe, expect, it } from "vitest";
import { webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { ColorScheme } from "../../Source/Shared/Theme.ts";

describe("CreateFluentTheme", () =>
{
    it("uses Fluent's default themes when the accent color is unavailable", () =>
    {
        expect(CreateFluentTheme({ AccentColor: null, ColorScheme: ColorScheme.Dark }))
            .toBe(webDarkTheme);
        expect(CreateFluentTheme({ AccentColor: null, ColorScheme: ColorScheme.Light }))
            .toBe(webLightTheme);
    });

    it("centers a generated brand ramp on the Windows accent color", () =>
    {
        const Brand = CreateBrandVariants("#336699");

        expect(Brand[80]).toBe("#336699");
        expect(CreateFluentTheme({
            AccentColor: "#336699",
            ColorScheme: ColorScheme.Light
        }).colorBrandBackground).toBe("#336699");
    });
});
