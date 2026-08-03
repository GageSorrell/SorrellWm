/**
 * Ink UI component for context.
 *
 * @module @sorrell/ink-ui/Mouse/Context
 *
 * @file      Context.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import {
    DefaultMouseGestureSettings,
    InstallTerminalMouseTracking,
    type MouseEvent,
    Parser,
    ResolveMouseDistance,
    type Scroll,
    UninstallTerminalMouseTracking
} from "./index.js";
import type { MouseDistance, MouseOptions, TrackingOptions } from "./Tracking.js";
import { Effect } from "effect";

interface MouseContextValue
{
    readonly IsEnabled: boolean;
    readonly Settings: TrackingOptions;
    readonly Subscribe: (Handler: (Event: MouseEvent.MouseEvent) => void) => () => void;
}

const MouseContext = React.createContext<MouseContextValue | undefined>(undefined);

/** {@inheritDoc MouseProvider} */
export interface MouseProviderProps extends React.PropsWithChildren
{
    readonly DoubleClickTimeMs?: number;
    readonly DoubleClickMaxDistance?: MouseDistance;
    readonly DragActivationDistance?: MouseDistance;
    readonly HorizontalScrollDirectionByButton?: Scroll.HorizontalDirection;
    readonly IsEnabled?: boolean;
    readonly OnEvent?: (Event: MouseEvent.MouseEvent) => void;
}

export/**
       * Provides one terminal mouse listener and configurable gesture recognition.
       *
       * The defaults recognize a double click within 500 milliseconds and one
       * terminal cell, and begin a drag after one cell of movement.
       *
       * @category Mouse
       * @since 1.0.0
       */
const MouseProvider = ({
    DoubleClickMaxDistance,
    DoubleClickTimeMs = DefaultMouseGestureSettings.DoubleClickTimeMs,
    DragActivationDistance,
    HorizontalScrollDirectionByButton,
    IsEnabled = true,
    OnEvent,
    children
}: MouseProviderProps): React.ReactNode =>
{
    const Settings = React.useMemo<TrackingOptions>(() => ({
        DoubleClickMaxDistance: ResolveMouseDistance(
            DoubleClickMaxDistance,
            DefaultMouseGestureSettings.DoubleClickMaxDistance
        ),
        DoubleClickTimeMs: Math.max(
            0,
            Number.isFinite(DoubleClickTimeMs)
                ? DoubleClickTimeMs
                : DefaultMouseGestureSettings.DoubleClickTimeMs
        ),
        DragActivationDistance: ResolveMouseDistance(
            DragActivationDistance,
            DefaultMouseGestureSettings.DragActivationDistance
        )
    }), [
        DoubleClickMaxDistance,
        DoubleClickTimeMs,
        DragActivationDistance
    ]);
    const Subscribers = React.useRef(
        new Set<(Event: MouseEvent.MouseEvent) => void>()
    );
    const OnEventReference = React.useRef(OnEvent);
    OnEventReference.current = OnEvent;

    const Dispatch = React.useCallback((Event: MouseEvent.MouseEvent): void =>
    {
        OnEventReference.current?.(Event);
        for (const Subscriber of Subscribers.current)
        {
            Subscriber(Event);
        }
    }, []);

    UseTerminalMouseListener(
        IsEnabled,
        Settings,
        HorizontalScrollDirectionByButton,
        Dispatch
    );

    const Subscribe = React.useCallback((
        Handler: (Event: MouseEvent.MouseEvent) => void
    ): (() => void) =>
    {
        Subscribers.current.add(Handler);
        return () => Subscribers.current.delete(Handler);
    }, []);

    const Context = React.useMemo<MouseContextValue>(() => ({
        IsEnabled,
        Settings,
        Subscribe
    }), [ IsEnabled, Settings, Subscribe ]);

    return (
        <MouseContext.Provider value={ Context }>
            { children }
        </MouseContext.Provider>
    );
};

export/**
       * Access the mouse provider's resolved configuration.
       *
       * @category Mouse
       * @since 1.0.0
       */
const useMouse = (): Readonly<{
    readonly IsEnabled: boolean;
    readonly Settings: TrackingOptions;
}> =>
{
    const Context = React.useContext(MouseContext);
    if (Context === undefined)
    {
        throw new Error("useMouse must be used inside a MouseProvider.");
    }
    return {
        IsEnabled: Context.IsEnabled,
        Settings: Context.Settings
    };
};

export/**
       * Subscribe to events dispatched by the nearest mouse provider.
       *
       * @category Mouse
       * @since 1.0.0
       */
const useMouseEvent = (
    OnEvent: (Event: MouseEvent.MouseEvent) => void,
    IsEnabled: boolean = true
): void =>
{
    const Context = React.useContext(MouseContext);
    if (Context === undefined)
    {
        throw new Error("useMouseEvent must be used inside a MouseProvider.");
    }
    useMouseEventSubscription(Context, OnEvent, IsEnabled);
};

export/**
       * Subscribes when a provider exists and otherwise remains inactive.
       *
       * @internal
       */
const useOptionalMouseEvent = (
    OnEvent: (Event: MouseEvent.MouseEvent) => void,
    IsEnabled: boolean = true
): void =>
{
    const Context = React.useContext(MouseContext);
    useMouseEventSubscription(Context, OnEvent, IsEnabled);
};

const useMouseEventSubscription = (
    Context: MouseContextValue | undefined,
    OnEvent: (Event: MouseEvent.MouseEvent) => void,
    IsEnabled: boolean
): void =>
{
    const HandlerReference = React.useRef(OnEvent);
    HandlerReference.current = OnEvent;
    React.useEffect(() =>
    {
        if (!IsEnabled || Context === undefined)
        {
            return;
        }
        return Context.Subscribe((Event: MouseEvent.MouseEvent) => HandlerReference.current(Event));
    }, [ Context, IsEnabled ]);
};

export/**
       * Listen for terminal mouse input without mounting a provider.
       *
       * Prefer `MouseProvider` and `useMouseEvent` when several components consume
       * mouse input, so only one terminal listener is installed.
       *
       * @category Mouse
       * @since 1.0.0
       */
const useTerminalMouseTracking = (Options: MouseOptions): void =>
{
    const Settings = React.useMemo<TrackingOptions>(() => ({
        DoubleClickMaxDistance: ResolveMouseDistance(
            Options.DoubleClickMaxDistance,
            DefaultMouseGestureSettings.DoubleClickMaxDistance
        ),
        DoubleClickTimeMs: Math.max(
            0,
            Number.isFinite(Options.DoubleClickTimeMs)
                ? Options.DoubleClickTimeMs
                    ?? DefaultMouseGestureSettings.DoubleClickTimeMs
                : DefaultMouseGestureSettings.DoubleClickTimeMs
        ),
        DragActivationDistance: ResolveMouseDistance(
            Options.DragActivationDistance,
            DefaultMouseGestureSettings.DragActivationDistance
        )
    }), [
        Options.DoubleClickMaxDistance,
        Options.DoubleClickTimeMs,
        Options.DragActivationDistance
    ]);
    const OptionsReference = React.useRef(Options);
    OptionsReference.current = Options;
    UseTerminalMouseListener(
        Options.IsEnabled !== false,
        Settings,
        Options.HorizontalScrollDirectionByButton,
        (Event: MouseEvent.MouseEvent) => OptionsReference.current.OnEvent(Event)
    );
};

const UseTerminalMouseListener = (
    IsEnabled: boolean,
    Settings: TrackingOptions,
    HorizontalScrollDirectionByButton: Scroll.HorizontalDirection | undefined,
    OnEvent: (Event: MouseEvent.MouseEvent) => void
): void =>
{
    const { stdin, isRawModeSupported, setRawMode } = Ink.useStdin();
    const { write } = Ink.useStdout();
    const OnEventReference = React.useRef(OnEvent);
    OnEventReference.current = OnEvent;
    const ParserState = React.useRef<Parser.ParserState>(
        Parser.Make(Settings)
    );

    React.useEffect(() =>
    {
        ParserState.current = new Parser.ParserState({
            ...ParserState.current,
            Settings
        });
    }, [ Settings ]);

    React.useEffect(() =>
    {
        if (!IsEnabled || !isRawModeSupported)
        {
            return;
        }

        const HandleData = (Data: Buffer | string): void =>
        {
            const Result = Effect.runSync(Parser.Parse(
                ParserState.current,
                Data,
                HorizontalScrollDirectionByButton === undefined
                    ? { }
                    : { HorizontalScrollDirectionByButton }
            ));
            ParserState.current = Result.State;
            for (const Event of Result.Events)
            {
                OnEventReference.current(Event);
            }
        };

        Effect.runSync(InstallTerminalMouseTracking(
            stdin,
            write,
            setRawMode,
            HandleData
        ));

        return () =>
        {
            Effect.runSync(UninstallTerminalMouseTracking(
                stdin,
                write,
                setRawMode,
                HandleData
            ));
            ParserState.current = Parser.Make(Settings);
        };
    }, [
        HorizontalScrollDirectionByButton,
        IsEnabled,
        Settings,
        isRawModeSupported,
        setRawMode,
        stdin,
        write
    ]);
};
