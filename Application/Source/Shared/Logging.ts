/**
 * Renderer-safe structured logging messages forwarded to the main process.
 *
 * @module @sorrell/wm/Shared/Logging
 *
 * @file      Logging.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Schema } from "effect";

export/** Supported renderer log categories. */
const RendererLogCategory = Schema.Literals([
    "Application",
    "Backdrop",
    "FocusPreview",
    "InsertTarget",
    "Overlay",
    "Settings",
    "Theme"
]);

/** One supported renderer log category. */
export type RendererLogCategory = typeof RendererLogCategory.Type;

export/** Supported renderer log severities. */
const RendererLogLevel = Schema.Literals([
    "Debug",
    "Error",
    "Info",
    "Warning"
]);

/** One supported renderer log severity. */
export type RendererLogLevel = typeof RendererLogLevel.Type;

export/** Schema for a renderer log event accepted by the main process. */
const RendererLogEntry = Schema.Struct({
    Category: RendererLogCategory,
    Details: Schema.optional(Schema.String),
    Level: RendererLogLevel,
    Message: Schema.String
});

/** Renderer log event forwarded through the preload bridge. */
export type RendererLogEntry = typeof RendererLogEntry.Type;
