/**
 * The MCP server itself: builds the tool catalog once (closing every handler over an
 * already-resolved `TilingManagerImpl`), registers it against the MCP SDK's low-level
 * `Server`, and reactively starts/stops a loopback-only HTTP listener as the
 * `McpServerEnabled`/`McpServerPort` settings change.
 *
 * Security note: this app has no capability/permission model anywhere else either
 * (`Command.Executor.Execute` will run anything reachable). The only guards here are
 * binding strictly to `127.0.0.1` (never configurable) and the `McpServerEnabled`
 * setting itself, off by default. Anyone with access to this loopback port has the same
 * window-management control as the overlay UI.
 *
 * @module @sorrell/wm/Main/Mcp/Server
 *
 * @file      Server.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettingsModule from "../AppSettings/AppSettings.ts";
import * as Tools from "./Tools/index.ts";
import type { CallToolRequest, CallToolResult, Tool } from "@modelcontextprotocol/sdk/types.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Context, Effect, Layer, Option, Ref, Schema, Stream, pipe } from "effect";
import type { Server as HttpServer, IncomingMessage, ServerResponse } from "node:http";
import { Server as McpProtocolServer } from "@modelcontextprotocol/sdk/server/index.js";
import type { Transport as McpTransportContract } from "@modelcontextprotocol/sdk/shared/transport.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Manager as TilingManager } from "../Tiling/index.ts";
import type { ToolDefinition } from "./ToolDefinition.ts";
import { WithCategory } from "@sorrell/log/Effect";
import { app } from "electron";
import { createServer } from "node:http";

export/** The type identifier of this module. */
const TypeId = "~sorrell/wm/Main/Mcp/Server" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/** The running MCP server, once started. */
export interface McpServerImpl
{
    readonly _tag: "McpServer";
}

/** Supervises the loopback MCP HTTP listener. */
export class McpServer extends Context.Service<McpServer, McpServerImpl>()(TypeId) { }

const LogInfo = (Message: string, Annotations: Readonly<Record<string, unknown>> = { }) =>
    pipe(Effect.logInfo(Message), Effect.annotateLogs(Annotations), WithCategory("Mcp"));

const LogWarning = (Message: string, Annotations: Readonly<Record<string, unknown>> = { }) =>
    pipe(Effect.logWarning(Message), Effect.annotateLogs(Annotations), WithCategory("Mcp"));

const ToMcpTool = (Definition: ToolDefinition): Tool => ({
    description: Definition.Description,
    inputSchema: Schema.toJsonSchemaDocument(Definition.InputSchema).schema as Tool["inputSchema"],
    name: Definition.Name
});

const Listen = (Transport: StreamableHTTPServerTransport, Port: number): Effect.Effect<HttpServer> =>
    Effect.promise(() => new Promise<HttpServer>((Resolve: (Value: HttpServer) => void) =>
    {
        const HttpServerValue = createServer((Request: IncomingMessage, Response: ServerResponse) =>
        {
            void Transport.handleRequest(Request, Response);
        });

        HttpServerValue.listen(Port, "127.0.0.1", () => Resolve(HttpServerValue));
        HttpServerValue.unref();
    }));

const Close = (HttpServerValue: HttpServer): Effect.Effect<void> =>
    Effect.callback<void>((Resume: (EffectValue: Effect.Effect<void>) => void) =>
    {
        HttpServerValue.close(() => Resume(Effect.void));
    });

interface DesiredState
{
    readonly Enabled: boolean;
    readonly Port: number;
}

export/** Live MCP server, reactively started/stopped by `AppSettings`. */
const Live = Layer.effect(
    McpServer,
    Effect.gen(function*()
    {
        const Settings = yield* AppSettingsModule.AppSettings;
        const TilingManagerService = yield* TilingManager.TilingManager;

        const Definitions: ReadonlyArray<ToolDefinition> = [
            ...Tools.Window.MakeDefinitions(TilingManagerService),
            ...Tools.Tiling.MakeDefinitions(TilingManagerService),
            ...Tools.Mouse.Definitions,
            ...Tools.Monitor.Definitions
        ];
        const DefinitionsByName = new Map<string, ToolDefinition>(
            Definitions.map((Definition: ToolDefinition) => [ Definition.Name, Definition ] as const)
        );

        const ProtocolServer = new McpProtocolServer(
            { name: "sorrell-wm", version: app.getVersion() },
            { capabilities: { tools: { } } }
        );

        ProtocolServer.setRequestHandler(ListToolsRequestSchema, () => ({
            tools: Definitions.map(ToMcpTool)
        }));

        ProtocolServer.setRequestHandler(
            CallToolRequestSchema,
            (Request: CallToolRequest): Promise<CallToolResult> =>
            {
                const Definition = DefinitionsByName.get(Request.params.name);

                if (Definition === undefined)
                {
                    return Promise.resolve({
                        content: [ { text: `Unknown tool: ${ Request.params.name }`, type: "text" } ],
                        isError: true
                    });
                }

                return Effect.runPromise(Definition.Handle(Request.params.arguments ?? { }));
            }
        );

        // Omitting `sessionIdGenerator` (rather than passing it as `undefined`, which the
        // SDK's own types reject under this repo's `exactOptionalPropertyTypes`) yields the
        // exact same "stateless" mode: the transport only checks whether the field is set.
        const Transport = new StreamableHTTPServerTransport();

        // The SDK's `Transport` interface types `onclose`/`onerror`/`onmessage` as bare
        // optional (`() => void`, no `| undefined`), but `StreamableHTTPServerTransport`'s own
        // getters/setters type them as `(() => void) | undefined` — a real gap between the
        // SDK's own class and interface that only `exactOptionalPropertyTypes` surfaces.
        yield* pipe(
            Effect.tryPromise(() => ProtocolServer.connect(Transport as unknown as McpTransportContract)),
            Effect.orDie
        );

        const RunningRef = yield* Ref.make<Option.Option<HttpServer>>(Option.none());

        const ApplyDesiredState = (Desired: DesiredState): Effect.Effect<void> => Effect.gen(function*()
        {
            const Current = yield* Ref.get(RunningRef);

            if (Option.isSome(Current))
            {
                yield* Close(Current.value);
                yield* Ref.set(RunningRef, Option.none());
            }

            if (Desired.Enabled)
            {
                const HttpServerValue = yield* Listen(Transport, Desired.Port);
                yield* Ref.set(RunningRef, Option.some(HttpServerValue));
                yield* LogInfo(`MCP server listening at http://127.0.0.1:${ Desired.Port }/mcp`, {
                    Port: Desired.Port,
                    ToolCount: Definitions.length
                });
            }
            else
            {
                yield* LogInfo("MCP server disabled.");
            }
        });

        yield* pipe(
            Settings.Changes,
            Stream.map((Current: AppSettingsModule.AppSettings): DesiredState => ({
                Enabled: Current.McpServerEnabled,
                Port: Current.McpServerPort
            })),
            Stream.changesWith((Previous: DesiredState, Next: DesiredState) =>
                Previous.Enabled === Next.Enabled && Previous.Port === Next.Port),
            Stream.runForEach((Desired: DesiredState) => pipe(
                ApplyDesiredState(Desired),
                Effect.catch((CauseValue: unknown) => LogWarning(
                    "Could not apply the MCP server's desired running state.",
                    { Cause: CauseValue }
                ))
            )),
            Effect.forkScoped({ startImmediately: true })
        );

        yield* Effect.addFinalizer(() => Effect.gen(function*()
        {
            const Current = yield* Ref.get(RunningRef);

            if (Option.isSome(Current))
            {
                yield* Close(Current.value);
            }
        }));

        return { _tag: "McpServer" } as const;
    })
);
