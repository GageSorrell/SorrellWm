/**
 * Main-process ownership of the overlay's navigation state.
 *
 * @module @sorrell/wm/Main/Overlay/Session
 *
 * @file      Session.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as BoxUtility from "../Utility/Math/Box.js";
import * as Logging from "../Log.ts";
import * as OverlayCommandCatalog from "./CommandCatalog.ts";
import * as Tiling from "../Tiling/index.ts";
import { AppSettings, BrowserWindow } from "../index.ts";
import {
    OverlayCommandId as CommandId,
    FocusMonitorCommandIds,
    IsFocusMonitorCommandId,
    type OverlayCommandId,
    type OverlayCommandTargetDto,
    type OverlayInsertWindowDto,
    type OverlayScreenDto,
    type OverlayScreenId,
    type OverlayStackWindowDto,
    ResizeMode,
    type ResizeMode as ResizeModeType,
    OverlayScreenId as ScreenId
} from "../../Shared/OverlayCommand.js";
import { Context, Effect, Layer, Option, Ref, Result, Stream, Struct, SubscriptionRef, pipe } from "effect";
import type {
    FocusPreviewExcludedRegion,
    FocusPreviewPresentation
} from "../../Shared/FocusPreview.ts";
import { type Handle, Screen, Theme, Window } from "@sorrell/windows";
import { AppApiChannel } from "../../Shared/Api.ts";
import { Box } from "@sorrell/math";
import type { TiledResizeBehavior } from "../../Shared/AppSettings.ts";

const TypeId = "~sorrell/wm/Main/Overlay/Session" as const;

/** A manageable window paired with the bounds used for directional selection. */
export interface FocusWindowCandidate
{
    readonly Bounds: Box.Box;
    readonly Window: Handle.HWND;
}

/** One logically selected node in a tiled workspace. */
export interface TiledFocusSelection
{
    readonly Node: Tiling.Tree.Node;
    readonly Path: Tiling.Tree.Path;
    readonly StackActiveIndex?: number;
    readonly StackWindows?: ReadonlyArray<Handle.HWND>;
    readonly WorkspaceId: string;
}

interface TiledMoveIntoPanelAction
{
    readonly _tag: "MoveIntoPanel";
    readonly TargetPanelPath: Tiling.Tree.Path;
}

interface TiledMoveToContainingPanelAction
{
    readonly _tag: "MoveToContainingPanel";
}

interface TiledMoveToIndexAction
{
    readonly _tag: "MoveToIndex";
    readonly TargetIndex: number;
}

/**
 * Sibling panel selected as the possible destination of a tiled window.
 *
 * @category models
 * @since 0.1.0
 */
export interface TiledMovePanelTarget
{
    readonly _tag: "SelectPanel";
    readonly DirectionId: TiledMoveDirectionCommandId;
    readonly TargetPanelPath: Tiling.Tree.Path;
    readonly WorkspaceId: string;
}

/** The reserved directional region for one in-progress tiled insertion. */
export interface TiledInsertTarget
{
    readonly Bounds: Box.Box;
    readonly Direction: Tiling.Tree.FocusDirection;
    readonly TargetWindow: Handle.HWND;
}

interface TiledInsertWindowCandidate
{
    readonly Target: OverlayCommandTargetDto;
    readonly Window: Handle.HWND;
}

/**
 * Resolved state transition for one command on the tiled Move screen.
 *
 * @category models
 * @since 0.1.0
 */
export type TiledMoveAction =
    | TiledMoveIntoPanelAction
    | TiledMovePanelTarget
    | TiledMoveToContainingPanelAction
    | TiledMoveToIndexAction;

interface TiledFocusLocation
{
    readonly Path: Tiling.Tree.Path;
    readonly StackActiveIndex?: number;
    readonly StackWindows?: ReadonlyArray<Handle.HWND>;
    readonly WorkspaceId: string;
}

/**
 * A window that could not be focused, excluded from Focus targets for the rest
 * of the overlay session.
 */
export interface FocusFailure
{
    readonly Window: Handle.HWND;
    readonly WindowTitle: string;
}

/**
 * A floating window raised to the foreground to satisfy a Focus command, and the
 * window it should be restored directly behind once focus moves elsewhere.
 */
export interface RaisedFloatingWindowZOrder
{
    /** The window directly above this one before it was raised, if any. */
    readonly RestoreBehind: Option.Option<Handle.HWND>;
    readonly Window: Handle.HWND;
}

type FocusCommandId =
    | typeof CommandId.FocusMoveDown
    | typeof CommandId.FocusMoveLeft
    | typeof CommandId.FocusMoveRight
    | typeof CommandId.FocusMoveUp;

const FocusCommandIds = Object.freeze([
    CommandId.FocusMoveLeft,
    CommandId.FocusMoveUp,
    CommandId.FocusMoveDown,
    CommandId.FocusMoveRight
] as const satisfies ReadonlyArray<FocusCommandId>);

const TiledFocusCommandIds = Object.freeze([
    ...FocusCommandIds,
    CommandId.FocusMoveParent,
    CommandId.FocusMoveFirst,
    CommandId.FocusMoveLast,
    CommandId.FocusMoveRoot
] as const);

type TiledMoveDirectionCommandId =
    | typeof CommandId.MoveWindowDown
    | typeof CommandId.MoveWindowLeft
    | typeof CommandId.MoveWindowRight
    | typeof CommandId.MoveWindowUp;

const TiledMoveCommandIds = Object.freeze([
    CommandId.MoveWindowLeft,
    CommandId.MoveWindowUp,
    CommandId.MoveWindowDown,
    CommandId.MoveWindowRight,
    CommandId.MoveWindowParent,
    CommandId.MoveWindowFirst,
    CommandId.MoveWindowLast,
    CommandId.MoveWindowIntoPanel
] as const);

type FocusPreviewKey =
    | typeof BrowserWindow.Key.FocusPreviewDown
    | typeof BrowserWindow.Key.FocusPreviewLeft
    | typeof BrowserWindow.Key.FocusPreviewRight
    | typeof BrowserWindow.Key.FocusPreviewUp;

const FocusPreviewKeyByCommandId: Readonly<Record<FocusCommandId, FocusPreviewKey>> = {
    [ CommandId.FocusMoveDown ]: BrowserWindow.Key.FocusPreviewDown,
    [ CommandId.FocusMoveLeft ]: BrowserWindow.Key.FocusPreviewLeft,
    [ CommandId.FocusMoveRight ]: BrowserWindow.Key.FocusPreviewRight,
    [ CommandId.FocusMoveUp ]: BrowserWindow.Key.FocusPreviewUp
};

const FocusPreviewKeys = Object.freeze(
    Object.values(FocusPreviewKeyByCommandId)
);

const TiledPanelPreviewOpacityScale = 0.5;

const IsFocusCommandId = (Id: OverlayCommandId): Id is FocusCommandId =>
    (FocusCommandIds as ReadonlyArray<OverlayCommandId>).includes(Id);

const TiledFocusDirectionByCommandId: Readonly<Partial<Record<
    OverlayCommandId,
    Tiling.Tree.FocusDirection
>>> = {
    [ CommandId.FocusMoveDown ]: Tiling.Tree.FocusDirection.Down,
    [ CommandId.FocusMoveLeft ]: Tiling.Tree.FocusDirection.Left,
    [ CommandId.FocusMoveRight ]: Tiling.Tree.FocusDirection.Right,
    [ CommandId.FocusMoveUp ]: Tiling.Tree.FocusDirection.Up
};

const TiledMoveDirectionByCommandId: Readonly<Partial<Record<
    OverlayCommandId,
    Tiling.Tree.FocusDirection
>>> = {
    [ CommandId.MoveWindowDown ]: Tiling.Tree.FocusDirection.Down,
    [ CommandId.MoveWindowLeft ]: Tiling.Tree.FocusDirection.Left,
    [ CommandId.MoveWindowRight ]: Tiling.Tree.FocusDirection.Right,
    [ CommandId.MoveWindowUp ]: Tiling.Tree.FocusDirection.Up
};

const OppositeTiledMoveCommand: Readonly<Record<
    TiledMoveDirectionCommandId,
    TiledMoveDirectionCommandId
>> = {
    [ CommandId.MoveWindowDown ]: CommandId.MoveWindowUp,
    [ CommandId.MoveWindowLeft ]: CommandId.MoveWindowRight,
    [ CommandId.MoveWindowRight ]: CommandId.MoveWindowLeft,
    [ CommandId.MoveWindowUp ]: CommandId.MoveWindowDown
};

const IsTiledMoveDirectionCommandId = (
    Id: OverlayCommandId
): Id is TiledMoveDirectionCommandId =>
    Id === CommandId.MoveWindowDown
    || Id === CommandId.MoveWindowLeft
    || Id === CommandId.MoveWindowRight
    || Id === CommandId.MoveWindowUp;

const ResolveTiledFocusPath = (
    Root: Tiling.Tree.Node | null,
    CurrentPath: Tiling.Tree.Path,
    Id: OverlayCommandId
): Tiling.Tree.Path | undefined =>
{
    switch (Id)
    {
        case CommandId.FocusMoveFirst:
            return Tiling.Tree.FocusFirstChild(Root, CurrentPath);
        case CommandId.FocusMoveLast:
            return Tiling.Tree.FocusLastChild(Root, CurrentPath);
        case CommandId.FocusMoveParent:
            return Tiling.Tree.FocusContainingPanel(Root, CurrentPath);
        case CommandId.FocusMoveRoot:
            return Tiling.Tree.FocusRootPanel(Root, CurrentPath);
        default:
        {
            const Direction = TiledFocusDirectionByCommandId[Id];
            return Direction === undefined
                ? undefined
                : Tiling.Tree.MoveFocus(Root, CurrentPath, Direction);
        }
    }
};

const GetMonitorDisplayId = (Id: OverlayCommandId): number | undefined =>
{
    const Index = (FocusMonitorCommandIds as ReadonlyArray<OverlayCommandId>)
        .indexOf(Id);
    return Index < 0 ? undefined : Index + 1;
};

const IsWindowTiled = (
    Snapshot: Tiling.Tree.State,
    WindowValue: Handle.HWND
): boolean => Snapshot.Workspaces.some((Workspace: Tiling.Tree.Workspace) =>
    Tiling.Tree.HasWindow(Workspace.Root, WindowValue));

const FindTiledFocusSelection = (
    Snapshot: Tiling.Tree.State,
    WindowValue: Handle.HWND
): Option.Option<TiledFocusSelection> =>
{
    for (const Workspace of Snapshot.Workspaces)
    {
        const Path = Tiling.Tree.FindWindowPath(Workspace.Root, WindowValue);
        const Node = Path === undefined
            ? undefined
            : Tiling.Tree.GetNodeAtPath(Workspace.Root, Path);

        if (Path !== undefined && Node !== undefined)
        {
            return Option.some({
                Node,
                Path,
                WorkspaceId: Workspace.Id
            });
        }
    }

    return Option.none();
};

const MakeTiledFocusSelection = (
    Node: Tiling.Tree.Node,
    PathValue: Tiling.Tree.Path,
    WorkspaceIdValue: string,
    StackWindows?: ReadonlyArray<Handle.HWND>,
    StackActiveIndex: number = 0
): TiledFocusSelection =>
{
    if (
        Node._tag !== "Panel"
        || Node.Orientation !== Tiling.Tree.Orientation.Stack
    )
    {
        return {
            Node,
            Path: PathValue,
            WorkspaceId: WorkspaceIdValue
        };
    }

    const CurrentWindows = Tiling.Tree.Windows(Node).map(
        (Value: Tiling.Tree.ManagedWindow): Handle.HWND => Value.Window
    );
    const CurrentWindowSet = new Set(CurrentWindows);
    const PreservedWindows = StackWindows?.filter(
        (WindowValue: Handle.HWND): boolean => CurrentWindowSet.has(WindowValue)
    ) ?? [ ];
    const PreservedSet = new Set(PreservedWindows);
    const OrderedWindows = Object.freeze([
        ...PreservedWindows,
        ...CurrentWindows.filter(
            (WindowValue: Handle.HWND): boolean => !PreservedSet.has(WindowValue)
        )
    ]);
    const ActiveIndex = Math.max(
        0,
        Math.min(StackActiveIndex, OrderedWindows.length - 1)
    );

    return {
        Node,
        Path: PathValue,
        StackActiveIndex: ActiveIndex,
        StackWindows: OrderedWindows,
        WorkspaceId: WorkspaceIdValue
    };
};

const GetTiledFocusSelection = (
    Snapshot: Tiling.Tree.State,
    Location: TiledFocusLocation
): Option.Option<TiledFocusSelection> =>
{
    const Workspace = Snapshot.Workspaces.find((
        Candidate: Tiling.Tree.Workspace
    ) => Candidate.Id === Location.WorkspaceId);
    const Node = Workspace === undefined
        ? undefined
        : Tiling.Tree.GetNodeAtPath(Workspace.Root, Location.Path);

    return Workspace === undefined || Node === undefined
        ? Option.none()
        : Option.some(MakeTiledFocusSelection(
            Node,
            Location.Path,
            Location.WorkspaceId,
            Location.StackWindows,
            Location.StackActiveIndex
        ));
};

// A candidate is assigned to whichever axis its offset is dominated by, so a
// window can never qualify for two directions at once (e.g. one both left of
// and below the current window is only ever a Left or a Down candidate, not
// both).
const IsInDirection = (
    Id: FocusCommandId,
    DeltaX: number,
    DeltaY: number
): boolean =>
{
    const IsHorizontal = Math.abs(DeltaX) > Math.abs(DeltaY);

    switch (Id)
    {
        case CommandId.FocusMoveDown:
            return !IsHorizontal && DeltaY > 0;
        case CommandId.FocusMoveLeft:
            return IsHorizontal && DeltaX < 0;
        case CommandId.FocusMoveRight:
            return IsHorizontal && DeltaX > 0;
        case CommandId.FocusMoveUp:
            return !IsHorizontal && DeltaY < 0;
    }
};

const SelectDirectionalCandidate = <Candidate extends { readonly Bounds: Box.Box; }>(
    CurrentBounds: Box.Box,
    Candidates: ReadonlyArray<Candidate>,
    Id: FocusCommandId
): Option.Option<Candidate> =>
{
    const CurrentCenter = BoxUtility.CenterPoint(CurrentBounds);
    let Selected: Candidate | undefined;
    let SelectedDistanceSquared = Number.POSITIVE_INFINITY;
    let SelectedCrossAxisDistance = Number.POSITIVE_INFINITY;

    for (const Candidate of Candidates)
    {
        const CandidateCenter = BoxUtility.CenterPoint(Candidate.Bounds);
        const DeltaX = CandidateCenter.X - CurrentCenter.X;
        const DeltaY = CandidateCenter.Y - CurrentCenter.Y;

        if (!IsInDirection(Id, DeltaX, DeltaY))
        {
            continue;
        }

        const DistanceSquared = DeltaX ** 2 + DeltaY ** 2;
        const CrossAxisDistance = Id === CommandId.FocusMoveLeft
            || Id === CommandId.FocusMoveRight
            ? Math.abs(DeltaY)
            : Math.abs(DeltaX);

        if (
            DistanceSquared < SelectedDistanceSquared ||
            (
                DistanceSquared === SelectedDistanceSquared &&
                CrossAxisDistance < SelectedCrossAxisDistance
            )
        )
        {
            Selected = Candidate;
            SelectedDistanceSquared = DistanceSquared;
            SelectedCrossAxisDistance = CrossAxisDistance;
        }
    }

    return Option.fromNullishOr(Selected);
};

export/** Select the nearest candidate whose center is in the requested direction. */
const SelectDirectionalWindow = (
    CurrentBounds: Box.Box,
    Candidates: ReadonlyArray<FocusWindowCandidate>,
    Id: FocusCommandId
): Option.Option<FocusWindowCandidate> =>
    SelectDirectionalCandidate(CurrentBounds, Candidates, Id);

/** Operations exposed by the main-owned overlay navigation session. */
export interface OverlaySessionImpl
{
    /** The current overlay screen. */
    readonly Current: Effect.Effect<OverlayScreenId>;

    /** Every current and future overlay-screen selection. */
    readonly Changes: Stream.Stream<OverlayScreenId>;

    /** Return to the preceding screen when one exists. */
    readonly Back: Effect.Effect<void>;

    /** Navigate to a child overlay screen. */
    readonly Navigate: (Screen: OverlayScreenId) => Effect.Effect<void>;

    /** Return the overlay to its home screen. */
    readonly Reset: Effect.Effect<void>;

    /** Clear the window from which the overlay was activated. */
    readonly ClearActivationWindow: Effect.Effect<void>;

    /** The application name of the window from which the overlay was activated, if any. */
    readonly GetActivationApplicationName: Effect.Effect<Option.Option<string>>;

    /** The current window from which the overlay was activated, if any. */
    readonly GetActivationWindow: Effect.Effect<Option.Option<Handle.HWND>>;

    /** Clear any active Focus hover preview. */
    readonly ClearFocusPreview: Effect.Effect<void>;

    /** Resolve the current target for one directional Focus command. */
    readonly ResolveFocusTarget: (
        Id: OverlayCommandId
    ) => Effect.Effect<Option.Option<Handle.HWND>>;

    /** Resolve the first child of the currently focused tiled panel. */
    readonly ResolveTiledFocusCommit: Effect.Effect<Option.Option<TiledFocusSelection>>;

    /** Resolve one logical tiled focus movement without applying it. */
    readonly ResolveTiledFocusTarget: (
        Id: OverlayCommandId
    ) => Effect.Effect<Option.Option<TiledFocusSelection>>;

    /** Resolve one window index from the currently focused stack panel. */
    readonly ResolveTiledStackWindow: (
        Index: number
    ) => Effect.Effect<Option.Option<TiledFocusSelection>>;

    /** Resolve one tiled-window move without applying it. */
    readonly ResolveTiledMoveAction: (
        Id: OverlayCommandId
    ) => Effect.Effect<Option.Option<TiledMoveAction>>;

    /** Remember the sibling panel awaiting a Commit move. */
    readonly SetTiledMovePanelTarget: (
        Target: TiledMovePanelTarget
    ) => Effect.Effect<void>;

    /** Clear the sibling panel awaiting a Commit move. */
    readonly ClearTiledMovePanelTarget: Effect.Effect<void>;

    /** Make a resolved tiled node the session's logical focus. */
    readonly SetTiledFocusSelection: (
        Selection: TiledFocusSelection
    ) => Effect.Effect<void>;

    /** Set the window from which the overlay was activated. */
    readonly SetActivationWindow: (Window: Handle.HWND) => Effect.Effect<void>;

    /** Remember a floating window raised for Focus, and where to restore it later. */
    readonly RecordRaisedFloatingWindowZOrder: (
        Value: RaisedFloatingWindowZOrder
    ) => Effect.Effect<void>;

    /** Remove and return the floating window most recently raised for Focus, if any. */
    readonly TakeRaisedFloatingWindowZOrder: Effect.Effect<
        Option.Option<RaisedFloatingWindowZOrder>
    >;

    /** Whether the primary modifier (e.g. Shift) is currently held. */
    readonly PrimaryModifierHeld: Effect.Effect<boolean>;

    /** Update whether the primary modifier is currently held. */
    readonly SetPrimaryModifierHeld: (Held: boolean) => Effect.Effect<void>;

    /** Whether the fine-step modifier (e.g. Alt) is currently held. */
    readonly FineModifierHeld: Effect.Effect<boolean>;

    /** Update whether the fine-step modifier is currently held. */
    readonly SetFineModifierHeld: (Held: boolean) => Effect.Effect<void>;

    /** Whether the Resize screen is growing or shrinking the window. */
    readonly ResizeMode: Effect.Effect<ResizeModeType>;

    /** Choose whether the Resize screen grows or shrinks the window. */
    readonly SetResizeMode: (Mode: ResizeModeType) => Effect.Effect<void>;

    /** The redistribution behavior currently used by tiled resizing. */
    readonly TiledResizeBehavior: Effect.Effect<TiledResizeBehavior>;

    /** Cycle the tiled Resize screen's redistribution behavior. */
    readonly ToggleTiledResizeBehavior: Effect.Effect<void>;

    /** Clear the reserved tiled Insert region and its window selection. */
    readonly ClearTiledInsert: Effect.Effect<void>;

    /** Whether the temporary Insert target is waiting for the next new window. */
    readonly TiledInsertCaptureNext: Effect.Effect<boolean>;

    /** Whether a floating native window is being dragged over the Insert target. */
    readonly TiledInsertDragActive: Effect.Effect<boolean>;

    /** The reserved directional region for the current tiled Insert flow. */
    readonly TiledInsertTarget: Effect.Effect<Option.Option<TiledInsertTarget>>;

    /** Refresh the floating windows available to the tiled Insert picker. */
    readonly RefreshTiledInsertWindows: Effect.Effect<void>;

    /** Cycle the selected floating window in the tiled Insert picker. */
    readonly MoveTiledInsertSelection: (Delta: number) => Effect.Effect<void>;

    /** Return the currently selected floating window, when one remains eligible. */
    readonly SelectedTiledInsertWindow: Effect.Effect<Option.Option<Handle.HWND>>;

    /** Set whether the temporary Insert target should capture the next new window. */
    readonly SetTiledInsertCaptureNext: (Enabled: boolean) => Effect.Effect<void>;

    /** Set whether a native window is currently being dragged over the target. */
    readonly SetTiledInsertDragActive: (Active: boolean) => Effect.Effect<void>;

    /** Reserve a directional tiled Insert region. */
    readonly SetTiledInsertTarget: (
        Target: TiledInsertTarget
    ) => Effect.Effect<void>;

    /** The most recent Focus-direction failure still being shown, if any. */
    readonly FocusFailure: Effect.Effect<Option.Option<FocusFailure>>;

    /**
     * Record that a window could not be focused: exclude it from Focus targets
     * for the rest of this overlay session and surface an explanatory error.
     */
    readonly RecordFocusFailure: (Failure: FocusFailure) => Effect.Effect<void>;

    /** Project the current screen and keybind settings for a renderer. */
    readonly Snapshot: Effect.Effect<OverlayScreenDto>;

    /** Remove and return the window from which the overlay was activated. */
    readonly TakeActivationWindow: Effect.Effect<Option.Option<Handle.HWND>>;

    /** Preview one directional Focus target, or clear the preview with `null`. */
    readonly PreviewFocusTarget: (
        Id: OverlayCommandId | null
    ) => Effect.Effect<void, unknown>;
}

/** Main-process ownership of one overlay activation's navigation stack. */
export class OverlaySession extends
    Context.Service<OverlaySession, OverlaySessionImpl>()(TypeId) { }

const GetCurrent = (Stack: ReadonlyArray<OverlayScreenId>): OverlayScreenId =>
    Stack.at(-1) ?? ScreenId.FloatingHome;

const GetWindowCandidates = (
    CurrentWindow: Handle.HWND,
    Excluded: ReadonlySet<Handle.HWND>
): ReadonlyArray<FocusWindowCandidate> =>
{
    const Windows = Window.GetManageableTopLevelWindows();

    if (Result.isFailure(Windows))
    {
        return [ ];
    }

    return Windows.success.flatMap((WindowHandle: Handle.HWND) =>
    {
        if (WindowHandle === CurrentWindow || Excluded.has(WindowHandle))
        {
            return [ ];
        }

        const Bounds = Window.GetWindowRect(WindowHandle);
        return Option.isSome(Bounds)
            ? [ { Bounds: Bounds.value, Window: WindowHandle } ]
            : [ ];
    });
};

const ResolveTarget = (
    CurrentWindow: Option.Option<Handle.HWND>,
    Id: OverlayCommandId,
    Excluded: ReadonlySet<Handle.HWND>
): Option.Option<FocusWindowCandidate> =>
{
    if (Option.isNone(CurrentWindow) || !IsFocusCommandId(Id))
    {
        return Option.none();
    }

    const CurrentBounds = Window.GetWindowRect(CurrentWindow.value);
    if (Option.isNone(CurrentBounds))
    {
        return Option.none();
    }

    return SelectDirectionalWindow(
        CurrentBounds.value,
        GetWindowCandidates(CurrentWindow.value, Excluded),
        Id
    );
};

const GetApplicationName = (WindowHandle: Handle.HWND): Option.Option<string> => pipe(
    Window.GetApplicationName(WindowHandle),
    Option.filter((Value: string) => Value.trim().length > 0),
    Option.map((Value: string) => Value.trim())
);

const GetFocusPreviewIntersection = (
    Bounds: Box.Box,
    OtherBounds: Box.Box
): Option.Option<FocusPreviewExcludedRegion> =>
{
    const Bottom = Math.min(Bounds.Bottom, OtherBounds.Bottom);
    const Left = Math.max(Bounds.Left, OtherBounds.Left);
    const Right = Math.min(Bounds.Right, OtherBounds.Right);
    const Top = Math.max(Bounds.Top, OtherBounds.Top);

    return Bottom > Top && Right > Left
        ? Option.some({
            Bottom: Bottom - Bounds.Top,
            Left: Left - Bounds.Left,
            Right: Right - Bounds.Left,
            Top: Top - Bounds.Top
        })
        : Option.none();
};

const GetTargetPresentation = (Target: FocusWindowCandidate): OverlayCommandTargetDto =>
{
    const Title = Option.getOrElse(
        Option.filter(
            Window.GetWindowText(Target.Window),
            (Value: string) => Value.trim().length > 0
        ),
        () => "Untitled window"
    );

    const Icon = Window.GetIcon(Target.Window);

    return {
        Icon: Icon.valueOrUndefined,
        Title
    } as const;
};

const GetTiledFocusPresentation = (
    Selection: TiledFocusSelection,
    Monitors: ReadonlyArray<Screen.MonitorInfo> = [ ]
): OverlayCommandTargetDto => Selection.Node._tag === "Window"
    ? GetTargetPresentation({
        Bounds: Selection.Node.Value.InitialBounds,
        Window: Selection.Node.Value.Window
    })
    : (() =>
    {
        const Monitor = Selection.Path.length === 0
            ? Monitors.find((Candidate: Screen.MonitorInfo) =>
                Tiling.Tree.WorkspaceId(Candidate.WorkArea) === Selection.WorkspaceId)
            : undefined;

        return {
            Icon: undefined,
            Title: Monitor === undefined
                ? `${ Selection.Node.Orientation } panel`
                : `Display ${ Monitor.DisplayId }: ${ Monitor.DeviceName }`
        };
    })();

const GetStackWindowPresentations = (
    Selection: TiledFocusSelection
): ReadonlyArray<OverlayStackWindowDto> =>
{
    const ManagedByWindow = new Map(
        Tiling.Tree.Windows(Selection.Node).map(
            (Value: Tiling.Tree.ManagedWindow) => [ Value.Window, Value ] as const
        )
    );

    return Selection.StackWindows?.map((
        WindowValue: Handle.HWND,
        Index: number
    ): OverlayStackWindowDto => ({
        Active: Index === Selection.StackActiveIndex,
        Target: GetTargetPresentation({
            Bounds: ManagedByWindow.get(WindowValue)!.InitialBounds,
            Window: WindowValue
        })
    })) ?? [ ];
};

const GetMonitorCommandStates = (
    Snapshot: Tiling.Tree.State,
    Monitors: ReadonlyArray<Screen.MonitorInfo>
): OverlayCommandCatalog.MonitorCommandStates =>
{
    const States: Partial<Record<
        OverlayCommandId,
        OverlayCommandCatalog.MonitorCommandState
    >> = { };

    for (const Monitor of Monitors)
    {
        if (Monitor.DisplayId < 1 || Monitor.DisplayId > 9)
        {
            continue;
        }

        const Id = FocusMonitorCommandIds[Monitor.DisplayId - 1];
        if (Id === undefined)
        {
            continue;
        }

        const Workspace = Snapshot.Workspaces.find((
            Candidate: Tiling.Tree.Workspace
        ) => Candidate.Id === Tiling.Tree.WorkspaceId(Monitor.WorkArea));

        States[Id] = {
            Disabled: Workspace?.Root?._tag !== "Panel",
            Target: {
                Icon: undefined,
                Title: `Display ${ Monitor.DisplayId }: ${ Monitor.DeviceName }`
            }
        };
    }

    return States;
};

export/** Live overlay navigation state scoped to the application runtime. */
const Live = Layer.effect(
    OverlaySession,
    Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;
        const Settings = yield* AppSettings.AppSettings;
        const TilingManager = yield* Tiling.Manager.TilingManager;
        const RecoverPreviewOperation = (
            Operation: string,
            KeyValue: BrowserWindow.Key
        ) => Effect.catch((Cause: unknown) => Logging.LogWarning(
            "Overlay.Preview",
            "A Focus or panel preview operation failed.",
            Cause,
            {
                Operation,
                Window: KeyValue
            }
        ));
        const ActivationWindow = yield* Ref.make(Option.none<Handle.HWND>());
        const RaisedFloatingWindowZOrderRef = yield* Ref.make(
            Option.none<RaisedFloatingWindowZOrder>()
        );
        const PrimaryModifierHeldRef = yield* Ref.make(false);
        const FineModifierHeldRef = yield* Ref.make(false);
        const ResizeModeRef = yield* Ref.make<ResizeModeType>(ResizeMode.Grow);
        const TiledResizeBehaviorRef = yield* Ref.make<TiledResizeBehavior>(
            "PreserveRatios"
        );
        const ExcludedFocusWindows = yield* Ref.make<ReadonlySet<Handle.HWND>>(new Set());
        const FocusFailureRef = yield* Ref.make(Option.none<FocusFailure>());
        const TiledFocusLocationRef = yield* Ref.make(
            Option.none<TiledFocusLocation>()
        );
        const TiledMovePanelTargetRef = yield* Ref.make(
            Option.none<TiledMovePanelTarget>()
        );
        const TiledInsertCaptureNextRef = yield* Ref.make(false);
        const TiledInsertDragActiveRef = yield* Ref.make(false);
        const TiledInsertSelectionRef = yield* Ref.make(0);
        const TiledInsertTargetRef = yield* Ref.make(
            Option.none<TiledInsertTarget>()
        );
        const TiledInsertWindowsRef = yield* Ref.make<
            ReadonlyArray<TiledInsertWindowCandidate>
        >([ ]);
        const Stack = yield* SubscriptionRef.make<ReadonlyArray<OverlayScreenId>>(
            Object.freeze([ ScreenId.FloatingHome ])
        );
        const Current = pipe(SubscriptionRef.get(Stack), Effect.map(GetCurrent));
        const ResolveHomeScreen = (
            WindowValue: Option.Option<Handle.HWND>
        ): Effect.Effect<OverlayScreenId> => TilingManager.Snapshot.pipe(
            Effect.map((Snapshot: Tiling.Tree.State): OverlayScreenId =>
                Option.isSome(WindowValue) && IsWindowTiled(Snapshot, WindowValue.value)
                    ? ScreenId.TiledHome
                    : ScreenId.FloatingHome)
        );
        const UpdateHomeScreen = (
            WindowValue: Option.Option<Handle.HWND>
        ): Effect.Effect<void> => ResolveHomeScreen(WindowValue).pipe(
            Effect.flatMap((Home: OverlayScreenId) => SubscriptionRef.update(
                Stack,
                (Value: ReadonlyArray<OverlayScreenId>) => Object.freeze([
                    Home,
                    ...Value.slice(1)
                ])
            ))
        );
        const ClearFocusPreview = Effect.sync(() =>
        {
            Window.ClearWindowDimming();
        });
        const ClearFocusProxyWindows = Effect.forEach(
            FocusPreviewKeys,
            (Key: FocusPreviewKey) => BrowserWindows.ForceClose(Key).pipe(
                Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void),
                Effect.ignore
            ),
            { concurrency: "unbounded", discard: true }
        );
        const ClearTiledFocusPanelPreview = BrowserWindows.ForceClose(
            BrowserWindow.Key.TiledFocusPanelPreview
        ).pipe(
            Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void),
            Effect.ignore
        );
        const ClearTiledMovePanelPreview = BrowserWindows.ForceClose(
            BrowserWindow.Key.TiledMovePanelPreview
        ).pipe(
            Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void),
            Effect.ignore
        );
        const ClearTiledInsert = Effect.all([
            Ref.set(TiledInsertCaptureNextRef, false),
            Ref.set(TiledInsertDragActiveRef, false),
            Ref.set(TiledInsertSelectionRef, 0),
            Ref.set(TiledInsertTargetRef, Option.none()),
            Ref.set(TiledInsertWindowsRef, [ ])
        ], { discard: true });
        const RefreshTiledInsertWindows = Effect.gen(function*()
        {
            const WindowsResult = Window.GetManageableTopLevelWindows();
            const TilingSnapshot = yield* TilingManager.Snapshot;

            if (Result.isFailure(WindowsResult))
            {
                yield* Logging.LogWarning(
                    "Overlay.Insert",
                    "Could not enumerate floating windows for tiled insertion.",
                    WindowsResult.failure
                );
                yield* Ref.set(TiledInsertWindowsRef, [ ]);
                yield* Ref.set(TiledInsertSelectionRef, 0);
                return;
            }

            const Candidates = WindowsResult.success.flatMap(
                (WindowHandle: Handle.HWND): ReadonlyArray<
                    TiledInsertWindowCandidate
                > => IsWindowTiled(TilingSnapshot, WindowHandle)
                    ? [ ]
                    : [ {
                        Target: GetTargetPresentation({
                            Bounds: Window.GetWindowRect(WindowHandle)
                                .pipe(Option.getOrElse(() => Box.Box(0, 0, 0, 0))),
                            Window: WindowHandle
                        }),
                        Window: WindowHandle
                    } ]
            );

            yield* Ref.set(TiledInsertWindowsRef, Object.freeze(Candidates));
            yield* Ref.set(TiledInsertSelectionRef, 0);
            yield* Logging.LogDebug(
                "Overlay.Insert",
                "Refreshed tiled Insert window candidates.",
                { WindowCount: Candidates.length }
            );
        });
        const GetFocusProxyNativeHandles = Effect.forEach(
            FocusPreviewKeys,
            (Key: FocusPreviewKey) => BrowserWindows.GetNativeHandle(Key).pipe(
                Effect.match({
                    onFailure: () => Option.none<Handle.HWND>(),
                    onSuccess: Option.some
                })
            ),
            { concurrency: "unbounded" }
        ).pipe(Effect.map((
            Handles: ReadonlyArray<Option.Option<Handle.HWND>>
        ): ReadonlyArray<Handle.HWND> => Handles.flatMap((
            HandleOption: Option.Option<Handle.HWND>
        ) => Option.isSome(HandleOption) ? [ HandleOption.value ] : [ ])));
        const SyncFocusProxyWindows = (
            CurrentWindow: Option.Option<Handle.HWND>,
            Excluded: ReadonlySet<Handle.HWND>,
            CurrentSettings: AppSettings.AppSettings
        ): Effect.Effect<void> => Effect.gen(function*()
        {
            const TilingSnapshot = yield* TilingManager.Snapshot;
            const OverlayHandle = yield* BrowserWindows.GetNativeHandle(
                BrowserWindow.Key.Overlay
            ).pipe(
                Effect.match({
                    onFailure: () => Option.none<Handle.HWND>(),
                    onSuccess: Option.some
                })
            );
            const ExistingProxyHandles = yield* GetFocusProxyNativeHandles;
            const OcclusionExclusions: Array<Handle.HWND> = [
                ...ExistingProxyHandles,
                ...(Option.isSome(OverlayHandle) ? [ OverlayHandle.value ] : [ ])
            ];
            let AnyProxyVisible = false;
            const VisiblePreviews: Array<{
                readonly ApplicationName: string;
                readonly Bounds: Box.Box;
            }> = [ ];

            for (const Id of FocusCommandIds)
            {
                const Key = FocusPreviewKeyByCommandId[Id];
                const Target = ResolveTarget(CurrentWindow, Id, Excluded);
                const Close = BrowserWindows.ForceClose(Key).pipe(
                    Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void),
                    Effect.ignore
                );

                if (
                    Option.isNone(Target)
                    || IsWindowTiled(TilingSnapshot, Target.value.Window)
                )
                {
                    yield* Close;
                    continue;
                }

                const Obscured = Window.IsWindowObscured(
                    Target.value.Window,
                    OcclusionExclusions
                );

                if (Result.isFailure(Obscured) || !Obscured.success)
                {
                    if (Result.isFailure(Obscured))
                    {
                        yield* Logging.LogWarning(
                            "Overlay.Preview",
                            "Could not determine whether a Focus target was obscured.",
                            Obscured.failure,
                            { Window: Target.value.Window }
                        );
                    }
                    yield* Close;
                    continue;
                }

                const TargetIcon = Window.GetIcon(Target.value.Window);
                const TargetApplicationName = GetApplicationName(Target.value.Window);
                const ExcludedRegions = Option.isNone(TargetApplicationName)
                    ? [ ]
                    : VisiblePreviews.flatMap((Preview: {
                        readonly ApplicationName: string;
                        readonly Bounds: Box.Box;
                    }) =>
                        Preview.ApplicationName === TargetApplicationName.value
                            ? Option.match(
                                GetFocusPreviewIntersection(
                                    Target.value.Bounds,
                                    Preview.Bounds
                                ),
                                {
                                    onNone: () => [ ],
                                    onSome: (
                                        Region: FocusPreviewExcludedRegion
                                    ) => [ Region ]
                                }
                            )
                            : [ ]);
                const Presentation: FocusPreviewPresentation = {
                    ExcludedRegions,
                    Opacity: CurrentSettings.FocusPreviewOpacity,
                    ...(Option.isSome(TargetIcon) ? { Icon: TargetIcon.value } : { })
                };

                yield* BrowserWindows.Ensure(
                    BrowserWindow.GetFocusPreviewWindowSpec(Key, Target.value.Bounds)
                ).pipe(RecoverPreviewOperation("Ensure", Key));
                yield* BrowserWindows.SetBounds(
                    Key,
                    Target.value.Bounds
                ).pipe(RecoverPreviewOperation("SetBounds", Key));
                yield* BrowserWindows.Send(
                    Key,
                    AppApiChannel.FocusPreviewChanged,
                    Presentation
                ).pipe(RecoverPreviewOperation("Send", Key));
                yield* BrowserWindows.ShowInactive(
                    Key
                ).pipe(RecoverPreviewOperation("ShowInactive", Key));
                const PreviewHandle = yield* BrowserWindows.GetNativeHandle(Key).pipe(
                    Effect.match({
                        onFailure: () => Option.none<Handle.HWND>(),
                        onSuccess: Option.some
                    })
                );

                if (
                    Option.isSome(PreviewHandle)
                    && !OcclusionExclusions.includes(PreviewHandle.value)
                )
                {
                    OcclusionExclusions.push(PreviewHandle.value);
                }

                if (Option.isSome(TargetApplicationName))
                {
                    VisiblePreviews.push({
                        ApplicationName: TargetApplicationName.value,
                        Bounds: Target.value.Bounds
                    });
                }

                AnyProxyVisible = true;
            }

            if (AnyProxyVisible)
            {
                // Both surfaces are always-on-top. Raising the command overlay
                // last guarantees every proxy remains directly beneath it.
                yield* BrowserWindows.ShowInactive(BrowserWindow.Key.Overlay).pipe(Effect.ignore);
            }
        });
        const SyncTiledFocusPanelPreview = (
            Selection: Option.Option<TiledFocusSelection>,
            CurrentSettings: AppSettings.AppSettings
        ): Effect.Effect<void> => Effect.gen(function*()
        {
            if (
                Option.isNone(Selection)
                || Selection.value.Node._tag !== "Panel"
            )
            {
                return yield* ClearTiledFocusPanelPreview;
            }

            const Snapshot = yield* TilingManager.Snapshot;
            const Workspace = Snapshot.Workspaces.find(
                (Candidate: Tiling.Tree.Workspace): boolean =>
                    Candidate.Id === Selection.value.WorkspaceId
            );
            const AccentColor = Theme.GetAccentColor();
            const Gap = yield* TilingManager.Gap;
            const Bounds = Workspace === undefined
                ? undefined
                : Tiling.Tree.GetNodeBoundsAtPath(
                    Workspace.Root,
                    Workspace.Bounds,
                    Selection.value.Path,
                    Gap
                );

            if (
                Workspace === undefined
                || Bounds === undefined
                || Option.isNone(AccentColor)
            )
            {
                return yield* ClearTiledFocusPanelPreview;
            }

            const Key = BrowserWindow.Key.TiledFocusPanelPreview;
            const Presentation: FocusPreviewPresentation = {
                Color: AccentColor.value,
                ExcludedRegions: [ ],
                Opacity: Math.round(
                    CurrentSettings.FocusPreviewOpacity
                    * TiledPanelPreviewOpacityScale
                ),
                ShowIcon: false
            };

            yield* BrowserWindows.Ensure(
                BrowserWindow.GetFocusPreviewWindowSpec(Key, Bounds)
            ).pipe(RecoverPreviewOperation("Ensure", Key));
            yield* BrowserWindows.SetBounds(
                Key,
                Bounds
            ).pipe(RecoverPreviewOperation("SetBounds", Key));
            yield* BrowserWindows.Send(
                Key,
                AppApiChannel.FocusPreviewChanged,
                Presentation
            ).pipe(RecoverPreviewOperation("Send", Key));
            yield* BrowserWindows.ShowInactive(
                Key
            ).pipe(RecoverPreviewOperation("ShowInactive", Key));

            // The panel highlight and overlay are both always-on-top. Raising
            // the overlay last keeps the highlight directly beneath it.
            yield* BrowserWindows.ShowInactive(
                BrowserWindow.Key.Overlay
            ).pipe(RecoverPreviewOperation(
                "RaiseOverlay",
                BrowserWindow.Key.Overlay
            ));
        });
        const SyncTiledMovePanelPreview = (
            Target: Option.Option<TiledMovePanelTarget>,
            CurrentSettings: AppSettings.AppSettings
        ): Effect.Effect<void> => Effect.gen(function*()
        {
            if (Option.isNone(Target))
            {
                return yield* ClearTiledMovePanelPreview;
            }

            const Snapshot = yield* TilingManager.Snapshot;
            const Workspace = Snapshot.Workspaces.find(
                (Candidate: Tiling.Tree.Workspace): boolean =>
                    Candidate.Id === Target.value.WorkspaceId
            );
            const TargetNode = Workspace === undefined
                ? undefined
                : Tiling.Tree.GetNodeAtPath(
                    Workspace.Root,
                    Target.value.TargetPanelPath
                );
            const AccentColor = Theme.GetAccentColor();
            const Gap = yield* TilingManager.Gap;
            const Bounds = Workspace === undefined || TargetNode?._tag !== "Panel"
                ? undefined
                : Tiling.Tree.GetNodeBoundsAtPath(
                    Workspace.Root,
                    Workspace.Bounds,
                    Target.value.TargetPanelPath,
                    Gap
                );

            if (
                Workspace === undefined
                || TargetNode?._tag !== "Panel"
                || Bounds === undefined
                || Option.isNone(AccentColor)
            )
            {
                return yield* ClearTiledMovePanelPreview;
            }

            const Key = BrowserWindow.Key.TiledMovePanelPreview;
            const Presentation: FocusPreviewPresentation = {
                Color: AccentColor.value,
                ExcludedRegions: [ ],
                Opacity: Math.round(
                    CurrentSettings.FocusPreviewOpacity
                    * TiledPanelPreviewOpacityScale
                ),
                ShowIcon: false
            };

            yield* BrowserWindows.Ensure(
                BrowserWindow.GetFocusPreviewWindowSpec(Key, Bounds)
            ).pipe(RecoverPreviewOperation("Ensure", Key));
            yield* BrowserWindows.SetBounds(
                Key,
                Bounds
            ).pipe(RecoverPreviewOperation("SetBounds", Key));
            yield* BrowserWindows.Send(
                Key,
                AppApiChannel.FocusPreviewChanged,
                Presentation
            ).pipe(RecoverPreviewOperation("Send", Key));
            yield* BrowserWindows.ShowInactive(
                Key
            ).pipe(RecoverPreviewOperation("ShowInactive", Key));
            yield* BrowserWindows.ShowInactive(
                BrowserWindow.Key.Overlay
            ).pipe(RecoverPreviewOperation(
                "RaiseOverlay",
                BrowserWindow.Key.Overlay
            ));
        });
        const ClearFocusFailure = Ref.set(FocusFailureRef, Option.none());
        const ResolveCurrentFocusTarget = (
            Id: OverlayCommandId
        ): Effect.Effect<Option.Option<Handle.HWND>> => Effect.gen(function*()
        {
            const CurrentWindow = yield* Ref.get(ActivationWindow);
            const Excluded = yield* Ref.get(ExcludedFocusWindows);
            return Option.map(ResolveTarget(CurrentWindow, Id, Excluded), Struct.get("Window"));
        });
        const InitializeTiledFocus = Effect.gen(function*()
        {
            const CurrentWindow = yield* Ref.get(ActivationWindow);

            if (Option.isNone(CurrentWindow))
            {
                return yield* Ref.set(TiledFocusLocationRef, Option.none());
            }

            const Snapshot = yield* TilingManager.Snapshot;
            const Selection = FindTiledFocusSelection(
                Snapshot,
                CurrentWindow.value
            );

            return yield* Ref.set(
                TiledFocusLocationRef,
                Option.map(Selection, (Value: TiledFocusSelection) => ({
                    Path: Value.Path,
                    WorkspaceId: Value.WorkspaceId
                }))
            );
        });
        const ResolveCurrentTiledFocusSelection = Effect.gen(function*()
        {
            const Location = yield* Ref.get(TiledFocusLocationRef);
            if (Option.isNone(Location))
            {
                return Option.none<TiledFocusSelection>();
            }

            return GetTiledFocusSelection(
                yield* TilingManager.Snapshot,
                Location.value
            );
        });
        const ResolveTiledFocusTarget = (
            Id: OverlayCommandId
        ): Effect.Effect<Option.Option<TiledFocusSelection>> => Effect.gen(function*()
        {
            const CurrentSelection = yield* ResolveCurrentTiledFocusSelection;
            if (Option.isNone(CurrentSelection))
            {
                return Option.none();
            }

            const Snapshot = yield* TilingManager.Snapshot;
            const Workspace = Snapshot.Workspaces.find((
                Candidate: Tiling.Tree.Workspace
            ) => Candidate.Id === CurrentSelection.value.WorkspaceId);
            if (Workspace === undefined)
            {
                return Option.none();
            }

            if (
                CurrentSelection.value.Node._tag === "Panel"
                && CurrentSelection.value.Node.Orientation
                    === Tiling.Tree.Orientation.Stack
                && (
                    Id === CommandId.FocusMoveUp
                    || Id === CommandId.FocusMoveDown
                )
            )
            {
                const StackWindows = CurrentSelection.value.StackWindows ?? [ ];
                const CurrentIndex = CurrentSelection.value.StackActiveIndex ?? 0;
                const TargetIndex = CurrentIndex
                    + (Id === CommandId.FocusMoveUp ? -1 : 1);

                return TargetIndex < 0 || TargetIndex >= StackWindows.length
                    ? Option.none()
                    : Option.some(MakeTiledFocusSelection(
                        CurrentSelection.value.Node,
                        CurrentSelection.value.Path,
                        CurrentSelection.value.WorkspaceId,
                        StackWindows,
                        TargetIndex
                    ));
            }

            if (IsFocusMonitorCommandId(Id))
            {
                if (
                    CurrentSelection.value.Path.length !== 0
                    || CurrentSelection.value.Node._tag !== "Panel"
                )
                {
                    return Option.none();
                }

                const DisplayId = GetMonitorDisplayId(Id);
                const MonitorsResult = Screen.GetMonitors();
                const Monitor = DisplayId === undefined || Result.isFailure(MonitorsResult)
                    ? undefined
                    : MonitorsResult.success.find((
                        Candidate: Screen.MonitorInfo
                    ) => Candidate.DisplayId === DisplayId);
                const TargetWorkspace = Monitor === undefined
                    ? undefined
                    : Snapshot.Workspaces.find((
                        Candidate: Tiling.Tree.Workspace
                    ) => Candidate.Id === Tiling.Tree.WorkspaceId(Monitor.WorkArea));

                return TargetWorkspace?.Root?._tag === "Panel"
                    ? Option.some(MakeTiledFocusSelection(
                        TargetWorkspace.Root,
                        Object.freeze([ ]),
                        TargetWorkspace.Id
                    ))
                    : Option.none();
            }

            if (
                CurrentSelection.value.Path.length === 0
                && CurrentSelection.value.Node._tag === "Panel"
                && IsFocusCommandId(Id)
            )
            {
                const Candidate = SelectDirectionalCandidate(
                    Workspace.Bounds,
                    Snapshot.Workspaces.flatMap((
                        CandidateWorkspace: Tiling.Tree.Workspace
                    ) => CandidateWorkspace.Id === Workspace.Id
                        || CandidateWorkspace.Root?._tag !== "Panel"
                        ? [ ]
                        : [ {
                            Bounds: CandidateWorkspace.Bounds,
                            Node: CandidateWorkspace.Root,
                            Workspace: CandidateWorkspace
                        } ]),
                    Id
                );

                return Option.map(Candidate, (Value: {
                    readonly Bounds: Box.Box;
                    readonly Node: Tiling.Tree.PanelNode;
                    readonly Workspace: Tiling.Tree.Workspace;
                }): TiledFocusSelection => MakeTiledFocusSelection(
                    Value.Node,
                    Object.freeze([ ]),
                    Value.Workspace.Id
                ));
            }

            const TargetPath = ResolveTiledFocusPath(
                Workspace.Root,
                CurrentSelection.value.Path,
                Id
            );
            const TargetNode = TargetPath === undefined
                ? undefined
                : Tiling.Tree.GetNodeAtPath(Workspace.Root, TargetPath);

            return TargetPath === undefined || TargetNode === undefined
                ? Option.none()
                : Option.some(MakeTiledFocusSelection(
                    TargetNode,
                    TargetPath,
                    Workspace.Id
                ));
        });
        const ResolveTiledFocusCommit = Effect.gen(function*()
        {
            const CurrentSelection = yield* ResolveCurrentTiledFocusSelection;
            if (Option.isNone(CurrentSelection))
            {
                return Option.none<TiledFocusSelection>();
            }

            const Snapshot = yield* TilingManager.Snapshot;
            const Workspace = Snapshot.Workspaces.find((
                Candidate: Tiling.Tree.Workspace
            ) => Candidate.Id === CurrentSelection.value.WorkspaceId);
            const TargetPath = Workspace === undefined
                ? undefined
                : Tiling.Tree.CommitFocus(
                    Workspace.Root,
                    CurrentSelection.value.Path
                );
            const TargetNode = Workspace === undefined || TargetPath === undefined
                ? undefined
                : Tiling.Tree.GetNodeAtPath(Workspace.Root, TargetPath);

            return Workspace === undefined
                || TargetPath === undefined
                || TargetNode === undefined
                ? Option.none()
                : Option.some(MakeTiledFocusSelection(
                    TargetNode,
                    TargetPath,
                    Workspace.Id
                ));
        });
        const ResolveCurrentTiledMoveSelection = Effect.gen(function*()
        {
            const CurrentWindow = yield* Ref.get(ActivationWindow);
            return Option.isNone(CurrentWindow)
                ? Option.none<TiledFocusSelection>()
                : FindTiledFocusSelection(
                    yield* TilingManager.Snapshot,
                    CurrentWindow.value
                );
        });
        const ResolveTiledMoveAction = (
            Id: OverlayCommandId
        ): Effect.Effect<Option.Option<TiledMoveAction>> => Effect.gen(function*()
        {
            const CurrentSelection = yield* ResolveCurrentTiledMoveSelection;
            if (
                Option.isNone(CurrentSelection)
                || CurrentSelection.value.Node._tag !== "Window"
                || CurrentSelection.value.Path.length === 0
            )
            {
                return Option.none();
            }

            const Snapshot = yield* TilingManager.Snapshot;
            const Workspace = Snapshot.Workspaces.find(((
                Candidate: Tiling.Tree.Workspace
            ): boolean => Candidate.Id === CurrentSelection.value.WorkspaceId));
            if (Workspace === undefined)
            {
                return Option.none();
            }

            const PendingTarget = yield* Ref.get(TiledMovePanelTargetRef);
            if (Option.isSome(PendingTarget))
            {
                if (Id === CommandId.MoveWindowIntoPanel)
                {
                    const TargetNode = PendingTarget.value.WorkspaceId === Workspace.Id
                        ? Tiling.Tree.GetNodeAtPath(
                            Workspace.Root,
                            PendingTarget.value.TargetPanelPath
                        )
                        : undefined;

                    return TargetNode?._tag === "Panel"
                        ? Option.some({
                            TargetPanelPath: PendingTarget.value.TargetPanelPath,
                            _tag: "MoveIntoPanel"
                        } as const)
                        : Option.none();
                }

                const OppositeId = OppositeTiledMoveCommand[
                    PendingTarget.value.DirectionId
                ];
                if (Id !== OppositeId)
                {
                    return Option.none();
                }

                const Direction = TiledMoveDirectionByCommandId[Id];
                const TargetPath = Direction === undefined
                    ? undefined
                    : Tiling.Tree.MoveFocus(
                        Workspace.Root,
                        CurrentSelection.value.Path,
                        Direction
                    );
                const TargetNode = TargetPath === undefined
                    ? undefined
                    : Tiling.Tree.GetNodeAtPath(Workspace.Root, TargetPath);

                return TargetPath !== undefined && TargetNode?._tag === "Window"
                    ? Option.some({
                        TargetIndex: TargetPath.at(-1)!,
                        _tag: "MoveToIndex"
                    } as const)
                    : Option.none();
            }

            if (Id === CommandId.MoveWindowParent)
            {
                return CurrentSelection.value.Path.length >= 2
                    ? Option.some({ _tag: "MoveToContainingPanel" } as const)
                    : Option.none();
            }

            if (
                Id === CommandId.MoveWindowFirst
                || Id === CommandId.MoveWindowLast
            )
            {
                const TargetPath = Id === CommandId.MoveWindowFirst
                    ? Tiling.Tree.FocusFirstChild(
                        Workspace.Root,
                        CurrentSelection.value.Path
                    )
                    : Tiling.Tree.FocusLastChild(
                        Workspace.Root,
                        CurrentSelection.value.Path
                    );

                return TargetPath === undefined
                    ? Option.none()
                    : Option.some({
                        TargetIndex: TargetPath.at(-1)!,
                        _tag: "MoveToIndex"
                    } as const);
            }

            if (!IsTiledMoveDirectionCommandId(Id))
            {
                return Option.none();
            }

            const TargetPath = Tiling.Tree.MoveFocus(
                Workspace.Root,
                CurrentSelection.value.Path,
                TiledMoveDirectionByCommandId[Id]!
            );
            const TargetNode = TargetPath === undefined
                ? undefined
                : Tiling.Tree.GetNodeAtPath(Workspace.Root, TargetPath);

            if (TargetPath === undefined || TargetNode === undefined)
            {
                return Option.none();
            }

            return TargetNode._tag === "Panel"
                ? Option.some({
                    DirectionId: Id,
                    TargetPanelPath: TargetPath,
                    WorkspaceId: Workspace.Id,
                    _tag: "SelectPanel"
                } as const)
                : Option.some({
                    TargetIndex: TargetPath.at(-1)!,
                    _tag: "MoveToIndex"
                } as const);
        });

        return {
            Back: pipe(
                Logging.LogDebug("Overlay", "Moving to the preceding overlay screen."),
                Effect.andThen(SubscriptionRef.update(
                    Stack,
                    (Value: ReadonlyArray<OverlayScreenId>) =>
                        Value.length > 1
                            ? Object.freeze(Value.slice(0, -1))
                            : Value
                )),
                Effect.andThen(ClearFocusProxyWindows),
                Effect.andThen(ClearTiledFocusPanelPreview),
                Effect.andThen(ClearTiledMovePanelPreview),
                Effect.andThen(ClearFocusFailure),
                Effect.andThen(Ref.set(TiledFocusLocationRef, Option.none())),
                Effect.andThen(Ref.set(TiledMovePanelTargetRef, Option.none()))
            ),
            Changes: pipe(SubscriptionRef.changes(Stack), Stream.map(GetCurrent)),
            ClearActivationWindow: pipe(
                Ref.set(ActivationWindow, Option.none()),
                Effect.andThen(ClearFocusProxyWindows),
                Effect.andThen(ClearTiledFocusPanelPreview),
                Effect.andThen(ClearTiledMovePanelPreview),
                Effect.andThen(Ref.set(TiledFocusLocationRef, Option.none())),
                Effect.andThen(Ref.set(TiledMovePanelTargetRef, Option.none()))
            ),
            ClearFocusPreview,
            ClearTiledInsert,
            ClearTiledMovePanelTarget: Ref.set(
                TiledMovePanelTargetRef,
                Option.none()
            ),
            Current,
            FineModifierHeld: Ref.get(FineModifierHeldRef),
            FocusFailure: Ref.get(FocusFailureRef),
            GetActivationApplicationName: pipe(
                Ref.get(ActivationWindow),
                Effect.map(Option.flatMap(GetApplicationName))
            ),
            GetActivationWindow: Ref.get(ActivationWindow),
            MoveTiledInsertSelection: (Delta: number) => Effect.gen(function*()
            {
                const Candidates = yield* Ref.get(TiledInsertWindowsRef);
                if (Candidates.length === 0)
                {
                    return;
                }

                yield* Ref.update(
                    TiledInsertSelectionRef,
                    (CurrentIndex: number): number =>
                        (
                            CurrentIndex
                            + Math.sign(Delta)
                            + Candidates.length
                        ) % Candidates.length
                );
            }),
            Navigate: (Screen: OverlayScreenId) => pipe(
                Logging.LogDebug("Overlay", "Navigating to an overlay screen.", {
                    Screen
                }),
                Effect.andThen(SubscriptionRef.update(
                    Stack,
                    (Value: ReadonlyArray<OverlayScreenId>) => GetCurrent(Value) === Screen
                        ? Value
                        : Object.freeze([ ...Value, Screen ])
                )),
                Effect.andThen(
                    Screen === ScreenId.FloatingFocus ? Effect.void : ClearFocusProxyWindows
                ),
                Effect.andThen(
                    Screen === ScreenId.TiledFocus
                        ? Effect.void
                        : ClearTiledFocusPanelPreview
                ),
                Effect.andThen(
                    Screen === ScreenId.TiledMove
                        ? Effect.void
                        : ClearTiledMovePanelPreview
                ),
                Effect.andThen(
                    Screen === ScreenId.TiledFocus
                        ? InitializeTiledFocus
                        : Effect.void
                ),
                Effect.andThen(
                    Screen === ScreenId.TiledResize
                        ? Settings.GetSetting("TiledResizeBehavior").pipe(
                            Effect.flatMap((Behavior: TiledResizeBehavior) =>
                                Ref.set(TiledResizeBehaviorRef, Behavior))
                        )
                        : Effect.void
                ),
                Effect.andThen(Ref.set(TiledMovePanelTargetRef, Option.none())),
                Effect.andThen(ClearFocusFailure)
            ),
            PreviewFocusTarget: (Id: OverlayCommandId | null) => Effect.gen(function*()
            {
                if (Id === null)
                {
                    return yield* ClearFocusPreview;
                }

                if ((yield* Current) === ScreenId.TiledFocus)
                {
                    return yield* ClearFocusPreview;
                }

                const CurrentWindow = yield* Ref.get(ActivationWindow);
                const Excluded = yield* Ref.get(ExcludedFocusWindows);
                const Target = ResolveTarget(CurrentWindow, Id, Excluded);

                if (Option.isNone(CurrentWindow) || Option.isNone(Target))
                {
                    return yield* ClearFocusPreview;
                }

                const OverlayWindow = yield* BrowserWindows.GetNativeHandle(
                    BrowserWindow.Key.Overlay
                );
                const FocusProxyWindows = yield* GetFocusProxyNativeHandles;
                const ResultValue = Window.DimWindowsExcept([
                    CurrentWindow.value,
                    OverlayWindow,
                    Target.value.Window,
                    ...FocusProxyWindows
                ]);

                if (Result.isFailure(ResultValue))
                {
                    return yield* Effect.fail(ResultValue.failure);
                }
            }),
            PrimaryModifierHeld: Ref.get(PrimaryModifierHeldRef),
            RecordFocusFailure: (Failure: FocusFailure) => pipe(
                Logging.LogWarning(
                    "Overlay.Focus",
                    "A focus target was excluded after Windows rejected focus.",
                    undefined,
                    { Window: Failure.Window }
                ),
                Effect.andThen(Ref.update(
                    ExcludedFocusWindows,
                    (Current: ReadonlySet<Handle.HWND>) => new Set([ ...Current, Failure.Window ])
                )),
                Effect.andThen(Ref.set(FocusFailureRef, Option.some(Failure)))
            ),
            RecordRaisedFloatingWindowZOrder: (Value: RaisedFloatingWindowZOrder) =>
                Ref.set(RaisedFloatingWindowZOrderRef, Option.some(Value)),
            RefreshTiledInsertWindows,
            Reset: Effect.gen(function*()
            {
                const CurrentWindow = yield* Ref.get(ActivationWindow);
                const Home = yield* ResolveHomeScreen(CurrentWindow);

                yield* Logging.LogDebug("Overlay", "Resetting the overlay session.", {
                    Home
                });
                yield* SubscriptionRef.set(Stack, Object.freeze([ Home ]));
                yield* Ref.set(ExcludedFocusWindows, new Set());
                yield* Ref.set(TiledFocusLocationRef, Option.none());
                yield* Ref.set(TiledMovePanelTargetRef, Option.none());
                yield* ClearTiledInsert;
                yield* ClearFocusProxyWindows;
                yield* ClearTiledFocusPanelPreview;
                yield* ClearTiledMovePanelPreview;
                yield* ClearFocusFailure;
            }),
            ResizeMode: Ref.get(ResizeModeRef),
            ResolveFocusTarget: ResolveCurrentFocusTarget,
            ResolveTiledFocusCommit,
            ResolveTiledFocusTarget,
            ResolveTiledMoveAction,
            ResolveTiledStackWindow: (Index: number) => Effect.gen(function*()
            {
                const CurrentSelection = yield* ResolveCurrentTiledFocusSelection;
                if (
                    Option.isNone(CurrentSelection)
                    || CurrentSelection.value.Node._tag !== "Panel"
                    || CurrentSelection.value.Node.Orientation
                        !== Tiling.Tree.Orientation.Stack
                )
                {
                    return Option.none();
                }

                const StackWindows = CurrentSelection.value.StackWindows ?? [ ];
                return Index < 0 || Index >= StackWindows.length
                    ? Option.none()
                    : Option.some(MakeTiledFocusSelection(
                        CurrentSelection.value.Node,
                        CurrentSelection.value.Path,
                        CurrentSelection.value.WorkspaceId,
                        StackWindows,
                        Index
                    ));
            }),
            SelectedTiledInsertWindow: Effect.gen(function*()
            {
                const Candidates = yield* Ref.get(TiledInsertWindowsRef);
                const Selection = yield* Ref.get(TiledInsertSelectionRef);
                return Option.fromNullishOr(Candidates[Selection]?.Window);
            }),
            SetActivationWindow: (WindowHandle: Handle.HWND) => pipe(
                Logging.LogDebug("Overlay", "Set the overlay activation window.", {
                    Window: WindowHandle
                }),
                Effect.andThen(Ref.set(ActivationWindow, Option.some(WindowHandle))),
                Effect.andThen(UpdateHomeScreen(Option.some(WindowHandle)))
            ),
            SetFineModifierHeld: (Held: boolean) =>
                Ref.set(FineModifierHeldRef, Held),
            SetPrimaryModifierHeld: (Held: boolean) =>
                Ref.set(PrimaryModifierHeldRef, Held),
            SetResizeMode: (Mode: ResizeModeType) =>
                Ref.set(ResizeModeRef, Mode),
            SetTiledFocusSelection: (Selection: TiledFocusSelection) =>
                Logging.LogDebug("Overlay.Focus", "Changed the tiled focus selection.", {
                    Path: Selection.Path,
                    WorkspaceId: Selection.WorkspaceId
                }).pipe(Effect.andThen(Ref.set(TiledFocusLocationRef, Option.some({
                    Path: Selection.Path,
                    ...(Selection.StackActiveIndex === undefined
                        ? { }
                        : { StackActiveIndex: Selection.StackActiveIndex }),
                    ...(Selection.StackWindows === undefined
                        ? { }
                        : { StackWindows: Selection.StackWindows }),
                    WorkspaceId: Selection.WorkspaceId
                })))),
            SetTiledInsertCaptureNext: (
                Enabled: boolean
            ) => Ref.set(TiledInsertCaptureNextRef, Enabled),
            SetTiledInsertDragActive: (
                Active: boolean
            ) => Ref.set(TiledInsertDragActiveRef, Active),
            SetTiledInsertTarget: (
                Target: TiledInsertTarget
            ) => Ref.set(TiledInsertTargetRef, Option.some(Object.freeze(Target))),
            SetTiledMovePanelTarget: (Target: TiledMovePanelTarget) =>
                Logging.LogDebug("Overlay.Move", "Selected a tiled move target panel.", {
                    Path: Target.TargetPanelPath,
                    WorkspaceId: Target.WorkspaceId
                }).pipe(Effect.andThen(
                    Ref.set(TiledMovePanelTargetRef, Option.some(Target))
                )),
            Snapshot: Effect.gen(function*()
            {
                const CurrentScreen = yield* Current;
                const CurrentSettings = yield* Settings.Get;
                const CurrentWindowOpt = yield* Ref.get(ActivationWindow);
                const Held = yield* Ref.get(PrimaryModifierHeldRef);
                const FineHeld = yield* Ref.get(FineModifierHeldRef);
                const CurrentResizeMode = yield* Ref.get(ResizeModeRef);
                const CurrentTiledResizeBehavior = yield* Ref.get(
                    TiledResizeBehaviorRef
                );
                const Excluded = yield* Ref.get(ExcludedFocusWindows);
                const TilingSnapshot = yield* TilingManager.Snapshot;
                const CanTileAll = CurrentScreen === ScreenId.FloatingHome
                    && Tiling.Tree.AreRootPanelsEmpty(TilingSnapshot);
                const FocusTargets: Partial<Record<
                    OverlayCommandId,
                    OverlayCommandTargetDto
                >> = { };
                const MonitorsResult = CurrentScreen === ScreenId.TiledFocus
                    ? Screen.GetMonitors()
                    : Result.succeed([ ] as ReadonlyArray<Screen.MonitorInfo>);
                if (Result.isFailure(MonitorsResult))
                {
                    yield* Logging.LogWarning(
                        "Overlay.Focus",
                        "Could not enumerate monitors for tiled focus.",
                        MonitorsResult.failure
                    );
                }
                const Monitors = Result.isSuccess(MonitorsResult)
                    ? MonitorsResult.success
                    : [ ];
                const DisabledCommandIds = new Set<OverlayCommandId>();
                let IsRootPanelFocused = false;
                let IsTiledMovePanelTargeted = false;
                let InsertWindows: ReadonlyArray<OverlayInsertWindowDto> = [ ];
                let StackWindows: ReadonlyArray<OverlayStackWindowDto> = [ ];

                if (CurrentScreen === ScreenId.FloatingFocus)
                {
                    const WindowsResult = Window.GetManageableTopLevelWindows();
                    if (Result.isFailure(WindowsResult))
                    {
                        yield* Logging.LogWarning(
                            "Overlay.Focus",
                            "Could not enumerate focusable windows.",
                            WindowsResult.failure
                        );
                    }
                    yield* ClearTiledFocusPanelPreview;
                    yield* ClearTiledMovePanelPreview;

                    for (const Id of FocusCommandIds)
                    {
                        const Target = ResolveTarget(CurrentWindowOpt, Id, Excluded);

                        if (Option.isSome(Target))
                        {
                            FocusTargets[Id] = GetTargetPresentation(Target.value);
                        }
                    }

                    yield* SyncFocusProxyWindows(
                        CurrentWindowOpt,
                        Excluded,
                        CurrentSettings
                    );
                }
                else if (CurrentScreen === ScreenId.TiledFocus)
                {
                    yield* ClearTiledMovePanelPreview;
                    const CurrentSelection = yield* ResolveCurrentTiledFocusSelection;
                    yield* SyncTiledFocusPanelPreview(
                        CurrentSelection,
                        CurrentSettings
                    );
                    IsRootPanelFocused = Option.isSome(CurrentSelection)
                        && CurrentSelection.value.Path.length === 0
                        && CurrentSelection.value.Node._tag === "Panel";
                    StackWindows = Option.isSome(CurrentSelection)
                        ? GetStackWindowPresentations(CurrentSelection.value)
                        : [ ];

                    for (const Id of TiledFocusCommandIds)
                    {
                        const Target = yield* ResolveTiledFocusTarget(Id);

                        if (Option.isSome(Target))
                        {
                            FocusTargets[Id] = GetTiledFocusPresentation(
                                Target.value,
                                Monitors
                            );
                        }
                    }
                }
                else if (CurrentScreen === ScreenId.TiledMove)
                {
                    yield* ClearTiledFocusPanelPreview;
                    const PanelTarget = yield* Ref.get(TiledMovePanelTargetRef);
                    IsTiledMovePanelTargeted = Option.isSome(PanelTarget);
                    yield* SyncTiledMovePanelPreview(
                        PanelTarget,
                        CurrentSettings
                    );

                    for (const Id of TiledMoveCommandIds)
                    {
                        if (Option.isNone(yield* ResolveTiledMoveAction(Id)))
                        {
                            DisabledCommandIds.add(Id);
                        }
                    }
                }
                else if (CurrentScreen === ScreenId.TiledInsertWindow)
                {
                    const Candidates = yield* Ref.get(TiledInsertWindowsRef);
                    const Selection = yield* Ref.get(TiledInsertSelectionRef);
                    InsertWindows = Candidates.map((
                        Candidate: TiledInsertWindowCandidate,
                        Index: number
                    ): OverlayInsertWindowDto => ({
                        Active: Index === Selection,
                        Target: Candidate.Target
                    }));

                    if (Candidates.length === 0)
                    {
                        DisabledCommandIds.add(CommandId.CommitInsertWindow);
                    }
                }
                else
                {
                    yield* ClearTiledFocusPanelPreview;
                    yield* ClearTiledMovePanelPreview;
                }

                const ApplicationTarget = Option.map(
                    CurrentWindowOpt,
                    (CurrentWindow: Handle.HWND) =>
                    {
                        const Name = GetApplicationName(CurrentWindow);
                        return Option.isNone(Name) ? { } : { Name: Name.value };
                    }
                );
                const CurrentFocusFailure = yield* Ref.get(FocusFailureRef);
                const ScreenDto = OverlayCommandCatalog.FromKeybindSettings(
                    CurrentScreen,
                    CurrentSettings.Keybinds,
                    FocusTargets,
                    ApplicationTarget.valueOrUndefined,
                    Held,
                    FineHeld,
                    CurrentSettings.MoveStepPrimary,
                    CurrentSettings.MoveStepSecondary,
                    CurrentResizeMode,
                    IsRootPanelFocused,
                    IsRootPanelFocused
                        ? GetMonitorCommandStates(TilingSnapshot, Monitors)
                        : { },
                    CanTileAll,
                    DisabledCommandIds,
                    IsTiledMovePanelTargeted,
                    StackWindows,
                    CurrentTiledResizeBehavior,
                    InsertWindows
                );

                return (
                    CurrentScreen === ScreenId.FloatingFocus
                    || CurrentScreen === ScreenId.TiledFocus
                )
                    && Option.isSome(CurrentFocusFailure)
                    ? {
                        ...ScreenDto,
                        FocusFailure: { WindowTitle: CurrentFocusFailure.value.WindowTitle }
                    }
                    : ScreenDto;
            }),
            TakeActivationWindow: Ref.getAndSet(ActivationWindow, Option.none()),
            TakeRaisedFloatingWindowZOrder: Ref.getAndSet(
                RaisedFloatingWindowZOrderRef,
                Option.none()
            ),
            TiledInsertCaptureNext: Ref.get(TiledInsertCaptureNextRef),
            TiledInsertDragActive: Ref.get(TiledInsertDragActiveRef),
            TiledInsertTarget: Ref.get(TiledInsertTargetRef),
            TiledResizeBehavior: Ref.get(TiledResizeBehaviorRef),
            ToggleTiledResizeBehavior: Ref.update(
                TiledResizeBehaviorRef,
                (Current: TiledResizeBehavior): TiledResizeBehavior =>
                    Current === "PreserveRatios"
                        ? "AdjacentOnly"
                        : "PreserveRatios"
            )
        } as const;
    })
);
