/**
 * Round-trip tests for the mouse automation schemas.
 *
 * @module @sorrell/wm-api/Test/Mouse
 *
 * @file      Mouse.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { IntPointSchema, MouseButtonSchema } from "../Source/Mouse.js";
import { Schema } from "effect";
import { describe, expect, it } from "vitest";

describe("IntPointSchema", () =>
{
    it("decodes an integer point", () =>
    {
        expect(Schema.decodeUnknownSync(IntPointSchema)({ X: 10, Y: -5 })).toEqual({ X: 10, Y: -5 });
    });

    it("rejects a non-integer coordinate", () =>
    {
        expect(() => Schema.decodeUnknownSync(IntPointSchema)({ X: 1.5, Y: 0 })).toThrow();
    });
});

describe("MouseButtonSchema", () =>
{
    it("accepts every supported button", () =>
    {
        for (const Value of [ "Left", "Middle", "Right", "X1", "X2" ])
        {
            expect(Schema.decodeUnknownSync(MouseButtonSchema)(Value)).toBe(Value);
        }
    });

    it("rejects an unsupported button", () =>
    {
        expect(() => Schema.decodeUnknownSync(MouseButtonSchema)("Scroll")).toThrow();
    });
});
