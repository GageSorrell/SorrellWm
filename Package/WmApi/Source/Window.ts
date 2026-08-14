/**
 * General-purpose, MCP-agnostic window automation types.
 *
 * @module @sorrell/wm-api/Window
 *
 * @file      Window.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Schema, pipe } from "effect";

export/**
       * A native window handle, portably represented as the decimal string form of the
       * underlying `HWND` bigint (JSON has no bigint type). Stays free of a dependency on
       * `@sorrell/windows`'s `Handle.HWND` brand; consumers convert between the two at
       * their boundary.
       */
const WindowIdSchema = pipe(Schema.String, Schema.brand("WindowId"));

/** A native window handle, portably represented as a decimal string. */
export type WindowId = typeof WindowIdSchema.Type;

export/** Convert a native window handle to its portable string form. */
const ToWindowId = (Handle: bigint): WindowId => String(Handle) as WindowId;

export/** Convert a portable window-handle string back into a native handle. */
const FromWindowId = (Id: WindowId): bigint => BigInt(Id);

export/** A rectangle in virtual-screen coordinates. */
const BoxSchema = Schema.Struct({
    Bottom: Schema.Int,
    Left: Schema.Int,
    Right: Schema.Int,
    Top: Schema.Int
});

/** A rectangle in virtual-screen coordinates. */
export type Box = typeof BoxSchema.Type;

export/** A concise, renderer-safe description of one native window. */
const WindowSummarySchema = Schema.Struct({
    ApplicationName: Schema.optional(Schema.String),
    Bounds: BoxSchema,
    ExecutablePath: Schema.optional(Schema.String),
    Id: WindowIdSchema,
    IsFocused: Schema.Boolean,
    IsTiled: Schema.Boolean,
    Title: Schema.String
});

/** A concise, renderer-safe description of one native window. */
export type WindowSummary = typeof WindowSummarySchema.Type;

export/**
       * A window summary together with the location of its tiled position, when it has
       * one.
       */
const WindowDetailSchema = Schema.Struct({
    ...WindowSummarySchema.fields,
    Path: Schema.optional(Schema.Array(Schema.Int)),
    WorkspaceId: Schema.optional(Schema.String)
});

/** A window summary together with the location of its tiled position, when it has one. */
export type WindowDetail = typeof WindowDetailSchema.Type;
