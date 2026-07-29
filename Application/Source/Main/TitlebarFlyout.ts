/**
 * When enabled, this draws the overlay window beneath the "maximize" button of a window
 * when that button is hovered over.  This is similar to the behavior provided by Windows's
 * snapping feature.
 *
 * @module @sorrell/wm/Main/TitlebarFlyout
 *
 * @file      TitlebarFlyout.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "./AppSettings/AppSettings.ts";
import * as BrowserWindow from "./BrowserWindow.js";
import * as Logging from "./Log.ts";
import * as Overlay from "./Overlay/index.js";
import { Box, type IntPoint } from "@sorrell/math";
import { Context, Duration, Effect, Layer, Option, pipe } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import { AppApiChannel } from "../Shared/Api.js";

const TypeId = "~sorrell/wm/Main/TitlebarFlyout" as const;
const FlyoutHeight = 800 as const;
const FlyoutWidth = 480 as const;
const PollInterval = Duration.millis(75);
export/** Hover duration used when Windows cannot report its configured timeout. */
const DefaultFlyoutHoverDelayMilliseconds = 1_000 as const;

interface ActiveFlyout
{
    readonly ButtonBounds: Box.Box;
    readonly OverlayBounds: Box.Box;
    readonly Window: Handle.HWND;
}

interface PendingFlyout
{
    readonly ButtonBounds: Box.Box;
    readonly HoverBeganAtMilliseconds: number;
    readonly Window: Handle.HWND;
}

/** The running titlebar-flyout controller. */
export interface TitlebarFlyoutImpl
{
    readonly _tag: "TitlebarFlyout";
}

/** Supervise the optional overlay flyout shown from native maximize buttons. */
export class TitlebarFlyout extends
    Context.Service<TitlebarFlyout, TitlebarFlyoutImpl>()(TypeId) { }

export/** Determine whether a cursor point is inside a half-open screen rectangle. */
const ContainsPoint = (Bounds: Box.Box, Point: IntPoint.IntPoint): boolean =>
    Bounds.Left <= Point.X &&
    Point.X < Bounds.Right &&
    Bounds.Top <= Point.Y &&
    Point.Y < Bounds.Bottom;

export/** Resolve the native hover time, falling back when Windows cannot provide it. */
const ResolveHoverDelayMilliseconds = (
    HoverTime: Option.Option<number>
): number => pipe(
    HoverTime,
    Option.filter((Milliseconds: number) =>
        Number.isSafeInteger(Milliseconds) && Milliseconds > 0
    ),
    Option.getOrElse(() => DefaultFlyoutHoverDelayMilliseconds)
);

export/** Determine whether a continuous hover has reached its required duration. */
const HasHoverDelayElapsed = (
    HoverBeganAtMilliseconds: number,
    CurrentTimeMilliseconds: number,
    HoverDelayMilliseconds: number
): boolean =>
    CurrentTimeMilliseconds - HoverBeganAtMilliseconds >= HoverDelayMilliseconds;

const IsSameMaximizeButton = (
    Pending: PendingFlyout,
    Hover: Window.HoveredMaximizeButton
): boolean =>
    Pending.Window === Hover.Window &&
    Pending.ButtonBounds.Bottom === Hover.Bounds.Bottom &&
    Pending.ButtonBounds.Left === Hover.Bounds.Left &&
    Pending.ButtonBounds.Right === Hover.Bounds.Right &&
    Pending.ButtonBounds.Top === Hover.Bounds.Top;

export/**
       * Determine whether the custom flyout should replace the built-in Snap
       * layouts flyout.
       */
const ShouldShow = (
    IsEnabled: boolean,
    IsSnapWindowsEnabled: Option.Option<boolean>,
    IsSnapLayoutsOnHoverEnabled: Option.Option<boolean>
): boolean => IsEnabled && (
    Option.exists(IsSnapWindowsEnabled, (Value: boolean) => !Value) ||
    Option.exists(IsSnapLayoutsOnHoverEnabled, (Value: boolean) => !Value)
);

export/** Place the overlay directly below or above a maximize button. */
const GetOverlayBounds = (
    ButtonBounds: Box.Box,
    WorkArea: Box.Box
): Box.Box =>
{
    const Width = Math.min(FlyoutWidth, Box.Width(WorkArea));
    const Height = Math.min(FlyoutHeight, Box.Height(WorkArea));
    const Left = Math.max(
        WorkArea.Left,
        Math.min(ButtonBounds.Right - Width, WorkArea.Right - Width)
    );
    const HasRoomBelow = ButtonBounds.Bottom + Height <= WorkArea.Bottom;
    const Top = HasRoomBelow
        ? Math.max(WorkArea.Top, ButtonBounds.Bottom)
        : Math.min(WorkArea.Bottom - Height, ButtonBounds.Top - Height);

    return Box.Box(Top, Left + Width, Top + Height, Left);
};

export/** Live scoped controller for the optional titlebar flyout. */
const Live = Layer.effect(
    TitlebarFlyout,
    Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;
        const Session = yield* Overlay.Session.OverlaySession;
        const Settings = yield* AppSettings.AppSettings;
        const HoverDelayMilliseconds = ResolveHoverDelayMilliseconds(
            Window.GetMouseHoverTime()
        );
        let Active: ActiveFlyout | undefined;
        let Pending: PendingFlyout | undefined;

        const Hide = (): Effect.Effect<void> =>
        {
            Pending = undefined;
            if (Active === undefined)
            {
                return Effect.void;
            }

            Active = undefined;
            return pipe(
                Logging.LogDebug("TitlebarFlyout", "Hiding the titlebar flyout."),
                Effect.andThen(
                    BrowserWindows.Hide(BrowserWindow.Key.Overlay)
                ),
                Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void),
                Effect.andThen(Session.Reset),
                Effect.andThen(Session.ClearActivationWindow),
                Effect.andThen(Session.ClearFocusPreview),
                Effect.catch(() => Effect.void)
            );
        };

        const Show = (
            Hover: Window.HoveredMaximizeButton,
            OverlayBounds: Box.Box
        ): Effect.Effect<void, BrowserWindow.Error> => Effect.gen(function*()
        {
            if (yield* BrowserWindows.IsVisible(BrowserWindow.Key.Overlay))
            {
                return;
            }

            yield* Session.Reset;
            yield* Session.SetActivationWindow(Hover.Window);
            yield* BrowserWindows.Send(
                BrowserWindow.Key.Overlay,
                AppApiChannel.OverlayScreenChanged,
                yield* Session.Snapshot
            );
            yield* BrowserWindows.SetBounds(BrowserWindow.Key.Overlay, OverlayBounds);
            yield* BrowserWindows.ShowInactive(BrowserWindow.Key.Overlay);
            yield* Logging.LogDebug("TitlebarFlyout", "Displayed the titlebar flyout.", {
                Window: Hover.Window
            });
            Active = {
                ButtonBounds: Hover.Bounds,
                OverlayBounds,
                Window: Hover.Window
            };
        });

        const Poll = Effect.gen(function*()
        {
            const IsEnabled = yield* Settings.GetSetting("ShowTitlebarFlyout");
            const UseFallback = ShouldShow(
                IsEnabled,
                Window.IsSnapWindowsEnabled(),
                Window.IsSnapLayoutsOnHoverEnabled()
            );

            if (!UseFallback)
            {
                return yield* Hide();
            }

            const Cursor = Window.GetCursorPosition();
            if (Active !== undefined)
            {
                if (
                    Option.isSome(Cursor) &&
                    (
                        ContainsPoint(Active.ButtonBounds, Cursor.value) ||
                        ContainsPoint(Active.OverlayBounds, Cursor.value)
                    )
                )
                {
                    return;
                }

                return yield* Hide();
            }

            const Hover = Window.GetHoveredMaximizeButton();
            if (Option.isNone(Hover))
            {
                Pending = undefined;
                return;
            }

            const CurrentTimeMilliseconds = performance.now();
            if (
                Pending === undefined ||
                !IsSameMaximizeButton(Pending, Hover.value)
            )
            {
                Pending = {
                    ButtonBounds: Hover.value.Bounds,
                    HoverBeganAtMilliseconds: CurrentTimeMilliseconds,
                    Window: Hover.value.Window
                };
                return;
            }

            if (!HasHoverDelayElapsed(
                Pending.HoverBeganAtMilliseconds,
                CurrentTimeMilliseconds,
                HoverDelayMilliseconds
            ))
            {
                return;
            }

            const WorkArea = Window.GetWindowWorkArea(Hover.value.Window);
            if (Option.isNone(WorkArea))
            {
                return;
            }

            Pending = undefined;
            yield* Show(
                Hover.value,
                GetOverlayBounds(Hover.value.Bounds, WorkArea.value)
            );
        });

        yield* pipe(
            Poll,
            Effect.catch((Cause: unknown) => Logging.LogWarning(
                "TitlebarFlyout",
                "Could not update the titlebar flyout.",
                Cause
            )),
            Effect.andThen(Effect.sleep(PollInterval)),
            Effect.forever,
            Effect.forkScoped({ startImmediately: true })
        );

        yield* Effect.addFinalizer(() => Hide());
        return { _tag: "TitlebarFlyout" } as const;
    })
);
