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
import * as OverlayCommandCatalog from "./CommandCatalog.ts";
import * as Tiling from "../Tiling/index.ts";
import { AppSettings, BrowserWindow } from "../index.ts";
import {
    OverlayCommandId as CommandId,
    type OverlayCommandId,
    type OverlayCommandTargetDto,
    type OverlayScreenDto,
    type OverlayScreenId,
    ResizeMode,
    type ResizeMode as ResizeModeType,
    OverlayScreenId as ScreenId
} from "../../Shared/OverlayCommand.js";
import { Context, Effect, Layer, Option, Ref, Result, Stream, Struct, SubscriptionRef, pipe } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import { AppApiChannel } from "../../Shared/Api.ts";
import type { Box } from "@sorrell/math";
import type { FocusPreviewPresentation } from "../../Shared/FocusPreview.ts";

const TypeId = "~sorrell/wm/Main/Overlay/Session" as const;

/** A manageable window paired with the bounds used for directional selection. */
export interface FocusWindowCandidate
{
    readonly Bounds: Box.Box;
    readonly Window: Handle.HWND;
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

const IsFocusCommandId = (Id: OverlayCommandId): Id is FocusCommandId =>
    (FocusCommandIds as ReadonlyArray<OverlayCommandId>).includes(Id);

const IsWindowTiled = (
    Snapshot: Tiling.Tree.State,
    WindowValue: Handle.HWND
): boolean => Snapshot.Workspaces.some((Workspace: Tiling.Tree.Workspace) =>
    Tiling.Tree.HasWindow(Workspace.Root, WindowValue));

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

export/** Select the nearest candidate whose center is in the requested direction. */
const SelectDirectionalWindow = (
    CurrentBounds: Box.Box,
    Candidates: ReadonlyArray<FocusWindowCandidate>,
    Id: FocusCommandId
): Option.Option<FocusWindowCandidate> =>
{
    const CurrentCenter = BoxUtility.CenterPoint(CurrentBounds);
    let Selected: FocusWindowCandidate | undefined;
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

    /** Set the window from which the overlay was activated. */
    readonly SetActivationWindow: (Window: Handle.HWND) => Effect.Effect<void>;

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

export/** Live overlay navigation state scoped to the application runtime. */
const Live = Layer.effect(
    OverlaySession,
    Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;
        const Settings = yield* AppSettings.AppSettings;
        const TilingManager = yield* Tiling.Manager.TilingManager;
        const ActivationWindow = yield* Ref.make(Option.none<Handle.HWND>());
        const PrimaryModifierHeldRef = yield* Ref.make(false);
        const FineModifierHeldRef = yield* Ref.make(false);
        const ResizeModeRef = yield* Ref.make<ResizeModeType>(ResizeMode.Grow);
        const ExcludedFocusWindows = yield* Ref.make<ReadonlySet<Handle.HWND>>(new Set());
        const FocusFailureRef = yield* Ref.make(Option.none<FocusFailure>());
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
                    yield* Close;
                    continue;
                }

                const TargetIcon = Window.GetIcon(Target.value.Window);
                const Presentation: FocusPreviewPresentation = {
                    Opacity: CurrentSettings.FocusPreviewOpacity,
                    ...(Option.isSome(TargetIcon) ? { Icon: TargetIcon.value } : { })
                };

                yield* BrowserWindows.Ensure(
                    BrowserWindow.GetFocusPreviewWindowSpec(Key, Target.value.Bounds)
                ).pipe(Effect.ignore);
                yield* BrowserWindows.SetBounds(Key, Target.value.Bounds).pipe(Effect.ignore);
                yield* BrowserWindows.Send(
                    Key,
                    AppApiChannel.FocusPreviewChanged,
                    Presentation
                ).pipe(Effect.ignore);
                yield* BrowserWindows.ShowInactive(Key).pipe(Effect.ignore);
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

                AnyProxyVisible = true;
            }

            if (AnyProxyVisible)
            {
                // Both surfaces are always-on-top. Raising the command overlay
                // last guarantees every proxy remains directly beneath it.
                yield* BrowserWindows.ShowInactive(BrowserWindow.Key.Overlay).pipe(Effect.ignore);
            }
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

        return {
            Back: pipe(
                SubscriptionRef.update(
                    Stack,
                    (Value: ReadonlyArray<OverlayScreenId>) =>
                        Value.length > 1
                            ? Object.freeze(Value.slice(0, -1))
                            : Value
                ),
                Effect.andThen(ClearFocusProxyWindows),
                Effect.andThen(ClearFocusFailure)
            ),
            Changes: pipe(SubscriptionRef.changes(Stack), Stream.map(GetCurrent)),
            ClearActivationWindow: pipe(
                Ref.set(ActivationWindow, Option.none()),
                Effect.andThen(ClearFocusProxyWindows)
            ),
            ClearFocusPreview,
            Current,
            FineModifierHeld: Ref.get(FineModifierHeldRef),
            FocusFailure: Ref.get(FocusFailureRef),
            GetActivationApplicationName: pipe(
                Ref.get(ActivationWindow),
                Effect.map(Option.flatMap(GetApplicationName))
            ),
            GetActivationWindow: Ref.get(ActivationWindow),
            Navigate: (Screen: OverlayScreenId) => pipe(
                SubscriptionRef.update(
                    Stack,
                    (Value: ReadonlyArray<OverlayScreenId>) => GetCurrent(Value) === Screen
                        ? Value
                        : Object.freeze([ ...Value, Screen ])
                ),
                Effect.andThen(
                    Screen === ScreenId.FloatingFocus ? Effect.void : ClearFocusProxyWindows
                ),
                Effect.andThen(ClearFocusFailure)
            ),
            PreviewFocusTarget: (Id: OverlayCommandId | null) => Effect.gen(function*()
            {
                if (Id === null)
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
                Ref.update(
                    ExcludedFocusWindows,
                    (Current: ReadonlySet<Handle.HWND>) => new Set([ ...Current, Failure.Window ])
                ),
                Effect.andThen(Ref.set(FocusFailureRef, Option.some(Failure)))
            ),
            Reset: Effect.gen(function*()
            {
                const CurrentWindow = yield* Ref.get(ActivationWindow);
                const Home = yield* ResolveHomeScreen(CurrentWindow);

                yield* SubscriptionRef.set(Stack, Object.freeze([ Home ]));
                yield* Ref.set(ExcludedFocusWindows, new Set());
                yield* ClearFocusProxyWindows;
                yield* ClearFocusFailure;
            }),
            ResizeMode: Ref.get(ResizeModeRef),
            ResolveFocusTarget: ResolveCurrentFocusTarget,
            SetActivationWindow: (WindowHandle: Handle.HWND) => pipe(
                Ref.set(ActivationWindow, Option.some(WindowHandle)),
                Effect.andThen(UpdateHomeScreen(Option.some(WindowHandle)))
            ),
            SetFineModifierHeld: (Held: boolean) =>
                Ref.set(FineModifierHeldRef, Held),
            SetPrimaryModifierHeld: (Held: boolean) =>
                Ref.set(PrimaryModifierHeldRef, Held),
            SetResizeMode: (Mode: ResizeModeType) =>
                Ref.set(ResizeModeRef, Mode),
            Snapshot: Effect.gen(function*()
            {
                const CurrentScreen = yield* Current;
                const CurrentSettings = yield* Settings.Get;
                const CurrentWindowOpt = yield* Ref.get(ActivationWindow);
                const Held = yield* Ref.get(PrimaryModifierHeldRef);
                const FineHeld = yield* Ref.get(FineModifierHeldRef);
                const CurrentResizeMode = yield* Ref.get(ResizeModeRef);
                const Excluded = yield* Ref.get(ExcludedFocusWindows);
                const FocusTargets: Partial<Record<
                    OverlayCommandId,
                    OverlayCommandTargetDto
                >> = { };

                if (CurrentScreen === ScreenId.FloatingFocus)
                {
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

                const ApplicationTarget = Option.map(
                    CurrentWindowOpt,
                    (CurrentWindow: Handle.HWND) =>
                    {
                        const Name = GetApplicationName(CurrentWindow);
                        return Option.isNone(Name) ? { } : { Name: Name.value };
                    }
                );
                const CurrentFocusFailure = yield* Ref.get(FocusFailureRef);
                const Screen = OverlayCommandCatalog.FromKeybindSettings(
                    CurrentScreen,
                    CurrentSettings.Keybinds,
                    FocusTargets,
                    ApplicationTarget.valueOrUndefined,
                    Held,
                    FineHeld,
                    CurrentSettings.MoveStepPrimary,
                    CurrentSettings.MoveStepSecondary,
                    CurrentResizeMode
                );

                return CurrentScreen === ScreenId.FloatingFocus
                    && Option.isSome(CurrentFocusFailure)
                    ? {
                        ...Screen,
                        FocusFailure: { WindowTitle: CurrentFocusFailure.value.WindowTitle }
                    }
                    : Screen;
            }),
            TakeActivationWindow: Ref.getAndSet(ActivationWindow, Option.none())
        } as const;
    })
);
