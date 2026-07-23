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

import * as TilingManager from "../Source/Main/TilingManager.js";
import * as TilingTree from "../Source/Main/TilingTree.js";
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

const FakeDependencies = (
    Handles: ReadonlyArray<Handle.HWND>,
    InitialBounds: ReadonlyMap<Handle.HWND, Box.Box>,
    WorkAreas: ReadonlyMap<Handle.HWND, Box.Box>,
    Applied: Array<AppliedBounds>
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
    }
});

describe("TilingManager", () =>
{
    it("adopts and tiles existing windows when its scoped layer starts", async () =>
    {
        const Primary = Bounds(0, 1200, 800, 0);
        const Secondary = Bounds(0, 2200, 800, 1200);
        const Handles = [ Hwnd(1), Hwnd(2), Hwnd(3) ];
        const Applied = new Array<AppliedBounds>();
        const Dependencies = FakeDependencies(
            Handles,
            new Map([
                [ Hwnd(1), Bounds(0, 600, 800, 0) ],
                [ Hwnd(2), Bounds(0, 1200, 800, 600) ],
                [ Hwnd(3), Secondary ]
            ]),
            new Map([
                [ Hwnd(1), Primary ],
                [ Hwnd(2), Primary ],
                [ Hwnd(3), Secondary ]
            ]),
            Applied
        );

        const State = await Effect.runPromise(Effect.gen(function*()
        {
            const Manager = yield* TilingManager.TilingManager;
            return yield* Manager.Snapshot;
        }).pipe(Effect.provide(TilingManager.MakeLive(Dependencies))));

        expect(State.Workspaces).toHaveLength(2);
        expect(Applied.map((Placement: AppliedBounds) => ({
            Bounds: Box.Tupled(Placement.Bounds),
            Window: Placement.Window
        }))).toEqual([
            { Bounds: [ 0, 600, 800, 0 ], Window: Hwnd(1) },
            { Bounds: [ 0, 1200, 800, 600 ], Window: Hwnd(2) },
            { Bounds: [ 0, 2200, 800, 1200 ], Window: Hwnd(3) }
        ]);
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
            yield* Manager.Manage(
                Hwnd(2),
                Hwnd(1),
                TilingTree.Orientation.Horizontal
            );
            yield* Manager.SetPanelRatio(TilingTree.WorkspaceId(WorkArea), [ ], 0.25);
            const SplitState = yield* Manager.Snapshot;
            yield* Manager.Unmanage(Hwnd(1), true);

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
