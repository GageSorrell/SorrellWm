/**
 * Create and manage an instance of {@link https://www.npmjs.com/package/ink | ink} within your
 * CLI application.
 *
 * @module @sorrell/effect-ink/Renderer
 */

/**
 * @file      Renderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Brand,
    Context,
    Data,
    Deferred,
    Effect,
    type Exit,
    Layer,
    type PlatformError,
    type Scope,
    Terminal,
    pipe
} from "effect";
import { render as InkRender, type RenderOptions as InkRenderOptions, type Instance } from "ink";
import type { ReactNode } from "react";
import { Utility } from "./Internal/index.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Renderer";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

/** Performance metrics for a render operation. */
export type RenderMetrics =
    {
        /** Time spent rendering in milliseconds. */
        renderTime: number;
    };

export interface Options
{
    readonly Stdin?: NodeJS.ReadStream;
    readonly Stdout?: NodeJS.WriteStream;
    readonly Stderr?: NodeJS.WriteStream;

    readonly Interactive?: boolean;
    readonly AlternateScreen?: boolean;

    readonly Debug?: boolean;
    readonly ExitOnCtrlC?: boolean;
    readonly PatchConsole?: boolean;

    readonly MaxFps?: number;
    readonly IncrementalRendering?: boolean;
    readonly Concurrent?: boolean;

    readonly IsScreenReaderEnabled?: boolean;
    readonly KittyKeyboard?: InkRenderOptions["kittyKeyboard"];

    readonly OnRender?: (Metrics: RenderMetrics) => void;

    readonly RestoreTerminalOnExit?: boolean;
    readonly ClearOnExit?: boolean;

    readonly UnsafeOptions?: Partial<InkRenderOptions>;
}

export type Operation =
    | "Render"
    | "Rerender"
    | "Unmount"
    | "Cleanup"
    | "Clear"
    | "WaitUntilRenderFlush";

export class RenderError extends Data.TaggedError("RendererError")<{
    readonly Operation: Operation;
    readonly Cause: unknown;
}> { }

export class ExitError extends Data.TaggedError("RendererExitError")<{
    readonly Cause: unknown;
}> { }

interface ResolvedOptions extends Options
{
    readonly Debug: boolean;
    readonly ExitOnCtrlC: boolean;
    readonly PatchConsole: boolean;

    readonly RestoreTerminalOnExit: boolean;
    readonly ClearOnExit: boolean;
}

/* eslint-disable-next-line @typescript-eslint/typedef */
export const DefaultOptions =
    {
        Debug: false,
        ExitOnCtrlC: true,
        PatchConsole: true,

        ClearOnExit: false,
        RestoreTerminalOnExit: true
    } as const satisfies Options;

export const Options = (In: Partial<Options>): Options =>
{
    return {
        ...DefaultOptions,
        ...In
    };
};

export const ResolvedOptions = (In: Options): ResolvedOptions =>
{
    return {
        ...DefaultOptions,
        ...In
    };
};

export const ToInkRenderOptions = (Options: Options): InkRenderOptions =>
{
    return {
        ...Utility.ApplyOptionalMany(Options, {
            stderr: "Stderr",
            stdin: "Stdin",
            stdout: "Stdout",

            alternateScreen: "AlternateScreen",
            interactive: "Interactive",

            debug: "Debug",
            exitOnCtrlC: "ExitOnCtrlC",
            patchConsole: "PatchConsole",

            concurrent: "Concurrent",
            incrementalRendering: "IncrementalRendering",
            maxFps: "MaxFps",

            isScreenReaderEnabled: "IsScreenReaderEnabled",
            kittyKeyboard: "KittyKeyboard",

            onRender: "OnRender"
        }),

        ...Options.UnsafeOptions
    };
};

/* eslint-disable-next-line @typescript-eslint/typedef */
export const DefaultProgramOptions =
    {
        CleanupOnComplete: true,
        ClearOnComplete: true,
        WaitUntilRenderFlushOnComplete: false
    } as const satisfies Partial<ProgramOptions>;

/**
 * The type from which all effects in the {@link RendererContext} extend.
 *
 * @template A - The success type of the effect.
 * @template R - The requirements type of the effect.
 */
export type ServiceEffect<A, E = never, R = never> =
    Effect.Effect<A, E | RenderError, Scope.Scope | Exclude<R, RendererContext>>;

export type HandleIdentifier = Brand.Branded<symbol, "InkHandleIdentifier">;
export const HandleIdentifier = (): HandleIdentifier => Brand.nominal<HandleIdentifier>()(Symbol());

export type LifetimeIdentifier = Brand.Branded<symbol, "InkLifetimeIdentifier">;
export const LifetimeIdentifier = (): LifetimeIdentifier => Brand.nominal<LifetimeIdentifier>()(Symbol());

export const Handle = (
    Instance: Instance,
    InLifetime: Lifetime,
    Options: ResolvedOptions
): Handle =>
{
    const Identifier: HandleIdentifier = HandleIdentifier();

    let IsUnmounted: boolean = false;
    let IsCleanedUp: boolean = false;

    const EnsureNotCleanedUp = (Operation: Operation): Effect.Effect<void, RenderError> =>
        Effect.suspend(() =>
        {
            if (IsCleanedUp)
            {
                return Effect.fail(new RenderError({
                    Cause: "EnsureNotCleanedUp failed.",
                    Operation
                }));
            }

            return Effect.void;
        });

    const Rerender = (Node: ReactNode): Effect.Effect<void, RenderError> =>
        Effect.gen(function*()
        {
            yield* EnsureNotCleanedUp("Rerender");

            yield* TryOperation("Rerender", () =>
            {
                Instance.rerender(Node);
            });
        });

    const Unmount: Effect.Effect<void, RenderError> =
        Effect.suspend(() =>
        {
            if (IsUnmounted || IsCleanedUp)
            {
                return Effect.void;
            }

            IsUnmounted = true;

            return TryOperation("Unmount", () =>
            {
                Instance.unmount();
            });
        });

    const Clear: Effect.Effect<void, RenderError> =
        Effect.gen(function*()
        {
            yield* EnsureNotCleanedUp("Clear");
            yield* TryOperation("Clear", Instance.clear);
        });

    const NativeCleanup: Effect.Effect<void, RenderError> =
        Effect.gen(function*()
        {
            yield* InLifetime.Close;

            if (Options.ClearOnExit)
            {
                yield* TryOperation("Clear", Instance.clear);
            }

            yield* TryOperation("Cleanup", Instance.cleanup);
        });

    const TerminalReset: Effect.Effect<void> =
        Options.RestoreTerminalOnExit
            ? Effect.ignore(Terminal.Terminal.Service.display("\x1B[2J\x1B[H"))
            : Effect.void;

    const Cleanup: Effect.Effect<void, RenderError> =
        Effect.suspend(() =>
        {
            if (IsCleanedUp)
            {
                return Effect.void;
            }

            IsCleanedUp = true;
            IsUnmounted = true;

            return pipe(
                NativeCleanup,
                Effect.ensuring(TerminalReset)
            );
        });

    const WaitUntilExit: Effect.Effect<
        unknown,
        ExitError
    > =
        Effect.tryPromise({
            catch: (Cause: unknown) => new ExitError({ Cause }),
            try: Instance.waitUntilExit
        });

    const WaitUntilRenderFlush: Effect.Effect<
        void,
        RenderError
    > =
        Effect.tryPromise({
            catch: (Cause: unknown) =>
                new RenderError({ Cause, Operation: "WaitUntilRenderFlush" }),
            try: Instance.waitUntilRenderFlush
        });

    return {
        Identifier,
        Lifetime: InLifetime,

        Rerender,

        Cleanup,
        Clear,
        Unmount,

        WaitUntilExit,
        WaitUntilRenderFlush
    };
};

const TryOperation = <Type>(
    Operation: Operation,
    Evaluate: () => Type
): Effect.Effect<Type, RenderError> =>
    Effect.try({
        catch: (Cause: unknown) => new RenderError({ Cause, Operation }),
        try: Evaluate
    });

/**
 * A handle that uniquely identifies an instance of `ink` running from within the {@link RendererContext}.
 *
 * @property {(Node: ReactNode) => ServiceEffect<void>} Rerender - Force the `ink`
 * instance to rerender.
 *
 * @property {ServiceEffect<void>} Unmount - Cause the `ink` instance to unmount.
 *
 * @property {ServiceEffect<void>} WaitUntilExit - An {@link Effect!Effect | effect} that
 * `yield`s when the `ink` instance exits.
 *
 * @property {ServiceEffect<void>} Clear - Cause the `ink` instance to clear the terminal.
 */
export interface Handle
{
    readonly Identifier: HandleIdentifier;
    readonly Lifetime: Lifetime;
    readonly Rerender: (Node: ReactNode) => ServiceEffect<void>;
    readonly Unmount: ServiceEffect<void>;
    readonly WaitUntilExit: ServiceEffect<void, ExitError>;
    readonly WaitUntilRenderFlush: ServiceEffect<void>;
    readonly Cleanup: Effect.Effect<void, RenderError | PlatformError.PlatformError>;
    readonly Clear: Effect.Effect<void, RenderError>;
}

export interface Lifetime
{
    readonly _tag: "Lifetime";

    readonly Identifier: LifetimeIdentifier;
    readonly AddFinalizer: (Finalizer: Effect.Effect<void>) => Effect.Effect<void>;
    readonly Close: Effect.Effect<void>;
    readonly IsClosed: Effect.Effect<boolean>;
    readonly Signal: AbortSignal;
}

export const Lifetime = (): Lifetime =>
{
    const Identifier: LifetimeIdentifier = LifetimeIdentifier();
    const AbortControllerValue: AbortController = new AbortController();

    let Closed: boolean = false;

    const Finalizers: Array<Effect.Effect<void, never, never>> = [ ];

    const AddFinalizer = (
        Finalizer: Effect.Effect<void, never, never>
    ): Effect.Effect<void, never, never> =>
        Effect.suspend(() =>
        {
            if (Closed)
            {
                return Finalizer;
            }

            Finalizers.push(Finalizer);

            return Effect.void;
        });

    const Close: Effect.Effect<void, never, never> =
        Effect.suspend(() =>
        {
            if (Closed)
            {
                return Effect.void;
            }

            Closed = true;
            AbortControllerValue.abort();

            const FinalizersToRun: Array<Effect.Effect<void>> = [ ...Finalizers ].reverse();

            Finalizers.length = 0;

            return Effect.gen(function*()
            {
                for (const Finalizer of FinalizersToRun)
                {
                    yield* Finalizer;
                }
            });
        });

    const IsClosed: Effect.Effect<boolean, never, never> =
        Effect.sync(() => Closed);

    return {
        _tag: "Lifetime",

        AddFinalizer,
        Close,
        Identifier,
        IsClosed,
        Signal: AbortControllerValue.signal
    } satisfies Lifetime;
};

export interface Program<A, E, R>
{
    readonly Name?: string;

    readonly Render: (Controller: Controller<A, E>) => ServiceEffect<ReactNode, E, R>;

    readonly Options?: ProgramOptions;
}

export namespace Program
{
    /* eslint-disable @typescript-eslint/no-explicit-any */

    export type Any = Program<any, any, any>;

    export type Success<ProgramType> =
        ProgramType extends Program<infer A, any, any>
            ? A
            : never;

    export type Error<ProgramType> =
        ProgramType extends Program<any, infer E, any>
            ? E
            : never;

    export type Requirements<ProgramType> =
        ProgramType extends Program<any, any, infer R>
            ? R
            : never;

    /* eslint-enable @typescript-eslint/no-explicit-any */
}

export interface ProgramOptions
{
    /**
     * Whether to flush pending Ink renders before cleanup.
     *
     * This is often useful for task UIs and final status screens.
     */
    readonly WaitUntilRenderFlushOnComplete?: boolean;

    /**
     * Whether to clear Ink output when the program completes.
     *
     * This overrides `InkRenderOptions.clearOnExit` when present.
     */
    readonly ClearOnComplete?: boolean;

    /**
     * Whether the renderer should be cleaned up after program completion.
     *
     * This should almost always stay `true`.
     */
    readonly CleanupOnComplete?: boolean;
}

export interface Controller<A, E>
{
    readonly Fail: (Error: E) => Effect.Effect<void>;
    readonly Succeed: (Value: A) => Effect.Effect<void>;

    readonly Await: Effect.Effect<A, E>;
    readonly AwaitExit: Effect.Effect<Exit.Exit<A, E>>;

    readonly Close: Effect.Effect<void>;
    readonly Lifetime: Lifetime;
    readonly Interrupt: Effect.Effect<void>;
}

export const ResolveProgramOptions = (
    Options?: ProgramOptions
): (
    Required<Pick<
        ProgramOptions,
        | "WaitUntilRenderFlushOnComplete"
        | "CleanupOnComplete"
    >> &
    Pick<ProgramOptions, "ClearOnComplete">
) =>
{
    return {
        WaitUntilRenderFlushOnComplete:
            Options?.WaitUntilRenderFlushOnComplete
            ?? DefaultProgramOptions.WaitUntilRenderFlushOnComplete,

        CleanupOnComplete:
            Options?.CleanupOnComplete
            ?? DefaultProgramOptions.CleanupOnComplete,

        ClearOnComplete: Options?.ClearOnComplete === true
    };
};

export function MergeProgramOptions(
    ProgramOptions: ProgramOptions | undefined,
    RenderOptions: Options | undefined
): Options | undefined
{
    if (ProgramOptions?.ClearOnComplete === undefined)
    {
        return RenderOptions;
    }

    return {
        ...RenderOptions,

        ClearOnExit: ProgramOptions.ClearOnComplete
    };
}

export interface RendererImpl
{
    readonly Render: (
        Node: ReactNode,
        Options?: Options
    ) => Effect.Effect<Handle, RenderError, Scope.Scope>;

    readonly Run: <A, E, R>(
        Program: Program<A, E, R>,
        Options?: Options
    ) => Effect.Effect<
        Program.Success<typeof Program>,
        Program.Error<typeof Program>,
        Program.Requirements<typeof Program>
    >
}

export class RendererContext extends Context.Service<RendererContext, RendererImpl>()(TypeIdKey)
{
    public static readonly Layer: Layer.Layer<RendererContext> = Layer.effect(this, Effect.gen(function* ()
    {
        const Render: RendererImpl["Render"] = Effect.fn("Renderer.Render")(
            function*(Node: ReactNode, Options?: Options)
            {
                return yield* Effect.acquireRelease(
                    Effect.gen(function* ()
                    {
                        const OutResolvedOptions: ResolvedOptions =
                            ResolvedOptions(Options ?? DefaultOptions);

                        const OutLifetime: Lifetime = Lifetime();

                        const OutOptions: InkRenderOptions = ToInkRenderOptions(OutResolvedOptions);

                        const OutInstance: Instance = yield* TryOperation(
                            "Render",
                            () => InkRender(Node, OutOptions)
                        );

                        return Handle(
                            OutInstance,
                            OutLifetime,
                            OutResolvedOptions
                        );
                    }),
                    (Handle: Handle) => pipe(
                        Handle.Cleanup,
                        Effect.ignore
                    )
                );
            });

        const Run: RendererImpl["Run"] = Effect.fn("Renderer.Run")(function* (
            Program: Program.Any,
            Options?: Options
        )
        {
            type A = "A";
            type E = "E";
            type R = "R";

            return Effect.scoped(
                Effect.gen(function*()
                {
                    /* eslint-disable-next-line @typescript-eslint/typedef */
                    const ProgramOptions = ResolveProgramOptions(
                        Program.Options
                    );

                    const RenderOptions: Options | undefined = MergeProgramOptions(
                        Program.Options,
                        Options
                    );

                    const OutController: Controller<A, E> =
                        yield* Controller<A, E>();

                    const FinalizeProgram: Effect.Effect<void> = Effect.ignore(OutController.Close);

                    const ExecuteProgram: Effect.Effect<A, E | RenderError, R | Scope.Scope> =
                        Effect.gen(function*()
                        {
                            const Node: ReactNode =
                                yield* (Program.Render(OutController) as Effect.Effect<A, E, R>);

                            const Handle: Handle = yield* Render(
                                Node,
                                RenderOptions
                            );

                            const CleanupHandle: Effect.Effect<void> =
                                ProgramOptions.CleanupOnComplete
                                    ? Effect.ignore(Handle.Cleanup)
                                    : Effect.void;

                            const FlushHandle: Effect.Effect<void, never, Scope.Scope> =
                                ProgramOptions.WaitUntilRenderFlushOnComplete
                                    ? Effect.ignore(Handle.WaitUntilRenderFlush)
                                    : Effect.void;

                            const FinalizeRender: Effect.Effect<void, never, Scope.Scope> =
                                Effect.andThen(FlushHandle, CleanupHandle);

                            return yield* pipe(
                                OutController.Await,
                                Effect.ensuring(FinalizeRender)
                            );
                        });

                    return yield* pipe(
                        ExecuteProgram,
                        Effect.ensuring(FinalizeProgram)
                    );
                })
            );
        }) as RendererImpl["Run"];

        return {
            Render,
            Run
        };
    })
    );
}

export const Controller = <A, E>(): Effect.Effect<Controller<A, E>> =>
    Effect.gen(function*()
    {
        const OutLifetime: Lifetime = Lifetime();

        const Completion: Deferred.Deferred<A, E> = yield* Deferred.make<A, E>();

        const Succeed = (Value: A): Effect.Effect<boolean> =>
            Deferred.succeed(Completion, Value);

        const Fail = (ErrorValue: E): Effect.Effect<boolean> =>
            Deferred.fail(Completion, ErrorValue);

        const Interrupt: Effect.Effect<boolean, never, never> =
            Deferred.interrupt(Completion);

        const Await: Effect.Effect<A, E> =
            Deferred.await(Completion);

        const AwaitExit: Effect.Effect<Exit.Exit<A, E>> =
            Effect.exit(Await);

        const Close: Effect.Effect<void> =
            OutLifetime.Close;

        yield* OutLifetime.AddFinalizer(Effect.asVoid(Interrupt));

        return {
            Await,
            AwaitExit,
            Close,
            Fail,
            Interrupt,
            Lifetime: OutLifetime,
            Succeed
        };
    });

export const Renderer: typeof RendererContext  = RendererContext;
export type Renderer = typeof RendererContext["Service"];

/* eslint-disable @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any */

export type RendererEffect<FunctionType extends Extract<Renderer[keyof Renderer], Function>> =
    FunctionType extends ((...Args: any) => infer EffectType extends Effect.All.EffectAny)
        ? (...ArgumentVector: Parameters<FunctionType>) => Effect.Effect<
            Effect.Success<EffectType>,
            Effect.Error<EffectType>,
            | RendererContext
            | Effect.Services<EffectType>
        >
        : never;

/* eslint-enable @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any */

export const Render: RendererEffect<RendererImpl["Render"]> = Effect.fn("Renderer.Render")(
    function* (Node: ReactNode, Options?: Options)
    {
        const TheRenderer: Renderer = yield* Renderer;
        return yield* TheRenderer.Render(Node, Options);
    }
);

export const Run: RendererEffect<RendererImpl["Run"]> = Effect.fn("Renderer.Run")(
    function* <A, E, R>(
        Program: Program<A, E, R>,
        Options?: Options
    )
    {
        const TheRenderer: Renderer = yield* Renderer;
        return yield* TheRenderer.Run(Program, Options);
    }
);
