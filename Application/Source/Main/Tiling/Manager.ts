/**
 * Runtime ownership and native reconciliation of multi-child tiling state.
 *
 * @module @sorrell/wm/Main/Tiling/Manager
 *
 * @file      Manager.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as TilingTree from "./Tree.ts";
import { Context, Data, Effect, Layer, Option, Ref, SubscriptionRef } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import type {
    ResizeRecoveryStrategy,
    TiledResizeBehavior
} from "../../Shared/AppSettings.ts";
import type { Result, Stream } from "effect";
import { Box } from "@sorrell/math";
import type { SimpleError } from "../Utility/Error.ts";
import { WithCategory } from "@sorrell/log/Effect";

export/** The type identifier of this module. */
const TypeId = "~sorrell/wm/Main/Tiling/Manager" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/** Native operations used by a tiling manager. */
export interface Dependencies
{
    /** Enumerate application windows that are eligible for management. */
    readonly Enumerate: () => Result.Result<ReadonlyArray<Handle.HWND>, SimpleError>;

    /** Read a top-level window's current bounds. */
    readonly GetWindowRect: (WindowValue: Handle.HWND) => Option.Option<Box.Box>;

    /** Read the work area containing a top-level window. */
    readonly GetWindowWorkArea: (WindowValue: Handle.HWND) => Option.Option<Box.Box>;

    /** Apply an outer rectangle to a top-level window. */
    readonly SetWindowRect: (
        WindowValue: Handle.HWND,
        Bounds: Box.Box
    ) => Result.Result<void, SimpleError>;

    /** Place one window immediately behind another without activating it. */
    readonly SetWindowZOrderAfter?: (
        WindowValue: Handle.HWND,
        PrecedingWindow: Handle.HWND
    ) => Result.Result<void, SimpleError>;
}

/** A failure to enumerate native windows during discovery. */
export class WindowEnumerationError extends Data.TaggedError("WindowEnumerationError")<{
    readonly Message: string;
}> { }

/** A window disappeared or stopped exposing the metadata required for management. */
export class WindowMetadataUnavailableError extends
    Data.TaggedError("WindowMetadataUnavailableError")<{
        readonly Window: Handle.HWND;
    }> { }

/** A native window could not be moved to its assigned tile. */
export class WindowLayoutError extends Data.TaggedError("WindowLayoutError")<{
    readonly Bounds: Box.Box;
    readonly Message: string;
    readonly Window: Handle.HWND;
}> { }

/**
 * Represents a tiled mutation that was rolled back because a native window remained larger
 * than requested.
 *
 * @category Error
 * @since 0.1.0
 */
export class ResizeRecoveryCanceledError extends
    Data.TaggedError("ResizeRecoveryCanceledError")<{
        readonly ActualBounds: Box.Box;
        readonly DesiredBounds: Box.Box;
        readonly Window: Handle.HWND;
    }> { }

/** A requested tiling workspace does not exist. */
export class WorkspaceNotFoundError extends Data.TaggedError("WorkspaceNotFoundError")<{
    readonly WorkspaceId: string;
}> { }

/** A requested path does not identify a panel in its workspace. */
export class PanelNotFoundError extends Data.TaggedError("PanelNotFoundError")<{
    readonly Path: TilingTree.Path;
    readonly WorkspaceId: string;
}> { }

/** A requested native window is not present in the tiling state. */
export class WindowNotManagedError extends Data.TaggedError("WindowNotManagedError")<{
    readonly Window: Handle.HWND;
}> { }

/** Errors produced while discovering, mutating, or reconciling tiled windows. */
export type TilingManagerError =
    | PanelNotFoundError
    | ResizeRecoveryCanceledError
    | WindowEnumerationError
    | WindowLayoutError
    | WindowMetadataUnavailableError
    | WindowNotManagedError
    | WorkspaceNotFoundError;

/** Stateful operations exposed by the application tiling manager. */
export interface TilingManagerImpl
{
    /** Every current and future immutable tiling state. */
    readonly Changes: Stream.Stream<TilingTree.State>;

    /** Read the current immutable tiling state. */
    readonly Snapshot: Effect.Effect<TilingTree.State>;

    /** Read the gap currently applied to tiled-window layout. */
    readonly Gap: Effect.Effect<number>;

    /** Reapply the current tree's calculated rectangles to native windows. */
    readonly Reconcile: Effect.Effect<void, WindowLayoutError>;

    /** Bring a managed window to the front of every stack panel that contains it. */
    readonly BringStackWindowToFront: (
        WindowValue: Handle.HWND
    ) => Effect.Effect<void, WindowLayoutError | WindowNotManagedError>;

    /** Resize a managed window or containing branch along one panel axis. */
    readonly Resize: (
        WindowValue: Handle.HWND,
        Direction: TilingTree.FocusDirection,
        DeltaPixels: number,
        Behavior: TiledResizeBehavior,
        RecoveryStrategy?: ResizeRecoveryStrategy
    ) => Effect.Effect<
        void,
        ResizeRecoveryCanceledError | WindowLayoutError | WindowNotManagedError
    >;

    /** Change the tiled-window gap and immediately reconcile native windows. */
    readonly SetGap: (Gap: number) => Effect.Effect<void, WindowLayoutError>;

    /** Discover current native windows and merge them into the managed state. */
    readonly Refresh: Effect.Effect<
        void,
        WindowEnumerationError | WindowLayoutError
    >;

    /**
     * Adopt every discoverable floating window into its monitor's root panel.
     * This is a no-op while any monitor root already contains tiled content.
     */
    readonly TileExistingWindows: Effect.Effect<
        void,
        WindowEnumerationError | WindowLayoutError
    >;

    /** Add one native window to its monitor's workspace. */
    readonly Tile: (
        WindowValue: Handle.HWND,
        Target?: Handle.HWND,
        Orientation?: TilingTree.Orientation
    ) => Effect.Effect<void, WindowLayoutError | WindowMetadataUnavailableError>;

    /** Preview the layout produced by inserting beside a tiled window. */
    readonly PreviewInsert: (
        Target: Handle.HWND,
        Direction: TilingTree.FocusDirection,
        RecoveryStrategy?: ResizeRecoveryStrategy
    ) => Effect.Effect<
        Box.Box,
        ResizeRecoveryCanceledError | WindowLayoutError | WindowNotManagedError
    >;

    /** Insert one floating window into a directional half of a tiled window. */
    readonly Insert: (
        WindowValue: Handle.HWND,
        Target: Handle.HWND,
        Direction: TilingTree.FocusDirection,
        RecoveryStrategy?: ResizeRecoveryStrategy
    ) => Effect.Effect<
        void,
        | ResizeRecoveryCanceledError
        | WindowLayoutError
        | WindowMetadataUnavailableError
        | WindowNotManagedError
    >;

    /** Reparent a managed window beside another leaf, including across workspaces. */
    readonly Move: (
        WindowValue: Handle.HWND,
        Target: Handle.HWND,
        Orientation?: TilingTree.Orientation,
        RecoveryStrategy?: ResizeRecoveryStrategy
    ) => Effect.Effect<
        void,
        ResizeRecoveryCanceledError | WindowLayoutError | WindowNotManagedError
    >;

    /** Move a managed window into an adjacent sibling panel as child zero. */
    readonly MoveIntoPanel: (
        WindowValue: Handle.HWND,
        TargetPanelPath: TilingTree.Path,
        RecoveryStrategy?: ResizeRecoveryStrategy
    ) => Effect.Effect<
        void,
        ResizeRecoveryCanceledError | WindowLayoutError | WindowNotManagedError
    >;

    /** Move a managed window to a child index in its current panel. */
    readonly MoveToIndex: (
        WindowValue: Handle.HWND,
        TargetIndex: number,
        RecoveryStrategy?: ResizeRecoveryStrategy
    ) => Effect.Effect<
        void,
        ResizeRecoveryCanceledError | WindowLayoutError | WindowNotManagedError
    >;

    /** Promote a managed window one panel level. */
    readonly MoveToContainingPanel: (
        WindowValue: Handle.HWND,
        RecoveryStrategy?: ResizeRecoveryStrategy
    ) => Effect.Effect<
        void,
        ResizeRecoveryCanceledError | WindowLayoutError | WindowNotManagedError
    >;

    /** Remove one native window, optionally restoring its pre-management bounds. */
    readonly Float: (
        WindowValue: Handle.HWND,
        RestoreInitialBounds?: boolean
    ) => Effect.Effect<void, WindowLayoutError | WindowNotManagedError>;

    /** Change one panel child's ratio and immediately reconcile its workspace. */
    readonly SetPanelRatio: (
        WorkspaceId: string,
        Path: TilingTree.Path,
        Ratio: number,
        ChildIndex?: number
    ) => Effect.Effect<
        void,
        PanelNotFoundError | WindowLayoutError | WorkspaceNotFoundError
    >;

    /** Change a panel's child arrangement and immediately reconcile its workspace. */
    readonly SetPanelOrientation: (
        WorkspaceId: string,
        Path: TilingTree.Path,
        Orientation: TilingTree.Orientation
    ) => Effect.Effect<
        void,
        PanelNotFoundError | WindowLayoutError | WorkspaceNotFoundError
    >;
}

/** Application-scoped owner of the native tiled-window graph. */
export class TilingManager extends
    Context.Service<TilingManager, TilingManagerImpl>()(TypeId) { }

const EmptyState: TilingTree.State = Object.freeze({
    Workspaces: Object.freeze(new Array<TilingTree.Workspace>())
});

const InsertPreviewWindow = 0n as Handle.HWND;

const LogTilingDebug = (
    Message: string,
    Annotations: Readonly<Record<string, unknown>> = { }
): Effect.Effect<void> => Effect.logDebug(Message).pipe(
    Effect.annotateLogs(Annotations),
    WithCategory("Tiling")
);

const LogTilingInfo = (
    Message: string,
    Annotations: Readonly<Record<string, unknown>> = { }
): Effect.Effect<void> => Effect.logInfo(Message).pipe(
    Effect.annotateLogs(Annotations),
    WithCategory("Tiling")
);

const DirectionForBounds = (Bounds: Box.Box): TilingTree.Orientation =>
    Box.Width(Bounds) >= Box.Height(Bounds)
        ? TilingTree.Orientation.Horizontal
        : TilingTree.Orientation.Vertical;

const FreezeWorkspace = (
    Workspace: TilingTree.Workspace,
    Root: TilingTree.Node | null = Workspace.Root
): TilingTree.Workspace => Object.freeze({
    Bounds: Workspace.Bounds,
    Id: Workspace.Id,
    Root
});

const FreezeState = (
    Workspaces: ReadonlyArray<TilingTree.Workspace>
): TilingTree.State => Object.freeze({
    Workspaces: Object.freeze([ ...Workspaces ].sort((
        Left: TilingTree.Workspace,
        Right: TilingTree.Workspace
    ): number => Left.Bounds.Top - Right.Bounds.Top || Left.Bounds.Left - Right.Bounds.Left))
});

const FindManagedWindow = (
    State: TilingTree.State,
    WindowValue: Handle.HWND
): TilingTree.ManagedWindow | undefined =>
{
    for (const Workspace of State.Workspaces)
    {
        const Found = TilingTree.Windows(Workspace.Root).find(
            (Value: TilingTree.ManagedWindow): boolean => Value.Window === WindowValue
        );

        if (Found !== undefined)
        {
            return Found;
        }
    }

    return undefined;
};

const RemoveManagedWindow = (
    State: TilingTree.State,
    WindowValue: Handle.HWND
): TilingTree.State => FreezeState(State.Workspaces.flatMap(
    (Workspace: TilingTree.Workspace): ReadonlyArray<TilingTree.Workspace> =>
    {
        const Root = TilingTree.RemoveWindow(Workspace.Root, WindowValue);
        return Root === null ? [ ] : [ FreezeWorkspace(Workspace, Root) ];
    }
));

const ReadWindowSeed = (
    DependenciesValue: Dependencies,
    WindowValue: Handle.HWND
): Option.Option<TilingTree.WindowSeed> =>
{
    const InitialBounds = DependenciesValue.GetWindowRect(WindowValue);
    const WorkArea = DependenciesValue.GetWindowWorkArea(WindowValue);

    return Option.isSome(InitialBounds) && Option.isSome(WorkArea)
        ? Option.some(Object.freeze({
            InitialBounds: InitialBounds.value,
            Window: WindowValue,
            WorkArea: WorkArea.value
        }))
        : Option.none();
};

const MergeDiscoveredWindows = (
    Current: TilingTree.State,
    Seeds: ReadonlyArray<TilingTree.WindowSeed>
): TilingTree.State =>
{
    const SeedsByWindow = new Map<Handle.HWND, TilingTree.WindowSeed>(
        Seeds.map((Seed: TilingTree.WindowSeed) => [ Seed.Window, Seed ])
    );
    const PreviouslyManaged = new Map<Handle.HWND, TilingTree.ManagedWindow>(
        Current.Workspaces.flatMap((Workspace: TilingTree.Workspace) =>
            TilingTree.Windows(Workspace.Root).map(
                (Managed: TilingTree.ManagedWindow) => [ Managed.Window, Managed ] as const
            ))
    );
    let Next = Current;

    for (const Workspace of Current.Workspaces)
    {
        for (const Managed of TilingTree.Windows(Workspace.Root))
        {
            const Seed = SeedsByWindow.get(Managed.Window);
            if (
                Seed === undefined ||
                TilingTree.WorkspaceId(Seed.WorkArea) !== Workspace.Id
            )
            {
                Next = RemoveManagedWindow(Next, Managed.Window);
            }
        }
    }

    const Workspaces = [ ...Next.Workspaces ];
    const ManagedHandles = new Set<Handle.HWND>(Workspaces.flatMap(
        (Workspace: TilingTree.Workspace) => TilingTree.Windows(Workspace.Root)
            .map((Managed: TilingTree.ManagedWindow) => Managed.Window)
    ));

    for (const Seed of Seeds)
    {
        if (ManagedHandles.has(Seed.Window))
        {
            continue;
        }

        const Id = TilingTree.WorkspaceId(Seed.WorkArea);
        const Managed = PreviouslyManaged.get(Seed.Window) ?? Seed;
        const Index = Workspaces.findIndex(
            (Workspace: TilingTree.Workspace): boolean => Workspace.Id === Id
        );

        if (Index < 0)
        {
            Workspaces.push(Object.freeze({
                Bounds: Seed.WorkArea,
                Id,
                Root: TilingTree.Window(Managed)
            }));
        }
        else
        {
            const Workspace = Workspaces[Index]!;
            Workspaces[Index] = FreezeWorkspace(
                Workspace,
                TilingTree.InsertWindow(
                    Workspace.Root,
                    Managed,
                    DirectionForBounds(Workspace.Bounds)
                )
            );
        }

        ManagedHandles.add(Seed.Window);
    }

    return FreezeState(Workspaces);
};

const UpdateWorkspace = (
    Current: TilingTree.State,
    WorkspaceId: string,
    Transform: (Root: TilingTree.Node) => readonly [ TilingTree.Node, boolean ],
    Path: TilingTree.Path
): Effect.Effect<TilingTree.State, PanelNotFoundError | WorkspaceNotFoundError> =>
{
    const Index = Current.Workspaces.findIndex(
        (Workspace: TilingTree.Workspace): boolean => Workspace.Id === WorkspaceId
    );

    if (Index < 0)
    {
        return Effect.fail(new WorkspaceNotFoundError({ WorkspaceId }));
    }

    const Workspace = Current.Workspaces[Index]!;
    if (Workspace.Root === null)
    {
        return Effect.fail(new PanelNotFoundError({ Path, WorkspaceId }));
    }

    const [ Root, Updated ] = Transform(Workspace.Root);
    if (!Updated)
    {
        return Effect.fail(new PanelNotFoundError({ Path, WorkspaceId }));
    }

    const Workspaces = [ ...Current.Workspaces ];
    Workspaces[Index] = FreezeWorkspace(Workspace, Root);
    return Effect.succeed(FreezeState(Workspaces));
};

const UpdateManagedWindowWorkspace = (
    Current: TilingTree.State,
    WindowValue: Handle.HWND,
    Transform: (Root: TilingTree.Node) => readonly [ TilingTree.Node, boolean ]
): Effect.Effect<TilingTree.State, WindowNotManagedError> =>
{
    const WorkspaceIndex = Current.Workspaces.findIndex(
        (Workspace: TilingTree.Workspace): boolean =>
            TilingTree.HasWindow(Workspace.Root, WindowValue)
    );

    if (WorkspaceIndex < 0)
    {
        return Effect.fail(new WindowNotManagedError({ Window: WindowValue }));
    }

    const Workspace = Current.Workspaces[WorkspaceIndex]!;
    if (Workspace.Root === null)
    {
        return Effect.fail(new WindowNotManagedError({ Window: WindowValue }));
    }

    const [ Root, Updated ] = Transform(Workspace.Root);
    if (!Updated)
    {
        return Effect.succeed(Current);
    }

    const Workspaces = [ ...Current.Workspaces ];
    Workspaces[WorkspaceIndex] = FreezeWorkspace(Workspace, Root);
    return Effect.succeed(FreezeState(Workspaces));
};

export/** Construct a tiling-manager layer using injectable native-window operations. */
const MakeLive = (
    DependenciesValue: Dependencies
): Layer.Layer<TilingManager> => Layer.effect(
    TilingManager,
    Effect.gen(function*()
    {
        const StateRef = yield* SubscriptionRef.make<TilingTree.State>(EmptyState);
        const GapRef = yield* Ref.make(0);

        interface ResizeMismatch
        {
            readonly ActualBounds: Box.Box;
            readonly DesiredBounds: Box.Box;
            readonly Window: Handle.HWND;
        }

        const Apply = (
            State: TilingTree.State,
            IgnoredWindow?: Handle.HWND,
            VerifyResizes: boolean = false
        ): Effect.Effect<ReadonlyArray<ResizeMismatch>, WindowLayoutError> => Effect.gen(function*()
        {
            const Gap = yield* Ref.get(GapRef);
            const Placements = TilingTree.Layout(State, Gap).filter(
                (Placement: TilingTree.Placement): boolean =>
                    Placement.Window !== IgnoredWindow
            );
            yield* LogTilingDebug("Reconciling tiled-window geometry.", {
                Gap,
                WindowCount: Placements.length,
                WorkspaceCount: State.Workspaces.length
            });
            const Mismatches = yield* Effect.forEach(
                Placements,
                (Placement: TilingTree.Placement) => Effect.gen(function*()
                {
                    const Before = VerifyResizes
                        ? DependenciesValue.GetWindowRect(Placement.Window)
                        : Option.none<Box.Box>();
                    yield* Effect.sync(() =>
                        DependenciesValue.SetWindowRect(Placement.Window, Placement.Bounds)
                    ).pipe(
                        Effect.flatMap(Effect.fromResult),
                        Effect.mapError((Failure: SimpleError) => new WindowLayoutError({
                            Bounds: Placement.Bounds,
                            Message: Failure.Message,
                            Window: Placement.Window
                        }))
                    );

                    if (
                        !VerifyResizes
                        || Option.isNone(Before)
                        || (
                            Box.Width(Before.value) === Box.Width(Placement.Bounds)
                            && Box.Height(Before.value) === Box.Height(Placement.Bounds)
                        )
                    )
                    {
                        return Option.none<ResizeMismatch>();
                    }

                    let Actual = DependenciesValue.GetWindowRect(Placement.Window);
                    if (
                        Option.isSome(Actual)
                        && Box.Width(Actual.value) === Box.Width(Before.value)
                        && Box.Height(Actual.value) === Box.Height(Before.value)
                        && (
                            Box.Width(Actual.value) !== Box.Width(Placement.Bounds)
                            || Box.Height(Actual.value) !== Box.Height(Placement.Bounds)
                        )
                    )
                    {
                        yield* Effect.sleep("50 millis");
                        Actual = DependenciesValue.GetWindowRect(Placement.Window);
                    }

                    if (
                        Option.isNone(Actual)
                        || (
                            Box.Width(Actual.value) <= Box.Width(Placement.Bounds)
                            && Box.Height(Actual.value) <= Box.Height(Placement.Bounds)
                        )
                    )
                    {
                        return Option.none<ResizeMismatch>();
                    }

                    return Option.some({
                        ActualBounds: Actual.value,
                        DesiredBounds: Placement.Bounds,
                        Window: Placement.Window
                    });
                }),
                { concurrency: 1 }
            );

            if (DependenciesValue.SetWindowZOrderAfter !== undefined)
            {
                const BoundsByWindow = new Map(
                    Placements.map((Placement: TilingTree.Placement) =>
                        [ Placement.Window, Placement.Bounds ] as const)
                );

                yield* Effect.forEach(
                    TilingTree.StackWindowOrders(State),
                    (Order: TilingTree.StackWindowOrder) =>
                    {
                        const Windows = Order.Windows.filter(
                            (WindowValue: Handle.HWND): boolean =>
                                WindowValue !== IgnoredWindow
                        );

                        return Effect.forEach(
                            Windows.slice(1),
                            (
                                WindowValue: Handle.HWND,
                                Index: number
                            ) => Effect.sync(() =>
                                DependenciesValue.SetWindowZOrderAfter!(
                                    WindowValue,
                                    Windows[Index]!
                                )
                            ).pipe(
                                Effect.flatMap(Effect.fromResult),
                                Effect.mapError((Failure: SimpleError) =>
                                    new WindowLayoutError({
                                        Bounds: BoundsByWindow.get(WindowValue)
                                        ?? Box.Box(0, 0, 0, 0),
                                        Message: Failure.Message,
                                        Window: WindowValue
                                    }))
                            ),
                            { discard: true }
                        );
                    },
                    { discard: true }
                );
            }

            yield* LogTilingDebug("Tiled-window geometry reconciled.", {
                WindowCount: Placements.length
            });

            return Mismatches.flatMap((Mismatch: Option.Option<ResizeMismatch>) =>
                Option.isSome(Mismatch) ? [ Mismatch.value ] : [ ]);
        });

        const AdjustForActualBounds = (
            State: TilingTree.State,
            Mismatches: ReadonlyArray<ResizeMismatch>
        ): Effect.Effect<TilingTree.State> => Effect.gen(function*()
        {
            const Gap = yield* Ref.get(GapRef);
            let Adjusted = State;

            for (const Mismatch of Mismatches)
            {
                const DeltaWidth = Box.Width(Mismatch.ActualBounds)
                    - Box.Width(Mismatch.DesiredBounds);
                const DeltaHeight = Box.Height(Mismatch.ActualBounds)
                    - Box.Height(Mismatch.DesiredBounds);

                for (const Adjustment of [
                    {
                        Delta: DeltaWidth,
                        Direction: TilingTree.FocusDirection.Right
                    },
                    {
                        Delta: DeltaHeight,
                        Direction: TilingTree.FocusDirection.Down
                    }
                ] as const)
                {
                    if (Adjustment.Delta <= 0)
                    {
                        continue;
                    }

                    const BeforeAdjustment = Adjusted;
                    Adjusted = yield* UpdateManagedWindowWorkspace(
                        BeforeAdjustment,
                        Mismatch.Window,
                        (Root: TilingTree.Node) =>
                        {
                            const Workspace = BeforeAdjustment.Workspaces.find(
                                (Candidate: TilingTree.Workspace): boolean =>
                                    TilingTree.HasWindow(Candidate.Root, Mismatch.Window)
                            )!;

                            return TilingTree.ResizeWindow(
                                Root,
                                Workspace.Bounds,
                                Mismatch.Window,
                                Adjustment.Direction,
                                Adjustment.Delta,
                                "PreserveRatios",
                                Gap
                            );
                        }
                    ).pipe(Effect.orElseSucceed(() => BeforeAdjustment));
                }
            }

            return Adjusted;
        });

        const ApplyWithRecovery = (
            Previous: TilingTree.State,
            Proposed: TilingTree.State,
            IgnoredWindow?: Handle.HWND,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ): Effect.Effect<
            TilingTree.State,
            ResizeRecoveryCanceledError | WindowLayoutError
        > => Effect.gen(function*()
        {
            if (RecoveryStrategy === undefined)
            {
                yield* Apply(Proposed, IgnoredWindow);
                return Proposed;
            }

            let Current = Proposed;
            for (let Attempt = 0; Attempt < 8; Attempt += 1)
            {
                const Mismatches = yield* Apply(Current, IgnoredWindow, true);
                if (Mismatches.length === 0 || RecoveryStrategy._tag === "Ignore")
                {
                    return Current;
                }

                const First = Mismatches[0]!;
                const Threshold = RecoveryStrategy._tag === "Continue"
                    ? RecoveryStrategy.Threshold
                    : undefined;
                const IsBelowThreshold = Threshold !== undefined
                    && Mismatches.some((Mismatch: ResizeMismatch): boolean =>
                        Box.Width(Mismatch.ActualBounds) < Threshold
                        || Box.Height(Mismatch.ActualBounds) < Threshold);

                if (RecoveryStrategy._tag === "Cancel" || IsBelowThreshold)
                {
                    yield* Apply(Previous);
                    return yield* new ResizeRecoveryCanceledError({
                        ActualBounds: First.ActualBounds,
                        DesiredBounds: First.DesiredBounds,
                        Window: First.Window
                    });
                }

                const Adjusted = yield* AdjustForActualBounds(Current, Mismatches);
                if (Adjusted === Current)
                {
                    return Current;
                }
                Current = Adjusted;
            }

            yield* Apply(Current, IgnoredWindow);
            return Current;
        });

        const Commit = <ErrorType>(
            Transform: (
                Current: TilingTree.State
            ) => Effect.Effect<TilingTree.State, ErrorType>
        ): Effect.Effect<void, ErrorType | WindowLayoutError> => SubscriptionRef.modifyEffect(
            StateRef,
            (Current: TilingTree.State) => Transform(Current).pipe(
                Effect.tap(Apply),
                Effect.map((Next: TilingTree.State) => [ undefined, Next ] as const)
            )
        );

        const CommitWithRecovery = <ErrorType>(
            Transform: (
                Current: TilingTree.State
            ) => Effect.Effect<TilingTree.State, ErrorType>,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ): Effect.Effect<
            void,
            ErrorType | ResizeRecoveryCanceledError | WindowLayoutError
        > => RecoveryStrategy === undefined
            ? Commit(Transform)
            : SubscriptionRef.modifyEffect(
                StateRef,
                (Current: TilingTree.State) => Transform(Current).pipe(
                    Effect.flatMap((Next: TilingTree.State) => ApplyWithRecovery(
                        Current,
                        Next,
                        undefined,
                        RecoveryStrategy
                    )),
                    Effect.map((Next: TilingTree.State) => [ undefined, Next ] as const)
                )
            );

        const Discover = Effect.sync(DependenciesValue.Enumerate).pipe(
            Effect.flatMap(Effect.fromResult),
            Effect.mapError((Failure: SimpleError) => new WindowEnumerationError({
                Message: Failure.Message
            })),
            Effect.flatMap((Handles: ReadonlyArray<Handle.HWND>) => Effect.forEach(
                Handles,
                (WindowValue: Handle.HWND) => Effect.gen(function*()
                {
                    const Seed = ReadWindowSeed(DependenciesValue, WindowValue);
                    if (Option.isNone(Seed))
                    {
                        yield* LogTilingDebug(
                            "Skipped a native window whose tiling metadata was unavailable.",
                            { Window: WindowValue }
                        );
                    }

                    return Seed;
                })
            ).pipe(Effect.map((
                Seeds: ReadonlyArray<Option.Option<TilingTree.WindowSeed>>
            ) => Seeds.flatMap(
                (Seed: Option.Option<TilingTree.WindowSeed>): ReadonlyArray<
                    TilingTree.WindowSeed
                > =>
                    Option.isSome(Seed) ? [ Seed.value ] : [ ]
            ))))
        );

        const Refresh = Effect.flatMap(
            Discover,
            (Seeds: ReadonlyArray<TilingTree.WindowSeed>) => Commit(
                (Current: TilingTree.State) => Effect.succeed(
                    Current.Workspaces.length === 0
                        ? TilingTree.FromWindowSeeds(Seeds)
                        : MergeDiscoveredWindows(Current, Seeds)
                )
            )
        ).pipe(Effect.tap(() => LogTilingInfo(
            "Refreshed the tiling state from native windows."
        )));

        const TileExistingWindows = SubscriptionRef.get(StateRef).pipe(
            Effect.flatMap((Current: TilingTree.State) =>
                TilingTree.AreRootPanelsEmpty(Current)
                    ? Discover.pipe(
                        Effect.flatMap((
                            Seeds: ReadonlyArray<TilingTree.WindowSeed>
                        ) => Seeds.length === 0
                            ? LogTilingDebug(
                                "No discoverable floating windows were available to tile."
                            )
                            : Commit((Latest: TilingTree.State) => Effect.succeed(
                                TilingTree.AreRootPanelsEmpty(Latest)
                                    ? TilingTree.FromWindowSeedsAtRootPanels(Seeds)
                                    : Latest
                            )).pipe(Effect.tap(() => LogTilingInfo(
                                "Tiled existing floating windows.",
                                { WindowCount: Seeds.length }
                            ))))
                    )
                    : LogTilingDebug(
                        "Skipped tiling existing windows because a root panel is not empty."
                    ))
        );

        const Tile = (
            WindowValue: Handle.HWND,
            Target?: Handle.HWND,
            Orientation?: TilingTree.Orientation
        ) =>
        {
            const Seed = ReadWindowSeed(DependenciesValue, WindowValue);
            if (Option.isNone(Seed))
            {
                return Effect.fail(new WindowMetadataUnavailableError({ Window: WindowValue }));
            }

            return Commit((Current: TilingTree.State) =>
            {
                if (FindManagedWindow(Current, WindowValue) !== undefined)
                {
                    return Effect.succeed(Current);
                }

                const Id = TilingTree.WorkspaceId(Seed.value.WorkArea);
                const Index = Current.Workspaces.findIndex(
                    (Workspace: TilingTree.Workspace): boolean => Workspace.Id === Id
                );
                const Workspaces = [ ...Current.Workspaces ];

                if (Index < 0)
                {
                    Workspaces.push(Object.freeze({
                        Bounds: Seed.value.WorkArea,
                        Id,
                        Root: TilingTree.Window(Seed.value)
                    }));
                }
                else
                {
                    const Workspace = Workspaces[Index]!;
                    Workspaces[Index] = FreezeWorkspace(
                        Workspace,
                        TilingTree.InsertWindow(
                            Workspace.Root,
                            Seed.value,
                            Orientation ?? DirectionForBounds(Workspace.Bounds),
                            Target
                        )
                    );
                }

                return Effect.succeed(FreezeState(Workspaces));
            }).pipe(Effect.tap(() => LogTilingInfo("Tiled a native window.", {
                Orientation: Orientation ?? "Automatic",
                Target: Target ?? "None",
                Window: WindowValue
            })));
        };

        const PreviewInsert: TilingManagerImpl["PreviewInsert"] = (
            Target: Handle.HWND,
            Direction: TilingTree.FocusDirection,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ) => Effect.gen(function*()
        {
            const Current = yield* SubscriptionRef.get(StateRef);
            const WorkspaceIndex = Current.Workspaces.findIndex(
                (Workspace: TilingTree.Workspace): boolean =>
                    TilingTree.HasWindow(Workspace.Root, Target)
            );

            if (WorkspaceIndex < 0)
            {
                return yield* new WindowNotManagedError({ Window: Target });
            }

            const Workspace = Current.Workspaces[WorkspaceIndex]!;
            const Managed = FindManagedWindow(Current, Target);
            if (Workspace.Root === null || Managed === undefined)
            {
                return yield* new WindowNotManagedError({ Window: Target });
            }

            const [ Root, Inserted ] = TilingTree.InsertWindowInDirection(
                Workspace.Root,
                {
                    InitialBounds: Managed.InitialBounds,
                    Window: InsertPreviewWindow
                },
                Target,
                Direction
            );

            if (!Inserted)
            {
                return yield* new WindowNotManagedError({ Window: Target });
            }

            const Workspaces = [ ...Current.Workspaces ];
            Workspaces[WorkspaceIndex] = FreezeWorkspace(Workspace, Root);
            const PreviewState = FreezeState(Workspaces);
            const AppliedState = yield* ApplyWithRecovery(
                Current,
                PreviewState,
                InsertPreviewWindow,
                RecoveryStrategy
            );
            const Gap = yield* Ref.get(GapRef);
            const TargetPlacement = TilingTree.Layout(AppliedState, Gap).find(
                (Placement: TilingTree.Placement): boolean =>
                    Placement.Window === InsertPreviewWindow
            );

            if (TargetPlacement === undefined)
            {
                return yield* new WindowNotManagedError({ Window: Target });
            }

            yield* LogTilingInfo("Previewed a directional tiled insertion.", {
                Direction,
                Target
            });
            return TargetPlacement.Bounds;
        });

        const Insert: TilingManagerImpl["Insert"] = (
            WindowValue: Handle.HWND,
            Target: Handle.HWND,
            Direction: TilingTree.FocusDirection,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ) =>
        {
            const Seed = ReadWindowSeed(DependenciesValue, WindowValue);
            if (Option.isNone(Seed))
            {
                return Effect.fail(new WindowMetadataUnavailableError({
                    Window: WindowValue
                }));
            }

            return CommitWithRecovery((Current: TilingTree.State) =>
            {
                if (FindManagedWindow(Current, WindowValue) !== undefined)
                {
                    return Effect.succeed(Current);
                }

                return UpdateManagedWindowWorkspace(
                    Current,
                    Target,
                    (Root: TilingTree.Node) => TilingTree.InsertWindowInDirection(
                        Root,
                        Seed.value,
                        Target,
                        Direction
                    )
                );
            }, RecoveryStrategy).pipe(Effect.tap(() => LogTilingInfo(
                "Inserted a floating window into a directional tile.",
                {
                    Direction,
                    Target,
                    Window: WindowValue
                }
            )));
        };

        const Float = (
            WindowValue: Handle.HWND,
            RestoreInitialBounds: boolean = false
        ) => Effect.gen(function*()
        {
            let Removed: TilingTree.ManagedWindow | undefined;

            yield* Commit((Current: TilingTree.State) =>
            {
                Removed = FindManagedWindow(Current, WindowValue);
                return Removed === undefined
                    ? Effect.fail(new WindowNotManagedError({ Window: WindowValue }))
                    : Effect.succeed(RemoveManagedWindow(Current, WindowValue));
            });

            if (RestoreInitialBounds && Removed !== undefined)
            {
                yield* Effect.sync(() => DependenciesValue.SetWindowRect(
                    WindowValue,
                    Removed!.InitialBounds
                )).pipe(
                    Effect.flatMap(Effect.fromResult),
                    Effect.mapError((Failure: SimpleError) => new WindowLayoutError({
                        Bounds: Removed!.InitialBounds,
                        Message: Failure.Message,
                        Window: WindowValue
                    }))
                );
            }

            yield* LogTilingInfo("Floated a tiled window.", {
                RestoreInitialBounds,
                Window: WindowValue
            });
        });

        const Move: TilingManagerImpl["Move"] = (
            WindowValue: Handle.HWND,
            Target: Handle.HWND,
            Orientation?: TilingTree.Orientation,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ) => CommitWithRecovery((Current: TilingTree.State) =>
        {
            const Managed = FindManagedWindow(Current, WindowValue);
            if (Managed === undefined)
            {
                return Effect.fail(new WindowNotManagedError({ Window: WindowValue }));
            }

            if (WindowValue === Target)
            {
                return Effect.succeed(Current);
            }

            const WithoutWindow = RemoveManagedWindow(Current, WindowValue);
            const TargetIndex = WithoutWindow.Workspaces.findIndex(
                (Workspace: TilingTree.Workspace): boolean =>
                    TilingTree.HasWindow(Workspace.Root, Target)
            );

            if (TargetIndex < 0)
            {
                return Effect.fail(new WindowNotManagedError({ Window: Target }));
            }

            const Workspaces = [ ...WithoutWindow.Workspaces ];
            const Workspace = Workspaces[TargetIndex]!;
            Workspaces[TargetIndex] = FreezeWorkspace(
                Workspace,
                TilingTree.InsertWindow(
                    Workspace.Root,
                    Managed,
                    Orientation ?? DirectionForBounds(Workspace.Bounds),
                    Target
                )
            );

            return Effect.succeed(FreezeState(Workspaces));
        }, RecoveryStrategy).pipe(Effect.tap(() => LogTilingInfo(
            "Moved a tiled window beside another window.",
            {
                Orientation: Orientation ?? "Automatic",
                Target,
                Window: WindowValue
            }
        )));

        const MoveIntoPanel: TilingManagerImpl["MoveIntoPanel"] = (
            WindowValue: Handle.HWND,
            TargetPanelPath: TilingTree.Path,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ) => CommitWithRecovery((Current: TilingTree.State) => UpdateManagedWindowWorkspace(
            Current,
            WindowValue,
            (Root: TilingTree.Node) => TilingTree.MoveWindowIntoPanel(
                Root,
                WindowValue,
                TargetPanelPath
            )
        ), RecoveryStrategy).pipe(Effect.tap(() => LogTilingInfo("Moved a tiled window into a panel.", {
            TargetPanelPath,
            Window: WindowValue
        })));

        const MoveToContainingPanel: TilingManagerImpl["MoveToContainingPanel"] = (
            WindowValue: Handle.HWND,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ) => CommitWithRecovery((Current: TilingTree.State) => UpdateManagedWindowWorkspace(
            Current,
            WindowValue,
            (Root: TilingTree.Node) => TilingTree.MoveWindowToContainingPanel(
                Root,
                WindowValue
            )
        ), RecoveryStrategy).pipe(Effect.tap(() => LogTilingInfo(
            "Moved a tiled window to its containing panel.",
            { Window: WindowValue }
        )));

        const MoveToIndex: TilingManagerImpl["MoveToIndex"] = (
            WindowValue: Handle.HWND,
            TargetIndex: number,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ) => CommitWithRecovery((Current: TilingTree.State) => UpdateManagedWindowWorkspace(
            Current,
            WindowValue,
            (Root: TilingTree.Node) => TilingTree.MoveWindowToIndex(
                Root,
                WindowValue,
                TargetIndex
            )
        ), RecoveryStrategy).pipe(Effect.tap(() => LogTilingInfo("Reordered a tiled window.", {
            TargetIndex,
            Window: WindowValue
        })));

        const BringStackWindowToFront: TilingManagerImpl[
            "BringStackWindowToFront"
        ] = (WindowValue: Handle.HWND) => Commit((
            Current: TilingTree.State
        ) => UpdateManagedWindowWorkspace(
            Current,
            WindowValue,
            (Root: TilingTree.Node) => TilingTree.BringStackWindowToFront(
                Root,
                WindowValue
            )
        )).pipe(Effect.tap(() => LogTilingInfo(
            "Brought a tiled window to the front of its stack.",
            { Window: WindowValue }
        )));

        const Resize: TilingManagerImpl["Resize"] = (
            WindowValue: Handle.HWND,
            Direction: TilingTree.FocusDirection,
            DeltaPixels: number,
            Behavior: TiledResizeBehavior,
            RecoveryStrategy?: ResizeRecoveryStrategy
        ) => Effect.gen(function*()
        {
            const Gap = yield* Ref.get(GapRef);
            yield* CommitWithRecovery((Current: TilingTree.State) =>
                UpdateManagedWindowWorkspace(
                    Current,
                    WindowValue,
                    (Root: TilingTree.Node) =>
                    {
                        const Workspace = Current.Workspaces.find(
                            (Candidate: TilingTree.Workspace): boolean =>
                                TilingTree.HasWindow(Candidate.Root, WindowValue)
                        )!;

                        return TilingTree.ResizeWindow(
                            Root,
                            Workspace.Bounds,
                            WindowValue,
                            Direction,
                            DeltaPixels,
                            Behavior,
                            Gap
                        );
                    }
                ), RecoveryStrategy);
            yield* LogTilingInfo("Resized a tiled window branch.", {
                Behavior,
                DeltaPixels,
                Direction,
                Window: WindowValue
            });
        });

        const SetPanelRatio: TilingManagerImpl["SetPanelRatio"] = (
            WorkspaceId: string,
            Path: TilingTree.Path,
            RatioValue: number,
            ChildIndex: number = 0
        ) => Commit((Current: TilingTree.State) => UpdateWorkspace(
            Current,
            WorkspaceId,
            (Root: TilingTree.Node) => TilingTree.SetPanelRatio(
                Root,
                Path,
                RatioValue,
                ChildIndex
            ),
            Path
        )).pipe(Effect.tap(() => LogTilingInfo("Changed a panel ratio.", {
            ChildIndex,
            Path,
            Ratio: RatioValue,
            WorkspaceId
        })));

        const SetPanelOrientation: TilingManagerImpl["SetPanelOrientation"] = (
            WorkspaceId: string,
            Path: TilingTree.Path,
            OrientationValue: TilingTree.Orientation
        ) => Commit((Current: TilingTree.State) => UpdateWorkspace(
            Current,
            WorkspaceId,
            (Root: TilingTree.Node) => TilingTree.SetPanelOrientation(
                Root,
                Path,
                OrientationValue
            ),
            Path
        )).pipe(Effect.tap(() => LogTilingInfo("Changed a panel orientation.", {
            Orientation: OrientationValue,
            Path,
            WorkspaceId
        })));

        const Changes = SubscriptionRef.changes(StateRef);
        const Gap = Ref.get(GapRef);
        const Reconcile = SubscriptionRef.get(StateRef).pipe(Effect.flatMap(Apply));
        const SetGap: TilingManagerImpl["SetGap"] = (Value: number) =>
            Ref.set(
                GapRef,
                Number.isFinite(Value) ? Math.max(0, Math.floor(Value)) : 0
            ).pipe(
                Effect.andThen(Reconcile),
                Effect.tap(() => LogTilingInfo("Changed the tiled-window gap.", {
                    Gap: Value
                }))
            );
        const Snapshot = SubscriptionRef.get(StateRef);

        return {
            BringStackWindowToFront,
            Changes,
            Float,
            Gap,
            Insert,
            Move,
            MoveIntoPanel,
            MoveToContainingPanel,
            MoveToIndex,
            PreviewInsert,
            Reconcile,
            Refresh,
            Resize,
            SetGap,
            SetPanelOrientation,
            SetPanelRatio,
            Snapshot,
            Tile,
            TileExistingWindows
        } as const;
    })
);

export/** Live tiling manager backed by the `@sorrell/windows` native package. */
const Live = MakeLive({
    Enumerate: Window.GetManageableTopLevelWindows,
    GetWindowRect: Window.GetWindowRect,
    GetWindowWorkArea: Window.GetWindowWorkArea,
    SetWindowRect: Window.SetWindowRect,
    SetWindowZOrderAfter: Window.SetWindowZOrderAfter
});
