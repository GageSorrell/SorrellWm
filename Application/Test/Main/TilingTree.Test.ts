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

import * as TilingTree from "../../Source/Main/Tiling/Tree.ts";
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
    it("adopts existing windows into balanced, monitor-local tiling trees", () =>
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

    it("lays out any number of panel children using normalized child ratios", () =>
    {
        const WorkArea = Bounds(0, 1000, 400, 0);
        const Children = [ 1, 2, 3, 4 ].map((Value: number) =>
            TilingTree.Window({
                InitialBounds: WorkArea,
                Window: Hwnd(Value)
            })) as [
            TilingTree.Node,
            TilingTree.Node,
            ...Array<TilingTree.Node>
        ];
        const Root = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            Children,
            [ 1, 2, 1, 4 ]
        );
        const State: TilingTree.State = {
            Workspaces: [ { Bounds: WorkArea, Id: "primary", Root } ]
        };

        expect(Root.Children).toHaveLength(4);
        expect(Root.Ratios).toEqual([ 0.125, 0.25, 0.125, 0.5 ]);
        expect(TilingTree.Layout(State).map((Placement: TilingTree.Placement) => ({
            Bounds: Box.Tupled(Placement.Bounds),
            Window: Placement.Window
        }))).toEqual([
            { Bounds: [ 0, 125, 400, 0 ], Window: Hwnd(1) },
            { Bounds: [ 0, 375, 400, 125 ], Window: Hwnd(2) },
            { Bounds: [ 0, 500, 400, 375 ], Window: Hwnd(3) },
            { Bounds: [ 0, 1000, 400, 500 ], Window: Hwnd(4) }
        ]);
    });

    it("pads monitors and applies one gap at each panel split", () =>
    {
        const WorkArea = Bounds(0, 1000, 600, 0);
        const WindowNode = (Value: number): TilingTree.WindowNode =>
            TilingTree.Window({
                InitialBounds: WorkArea,
                Window: Hwnd(Value)
            });
        const Nested = TilingTree.Panel(
            TilingTree.Orientation.Vertical,
            [ WindowNode(2), WindowNode(3) ]
        );
        const Root = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            [ WindowNode(1), Nested ]
        );
        const State: TilingTree.State = {
            Workspaces: [ { Bounds: WorkArea, Id: "primary", Root } ]
        };

        expect(TilingTree.Layout(State, 8).map((Placement: TilingTree.Placement) => ({
            Bounds: Box.Tupled(Placement.Bounds),
            Window: Placement.Window
        }))).toEqual([
            { Bounds: [ 8, 496, 592, 8 ], Window: Hwnd(1) },
            { Bounds: [ 8, 992, 296, 504 ], Window: Hwnd(2) },
            { Bounds: [ 304, 992, 592, 504 ], Window: Hwnd(3) }
        ]);

        expect(TilingTree.GetNodeBoundsAtPath(
            Root,
            WorkArea,
            [ 1 ],
            8
        )).toEqual(Bounds(8, 992, 592, 504));
    });

    it("widens matching panels during insertion and preserves remaining siblings on removal", () =>
    {
        const WorkArea = Bounds(0, 1000, 400, 0);
        let Root: TilingTree.Node = TilingTree.Window({
            InitialBounds: WorkArea,
            Window: Hwnd(1)
        });

        for (const Value of [ 2, 3, 4 ])
        {
            Root = TilingTree.InsertWindow(
                Root,
                { InitialBounds: WorkArea, Window: Hwnd(Value) },
                TilingTree.Orientation.Horizontal
            );
        }

        expect(Root._tag).toBe("Panel");
        expect(Root._tag === "Panel" ? Root.Children : [ ]).toHaveLength(4);
        expect(Root._tag === "Panel" ? Root.Ratios : [ ]).toEqual([
            0.5,
            0.25,
            0.125,
            0.125
        ]);

        const Removed = TilingTree.RemoveWindow(Root, Hwnd(2));
        expect(Removed?._tag).toBe("Panel");
        expect(Removed?._tag === "Panel" ? Removed.Children : [ ]).toHaveLength(3);
        expect(TilingTree.Windows(Removed).map(
            (Value: TilingTree.ManagedWindow) => Value.Window
        )).toEqual([ Hwnd(1), Hwnd(3), Hwnd(4) ]);
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

    it("addresses arbitrary child indices and resizes any panel child", () =>
    {
        const WindowNode = (Value: number): TilingTree.WindowNode =>
            TilingTree.Window({
                InitialBounds: Bounds(0, 100, 100, 0),
                Window: Hwnd(Value)
            });
        const Nested = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            [ WindowNode(3), WindowNode(4), WindowNode(5) ]
        );
        const Root = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            [ WindowNode(1), WindowNode(2), Nested ]
        );
        const [ WithOrientation, OrientationChanged ] = TilingTree.SetPanelOrientation(
            Root,
            [ 2 ],
            TilingTree.Orientation.Vertical
        );
        const [ WithRatio, RatioChanged ] = TilingTree.SetPanelRatio(
            WithOrientation,
            [ ],
            0.5,
            2
        );

        expect(OrientationChanged).toBe(true);
        expect(RatioChanged).toBe(true);
        expect(WithOrientation._tag === "Panel"
            ? WithOrientation.Children[2]
            : undefined).toMatchObject({
            Orientation: "Vertical",
            _tag: "Panel"
        });
        expect(WithRatio._tag === "Panel" ? WithRatio.Ratios : [ ]).toEqual([
            0.25,
            0.25,
            0.5
        ]);
    });

    it("moves logical focus through nested panels according to their orientation", () =>
    {
        const WindowNode = (Value: number): TilingTree.WindowNode =>
            TilingTree.Window({
                InitialBounds: Bounds(0, 100, 100, 0),
                Window: Hwnd(Value)
            });
        const NestedHorizontal = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            [ WindowNode(3), WindowNode(4) ]
        );
        const NestedVertical = TilingTree.Panel(
            TilingTree.Orientation.Vertical,
            [ WindowNode(2), NestedHorizontal ]
        );
        const Root = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            [ WindowNode(1), NestedVertical, WindowNode(5) ]
        );

        expect(TilingTree.FindWindowPath(Root, Hwnd(2))).toEqual([ 1, 0 ]);
        expect(TilingTree.MoveFocus(
            Root,
            [ 1, 0 ],
            TilingTree.FocusDirection.Down
        )).toEqual([ 1, 1 ]);
        expect(TilingTree.MoveFocus(
            Root,
            [ 1, 0 ],
            TilingTree.FocusDirection.Right
        )).toBeUndefined();
        expect(TilingTree.CommitFocus(Root, [ 1, 1 ])).toEqual([ 1, 1, 0 ]);
        expect(TilingTree.MoveFocus(
            Root,
            [ 1, 1, 0 ],
            TilingTree.FocusDirection.Right
        )).toEqual([ 1, 1, 1 ]);
        expect(TilingTree.FocusContainingPanel(Root, [ 1, 1, 0 ]))
            .toEqual([ 1, 1 ]);
        expect(TilingTree.FocusContainingPanel(Root, [ 1, 0 ]))
            .toEqual([ 1 ]);
        expect(TilingTree.FocusContainingPanel(Root, [ 1 ])).toEqual([ ]);
        expect(TilingTree.FocusContainingPanel(Root, [ 0 ])).toEqual([ ]);
        expect(TilingTree.FocusContainingPanel(Root, [ ])).toBeUndefined();
        expect(TilingTree.FocusFirstChild(Root, [ 1, 1, 1 ]))
            .toEqual([ 1, 1, 0 ]);
        expect(TilingTree.FocusFirstChild(Root, [ 1, 1, 0 ]))
            .toBeUndefined();
        expect(TilingTree.FocusLastChild(Root, [ 1, 1, 0 ]))
            .toEqual([ 1, 1, 1 ]);
        expect(TilingTree.FocusLastChild(Root, [ 1, 1, 1 ]))
            .toBeUndefined();
        expect(TilingTree.FocusRootPanel(Root, [ 1, 1, 1 ])).toEqual([ ]);
        expect(TilingTree.FocusRootPanel(Root, [ ])).toBeUndefined();
        expect(TilingTree.GetNodeAtPath(Root, [ 1, 1 ])).toBe(NestedHorizontal);
        expect(TilingTree.GetNodeBoundsAtPath(
            Root,
            Bounds(0, 900, 600, 0),
            [ 1 ]
        )).toEqual(Bounds(0, 600, 600, 300));
        expect(TilingTree.GetNodeBoundsAtPath(
            Root,
            Bounds(0, 900, 600, 0),
            [ 1, 1 ]
        )).toEqual(Bounds(300, 600, 600, 300));
        expect(TilingTree.GetNodeBoundsAtPath(
            Root,
            Bounds(0, 900, 600, 0),
            [ 4 ]
        )).toBeUndefined();
    });

    it("reorders, promotes, and inserts tiled windows through panel paths", () =>
    {
        const WindowNode = (Value: number): TilingTree.WindowNode =>
            TilingTree.Window({
                InitialBounds: Bounds(0, 100, 100, 0),
                Window: Hwnd(Value)
            });
        const Nested = TilingTree.Panel(
            TilingTree.Orientation.Vertical,
            [ WindowNode(2), WindowNode(3), WindowNode(4) ]
        );
        const Root = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            [ WindowNode(1), Nested, WindowNode(5) ]
        );

        const [ Reordered, DidReorder ] = TilingTree.MoveWindowToIndex(
            Root,
            Hwnd(4),
            0
        );
        expect(DidReorder).toBe(true);
        expect(TilingTree.Windows(TilingTree.GetNodeAtPath(Reordered, [ 1 ]) ?? null)
            .map((Value: TilingTree.ManagedWindow) => Value.Window))
            .toEqual([ Hwnd(4), Hwnd(2), Hwnd(3) ]);

        const [ Promoted, DidPromote ] = TilingTree.MoveWindowToContainingPanel(
            Root,
            Hwnd(2)
        );
        expect(DidPromote).toBe(true);
        expect(TilingTree.Windows(Promoted)
            .map((Value: TilingTree.ManagedWindow) => Value.Window))
            .toEqual([ Hwnd(1), Hwnd(3), Hwnd(4), Hwnd(2), Hwnd(5) ]);
        expect(TilingTree.FindWindowPath(Promoted, Hwnd(2))).toEqual([ 2 ]);

        const [ Inserted, DidInsert ] = TilingTree.MoveWindowIntoPanel(
            Root,
            Hwnd(1),
            [ 1 ]
        );
        expect(DidInsert).toBe(true);
        expect(TilingTree.Windows(Inserted)
            .map((Value: TilingTree.ManagedWindow) => Value.Window))
            .toEqual([ Hwnd(1), Hwnd(2), Hwnd(3), Hwnd(4), Hwnd(5) ]);
        expect(TilingTree.FindWindowPath(Inserted, Hwnd(1))).toEqual([ 0, 0 ]);

        const TwoChildRoot = TilingTree.Panel(
            TilingTree.Orientation.Horizontal,
            WindowNode(1),
            Nested
        );
        const [ Collapsed, DidCollapse ] = TilingTree.MoveWindowIntoPanel(
            TwoChildRoot,
            Hwnd(1),
            [ 1 ]
        );
        expect(DidCollapse).toBe(true);
        expect(Collapsed).toMatchObject({
            Orientation: TilingTree.Orientation.Vertical,
            _tag: "Panel"
        });
        expect(TilingTree.FindWindowPath(Collapsed, Hwnd(1))).toEqual([ 0 ]);
    });
});
