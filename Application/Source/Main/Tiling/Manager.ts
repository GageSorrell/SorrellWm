/**
 * Runtime ownership and native reconciliation of BSP-style tiling state.
 *
 * @module @sorrell/wm/Main/Tiling/Manager
 *
 * @file      Manager.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as TilingTree from "./Tree.ts";
import { Context, Data, Effect, Layer, Option, SubscriptionRef } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import type { Result, Stream } from "effect";
import { Box } from "@sorrell/math";
import { DevFeatures } from "../Development/DevFeatures.ts";
import type { SimpleError } from "../Utility/Error.ts";

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

    /** Reapply the current tree's calculated rectangles to native windows. */
    readonly Reconcile: Effect.Effect<void, WindowLayoutError>;

    /** Discover current native windows and merge them into the managed state. */
    readonly Refresh: Effect.Effect<
        void,
        WindowEnumerationError | WindowLayoutError
    >;

    /** Add one native window to its monitor's workspace. */
    readonly Tile: (
        WindowValue: Handle.HWND,
        Target?: Handle.HWND,
        Orientation?: TilingTree.Orientation
    ) => Effect.Effect<void, WindowLayoutError | WindowMetadataUnavailableError>;

    /** Reparent a managed window beside another leaf, including across workspaces. */
    readonly Move: (
        WindowValue: Handle.HWND,
        Target: Handle.HWND,
        Orientation?: TilingTree.Orientation
    ) => Effect.Effect<void, WindowLayoutError | WindowNotManagedError>;

    /** Remove one native window, optionally restoring its pre-management bounds. */
    readonly Float: (
        WindowValue: Handle.HWND,
        RestoreInitialBounds?: boolean
    ) => Effect.Effect<void, WindowLayoutError | WindowNotManagedError>;

    /** Change a panel's split ratio and immediately reconcile its workspace. */
    readonly SetPanelRatio: (
        WorkspaceId: string,
        Path: TilingTree.Path,
        Ratio: number
    ) => Effect.Effect<
        void,
        PanelNotFoundError | WindowLayoutError | WorkspaceNotFoundError
    >;

    /** Change a panel's split direction and immediately reconcile its workspace. */
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

export/** Construct a tiling-manager layer using injectable native-window operations. */
const MakeLive = (
    DependenciesValue: Dependencies
): Layer.Layer<TilingManager> => Layer.effect(
    TilingManager,
    Effect.gen(function*()
    {
        const StateRef = yield* SubscriptionRef.make<TilingTree.State>(EmptyState);

        const Apply = (
            State: TilingTree.State
        ): Effect.Effect<void, WindowLayoutError> => Effect.forEach(
            TilingTree.Layout(State),
            (Placement: TilingTree.Placement) => Effect.sync(() =>
                DependenciesValue.SetWindowRect(Placement.Window, Placement.Bounds)
            ).pipe(
                Effect.flatMap(Effect.fromResult),
                Effect.mapError((Failure: SimpleError) => new WindowLayoutError({
                    Bounds: Placement.Bounds,
                    Message: Failure.Message,
                    Window: Placement.Window
                }))
            ),
            { discard: true }
        );

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

        const Discover = Effect.sync(DependenciesValue.Enumerate).pipe(
            Effect.flatMap(Effect.fromResult),
            Effect.mapError((Failure: SimpleError) => new WindowEnumerationError({
                Message: Failure.Message
            })),
            Effect.map((Handles: ReadonlyArray<Handle.HWND>) => Handles.flatMap(
                (WindowValue: Handle.HWND): ReadonlyArray<TilingTree.WindowSeed> =>
                {
                    const Seed = ReadWindowSeed(DependenciesValue, WindowValue);
                    return Option.isSome(Seed) ? [ Seed.value ] : [ ];
                }
            ))
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
            });
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
        });

        const Move: TilingManagerImpl["Move"] = (
            WindowValue: Handle.HWND,
            Target: Handle.HWND,
            Orientation?: TilingTree.Orientation
        ) => Commit((Current: TilingTree.State) =>
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
        });

        const SetPanelRatio: TilingManagerImpl["SetPanelRatio"] = (
            WorkspaceId: string,
            Path: TilingTree.Path,
            RatioValue: number
        ) => Commit((Current: TilingTree.State) => UpdateWorkspace(
            Current,
            WorkspaceId,
            (Root: TilingTree.Node) => TilingTree.SetPanelRatio(Root, Path, RatioValue),
            Path
        ));

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
        ));

        if ((yield* DevFeatures).TileOnStart)
        {
            yield* Refresh.pipe(Effect.catch((ErrorValue: TilingManagerError) =>
                Effect.logWarning(
                    "Could not adopt existing windows; tiling will start with an empty state.",
                    ErrorValue
                )
            ));
        }

        const Changes = SubscriptionRef.changes(StateRef);
        const Reconcile = SubscriptionRef.get(StateRef).pipe(Effect.flatMap(Apply));
        const Snapshot = SubscriptionRef.get(StateRef);

        return {
            Changes,
            Float,
            Move,
            Reconcile,
            Refresh,
            SetPanelOrientation,
            SetPanelRatio,
            Snapshot,
            Tile
        } as const;
    })
);

export/** Live tiling manager backed by the `@sorrell/windows` native package. */
const Live = MakeLive({
    Enumerate: Window.GetManageableTopLevelWindows,
    GetWindowRect: Window.GetWindowRect,
    GetWindowWorkArea: Window.GetWindowWorkArea,
    SetWindowRect: Window.SetWindowRect
});
