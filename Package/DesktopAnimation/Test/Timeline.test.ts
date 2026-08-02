/**
 * Tests for desktop animation timeline constructors and validation.
 *
 * @module @sorrell/desktop-animation/Test/Timeline.test
 *
 * @file      Timeline.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { CursorStep, DefineAnimation, WindowStep } from "../Source/Timeline.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/Test/Timeline.test" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

describe("desktop animation timeline", () =>
{
    it("supports instantaneous and timed window movement", () =>
    {
        expect(WindowStep.Move("one", { X: 10, Y: 20 })).toMatchObject({
            Duration: 0,
            Kind: "MoveWindow"
        });
        expect(WindowStep.Move("one", { X: 10, Y: 20 }, 450)).toMatchObject({
            Duration: 450,
            Kind: "MoveWindow"
        });
    });

    it("validates step ordering at the public definition seam", () =>
    {
        expect(() => DefineAnimation({
            Canvas: { Height: 100, Width: 200 },
            Label: "Invalid move",
            Steps: [ WindowStep.Move("missing", { X: 20, Y: 20 }, 100) ]
        })).toThrow("Window \"missing\" is not visible");

        expect(() => DefineAnimation({
            Canvas: { Height: 100, Width: 200 },
            Label: "Invalid cursor move",
            Steps: [ CursorStep.Move({ X: 20, Y: 20 }, 100) ]
        })).toThrow("cursor is not visible");
    });

    it("accepts creation, resizing, dragging, and destruction in sequence", () =>
    {
        const Animation = DefineAnimation({
            Canvas: { Height: 100, Width: 200 },
            Cursor: { Position: { X: 20, Y: 20 }, Type: "Pointer" },
            Label: "Complete sequence",
            Steps: [
                WindowStep.Create({
                    Frame: { Height: 40, Width: 80, X: 10, Y: 10 },
                    Id: "one"
                }),
                WindowStep.Resize("one", { Height: 50, Width: 90 }, 200),
                CursorStep.Drag("one", { X: 70, Y: 30 }, 300),
                WindowStep.Destroy("one")
            ]
        });

        expect(Object.isFrozen(Animation)).toBe(true);
        expect(Animation.Steps).toHaveLength(4);
    });
});
