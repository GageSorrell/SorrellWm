/**
 * SorrellWm logging configuration and application telemetry.
 *
 * @module @sorrell/wm/Main/Logging
 *
 * @file      Logging.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as ConsoleSink from "@sorrell/log/Node/ConsoleSink";
import * as NamedPipe from "@sorrell/log/Node/NamedPipe";
import * as NamedPipeSink from "@sorrell/log/Node/NamedPipeSink";
import * as SorrellLogging from "@sorrell/log/Effect";
import * as TilingManager from "./Tiling/Manager.ts";
import * as TilingTree from "./Tiling/Tree.ts";
import {
    type ApplicationMetadata,
    LogGlobal,
    MakeGlobal
} from "@sorrell/log";
import {
    type Duration,
    Effect,
    Layer,
    type LogLevel,
    Stream,
    pipe
} from "effect";
import { NodeMetadata } from "@sorrell/log/Node";

export/** Environment variable that overrides the default local log-client pipe port. */
const LogClientPortEnvironmentVariable = "SORRELL_WM_LOG_PORT";

export/** Stable named-pipe port used by SorrellWm unless an environment override is set. */
const DefaultLogClientPort = 43_817;

export { LogGlobal };

export/** The time at which the current SorrellWm process started. */
const ApplicationStartedAt = MakeGlobal("wm.application-started-at", {
    Category: "Lifecycle",
    DisplayTimeSince: true,
    Name: "Application started",
    Type: "DateTime"
});

export/** Number of application windows currently owned by the tiling manager. */
const ManagedWindowCount = MakeGlobal("wm.managed-window-count", {
    Category: "Tiling",
    MinimumValue: 0,
    Name: "Managed windows",
    Type: "Integer"
});

export/** Number of monitor workspaces represented by the current tiling state. */
const WorkspaceCount = MakeGlobal("wm.workspace-count", {
    Category: "Tiling",
    MinimumValue: 0,
    Name: "Workspaces",
    Type: "Integer"
});

/** Options used to construct SorrellWm's logging runtime and client endpoint. */
export interface ConfigurationOptions
{
    readonly Application: ApplicationMetadata;
    readonly ColorMode?: "Always" | "Auto" | "Never";
    readonly GlobalRetention?: Duration.Input;
    readonly MinimumLevel?: LogLevel.Severity;
    readonly Port?: number;
}

/** Configured logging layer and named-pipe endpoint owned by the application. */
export interface Configuration
{
    readonly ClientSink: NamedPipeSink.NamedPipeSink;
    readonly Layer: Layer.Layer<SorrellLogging.LogRuntime>;
    readonly Port: number;
}

/**
 * Resolve and validate the named-pipe port used by `@sorrell/log-client`.
 *
 * @throws {RangeError} When the configured value is not an integer from 1 through 65,535.
 */
export function ResolveLogClientPort(
    Environment: Readonly<Record<string, string | undefined>> = process.env
): number
{
    const Configured = Environment[LogClientPortEnvironmentVariable];

    if (Configured === undefined || Configured.trim().length === 0)
    {
        return DefaultLogClientPort;
    }

    return NamedPipe.Port(Number(Configured));
}

/**
 * Count every managed window across the workspaces in a tiling state.
 */
export function CountManagedWindows(State: TilingTree.State): number
{
    return State.Workspaces.reduce(
        (Count: number, Workspace: TilingTree.Workspace): number =>
            Count + TilingTree.Windows(Workspace.Root).length,
        0
    );
}

/**
 * Emit the current tiling metrics as globally tracked log values.
 */
export function LogTilingState(
    State: TilingTree.State
): Effect.Effect<void, never, SorrellLogging.LogRuntime>
{
    return pipe(
        Effect.all(
            [
                LogGlobal(ManagedWindowCount, CountManagedWindows(State)),
                LogGlobal(WorkspaceCount, State.Workspaces.length)
            ],
            { discard: true }
        ),
        Effect.orDie
    );
}

/**
 * Construct SorrellWm's console logger and discoverable Windows named-pipe sink.
 */
export function MakeConfiguration(
    Options: ConfigurationOptions
): Configuration
{
    const Port = Options.Port ?? ResolveLogClientPort();
    const Process = NodeMetadata.Process("ElectronMain");
    const ClientSink = NamedPipeSink.Make({
        Application: Options.Application,
        GlobalRetention: Options.GlobalRetention ?? "7 days",
        Port,
        Process
    });

    return {
        ClientSink,
        Layer: SorrellLogging.Layer({
            Application: Options.Application,
            DefaultCategory: "Application",
            MinimumLevel: Options.MinimumLevel ?? "Info",
            Process,
            Sinks: [
                ConsoleSink.Pretty({
                    ColorMode: Options.ColorMode ?? "Auto"
                }),
                ClientSink
            ]
        }),
        Port
    };
}

export/**
       * Subscribe globally logged tiling metrics to the manager's scoped state stream.
       */
const TelemetryLive: Layer.Layer<
    never,
    never,
    SorrellLogging.LogRuntime | TilingManager.TilingManager
> = Layer.effectDiscard(Effect.gen(function*()
{
    const Manager = yield* TilingManager.TilingManager;

    yield* Manager.Changes.pipe(
        Stream.runForEach(LogTilingState),
        Effect.forkScoped({ startImmediately: true })
    );
}));
