/**
 * MCP tools that read or mutate the tiled layout via `TilingManager` directly, including
 * a few operations (panel ratio/orientation, reparenting) that have no overlay UI entry
 * point at all today.
 *
 * @module @sorrell/wm/Main/Mcp/Tools/Tiling
 *
 * @file      Tiling.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Convert from "../Convert.ts";
import type * as TilingManagerModule from "../../Tiling/Manager.ts";
import type * as TilingTree from "../../Tiling/Tree.ts";
import * as ToolResult from "../ToolResult.ts";
import { Effect, Option, Schema, pipe } from "effect";
import { Tiling as WmApiTiling, Window as WmApiWindow } from "@sorrell/wm-api";
import type { Box } from "@sorrell/math";
import { Window as NativeWindow } from "@sorrell/windows";
import type { ToolDefinition } from "../ToolDefinition.ts";
import { ToolName } from "../ToolName.ts";

const FlattenNode = (
    WorkspaceId: string,
    NodeValue: TilingTree.Node,
    PathValue: TilingTree.Path,
    Panels: Array<WmApiTiling.PanelSummary>,
    Windows: Array<WmApiTiling.PlacedWindow>
): void =>
{
    if (NodeValue._tag === "Window")
    {
        const Bounds = Option.getOrElse(
            NativeWindow.GetWindowRect(NodeValue.Value.Window),
            () => NodeValue.Value.InitialBounds
        );

        Windows.push({
            Bounds: Convert.ToBox(Bounds),
            Path: PathValue,
            WindowId: Convert.ToWindowId(NodeValue.Value.Window),
            WorkspaceId
        });
        return;
    }

    Panels.push({
        ChildCount: NodeValue.Children.length,
        Orientation: NodeValue.Orientation,
        Path: PathValue,
        Ratios: NodeValue.Ratios,
        WorkspaceId
    });

    NodeValue.Children.forEach((Child: TilingTree.Node, Index: number) =>
        FlattenNode(WorkspaceId, Child, [ ...PathValue, Index ], Panels, Windows));
};

const BuildSnapshot = (State: TilingTree.State): WmApiTiling.TilingSnapshot =>
{
    const Panels: Array<WmApiTiling.PanelSummary> = [ ];
    const Windows: Array<WmApiTiling.PlacedWindow> = [ ];
    const Workspaces: Array<WmApiTiling.WorkspaceSummary> = [ ];

    for (const Workspace of State.Workspaces)
    {
        Workspaces.push({ Bounds: Convert.ToBox(Workspace.Bounds), Id: Workspace.Id });

        if (Workspace.Root !== null)
        {
            FlattenNode(Workspace.Id, Workspace.Root, [ ], Panels, Windows);
        }
    }

    return { Panels, Windows, Workspaces };
};

/** Wrap a `TilingManagerImpl` call whose only failure channel is a tagged error. */
const RunTilingEffect = <Output>(
    EffectValue: Effect.Effect<Output, { readonly _tag: string; }>
): Effect.Effect<Output, { readonly Message: string; }> => pipe(
    EffectValue,
    Effect.mapError(ToolResult.ToMessageError)
);

const WindowIdInputSchema = Schema.Struct({ WindowId: WmApiWindow.WindowIdSchema });
const SnapshotInputSchema = Schema.Struct({ });
const NoInputSchema = Schema.Struct({ });

const MoveInputSchema = Schema.Struct({
    Orientation: Schema.optional(WmApiTiling.OrientationSchema),
    TargetWindowId: WmApiWindow.WindowIdSchema,
    WindowId: WmApiWindow.WindowIdSchema
});

const MoveIntoPanelInputSchema = Schema.Struct({
    TargetPanelPath: WmApiTiling.PathSchema,
    WindowId: WmApiWindow.WindowIdSchema
});

const MoveToIndexInputSchema = Schema.Struct({
    TargetIndex: Schema.Int,
    WindowId: WmApiWindow.WindowIdSchema
});

const InsertInputSchema = Schema.Struct({
    Direction: WmApiTiling.FocusDirectionSchema,
    TargetWindowId: WmApiWindow.WindowIdSchema,
    WindowId: WmApiWindow.WindowIdSchema
});

const PreviewInsertInputSchema = Schema.Struct({
    Direction: WmApiTiling.FocusDirectionSchema,
    TargetWindowId: WmApiWindow.WindowIdSchema
});

const ResizeInputSchema = Schema.Struct({
    Behavior: WmApiTiling.TiledResizeBehaviorSchema,
    DeltaPixels: Schema.Int,
    Direction: WmApiTiling.FocusDirectionSchema,
    WindowId: WmApiWindow.WindowIdSchema
});

const SetPanelRatioInputSchema = Schema.Struct({
    ChildIndex: Schema.optional(Schema.Int),
    Path: WmApiTiling.PathSchema,
    Ratio: Schema.Number,
    WorkspaceId: Schema.String
});

const SetPanelOrientationInputSchema = Schema.Struct({
    Orientation: WmApiTiling.OrientationSchema,
    Path: WmApiTiling.PathSchema,
    WorkspaceId: Schema.String
});

const SetGapInputSchema = Schema.Struct({ Gap: Schema.Int });

export/**
       * Build every tiling tool this MCP server advertises, closing over an
       * already-resolved `TilingManagerImpl` so handlers carry no further Effect
       * Context requirement.
       */
const MakeDefinitions = (
    TilingManagerService: TilingManagerModule.TilingManagerImpl
): ReadonlyArray<ToolDefinition> =>
{
    const GetSnapshot = (): Effect.Effect<
        WmApiTiling.TilingSnapshot,
        { readonly Message: string; }
    > => Effect.gen(function*()
    {
        return BuildSnapshot(yield* TilingManagerService.Snapshot);
    });

    const Move = (Input: typeof MoveInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.Move(
            Convert.FromWindowId(Input.WindowId),
            Convert.FromWindowId(Input.TargetWindowId),
            Input.Orientation === undefined ? undefined : Convert.FromOrientation(Input.Orientation)
        )),
        Effect.as({ WindowId: Input.WindowId })
    );

    const MoveIntoPanel = (Input: typeof MoveIntoPanelInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.MoveIntoPanel(
            Convert.FromWindowId(Input.WindowId),
            Input.TargetPanelPath
        )),
        Effect.as({ WindowId: Input.WindowId })
    );

    const MoveToIndex = (Input: typeof MoveToIndexInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.MoveToIndex(
            Convert.FromWindowId(Input.WindowId),
            Input.TargetIndex
        )),
        Effect.as({ WindowId: Input.WindowId })
    );

    const MoveToContainingPanel = (Input: typeof WindowIdInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.MoveToContainingPanel(
            Convert.FromWindowId(Input.WindowId)
        )),
        Effect.as({ WindowId: Input.WindowId })
    );

    const Insert = (Input: typeof InsertInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.Insert(
            Convert.FromWindowId(Input.WindowId),
            Convert.FromWindowId(Input.TargetWindowId),
            Convert.FromFocusDirection(Input.Direction)
        )),
        Effect.as({ WindowId: Input.WindowId })
    );

    const PreviewInsert = (
        Input: typeof PreviewInsertInputSchema.Type
    ): Effect.Effect<{ readonly Bounds: WmApiWindow.Box; }, { readonly Message: string; }> => pipe(
        RunTilingEffect(TilingManagerService.PreviewInsert(
            Convert.FromWindowId(Input.TargetWindowId),
            Convert.FromFocusDirection(Input.Direction)
        )),
        Effect.map((Bounds: Box.Box) => ({ Bounds: Convert.ToBox(Bounds) }))
    );

    const Resize = (Input: typeof ResizeInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.Resize(
            Convert.FromWindowId(Input.WindowId),
            Convert.FromFocusDirection(Input.Direction),
            Input.DeltaPixels,
            Input.Behavior
        )),
        Effect.as({ WindowId: Input.WindowId })
    );

    const SetPanelRatio = (Input: typeof SetPanelRatioInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.SetPanelRatio(
            Input.WorkspaceId,
            Input.Path,
            Input.Ratio,
            Input.ChildIndex
        )),
        Effect.as({ Path: Input.Path, WorkspaceId: Input.WorkspaceId })
    );

    const SetPanelOrientation = (Input: typeof SetPanelOrientationInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.SetPanelOrientation(
            Input.WorkspaceId,
            Input.Path,
            Convert.FromOrientation(Input.Orientation)
        )),
        Effect.as({ Path: Input.Path, WorkspaceId: Input.WorkspaceId })
    );

    const SetGap = (Input: typeof SetGapInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.SetGap(Input.Gap)),
        Effect.as({ Gap: Input.Gap })
    );

    const TileAll = (): Effect.Effect<{ readonly TileAll: true; }, { readonly Message: string; }> => pipe(
        RunTilingEffect(TilingManagerService.TileExistingWindows),
        Effect.as({ TileAll: true as const })
    );

    const Refresh = (): Effect.Effect<{ readonly Refreshed: true; }, { readonly Message: string; }> =>
        pipe(RunTilingEffect(TilingManagerService.Refresh), Effect.as({ Refreshed: true as const }));

    const Reconcile = (): Effect.Effect<{ readonly Reconciled: true; }, { readonly Message: string; }> =>
        pipe(RunTilingEffect(TilingManagerService.Reconcile), Effect.as({ Reconciled: true as const }));

    const BringStackWindowToFront = (Input: typeof WindowIdInputSchema.Type) => pipe(
        RunTilingEffect(TilingManagerService.BringStackWindowToFront(
            Convert.FromWindowId(Input.WindowId)
        )),
        Effect.as({ WindowId: Input.WindowId })
    );

    return [
        {
            Description: "Get a flattened snapshot of the complete tiled layout across "
                + "every workspace (monitor): every panel and every tiled window, each "
                + "with its path from its workspace root.",
            Handle: ToolResult.HandleTool(SnapshotInputSchema, GetSnapshot),
            InputSchema: SnapshotInputSchema,
            Name: ToolName.TilingSnapshot
        },
        {
            Description: "Reparent a tiled window beside another tiled window, "
                + "including across workspaces (monitors).",
            Handle: ToolResult.HandleTool(MoveInputSchema, Move),
            InputSchema: MoveInputSchema,
            Name: ToolName.TilingMove
        },
        {
            Description: "Move a tiled window into an adjacent sibling panel, as its "
                + "first child.",
            Handle: ToolResult.HandleTool(MoveIntoPanelInputSchema, MoveIntoPanel),
            InputSchema: MoveIntoPanelInputSchema,
            Name: ToolName.TilingMoveIntoPanel
        },
        {
            Description: "Reorder a tiled window to a specific child index within its "
                + "current panel.",
            Handle: ToolResult.HandleTool(MoveToIndexInputSchema, MoveToIndex),
            InputSchema: MoveToIndexInputSchema,
            Name: ToolName.TilingMoveToIndex
        },
        {
            Description: "Promote a tiled window one panel level toward its workspace "
                + "root.",
            Handle: ToolResult.HandleTool(WindowIdInputSchema, MoveToContainingPanel),
            InputSchema: WindowIdInputSchema,
            Name: ToolName.TilingMoveToContainingPanel
        },
        {
            Description: "Insert a floating window into a directional half of a tiled "
                + "window's space (splitting it).",
            Handle: ToolResult.HandleTool(InsertInputSchema, Insert),
            InputSchema: InsertInputSchema,
            Name: ToolName.TilingInsert
        },
        {
            Description: "Preview the rectangle a directional insert would produce, "
                + "without committing it.",
            Handle: ToolResult.HandleTool(PreviewInsertInputSchema, PreviewInsert),
            InputSchema: PreviewInsertInputSchema,
            Name: ToolName.TilingPreviewInsert
        },
        {
            Description: "Resize a tiled window (or its containing branch) along one "
                + "edge, by a pixel delta, using either ratio-preserving or "
                + "adjacent-only redistribution.",
            Handle: ToolResult.HandleTool(ResizeInputSchema, Resize),
            InputSchema: ResizeInputSchema,
            Name: ToolName.TilingResize
        },
        {
            Description: "Set one panel child's layout ratio directly. Has no overlay "
                + "UI entry point today.",
            Handle: ToolResult.HandleTool(SetPanelRatioInputSchema, SetPanelRatio),
            InputSchema: SetPanelRatioInputSchema,
            Name: ToolName.TilingSetPanelRatio
        },
        {
            Description: "Set one panel's child arrangement "
                + "(horizontal/vertical/stacked). Has no overlay UI entry point today.",
            Handle: ToolResult.HandleTool(SetPanelOrientationInputSchema, SetPanelOrientation),
            InputSchema: SetPanelOrientationInputSchema,
            Name: ToolName.TilingSetPanelOrientation
        },
        {
            Description: "Change the pixel gap between tiled windows and reconcile "
                + "immediately.",
            Handle: ToolResult.HandleTool(SetGapInputSchema, SetGap),
            InputSchema: SetGapInputSchema,
            Name: ToolName.TilingSetGap
        },
        {
            Description: "Tile every discoverable floating window onto its monitor's "
                + "root panel. No-ops if any monitor already has tiled content.",
            Handle: ToolResult.HandleTool(NoInputSchema, TileAll),
            InputSchema: NoInputSchema,
            Name: ToolName.TilingTileAll
        },
        {
            Description: "Re-discover native windows and merge them into the tiled "
                + "state.",
            Handle: ToolResult.HandleTool(NoInputSchema, Refresh),
            InputSchema: NoInputSchema,
            Name: ToolName.TilingRefresh
        },
        {
            Description: "Reapply the current tiled layout's calculated rectangles to "
                + "native windows.",
            Handle: ToolResult.HandleTool(NoInputSchema, Reconcile),
            InputSchema: NoInputSchema,
            Name: ToolName.TilingReconcile
        },
        {
            Description: "Bring a tiled window to the front of every stack panel that "
                + "contains it.",
            Handle: ToolResult.HandleTool(WindowIdInputSchema, BringStackWindowToFront),
            InputSchema: WindowIdInputSchema,
            Name: ToolName.TilingBringStackWindowToFront
        }
    ];
};
