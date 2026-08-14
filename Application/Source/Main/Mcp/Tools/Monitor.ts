/**
 * MCP tools that read display-monitor topology.
 *
 * @module @sorrell/wm/Main/Mcp/Tools/Monitor
 *
 * @file      Monitor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Convert from "../Convert.ts";
import * as ToolResult from "../ToolResult.ts";
import { Effect, Schema, pipe } from "effect";
import { Screen } from "@sorrell/windows";
import type { ToolDefinition } from "../ToolDefinition.ts";
import { ToolName } from "../ToolName.ts";
import type { Window as WmApiWindow } from "@sorrell/wm-api";

const NoInputSchema = Schema.Struct({ });

interface MonitorSummary
{
    readonly DeviceName: string;
    readonly DisplayId: number;
    readonly IsPrimary: boolean;
    readonly Monitor: WmApiWindow.Box;
    readonly WorkArea: WmApiWindow.Box;
}

const ListMonitors = (): Effect.Effect<
    ReadonlyArray<MonitorSummary>,
    { readonly Message: string; }
> => pipe(
    Effect.sync(Screen.GetMonitors),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError(ToolResult.ToMessageError),
    Effect.map((Monitors: ReadonlyArray<Screen.MonitorInfo>) => Monitors.map(
        (MonitorValue: Screen.MonitorInfo): MonitorSummary => ({
            DeviceName: MonitorValue.DeviceName,
            DisplayId: MonitorValue.DisplayId,
            IsPrimary: MonitorValue.IsPrimary,
            Monitor: Convert.ToBox(MonitorValue.Monitor),
            WorkArea: Convert.ToBox(MonitorValue.WorkArea)
        })
    ))
);

export/** Every monitor-topology tool this MCP server advertises. */
const Definitions: ReadonlyArray<ToolDefinition> = [
    {
        Description: "List every display monitor, with its device name, display "
            + "number, primary flag, and virtual-screen/work-area bounds.",
        Handle: ToolResult.HandleTool(NoInputSchema, ListMonitors),
        InputSchema: NoInputSchema,
        Name: ToolName.MonitorList
    }
];
