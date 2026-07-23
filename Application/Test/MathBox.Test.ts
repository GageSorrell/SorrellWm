/**
 *
 *
 * @module @sorrell/wm/Test/MathBox
 *
 * @file      MathBox.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as BoxUtility from "../Source/Main/Utility/Math/Box.js";
import { Box, Int, IntInterval, IntPoint } from "@sorrell/math";
import { describe, expect, it } from "vitest";

describe("Math.Box.Center", () =>
{
    it("preserves the requested size and centers it over the target", () =>
    {
        const That = Box.Box(Int.Int(10), Int.Int(30), Int.Int(30), Int.Int(10));
        const Size = IntPoint.IntPoint(8, 6);
        const Centered = BoxUtility.Center(Size, That);

        expect(Box.Tupled(Centered)).toEqual([ 17, 24, 23, 16 ]);
        expect(Box.Width(Centered)).toBe(8);
        expect(Box.Height(Centered)).toBe(6);
        expect(BoxUtility.CenterPoint(Centered)).toEqual(BoxUtility.CenterPoint(That));
    });

    it("supports piped calls and rounds half-coordinate placement toward the upper-left", () =>
    {
        const That = Box.Box(Int.Int(0), Int.Int(5), Int.Int(5), Int.Int(0));
        const Centered = BoxUtility.Center(That)(IntInterval.IntInterval(4, 3));

        expect(Box.Tupled(Centered)).toEqual([ 1, 4, 4, 0 ]);
        expect(Box.Width(Centered)).toBe(4);
        expect(Box.Height(Centered)).toBe(3);
    });
});
