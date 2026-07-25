/**
 *
 *
 * @module @sorrell/wm/Test/TitlebarFlyout
 *
 * @file      TitlebarFlyout.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Box, IntPoint } from "@sorrell/math";
import {
    ContainsPoint,
    DefaultFlyoutHoverDelayMilliseconds,
    GetOverlayBounds,
    HasHoverDelayElapsed,
    ResolveHoverDelayMilliseconds,
    ShouldShow
} from
    "../../Source/Main/TitlebarFlyout.ts";
import { describe, expect, it } from "vitest";
import { Option } from "effect";

describe("TitlebarFlyout", () =>
{
    it("uses the fallback only when enabled and a native Snap feature is disabled", () =>
    {
        expect(ShouldShow(true, Option.some(false), Option.some(true))).toBe(true);
        expect(ShouldShow(true, Option.some(true), Option.some(false))).toBe(true);
        expect(ShouldShow(true, Option.some(true), Option.some(true))).toBe(false);
        expect(ShouldShow(false, Option.some(false), Option.some(false))).toBe(false);
        expect(ShouldShow(true, Option.none(), Option.none())).toBe(false);
    });

    it("uses Windows' hover time and falls back when it is unavailable", () =>
    {
        expect(ResolveHoverDelayMilliseconds(Option.some(400))).toBe(400);
        expect(ResolveHoverDelayMilliseconds(Option.some(0))).toBe(
            DefaultFlyoutHoverDelayMilliseconds
        );
        expect(ResolveHoverDelayMilliseconds(Option.none())).toBe(
            DefaultFlyoutHoverDelayMilliseconds
        );
    });

    it("requires the full hover duration to elapse", () =>
    {
        expect(HasHoverDelayElapsed(1_000, 1_399, 400)).toBe(false);
        expect(HasHoverDelayElapsed(1_000, 1_400, 400)).toBe(true);
    });

    it("anchors the overlay to the maximize button and keeps it in the work area", () =>
    {
        const Button = Box.Box(10, 950, 40, 900);
        const WorkArea = Box.Box(0, 1000, 900, 0);
        const Bounds = GetOverlayBounds(Button, WorkArea);

        expect(Bounds).toMatchObject({
            Bottom: 840,
            Left: 470,
            Right: 950,
            Top: 40
        });
        expect(ContainsPoint(Bounds, IntPoint.IntPoint(470, 40))).toBe(true);
        expect(ContainsPoint(Bounds, IntPoint.IntPoint(950, 40))).toBe(false);
    });

    it("places the overlay above a button when there is not enough room below it", () =>
    {
        const Bounds = GetOverlayBounds(
            Box.Box(850, 950, 880, 900),
            Box.Box(0, 1000, 900, 0)
        );

        expect(Bounds.Top).toBe(50);
        expect(Bounds.Bottom).toBe(850);
    });
});
