/**
 * Shared helpers for decoding tool arguments and encoding `CallToolResult` responses, so
 * every tool handler in `./Tools/*.ts` follows the same shape.
 *
 * @module @sorrell/wm/Main/Mcp/ToolResult
 *
 * @file      ToolResult.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, Schema, pipe } from "effect";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export/** Encode a successful tool result as a single JSON text content block. */
const Success = (Value: unknown): CallToolResult => ({
    content: [ {
        text: JSON.stringify(Value, undefined, 2),
        type: "text"
    } ]
});

export/** Encode a failed tool result as a single text content block, flagged as an error. */
const Failure = (Message: string): CallToolResult => ({
    content: [ { text: Message, type: "text" } ],
    isError: true
});

export/** Render any of this app's `Data.TaggedError` failures as a one-line message. */
const DescribeTaggedError = (ErrorValue: { readonly _tag: string; }): string =>
    `${ ErrorValue._tag }: ${ JSON.stringify(ErrorValue) }`;

export/**
       * Map any of this app's `Data.TaggedError` failures into the `{ Message }` shape
       * every tool handler's Effect fails with, ready to pass straight to `Effect.mapError`.
       */
const ToMessageError = (
    ErrorValue: { readonly _tag: string; }
): { readonly Message: string; } => ({ Message: DescribeTaggedError(ErrorValue) });

export/**
       * Decode raw tool arguments against a `WmApi` input schema, run `Handler` against the
       * decoded value, and translate any decode or handler failure into a `CallToolResult`
       * error instead of throwing across the MCP transport.
       */
const HandleTool = <SchemaType extends Schema.Constraint & { readonly DecodingServices: never; }, Output>(
    InputSchema: SchemaType,
    Handler: (
        Decoded: SchemaType["Type"]
    ) => Effect.Effect<Output, { readonly Message: string; }>
) => (RawArguments: unknown): Effect.Effect<CallToolResult> => pipe(
    Schema.decodeUnknownEffect(InputSchema)(RawArguments),
    Effect.mapError((CauseValue: unknown) => ({
        Message: `Invalid tool arguments: ${ String(CauseValue) }`
    })),
    Effect.flatMap(Handler),
    Effect.map(Success),
    Effect.catch((CauseValue: { readonly Message: string; }) => Effect.succeed(
        Failure(CauseValue.Message)
    ))
);
