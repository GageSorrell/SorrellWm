/**
 * Effectful management of `electron` `BrowserWindow`s.
 *
 * @module @sorrell/wm/Main/BrowserWindow
 *
 * @file      BrowserWindow.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "./AppSettings/AppSettings.ts";
import * as Logging from "./Log.ts";
import * as TrayIcon from "./TrayIcon.ts";
import type {
    BrowserWindowConstructorOptions,
    BrowserWindow as ElectronBrowserWindow,
    HandlerDetails
} from "electron";
import {
    Context,
    Data,
    Deferred,
    Effect,
    Layer,
    PubSub,
    type Scope,
    Semaphore,
    Stream,
    Struct,
    pipe
} from "effect";
import electron, { app, nativeTheme } from "electron";
import type { Box } from "@sorrell/math";
import { ToRectangle as BoxToRectangle } from "./Utility/Math/Box.js";
import { DevFeatures } from "./Development/DevFeatures.ts";
import { SettingsTitlebarHeight } from "../Shared/SettingsWindow.ts";
import type { Handle as WindowsHandle } from "@sorrell/windows";
import { join } from "path";
import type { Thunk } from "@sorrell/effect/Function";

const TypeId = "~sorrell/wm/Main/BrowserWindow" as const;

interface Diagnostic
{
    readonly Cause: unknown;
    readonly Message: string;
    readonly Operation: string;
}

export/** The logical identities understood by the BrowserWindow service. */
const Key = Object.freeze({
    Backdrop: "Backdrop",
    FocusPreviewDown: "FocusPreviewDown",
    FocusPreviewLeft: "FocusPreviewLeft",
    FocusPreviewRight: "FocusPreviewRight",
    FocusPreviewUp: "FocusPreviewUp",
    InsertTarget: "InsertTarget",
    Inspector: "Inspector",
    Main: "Main",
    Overlay: "Overlay",
    Settings: "Settings",
    TiledFocusPanelPreview: "TiledFocusPanelPreview",
    TiledMovePanelPreview: "TiledMovePanelPreview"
} as const);

/** The logical identity of an application-owned browser window. */
export type Key = typeof Key[keyof typeof Key];

/** A stable logical identity paired with Electron's current runtime identity. */
export interface Handle
{
    readonly ElectronWindowId: number;
    readonly Key: Key;
}

/** Everything required to construct and load one application browser window. */
export interface Spec
{
    /** Make pointer input pass through the native window after construction. */
    readonly IgnoreMouseEvents?: boolean;
    readonly Key: Key;
    readonly Options: BrowserWindowConstructorOptions;
    readonly ShowWhenReady?: boolean;
    readonly Url: string;
}

/** Operations that can fail after a window has been opened. */
export type Operation =
    | "Close"
    | "Destroy"
    | "Focus"
    | "GetNativeHandle"
    | "Hide"
    | "IsVisible"
    | "Send"
    | "SetIgnoreMouseEvents"
    | "SetBounds"
    | "Show"
    | "ShowInactive";

/** BrowserWindow construction failed before an Electron window was registered. */
export class BrowserWindowConstructionError extends
    Data.TaggedError("BrowserWindowConstructionError")<{
        readonly Cause: unknown;
        readonly Key: Key;
    }> { }

/** The renderer failed to load for a newly constructed window. */
export class BrowserWindowLoadError extends
    Data.TaggedError("BrowserWindowLoadError")<{
        readonly Cause: unknown;
        readonly Key: Key;
        readonly Url: string;
    }> { }

/** A singleton window was explicitly opened while it already existed. */
export class BrowserWindowAlreadyOpenError extends
    Data.TaggedError("BrowserWindowAlreadyOpenError")<{
        readonly Key: Key;
    }> { }

/** An operation referred to a logical window that is not currently open. */
export class BrowserWindowNotFoundError extends
    Data.TaggedError("BrowserWindowNotFoundError")<{
        readonly Key: Key;
    }> { }

/** A window closed before construction and renderer loading completed. */
export class BrowserWindowClosedBeforeReadyError extends
    Data.TaggedError("BrowserWindowClosedBeforeReadyError")<Pick<Handle, "Key">> { }

/** Electron rejected an operation on a registered window. */
export class BrowserWindowOperationError extends
    Data.TaggedError("BrowserWindowOperationError")<
        Pick<Handle, "Key"> &
        {
            readonly Cause: unknown;
            readonly Operation: Operation;
        }
    > { }

/** Any expected failure produced by the BrowserWindow service. */
export type Error =
    | BrowserWindowAlreadyOpenError
    | BrowserWindowClosedBeforeReadyError
    | BrowserWindowConstructionError
    | BrowserWindowLoadError
    | BrowserWindowNotFoundError
    | BrowserWindowOperationError;

/** Application-level browser-window events with Electron details removed. */
export type Event = Data.TaggedEnum<{
    readonly Closed: Pick<Handle, "Key">;
    readonly Focused: Pick<Handle, "Key">;
    readonly Hidden: Pick<Handle, "Key">;
    readonly Opened: { readonly Handle: Handle; };
    readonly Shown: Pick<Handle, "Key">;
    readonly Unresponsive: Pick<Handle, "Key">;
}>;

/** Operations exposed by the scoped BrowserWindow service. */
export interface BrowserWindowImpl
{
    /** Every application-level event published after stream subscription. */
    readonly Events: Stream.Stream<Event>;

    /** Open a new singleton window, failing when its key is already registered. */
    readonly Open: (Specification: Spec) => Effect.Effect<Handle, Error>;

    /** Return an existing singleton window or atomically begin opening it. */
    readonly Ensure: (Specification: Spec) => Effect.Effect<Handle, Error>;

    /** Show an open window. */
    readonly Show: (Key: Key) => Effect.Effect<void, Error>;

    /** Show an open window without activating it. */
    readonly ShowInactive: (Key: Key) => Effect.Effect<void, Error>;

    /** Hide an open window. */
    readonly Hide: (Key: Key) => Effect.Effect<void, Error>;

    /** Focus an open window. */
    readonly Focus: (Key: Key) => Effect.Effect<void, Error>;

    /** Determine whether an open window is currently visible. */
    readonly IsVisible: (Key: Key) => Effect.Effect<boolean, Error>;

    /** Get the native Win32 handle for an open Electron window. */
    readonly GetNativeHandle: (Key: Key) => Effect.Effect<WindowsHandle.HWND, Error>;

    /** Request a normal, cancellable close. */
    readonly RequestClose: (Key: Key) => Effect.Effect<void, Error>;

    /** Destroy a window and guarantee that its lifecycle ends. */
    readonly ForceClose: (Key: Key) => Effect.Effect<void, Error>;

    /** Send an IPC value to an open window's renderer. */
    readonly Send: (
        Key: Key,
        Channel: string,
        Payload: unknown
    ) => Effect.Effect<void, Error>;

    readonly SetBounds: (Key: Key, NewShape: Box.Box) => Effect.Effect<void, Error>;
}

/** Scoped ownership and control of the application's Electron windows. */
export class BrowserWindow extends
    Context.Service<BrowserWindow, BrowserWindowImpl>()(TypeId) { }

/** Injectable Electron boundaries used by the live layer and lifecycle tests. */
export interface Dependencies
{
    readonly Construct: (Options: BrowserWindowConstructorOptions) => ElectronBrowserWindow;
    readonly OpenExternal: (Url: string) => Promise<void> | void;
}

interface OpeningEntry
{
    readonly _tag: "Opening";
    readonly Ready: Deferred.Deferred<Handle, Error>;
}

interface OpenEntry
{
    readonly _tag: "Open";
    readonly Handle: Handle;
    readonly Ready: Deferred.Deferred<Handle, Error>;
    readonly Window: ElectronBrowserWindow;
}

type Entry =
    | OpeningEntry
    | OpenEntry;

type RestoreInterruptibility = <A, E, R>(
    EffectValue: Effect.Effect<A, E, R>
) => Effect.Effect<A, E, R>;

interface ManagedWindow
{
    readonly Handle: Handle;
    readonly Window: ElectronBrowserWindow;
}

type OpenDecision =
    | { readonly _tag: "Conflict"; }
    | { readonly _tag: "Existing"; readonly Handle: Handle; }
    | { readonly _tag: "Start"; readonly Ready: Deferred.Deferred<Handle, Error>; }
    | { readonly _tag: "Wait"; readonly Ready: Deferred.Deferred<Handle, Error>; };

interface WindowListeners
{
    readonly Closed: Thunk;
    readonly Focused: Thunk;
    readonly Hidden: Thunk;
    readonly ReadyToShow: Thunk;
    readonly Shown: Thunk;
    readonly Unresponsive: Thunk;
}

const SecureOptions = (SpecificationValue: Spec): BrowserWindowConstructorOptions =>
{
    const Show = SpecificationValue.ShowWhenReady === true
        ? false
        : SpecificationValue.Options.show;

    return {
        ...SpecificationValue.Options,
        ...(Show === undefined ? { } : { show: Show }),
        webPreferences:
        {
            ...SpecificationValue.Options.webPreferences,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    };
};

const TryOperation = (
    KeyValue: Key,
    OperationValue: Operation,
    OperationEffect: Thunk
): Effect.Effect<void, BrowserWindowOperationError> => Effect.try({
    catch: (Cause: unknown) => new BrowserWindowOperationError({
        Cause,
        Key: KeyValue,
        Operation: OperationValue
    }),
    try: OperationEffect
});

export/** Construct the scoped BrowserWindow layer with injectable Electron boundaries. */
const MakeLive = (DependenciesValue: Dependencies) => Layer.effect(
    BrowserWindow,
    Effect.gen(function*()
    {
        const ManagerScope: Scope.Scope = yield* Effect.scope;
        const Registry = new Map<Key, Entry>();
        const RegistryLock = yield* Semaphore.make(1);
        const EventPubSub = yield* Effect.acquireRelease(
            PubSub.unbounded<Event>(),
            PubSub.shutdown
        );
        const DiagnosticPubSub = yield* Effect.acquireRelease(
            PubSub.unbounded<Diagnostic>(),
            PubSub.shutdown
        );

        const Publish = (EventValue: Event): void =>
        {
            PubSub.publishUnsafe(EventPubSub, Object.freeze(EventValue));
        };

        const RemoveEntry = (
            KeyValue: Key,
            Ready: Deferred.Deferred<Handle, Error>
        ): Effect.Effect<void> => RegistryLock.withPermit(Effect.sync(() =>
        {
            const Current = Registry.get(KeyValue);

            if (Current?._tag === "Opening" && Current.Ready === Ready)
            {
                Registry.delete(KeyValue);
            }
            else if (Current?._tag === "Open" && Current.Ready === Ready)
            {
                Registry.delete(KeyValue);
            }
        }));

        const RunLifecycle = (
            SpecificationValue: Spec,
            Ready: Deferred.Deferred<Handle, Error>
        ): Effect.Effect<void, Error> => Effect.scoped(Effect.gen(function*()
        {
            const OpenStartedAt = performance.now();
            const Window = yield* Effect.acquireRelease(
                Effect.try({
                    catch: (Cause: unknown) => new BrowserWindowConstructionError({
                        Cause,
                        Key: SpecificationValue.Key
                    }),
                    try: () => DependenciesValue.Construct(SecureOptions(SpecificationValue))
                }),
                (WindowValue: ElectronBrowserWindow) => pipe(
                    WindowValue.isDestroyed()
                        ? Effect.void
                        : TryOperation(
                            SpecificationValue.Key,
                            "Destroy",
                            () => WindowValue.destroy()
                        ),
                    Effect.ignore
                )
            );
            const Closed = yield* Deferred.make<void>();
            const ReadyToShow = yield* Deferred.make<void>();

            if (SpecificationValue.IgnoreMouseEvents === true)
            {
                yield* TryOperation(
                    SpecificationValue.Key,
                    "SetIgnoreMouseEvents",
                    () => Window.setIgnoreMouseEvents(true)
                );
            }

            yield* Effect.acquireRelease(
                Effect.sync((): WindowListeners =>
                {
                    const Listeners: WindowListeners = {
                        Closed: (): void =>
                        {
                            Deferred.doneUnsafe(Closed, Effect.void);
                        },
                        Focused: (): void => Publish({
                            Key: SpecificationValue.Key,
                            _tag: "Focused"
                        }),
                        Hidden: (): void => Publish({
                            Key: SpecificationValue.Key,
                            _tag: "Hidden"
                        }),
                        ReadyToShow: (): void =>
                        {
                            Deferred.doneUnsafe(ReadyToShow, Effect.void);
                        },
                        Shown: (): void => Publish({
                            Key: SpecificationValue.Key,
                            _tag: "Shown"
                        }),
                        Unresponsive: (): void => Publish({
                            Key: SpecificationValue.Key,
                            _tag: "Unresponsive"
                        })
                    };

                    Window.once("closed", Listeners.Closed);
                    Window.on("focus", Listeners.Focused);
                    Window.on("hide", Listeners.Hidden);
                    Window.once("ready-to-show", Listeners.ReadyToShow);
                    Window.on("show", Listeners.Shown);
                    Window.on("unresponsive", Listeners.Unresponsive);

                    return Listeners;
                }),
                (Listeners: WindowListeners) => Effect.sync(() =>
                {
                    Window.removeListener("closed", Listeners.Closed);
                    Window.removeListener("focus", Listeners.Focused);
                    Window.removeListener("hide", Listeners.Hidden);
                    Window.removeListener("ready-to-show", Listeners.ReadyToShow);
                    Window.removeListener("show", Listeners.Shown);
                    Window.removeListener("unresponsive", Listeners.Unresponsive);
                })
            );

            Window.webContents.setWindowOpenHandler((Details: HandlerDetails): { action: "deny"; } =>
            {
                if (Details.url.startsWith("https://"))
                {
                    try
                    {
                        void Promise.resolve(DependenciesValue.OpenExternal(Details.url))
                            .catch((Cause: unknown): void =>
                            {
                                PubSub.publishUnsafe(DiagnosticPubSub, {
                                    Cause,
                                    Message: "Could not open an external link.",
                                    Operation: "OpenExternal"
                                });
                            });
                    }
                    catch (Cause: unknown)
                    {
                        PubSub.publishUnsafe(DiagnosticPubSub, {
                            Cause,
                            Message: "Could not open an external link.",
                            Operation: "OpenExternal"
                        });
                    }
                }

                return { action: "deny" };
            });

            yield* Effect.raceFirst(
                Effect.tryPromise({
                    catch: (Cause: unknown) => new BrowserWindowLoadError({
                        Cause,
                        Key: SpecificationValue.Key,
                        Url: SpecificationValue.Url
                    }),
                    try: () => Window.loadURL(SpecificationValue.Url)
                }),
                pipe(
                    Deferred.await(Closed),
                    Effect.flatMap(() => Effect.fail(
                        new BrowserWindowClosedBeforeReadyError({
                            Key: SpecificationValue.Key
                        })
                    ))
                )
            );

            if (SpecificationValue.ShowWhenReady === true)
            {
                yield* Effect.raceFirst(
                    Deferred.await(ReadyToShow),
                    pipe(
                        Deferred.await(Closed),
                        Effect.flatMap(() => Effect.fail(
                            new BrowserWindowClosedBeforeReadyError({
                                Key: SpecificationValue.Key
                            })
                        ))
                    )
                );
                yield* TryOperation(SpecificationValue.Key, "Show", () => Window.show());
            }

            if (Window.isDestroyed() || (yield* Deferred.isDone(Closed)))
            {
                return yield* new BrowserWindowClosedBeforeReadyError({
                    Key: SpecificationValue.Key
                });
            }

            const HandleValue: Handle = Object.freeze({
                ElectronWindowId: Window.id,
                Key: SpecificationValue.Key
            });
            const Registered = yield* RegistryLock.withPermit(Effect.sync((): boolean =>
            {
                const Current = Registry.get(SpecificationValue.Key);

                if (Current?._tag !== "Opening" || Current.Ready !== Ready)
                {
                    return false;
                }

                Registry.set(SpecificationValue.Key, {
                    Handle: HandleValue,
                    Ready,
                    Window,
                    _tag: "Open"
                });

                return true;
            }));

            if (!Registered)
            {
                return yield* new BrowserWindowClosedBeforeReadyError({
                    Key: SpecificationValue.Key
                });
            }

            Publish({ Handle: HandleValue, _tag: "Opened" });
            yield* Logging.LogDebug("BrowserWindow", "Electron window opened.", {
                DurationMilliseconds: Math.max(0, performance.now() - OpenStartedAt),
                Window: SpecificationValue.Key
            });
            yield* Deferred.succeed(Ready, HandleValue);
            yield* Deferred.await(Closed);
            Publish({ Key: SpecificationValue.Key, _tag: "Closed" });
        }));

        const StartLifecycle = (
            SpecificationValue: Spec,
            Ready: Deferred.Deferred<Handle, Error>
        ): Effect.Effect<void> => pipe(
            RunLifecycle(SpecificationValue, Ready),
            Effect.catch((ErrorValue: Error) => pipe(Logging.LogError(
                "BrowserWindow",
                "An Electron window lifecycle failed.",
                ErrorValue,
                { Window: SpecificationValue.Key }
            ),
            Effect.andThen(Deferred.fail(Ready, ErrorValue)),
            Effect.asVoid)),
            Effect.ensuring(Effect.gen(function*()
            {
                yield* Deferred.fail(
                    Ready,
                    new BrowserWindowClosedBeforeReadyError(Struct.pick(SpecificationValue, [ "Key" ]))
                );
                yield* RemoveEntry(SpecificationValue.Key, Ready);
            })),
            Effect.forkIn(ManagerScope, { startImmediately: true }),
            Effect.asVoid
        );

        const DecideOpen = (
            SpecificationValue: Spec,
            EnsureExisting: boolean
        ): Effect.Effect<OpenDecision> => Effect.gen(function*()
        {
            const Candidate = yield* Deferred.make<Handle, Error>();

            return yield* RegistryLock.withPermit(Effect.sync((): OpenDecision =>
            {
                const Current = Registry.get(SpecificationValue.Key);

                if (Current?._tag === "Opening")
                {
                    return EnsureExisting
                        ? { Ready: Current.Ready, _tag: "Wait" }
                        : { _tag: "Conflict" };
                }

                if (Current?._tag === "Open" && !Current.Window.isDestroyed())
                {
                    return EnsureExisting
                        ? { Handle: Current.Handle, _tag: "Existing" }
                        : { _tag: "Conflict" };
                }

                Registry.set(SpecificationValue.Key, {
                    Ready: Candidate,
                    _tag: "Opening"
                });

                return { Ready: Candidate, _tag: "Start" };
            }));
        });

        const OpenOrEnsure = (
            SpecificationValue: Spec,
            EnsureExisting: boolean
        ): Effect.Effect<Handle, Error> => Effect.uninterruptibleMask((
            Restore: RestoreInterruptibility
        ) =>
            Effect.gen(function*()
            {
                const Decision = yield* DecideOpen(SpecificationValue, EnsureExisting);

                switch (Decision._tag)
                {
                    case "Conflict":
                        return yield* new BrowserWindowAlreadyOpenError({
                            Key: SpecificationValue.Key
                        });
                    case "Existing":
                        return Decision.Handle;
                    case "Wait":
                        return yield* Restore(Deferred.await(Decision.Ready));
                    case "Start":
                        yield* StartLifecycle(SpecificationValue, Decision.Ready);
                        return yield* Restore(Deferred.await(Decision.Ready));
                }
            })
        );

        const GetManaged = (KeyValue: Key): Effect.Effect<ManagedWindow, Error> =>
            Effect.gen(function*()
            {
                const Initial = yield* RegistryLock.withPermit(Effect.sync(() =>
                    Registry.get(KeyValue)
                ));

                if (Initial?._tag === "Opening")
                {
                    yield* Deferred.await(Initial.Ready);
                }

                const Current = yield* RegistryLock.withPermit(Effect.sync(() =>
                    Registry.get(KeyValue)
                ));

                if (Current?._tag !== "Open" || Current.Window.isDestroyed())
                {
                    return yield* new BrowserWindowNotFoundError({ Key: KeyValue });
                }

                return {
                    Handle: Current.Handle,
                    Window: Current.Window
                };
            });

        const Operate = (
            KeyValue: Key,
            OperationValue: Operation,
            OperationEffect: (Window: ElectronBrowserWindow) => void
        ): Effect.Effect<void, Error> => pipe(
            GetManaged(KeyValue),
            Effect.flatMap((Managed: ManagedWindow) => TryOperation(
                KeyValue,
                OperationValue,
                () => OperationEffect(Managed.Window)
            ))
        );

        yield* pipe(
            Stream.fromPubSub(EventPubSub),
            Stream.runForEach((EventValue: Event) =>
            {
                const KeyValue = EventValue._tag === "Opened"
                    ? EventValue.Handle.Key
                    : EventValue.Key;
                const Annotations = {
                    Event: EventValue._tag,
                    Window: KeyValue
                };

                return EventValue._tag === "Unresponsive"
                    ? Logging.LogWarning(
                        "BrowserWindow",
                        "An Electron window became unresponsive.",
                        undefined,
                        Annotations
                    )
                    : Logging.LogDebug(
                        "BrowserWindow",
                        "Electron window lifecycle event.",
                        Annotations
                    );
            }),
            Effect.forkScoped({ startImmediately: true })
        );

        yield* pipe(
            Stream.fromPubSub(DiagnosticPubSub),
            Stream.runForEach((DiagnosticValue: Diagnostic) => Logging.LogWarning(
                "BrowserWindow",
                DiagnosticValue.Message,
                DiagnosticValue.Cause,
                { Operation: DiagnosticValue.Operation }
            )),
            Effect.forkScoped({ startImmediately: true })
        );

        return {
            Ensure: (SpecificationValue: Spec) =>
                OpenOrEnsure(SpecificationValue, true),
            Events: Stream.fromPubSub(EventPubSub),
            Focus: (KeyValue: Key) => Operate(
                KeyValue,
                "Focus",
                (Window: ElectronBrowserWindow) => Window.focus()
            ),
            ForceClose: (KeyValue: Key) => Operate(
                KeyValue,
                "Destroy",
                (Window: ElectronBrowserWindow) => Window.destroy()
            ),
            GetNativeHandle: (KeyValue: Key) => pipe(
                GetManaged(KeyValue),
                Effect.flatMap((Managed: ManagedWindow) => Effect.try({
                    catch: (Cause: unknown) => new BrowserWindowOperationError({
                        Cause,
                        Key: KeyValue,
                        Operation: "GetNativeHandle"
                    }),
                    try: (): WindowsHandle.HWND =>
                    {
                        const Value = Managed.Window.getNativeWindowHandle();
                        const NumericValue = Value.byteLength === 8
                            ? Value.readBigUInt64LE(0)
                            : BigInt(Value.readUInt32LE(0));

                        if (NumericValue === 0n)
                        {
                            throw new Error("Electron returned a null native window handle.");
                        }

                        return NumericValue as WindowsHandle.HWND;
                    }
                }))
            ),
            Hide: (KeyValue: Key) => Operate(
                KeyValue,
                "Hide",
                (Window: ElectronBrowserWindow) => Window.hide()
            ),
            IsVisible: (KeyValue: Key) => pipe(
                GetManaged(KeyValue),
                Effect.flatMap((Managed: ManagedWindow) => Effect.try({
                    catch: (Cause: unknown) => new BrowserWindowOperationError({
                        Cause,
                        Key: KeyValue,
                        Operation: "IsVisible"
                    }),
                    try: () => Managed.Window.isVisible()
                }))
            ),
            Open: (SpecificationValue: Spec) =>
                OpenOrEnsure(SpecificationValue, false),
            RequestClose: (KeyValue: Key) => Operate(
                KeyValue,
                "Close",
                (Window: ElectronBrowserWindow) => Window.close()
            ),
            Send: (KeyValue: Key, Channel: string, Payload: unknown) => Operate(
                KeyValue,
                "Send",
                (Window: ElectronBrowserWindow) => Window.webContents.send(Channel, Payload)
            ),
            SetBounds: (Key: Key, NewShape: Box.Box): Effect.Effect<void, Error> => Operate(
                Key,
                "SetBounds",
                (Window: ElectronBrowserWindow) => Window.setBounds(BoxToRectangle(NewShape), false)
            ),
            Show: (KeyValue: Key) => Operate(
                KeyValue,
                "Show",
                (Window: ElectronBrowserWindow) => Window.show()
            ),
            ShowInactive: (KeyValue: Key) => Operate(
                KeyValue,
                "ShowInactive",
                (Window: ElectronBrowserWindow) => Window.showInactive()
            )
        } as const;
    })
);

const { BrowserWindow: ElectronBrowserWindowConstructor, shell } = electron;

export/** Live ownership of the application's Electron browser windows. */
const Live = MakeLive({
    Construct: (Options: BrowserWindowConstructorOptions): ElectronBrowserWindow =>
        new ElectronBrowserWindowConstructor(Options),
    OpenExternal: (Url: string): Promise<void> => shell.openExternal(Url)
});

const GetSpecBase = (): Pick<Spec, "Options" | "Url"> =>
{
    const DevelopmentRendererUrl: string | undefined = process.env.ELECTRON_RENDERER_URL;
    const Url: string = app?.isPackaged === false && DevelopmentRendererUrl !== undefined
        ? DevelopmentRendererUrl
        : "sorrell://app/index.html";

    return {
        Options:
        {
            backgroundMaterial: "acrylic",
            fullscreenable: false,
            show: false,
            webPreferences:
                {
                    contextIsolation: true,
                    nodeIntegration: false,
                    preload: join(import.meta.dirname, "../Preload/index.cjs"),
                    sandbox: true
                }
        },
        Url
    } as const;
};

const WithWindowKey = (Url: string, WindowKey: Key): string =>
{
    const WindowUrl = new URL(Url);
    WindowUrl.searchParams.set("window", WindowKey);
    return WindowUrl.toString();
};

export/** Construct the transparent, input-transparent transient backdrop specification. */
const GetBackdropWindowSpec = (): Spec =>
{
    const { Options: BaseOptions, Url } = GetSpecBase();
    const BackdropOptions: BrowserWindowConstructorOptions =
        {
            alwaysOnTop: true,
            backgroundColor: "#00000000",
            backgroundMaterial: "none",
            focusable: false,
            frame: false,
            hasShadow: false,
            height: 1,
            maximizable: false,
            minimizable: false,
            resizable: false,
            roundedCorners: false,
            skipTaskbar: true,
            transparent: true,
            webPreferences:
            {
                ...BaseOptions.webPreferences,
                backgroundThrottling: false
            },
            width: 1
        } as const;

    return {
        IgnoreMouseEvents: true,
        Key: Key.Backdrop,
        Options: Struct.assign(BaseOptions, BackdropOptions),
        ShowWhenReady: false,
        Url: WithWindowKey(Url, Key.Backdrop)
    } as const;
};

export/** Construct a click-through visualization surface at the requested Focus bounds. */
const GetFocusPreviewWindowSpec = (
    PreviewKey:
        | typeof Key.FocusPreviewDown
        | typeof Key.FocusPreviewLeft
        | typeof Key.FocusPreviewRight
        | typeof Key.FocusPreviewUp
        | typeof Key.TiledFocusPanelPreview
        | typeof Key.TiledMovePanelPreview,
    Bounds: Box.Box
): Spec =>
{
    const { Options: BaseOptions, Url } = GetSpecBase();
    const Rectangle = BoxToRectangle(Bounds);
    const PreviewOptions: BrowserWindowConstructorOptions =
        {
            alwaysOnTop: true,
            backgroundColor: "#00000000",
            backgroundMaterial: "none",
            focusable: false,
            frame: false,
            hasShadow: false,
            maximizable: false,
            minimizable: false,
            resizable: false,
            roundedCorners: false,
            show: false,
            skipTaskbar: true,
            transparent: true,
            type: "toolbar",
            ...Rectangle,
            webPreferences:
        {
            ...BaseOptions.webPreferences,
            backgroundThrottling: false
        }
        } as const;

    return {
        IgnoreMouseEvents: true,
        Key: PreviewKey,
        Options: Struct.assign(BaseOptions, PreviewOptions),
        ShowWhenReady: false,
        Url: WithWindowKey(Url, PreviewKey)
    } as const;
};

export/** Construct the overlay specification for the selected corner style. */
const OverlayWindowSpec = Effect.gen(function* ()
{
    const { Options: BaseOptions, Url } = GetSpecBase();
    const { StaticOverlay } = yield* DevFeatures;

    const OverlayOptions: BrowserWindowConstructorOptions =
        {
            alwaysOnTop: true,
            frame: false,
            height: 800,
            maximizable: false,
            resizable: false,
            roundedCorners: false,
            // roundedCorners: RoundedCorners,
            skipTaskbar: !StaticOverlay,
            title: "SorrellWm Overlay",
            width: 480
        } as const;

    return {
        Key: Key.Overlay,
        Options: Struct.assign(BaseOptions, OverlayOptions),
        ShowWhenReady: false,
        Url: WithWindowKey(Url, Key.Overlay)
    } as const;
});

export/**
       * Constructs the temporary acrylic target for a tiled Insert operation.
       *
       * @category constructors
       * @since 0.1.0
       */
const GetInsertTargetWindowSpec = (Bounds: Box.Box): Spec =>
{
    const { Options: BaseOptions, Url } = GetSpecBase();
    const Rectangle = BoxToRectangle(Bounds);
    const InsertTargetOptions: BrowserWindowConstructorOptions =
        {
            alwaysOnTop: true,
            frame: false,
            maximizable: false,
            minimizable: false,
            resizable: false,
            roundedCorners: false,
            show: false,
            skipTaskbar: true,
            title: "SorrellWm Insert Target",
            type: "toolbar",
            ...Rectangle
        } as const;

    return {
        Key: Key.InsertTarget,
        Options: Struct.assign(BaseOptions, InsertTargetOptions),
        ShowWhenReady: true,
        Url: WithWindowKey(Url, Key.InsertTarget)
    } as const;
};

export/** Construct the main application-window specification. */
const MainWindowSpec = Effect.gen(function*()
{
    const { Options: BaseOptions, Url } = GetSpecBase();
    const OverlayOptions: BrowserWindowConstructorOptions =
        {
            height: 800,
            minHeight: 480,
            minWidth: 640,
            show: false,
            title: "SorrellWm",
            width: 1200
        } as const;

    const ShowWhenReady: boolean = process.argv.includes("--smoke-test");

    return {
        Key: Key.Main,
        Options: Struct.assign(BaseOptions, OverlayOptions),
        ShowWhenReady,
        Url: WithWindowKey(Url, Key.Main)
    } as const;
});

export/** Construct the normal, persistent settings-window specification. */
const SettingsWindowSpec = Effect.gen(function*()
{
    const { Options: BaseOptions, Url } = GetSpecBase();
    const Settings = yield* AppSettings.AppSettings;
    const CurrentSettings = yield* Settings.Get;
    const IconVariant = TrayIcon.ResolveTrayIconVariant(
        CurrentSettings.UseSimplifiedTrayIcon,
        nativeTheme.shouldUseDarkColors
    );
    const SettingsOptions: BrowserWindowConstructorOptions =
        {
            backgroundMaterial: "mica",
            height: 640,
            icon: TrayIcon.GetTrayIconPath(IconVariant),
            minHeight: 480,
            minWidth: 640,
            show: true,
            title: "SorrellWm Settings",
            titleBarOverlay: { height: SettingsTitlebarHeight },
            titleBarStyle: "hidden",
            width: 900
        } as const;

    return {
        Key: Key.Settings,
        Options: Struct.assign(BaseOptions, SettingsOptions),
        ShowWhenReady: false,
        Url: WithWindowKey(Url, Key.Settings)
    } as const;
});
