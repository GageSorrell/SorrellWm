/**
 * The shape every `Tools/*.ts` module exports one array of: a tool's identifier,
 * description, `WmApi`-backed input schema (used both to generate the advertised JSON
 * Schema and to decode incoming arguments), and its handler.
 *
 * @module @sorrell/wm/Main/Mcp/ToolDefinition
 *
 * @file      ToolDefinition.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect, Schema } from "effect";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ToolName } from "./ToolName.ts";

/** One MCP tool's identifier, description, input schema, and handler. */
export interface ToolDefinition
{
    readonly Description: string;
    readonly Handle: (RawArguments: unknown) => Effect.Effect<CallToolResult>;
    readonly InputSchema: Schema.Constraint;
    readonly Name: ToolName;
}
