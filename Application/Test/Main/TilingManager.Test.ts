/**
 *
 *
 * @module @sorrell/wm/Test/TilingManager
 *
 * @file      TilingManager.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as TilingManager from "../../Source/Main/Tiling/Manager.ts";
import * as TilingTree from "../../Source/Main/Tiling/Tree.ts";
import { Effect, Option, Result } from "effect";
import { describe, expect, it, vi } from "vitest";
import { Box } from "@sorrell/math";
import type { Handle } from "@sorrell/windows";

vi.mock("@sorrell/windows", () => ({
    Window: { }
}));

const Hwnd = (Value: number): Handle.HWND => BigInt(Value) as Handle.HWND;
const Bounds = (Top: number, Right: number, Bottom: number, Left: number): Box.Box =>
    Box.Box(Top, Right, Bottom, Left);

interface AppliedBounds
{
    readonly Bounds: Box.Box;
    readonly Window: Handle.HWND;
}

interface AppliedZOrder
{
    readonly PrecedingWindow: Handle.HWND;
    readonly Window: Handle.HWND;
}

const FakeDependencies = (
    Handles: ReadonlyArray<Handle.HWND>,
    InitialBounds: ReadonlyMap<Handle.HWND, Box.Box>,
    WorkAreas: ReadonlyMap<Handle.HWND, Box.Box>,
    Applied: Array<AppliedBounds>,
    AppliedZOrders?: Array<AppliedZOrder>
): TilingManager.Dependencies => ({
    Enumerate: () => Result.succeed(Handles),
    GetWindowRect: (WindowValue: Handle.HWND) => Option.fromUndefinedOr(
        InitialBounds.get(WindowValue)
    ),
    GetWindowWorkArea: (WindowValue: Handle.HWND) => Option.fromUndefinedOr(
        WorkAreas.get(WindowValue)
    ),
    SetWindowRect: (WindowValue: Handle.HWND, Rectangle: Box.Box) =>
    {
        Applied.push({ Bounds: Rectangle, Window: WindowValue });
        return Result.succeed(undefined);
    },
    ...(AppliedZOrders === undefined
        ? { }
        : {
            SetWindowZOrderAfter: (
                WindowValue: Handle.HWND,
                PrecedingWindow: Handle.HWND
            ) =>
            {
                AppliedZOrders.push({ PrecedingWindow, Window: WindowValue });
                return Result.succeed(undefined);
            }
        })
});

describe("TilingManager", () =>
{
    it("reconciles tiled windows with the configured gap", async () =>
    {
        const WorkArea = Bounds(0, 1000, 600, 0);
        const Applied = new Array<AppliedBounds>();
        const Dependencies = FakeDependencies(
            [ Hwnd(1) ],
            new Map([ [ Hwnd(1), WorkArea ] ]),
            new Map([ [ Hwnd(1), WorkArea ] ]),
            Applied
        );

        await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            yield* Manager.SetGap(8);
            yield* Manager.TileExistingWindows;
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(Applied).toEqual([
            { Bounds: Bounds(8, 992, 592, 8), Window: Hwnd(1) }
        ]);
    });

    it("adopts existing windows directly into each monitor's root panel", async () =>
    {
        const Primary = Bounds(0, 1200, 800, 0);
        const Secondary = Bounds(0, 2200, 800, 1200);
        const Handles = [ Hwnd(1), Hwnd(2), Hwnd(3), Hwnd(4) ];
        const Applied = new Array<AppliedBounds>();
        const Dependencies = FakeDependencies(
            Handles,
            new Map([
                [ Hwnd(1), Bounds(0, 600, 800, 0) ],
                [ Hwnd(2), Bounds(0, 1200, 800, 600) ],
                [ Hwnd(3), Bounds(0, 900, 800, 300) ],
                [ Hwnd(4), Secondary ]
            ]),
            new Map([
                [ Hwnd(1), Primary ],
                [ Hwnd(2), Primary ],
                [ Hwnd(3), Primary ],
                [ Hwnd(4), Secondary ]
            ]),
            Applied
        );

        const State = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            expect((yield* Manager.Snapshot).Workspaces).toEqual([ ]);
            yield* Manager.TileExistingWindows;
            return yield* Manager.Snapshot;
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(State.Workspaces).toHaveLength(2);
        expect(State.Workspaces[0]?.Root?._tag).toBe("Panel");
        expect(State.Workspaces[0]?.Root?._tag === "Panel"
            ? State.Workspaces[0].Root.Children
            : [ ]).toHaveLength(3);
        expect(Applied.map((Placement: AppliedBounds) => ({
            Bounds: Box.Tupled(Placement.Bounds),
            Window: Placement.Window
        }))).toEqual([
            { Bounds: [ 0, 400, 800, 0 ], Window: Hwnd(1) },
            { Bounds: [ 0, 800, 800, 400 ], Window: Hwnd(3) },
            { Bounds: [ 0, 1200, 800, 800 ], Window: Hwnd(2) },
            { Bounds: [ 0, 2200, 800, 1200 ], Window: Hwnd(4) }
        ]);
    });

    it("does not adopt floating windows while a root already has tiled content", async () =>
    {
        const WorkArea = Bounds(0, 1200, 800, 0);
        const Handles = [ Hwnd(1), Hwnd(2) ];
        const Dependencies = FakeDependencies(
            Handles,
            new Map(Handles.map((WindowValue: Handle.HWND) => [ WindowValue, WorkArea ])),
            new Map(Handles.map((WindowValue: Handle.HWND) => [ WindowValue, WorkArea ])),
            [ ]
        );

        const Managed = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            yield* Manager.Tile(Hwnd(1));
            yield* Manager.TileExistingWindows;
            return TilingTree.Windows((yield* Manager.Snapshot).Workspaces[0]!.Root);
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(Managed.map((Value: TilingTree.ManagedWindow) => Value.Window))
            .toEqual([ Hwnd(1) ]);
    });

    it("starts with an empty state when native startup discovery is unavailable", async () =>
    {
        const State = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            return yield* Manager.Snapshot;
        }).pipe(Effect.provide(TilingManager.MakeLive({
            Enumerate: () => Result.fail({ Message: "Native method unavailable." }),
            GetWindowRect: () => Option.none(),
            GetWindowWorkArea: () => Option.none(),
            SetWindowRect: () => Result.succeed(undefined)
        }))));

        expect(State.Workspaces).toEqual([ ]);
    });

    it("serializes tree mutations, reconciles bounds, and restores unmanaged windows", async () =>
    {
        const WorkArea = Bounds(0, 1000, 800, 0);
        const FirstInitial = Bounds(100, 500, 500, 100);
        const SecondInitial = Bounds(200, 900, 700, 500);
        const Applied = new Array<AppliedBounds>();
        const Dependencies = FakeDependencies(
            [ Hwnd(1) ],
            new Map([
                [ Hwnd(1), FirstInitial ],
                [ Hwnd(2), SecondInitial ]
            ]),
            new Map([
                [ Hwnd(1), WorkArea ],
                [ Hwnd(2), WorkArea ]
            ]),
            Applied
        );

        const ResultValue = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            yield* Manager.TileExistingWindows;
            yield* Manager.Tile(
                Hwnd(2),
                Hwnd(1),
                TilingTree.Orientation.Horizontal
            );
            yield* Manager.SetPanelRatio(TilingTree.WorkspaceId(WorkArea), [ ], 0.25);
            const SplitState = yield* Manager.Snapshot;
            yield* Manager.Float(Hwnd(1), true);

            return {
                FinalState: yield* Manager.Snapshot,
                SplitState
            };
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(TilingTree.Layout(ResultValue.SplitState).map(
            (Placement: TilingTree.Placement) => ({
                Bounds: Box.Tupled(Placement.Bounds),
                Window: Placement.Window
            })
        )).toEqual([
            { Bounds: [ 0, 250, 800, 0 ], Window: Hwnd(1) },
            { Bounds: [ 0, 1000, 800, 250 ], Window: Hwnd(2) }
        ]);
        expect(TilingTree.Windows(ResultValue.FinalState.Workspaces[0]!.Root)
            .map((Managed: TilingTree.ManagedWindow) => Managed.Window)).toEqual([ Hwnd(2) ]);
        expect(Applied.slice(-2).map((Placement: AppliedBounds) => ({
            Bounds: Box.Tupled(Placement.Bounds),
            Window: Placement.Window
        }))).toEqual([
            { Bounds: [ 0, 1000, 800, 0 ], Window: Hwnd(2) },
            { Bounds: [ 100, 500, 500, 100 ], Window: Hwnd(1) }
        ]);
    });

    it("adds same-orientation windows as siblings in a multi-child panel", async () =>
    {
        const WorkArea = Bounds(0, 1200, 600, 0);
        const Handles = [ Hwnd(1), Hwnd(2), Hwnd(3), Hwnd(4) ];
        const Dependencies = FakeDependencies(
            [ ],
            new Map(Handles.map((WindowValue: Handle.HWND) => [
                WindowValue,
                WorkArea
            ])),
            new Map(Handles.map((WindowValue: Handle.HWND) => [
                WindowValue,
                WorkArea
            ])),
            [ ]
        );

        const State = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;

            for (const WindowValue of Handles)
            {
                yield* Manager.Tile(
                    WindowValue,
                    undefined,
                    TilingTree.Orientation.Horizontal
                );
            }

            yield* Manager.SetPanelRatio(
                TilingTree.WorkspaceId(WorkArea),
                [ ],
                0.5,
                3
            );

            return yield* Manager.Snapshot;
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        const Root = State.Workspaces[0]?.Root;
        expect(Root?._tag).toBe("Panel");
        expect(Root?._tag === "Panel" ? Root.Children : [ ]).toHaveLength(4);
        expect(Root?._tag === "Panel" ? Root.Ratios : [ ]).toEqual([
            2 / 7,
            1 / 7,
            1 / 14,
            0.5
        ]);
    });

    it("previews and commits a directional insertion without persisting the preview", async () =>
    {
        const WorkArea = Bounds(0, 1000, 600, 0);
        const Applied = new Array<AppliedBounds>();
        const Handles = [ Hwnd(1), Hwnd(2), Hwnd(3) ];
        const Dependencies = FakeDependencies(
            [ ],
            new Map(Handles.map((WindowValue: Handle.HWND) => [
                WindowValue,
                WorkArea
            ])),
            new Map(Handles.map((WindowValue: Handle.HWND) => [
                WindowValue,
                WorkArea
            ])),
            Applied
        );

        const ResultValue = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            yield* Manager.Tile(
                Hwnd(1),
                undefined,
                TilingTree.Orientation.Horizontal
            );
            yield* Manager.Tile(
                Hwnd(2),
                Hwnd(1),
                TilingTree.Orientation.Horizontal
            );
            Applied.length = 0;

            const PreviewBounds = yield* Manager.PreviewInsert(
                Hwnd(1),
                TilingTree.FocusDirection.Up
            );
            const PreviewSnapshot = yield* Manager.Snapshot;
            yield* Manager.Insert(
                Hwnd(3),
                Hwnd(1),
                TilingTree.FocusDirection.Up
            );

            return {
                FinalSnapshot: yield* Manager.Snapshot,
                PreviewBounds,
                PreviewSnapshot
            };
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(ResultValue.PreviewBounds).toEqual(Bounds(0, 500, 300, 0));
        expect(TilingTree.Windows(ResultValue.PreviewSnapshot.Workspaces[0]!.Root)
            .map((Value: TilingTree.ManagedWindow) => Value.Window))
            .toEqual([ Hwnd(1), Hwnd(2) ]);
        expect(TilingTree.Layout(ResultValue.FinalSnapshot).map(
            (Placement: TilingTree.Placement) => ({
                Bounds: Box.Tupled(Placement.Bounds),
                Window: Placement.Window
            })
        )).toEqual([
            { Bounds: [ 0, 500, 300, 0 ], Window: Hwnd(3) },
            { Bounds: [ 300, 500, 600, 0 ], Window: Hwnd(1) },
            { Bounds: [ 0, 1000, 600, 500 ], Window: Hwnd(2) }
        ]);
        expect(Applied).toContainEqual({
            Bounds: Bounds(300, 500, 600, 0),
            Window: Hwnd(1)
        });
    });

    it("reconciles stack panels in their persisted top-to-bottom order", async () =>
    {
        const WorkArea = Bounds(0, 1200, 600, 0);
        const Handles = [ Hwnd(1), Hwnd(2), Hwnd(3) ];
        const Applied = new Array<AppliedBounds>();
        const AppliedZOrders = new Array<AppliedZOrder>();
        const Dependencies = FakeDependencies(
            [ ],
            new Map(Handles.map((WindowValue: Handle.HWND) => [
                WindowValue,
                WorkArea
            ])),
            new Map(Handles.map((WindowValue: Handle.HWND) => [
                WindowValue,
                WorkArea
            ])),
            Applied,
            AppliedZOrders
        );

        const State = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;

            for (const WindowValue of Handles)
            {
                yield* Manager.Tile(
                    WindowValue,
                    undefined,
                    TilingTree.Orientation.Horizontal
                );
            }

            yield* Manager.SetPanelOrientation(
                TilingTree.WorkspaceId(WorkArea),
                [ ],
                TilingTree.Orientation.Stack
            );
            AppliedZOrders.length = 0;
            yield* Manager.BringStackWindowToFront(Hwnd(3));
            return yield* Manager.Snapshot;
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        const Root = State.Workspaces[0]?.Root;
        expect(Root?._tag === "Panel"
            ? TilingTree.Windows(Root).map(
                (Value: TilingTree.ManagedWindow) => Value.Window
            )
            : [ ]).toEqual([ Hwnd(3), Hwnd(1), Hwnd(2) ]);
        expect(TilingTree.Layout(State).map((Placement: TilingTree.Placement) => ({
            Bounds: Box.Tupled(Placement.Bounds),
            Window: Placement.Window
        }))).toEqual([
            { Bounds: [ 0, 1200, 600, 0 ], Window: Hwnd(3) },
            { Bounds: [ 0, 1200, 600, 0 ], Window: Hwnd(1) },
            { Bounds: [ 0, 1200, 600, 0 ], Window: Hwnd(2) }
        ]);
        expect(AppliedZOrders).toEqual([
            { PrecedingWindow: Hwnd(3), Window: Hwnd(1) },
            { PrecedingWindow: Hwnd(1), Window: Hwnd(2) }
        ]);
    });

    it("reparents managed windows across monitor workspaces", async () =>
    {
        const Primary = Bounds(0, 1000, 800, 0);
        const Secondary = Bounds(0, 1800, 800, 1000);
        const Applied = new Array<AppliedBounds>();
        const Dependencies = FakeDependencies(
            [ Hwnd(1), Hwnd(2) ],
            new Map([
                [ Hwnd(1), Primary ],
                [ Hwnd(2), Secondary ]
            ]),
            new Map([
                [ Hwnd(1), Primary ],
                [ Hwnd(2), Secondary ]
            ]),
            Applied
        );

        const State = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            yield* Manager.TileExistingWindows;
            yield* Manager.Move(Hwnd(1), Hwnd(2), TilingTree.Orientation.Vertical);
            return yield* Manager.Snapshot;
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(State.Workspaces).toHaveLength(1);
        expect(TilingTree.Layout(State).map((Placement: TilingTree.Placement) => ({
            Bounds: Box.Tupled(Placement.Bounds),
            Window: Placement.Window
        }))).toEqual([
            { Bounds: [ 0, 1800, 400, 1000 ], Window: Hwnd(2) },
            { Bounds: [ 400, 1800, 800, 1000 ], Window: Hwnd(1) }
        ]);
    });

    it("reorders, nests, and promotes windows within a tiled workspace", async () =>
    {
        const WorkArea = Bounds(0, 1200, 600, 0);
        const Handles = [ Hwnd(1), Hwnd(2), Hwnd(3), Hwnd(4) ];
        const Applied = new Array<AppliedBounds>();
        const Dependencies = FakeDependencies(
            [ ],
            new Map(Handles.map((WindowValue: Handle.HWND) => [
                WindowValue,
                WorkArea
            ])),
            new Map(Handles.map((WindowValue: Handle.HWND) => [
                WindowValue,
                WorkArea
            ])),
            Applied
        );

        const ResultValue = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            yield* Manager.Tile(Hwnd(1), undefined, TilingTree.Orientation.Horizontal);
            yield* Manager.Tile(Hwnd(2), undefined, TilingTree.Orientation.Horizontal);
            yield* Manager.Tile(Hwnd(3), undefined, TilingTree.Orientation.Horizontal);
            yield* Manager.MoveToIndex(Hwnd(3), 0);
            yield* Manager.Tile(
                Hwnd(4),
                Hwnd(2),
                TilingTree.Orientation.Vertical
            );
            yield* Manager.MoveIntoPanel(Hwnd(1), [ 2 ]);
            const Nested = yield* Manager.Snapshot;
            yield* Manager.MoveToContainingPanel(Hwnd(2));

            return {
                Nested,
                Promoted: yield* Manager.Snapshot
            };
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(TilingTree.Windows(ResultValue.Nested.Workspaces[0]!.Root)
            .map((Value: TilingTree.ManagedWindow) => Value.Window))
            .toEqual([ Hwnd(3), Hwnd(1), Hwnd(2), Hwnd(4) ]);
        expect(TilingTree.FindWindowPath(
            ResultValue.Nested.Workspaces[0]!.Root,
            Hwnd(1)
        )).toEqual([ 1, 0 ]);
        expect(TilingTree.Windows(ResultValue.Promoted.Workspaces[0]!.Root)
            .map((Value: TilingTree.ManagedWindow) => Value.Window))
            .toEqual([ Hwnd(3), Hwnd(1), Hwnd(4), Hwnd(2) ]);
        expect(TilingTree.FindWindowPath(
            ResultValue.Promoted.Workspaces[0]!.Root,
            Hwnd(2)
        )).toEqual([ 2 ]);
        expect(Applied.length).toBeGreaterThan(0);
    });

    it("preserves original bounds when refresh discovers a monitor change", async () =>
    {
        const Primary = Bounds(0, 1000, 800, 0);
        const Secondary = Bounds(0, 1800, 800, 1000);
        const FirstInitial = Bounds(100, 800, 700, 100);
        const InitialBounds = new Map<Handle.HWND, Box.Box>([
            [ Hwnd(1), FirstInitial ],
            [ Hwnd(2), Secondary ]
        ]);
        const WorkAreas = new Map<Handle.HWND, Box.Box>([
            [ Hwnd(1), Primary ],
            [ Hwnd(2), Secondary ]
        ]);
        const Dependencies = FakeDependencies(
            [ Hwnd(1), Hwnd(2) ],
            InitialBounds,
            WorkAreas,
            [ ]
        );

        const Managed = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            yield* Manager.TileExistingWindows;
            InitialBounds.set(Hwnd(1), Bounds(0, 1400, 400, 1000));
            WorkAreas.set(Hwnd(1), Secondary);
            yield* Manager.Refresh;
            const State = yield* Manager.Snapshot;
            return TilingTree.Windows(State.Workspaces[0]!.Root).find(
                (Value: TilingTree.ManagedWindow): boolean => Value.Window === Hwnd(1)
            );
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(Managed).toBeDefined();
        expect(Box.Tupled(Managed!.InitialBounds)).toEqual(Box.Tupled(FirstInitial));
    });
});
