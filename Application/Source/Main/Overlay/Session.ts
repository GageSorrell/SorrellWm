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
import { AppSettings, BrowserWindow } from "../index.ts";
import {
    OverlayCommandId as CommandId,
    type OverlayCommandId,
    type OverlayCommandTargetDto,
    type OverlayScreenDto,
    type OverlayScreenId,
    OverlayScreenId as ScreenId
} from "../../Shared/OverlayCommand.js";
import { Context, Effect, Layer, Option, Ref, Result, Stream, Struct, SubscriptionRef, pipe } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import type { Box } from "@sorrell/math";

const TypeId = "~sorrell/wm/Main/Overlay/Session" as const;

/** A manageable window paired with the bounds used for directional selection. */
export interface FocusWindowCandidate
{
    readonly Bounds: Box.Box;
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

const IsFocusCommandId = (Id: OverlayCommandId): Id is FocusCommandId =>
    (FocusCommandIds as ReadonlyArray<OverlayCommandId>).includes(Id);

const IsInDirection = (
    Id: FocusCommandId,
    DeltaX: number,
    DeltaY: number
): boolean =>
{
    switch (Id)
    {
        case CommandId.FocusMoveDown:
            return DeltaY > 0;
        case CommandId.FocusMoveLeft:
            return DeltaX < 0;
        case CommandId.FocusMoveRight:
            return DeltaX > 0;
        case CommandId.FocusMoveUp:
            return DeltaY < 0;
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

    /** Clear any active Focus hover preview. */
    readonly ClearFocusPreview: Effect.Effect<void>;

    /** Resolve the current target for one directional Focus command. */
    readonly ResolveFocusTarget: (
        Id: OverlayCommandId
    ) => Effect.Effect<Option.Option<Handle.HWND>>;

    /** Set the window from which the overlay was activated. */
    readonly SetActivationWindow: (Window: Handle.HWND) => Effect.Effect<void>;

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
    Stack.at(-1) ?? ScreenId.Home;

const GetWindowCandidates = (
    CurrentWindow: Handle.HWND
): ReadonlyArray<FocusWindowCandidate> =>
{
    const Windows = Window.GetManageableTopLevelWindows();

    if (Result.isFailure(Windows))
    {
        return [ ];
    }

    return Windows.success.flatMap((WindowHandle: Handle.HWND) =>
    {
        if (WindowHandle === CurrentWindow)
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
    Id: OverlayCommandId
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
        GetWindowCandidates(CurrentWindow.value),
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
        const ActivationWindow = yield* Ref.make(Option.none<Handle.HWND>());
        const Stack = yield* SubscriptionRef.make<ReadonlyArray<OverlayScreenId>>(
            Object.freeze([ ScreenId.Home ])
        );
        const Current = pipe(SubscriptionRef.get(Stack), Effect.map(GetCurrent));
        const ClearFocusPreview = Effect.sync(() =>
        {
            Window.ClearWindowDimming();
        });
        const ResolveCurrentFocusTarget = (
            Id: OverlayCommandId
        ): Effect.Effect<Option.Option<Handle.HWND>> => pipe(
            Ref.get(ActivationWindow),
            Effect.map((CurrentWindow: Option.Option<Handle.HWND>) =>
                Option.map(ResolveTarget(CurrentWindow, Id), Struct.get("Window")))
        );

        return {
            Back: SubscriptionRef.update(
                Stack,
                (Value: ReadonlyArray<OverlayScreenId>) =>
                    Value.length > 1
                        ? Object.freeze(Value.slice(0, -1))
                        : Value
            ),
            Changes: pipe(SubscriptionRef.changes(Stack), Stream.map(GetCurrent)),
            ClearActivationWindow: Ref.set(ActivationWindow, Option.none()),
            ClearFocusPreview,
            Current,
            GetActivationApplicationName: pipe(
                Ref.get(ActivationWindow),
                Effect.map(Option.flatMap(GetApplicationName))
            ),
            Navigate: (Screen: OverlayScreenId) => SubscriptionRef.update(
                Stack,
                (Value: ReadonlyArray<OverlayScreenId>) => GetCurrent(Value) === Screen
                    ? Value
                    : Object.freeze([ ...Value, Screen ])
            ),
            PreviewFocusTarget: (Id: OverlayCommandId | null) => Effect.gen(function*()
            {
                if (Id === null)
                {
                    return yield* ClearFocusPreview;
                }

                const CurrentWindow = yield* Ref.get(ActivationWindow);
                const Target = ResolveTarget(CurrentWindow, Id);

                if (Option.isNone(CurrentWindow) || Option.isNone(Target))
                {
                    return yield* ClearFocusPreview;
                }

                const OverlayWindow = yield* BrowserWindows.GetNativeHandle(
                    BrowserWindow.Key.Overlay
                );
                const ResultValue = Window.DimWindowsExcept([
                    CurrentWindow.value,
                    OverlayWindow,
                    Target.value.Window
                ]);

                if (Result.isFailure(ResultValue))
                {
                    return yield* Effect.fail(ResultValue.failure);
                }
            }),
            Reset: SubscriptionRef.set(Stack, Object.freeze([ ScreenId.Home ])),
            ResolveFocusTarget: ResolveCurrentFocusTarget,
            SetActivationWindow: (WindowHandle: Handle.HWND) =>
                Ref.set(ActivationWindow, Option.some(WindowHandle)),
            Snapshot: Effect.gen(function*()
            {
                const CurrentScreen = yield* Current;
                const CurrentSettings = yield* Settings.Get;
                const CurrentWindowOpt = yield* Ref.get(ActivationWindow);
                const FocusTargets: Partial<Record<
                    OverlayCommandId,
                    OverlayCommandTargetDto
                >> = { };

                if (CurrentScreen === ScreenId.Focus)
                {
                    for (const Id of FocusCommandIds)
                    {
                        const Target = ResolveTarget(CurrentWindowOpt, Id);

                        if (Option.isSome(Target))
                        {
                            FocusTargets[Id] = GetTargetPresentation(Target.value);
                        }
                    }
                }

                const ApplicationTarget = Option.map(
                    CurrentWindowOpt,
                    (CurrentWindow: Handle.HWND) =>
                    {
                        const Name = GetApplicationName(CurrentWindow);
                        return Option.isNone(Name) ? { } : { Name: Name.value };
                    }
                );

                return OverlayCommandCatalog.FromKeybindSettings(
                    CurrentScreen,
                    CurrentSettings.Keybinds,
                    FocusTargets,
                    ApplicationTarget.valueOrUndefined
                );
            }),
            TakeActivationWindow: Ref.getAndSet(ActivationWindow, Option.none())
        } as const;
    })
);
