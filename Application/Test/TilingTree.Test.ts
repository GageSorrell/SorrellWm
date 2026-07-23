/**
 *
 *
 * @module @sorrell/wm/Test/TilingTree
 *
 * @file      TilingTree.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as TilingTree from "../Source/Main/TilingTree.js";
import { describe, expect, it } from "vitest";
import { Box } from "@sorrell/math";
import type { Handle } from "@sorrell/windows";

const Hwnd = (Value: number): Handle.HWND => BigInt(Value) as Handle.HWND;
const Bounds = (Top: number, Right: number, Bottom: number, Left: number): Box.Box =>
    Box.Box(Top, Right, Bottom, Left);

const Seed = (
    Window: number,
    InitialBounds: Box.Box,
    WorkArea: Box.Box
): TilingTree.WindowSeed => ({ InitialBounds, Window: Hwnd(Window), WorkArea });

describe("TilingTree", () =>
{
    it("adopts existing windows into balanced, monitor-local BSP trees", () =>
    {
        const Primary = Bounds(0, 1200, 800, 0);
        const Secondary = Bounds(0, 2200, 800, 1200);
        const State = TilingTree.FromWindowSeeds([
            Seed(1, Bounds(0, 600, 400, 0), Primary),
            Seed(2, Bounds(0, 1200, 400, 600), Primary),
            Seed(3, Bounds(400, 600, 800, 0), Primary),
            Seed(4, Bounds(400, 1200, 800, 600), Primary),
            Seed(5, Secondary, Secondary)
        ]);

        expect(State.Workspaces).toHaveLength(2);
        expect(TilingTree.Layout(State).map((Placement: TilingTree.Placement) => ({
            Bounds: Box.Tupled(Placement.Bounds),
            Window: Placement.Window
        }))).toEqual([
            { Bounds: [ 0, 600, 400, 0 ], Window: Hwnd(1) },
            { Bounds: [ 400, 600, 800, 0 ], Window: Hwnd(3) },
            { Bounds: [ 0, 1200, 400, 600 ], Window: Hwnd(2) },
            { Bounds: [ 400, 1200, 800, 600 ], Window: Hwnd(4) },
            { Bounds: [ 0, 2200, 800, 1200 ], Window: Hwnd(5) }
        ]);
    });

    it("inserts, removes, and collapses window leaves", () =>
    {
        const First = TilingTree.Window({
            InitialBounds: Bounds(0, 100, 100, 0),
            Window: Hwnd(1)
        });
        const Inserted = TilingTree.InsertWindow(
            First,
            { InitialBounds: Bounds(0, 200, 100, 100), Window: Hwnd(2) },
            TilingTree.Orientation.Horizontal,
            Hwnd(1)
        );

        expect(Inserted._tag).toBe("Panel");
        expect(TilingTree.Windows(Inserted).map((Value: TilingTree.ManagedWindow) => Value.Window))
            .toEqual([ Hwnd(1), Hwnd(2) ]);
        expect(TilingTree.RemoveWindow(Inserted, Hwnd(1))).toEqual(
            TilingTree.Window({
                InitialBounds: Bounds(0, 200, 100, 100),
                Window: Hwnd(2)
            })
        );
    });

    it("mutates panel orientation and ratio through immutable paths", () =>
    {
        const Root = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            TilingTree.Window({ InitialBounds: Bounds(0, 10, 10, 0), Window: Hwnd(1) }),
            TilingTree.Window({ InitialBounds: Bounds(0, 20, 10, 10), Window: Hwnd(2) })
        );
        const [ WithRatio, RatioChanged ] = TilingTree.SetPanelRatio(Root, [ ], 0.25);
        const [ WithOrientation, OrientationChanged ] = TilingTree.SetPanelOrientation(
            WithRatio,
            [ ],
            TilingTree.Orientation.Vertical
        );

        expect(RatioChanged).toBe(true);
        expect(OrientationChanged).toBe(true);
        expect(WithOrientation).toMatchObject({
            Orientation: "Vertical",
            Ratio: 0.25,
            _tag: "Panel"
        });
        expect(Root).toMatchObject({ Orientation: "Horizontal", Ratio: 0.5 });
        expect(Object.isFrozen(WithOrientation)).toBe(true);
    });
});
