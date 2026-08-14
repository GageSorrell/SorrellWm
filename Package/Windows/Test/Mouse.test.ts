/**
 * Pure-function tests for the mouse-simulation module. `LerpPoint` is the only piece of
 * `Mouse.ts` that isn't a thin native wrapper, so it's the only piece worth unit testing
 * directly (everything else needs a real `SendInput`/`SetCursorPos` call, exercised
 * instead by `Application`'s Mcp integration).
 *
 * @module @sorrell/windows/Test/Mouse
 *
 * @file      Mouse.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { IntPoint } from "@sorrell/math";
import { LerpPoint } from "../Source/Mouse.js";

describe("LerpPoint", () =>
{
    it("returns the start point at T=0", () =>
    {
        const Result = LerpPoint(IntPoint.IntPoint(10, 20), IntPoint.IntPoint(110, 220), 0);
        expect(Result.X).toBe(10);
        expect(Result.Y).toBe(20);
    });

    it("returns the end point at T=1", () =>
    {
        const Result = LerpPoint(IntPoint.IntPoint(10, 20), IntPoint.IntPoint(110, 220), 1);
        expect(Result.X).toBe(110);
        expect(Result.Y).toBe(220);
    });

    it("interpolates linearly between the two points", () =>
    {
        const Result = LerpPoint(IntPoint.IntPoint(0, 0), IntPoint.IntPoint(100, 200), 0.5);
        expect(Result.X).toBe(50);
        expect(Result.Y).toBe(100);
    });

    it("clamps T below zero to the start point", () =>
    {
        const Result = LerpPoint(IntPoint.IntPoint(10, 20), IntPoint.IntPoint(110, 220), -1);
        expect(Result.X).toBe(10);
        expect(Result.Y).toBe(20);
    });

    it("clamps T above one to the end point", () =>
    {
        const Result = LerpPoint(IntPoint.IntPoint(10, 20), IntPoint.IntPoint(110, 220), 2);
        expect(Result.X).toBe(110);
        expect(Result.Y).toBe(220);
    });
});
