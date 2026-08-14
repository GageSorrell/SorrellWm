/**
 * Round-trip tests for the tiling automation schemas.
 *
 * @module @sorrell/wm-api/Test/Tiling
 *
 * @file      Tiling.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { OrientationSchema, PathSchema, TilingSnapshotSchema } from "../Source/Tiling.js";
import { Schema } from "effect";
import { ToWindowId } from "../Source/Window.js";
import { describe, expect, it } from "vitest";

describe("OrientationSchema", () =>
{
    it("accepts every supported orientation", () =>
    {
        for (const Value of [ "Horizontal", "Stack", "Vertical" ])
        {
            expect(Schema.decodeUnknownSync(OrientationSchema)(Value)).toBe(Value);
        }
    });

    it("rejects an unsupported orientation", () =>
    {
        expect(() => Schema.decodeUnknownSync(OrientationSchema)("Diagonal")).toThrow();
    });
});

describe("PathSchema", () =>
{
    it("decodes an array of child indices", () =>
    {
        expect(Schema.decodeUnknownSync(PathSchema)([ 0, 1, 2 ])).toEqual([ 0, 1, 2 ]);
    });
});

describe("TilingSnapshotSchema", () =>
{
    it("decodes a flattened snapshot", () =>
    {
        const Encoded = {
            Panels: [ {
                ChildCount: 2,
                Orientation: "Horizontal",
                Path: [ ],
                Ratios: [ 0.5, 0.5 ],
                WorkspaceId: "Monitor1"
            } ],
            Windows: [ {
                Bounds: { Bottom: 100, Left: 0, Right: 100, Top: 0 },
                Path: [ 0 ],
                WindowId: ToWindowId(1n),
                WorkspaceId: "Monitor1"
            } ],
            Workspaces: [ {
                Bounds: { Bottom: 1080, Left: 0, Right: 1920, Top: 0 },
                Id: "Monitor1"
            } ]
        };

        const Decoded = Schema.decodeUnknownSync(TilingSnapshotSchema)(Encoded);
        expect(Decoded.Windows).toHaveLength(1);
        expect(Decoded.Panels).toHaveLength(1);
        expect(Decoded.Workspaces).toHaveLength(1);
    });
});
