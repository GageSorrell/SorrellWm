/**
 * General-purpose, MCP-agnostic tiling automation types.
 *
 * @module @sorrell/wm-api/Tiling
 *
 * @file      Tiling.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Schema } from "effect";
import { BoxSchema, WindowIdSchema } from "./Window.js";

export/** The arrangements a panel can apply to its children. */
const Orientations = Object.freeze([ "Horizontal", "Stack", "Vertical" ] as const);

export/** A panel child arrangement. */
const OrientationSchema = Schema.Literals(Orientations);

/** A panel child arrangement. */
export type Orientation = typeof OrientationSchema.Type;

export/** Directions used to move logical focus, or a managed window, between panel children. */
const FocusDirections = Object.freeze([ "Down", "Left", "Right", "Up" ] as const);

export/** One logical panel-focus movement direction. */
const FocusDirectionSchema = Schema.Literals(FocusDirections);

/** One logical panel-focus movement direction. */
export type FocusDirection = typeof FocusDirectionSchema.Type;

export/** Every supported redistribution behavior for tiled resizing. */
const TiledResizeBehaviors = Object.freeze([ "AdjacentOnly", "PreserveRatios" ] as const);

export/** How neighboring tiled windows respond to resizing. */
const TiledResizeBehaviorSchema = Schema.Literals(TiledResizeBehaviors);

/** How neighboring tiled windows respond to resizing. */
export type TiledResizeBehavior = typeof TiledResizeBehaviorSchema.Type;

export/** A path from a workspace root to a descendant panel or window. */
const PathSchema = Schema.Array(Schema.Int);

/** A path from a workspace root to a descendant panel or window. */
export type Path = typeof PathSchema.Type;

export/** One monitor's work area and the workspace identifier assigned to it. */
const WorkspaceSummarySchema = Schema.Struct({
    Bounds: BoxSchema,
    Id: Schema.String
});

/** One monitor's work area and the workspace identifier assigned to it. */
export type WorkspaceSummary = typeof WorkspaceSummarySchema.Type;

export/**
       * One panel in a tiling tree, flattened out of the recursive tree structure so an
       * agent can reason about a layout as a flat list rather than nested JSON.
       */
const PanelSummarySchema = Schema.Struct({
    ChildCount: Schema.Int,
    Orientation: OrientationSchema,
    Path: PathSchema,
    Ratios: Schema.Array(Schema.Number),
    WorkspaceId: Schema.String
});

/** One panel in a tiling tree, flattened out of the recursive tree structure. */
export type PanelSummary = typeof PanelSummarySchema.Type;

export/** One managed window's location within a tiling tree. */
const PlacedWindowSchema = Schema.Struct({
    Bounds: BoxSchema,
    Path: PathSchema,
    WindowId: WindowIdSchema,
    WorkspaceId: Schema.String
});

/** One managed window's location within a tiling tree. */
export type PlacedWindow = typeof PlacedWindowSchema.Type;

export/** A flattened snapshot of the complete tiling state, across every workspace. */
const TilingSnapshotSchema = Schema.Struct({
    Panels: Schema.Array(PanelSummarySchema),
    Windows: Schema.Array(PlacedWindowSchema),
    Workspaces: Schema.Array(WorkspaceSummarySchema)
});

/** A flattened snapshot of the complete tiling state, across every workspace. */
export type TilingSnapshot = typeof TilingSnapshotSchema.Type;
