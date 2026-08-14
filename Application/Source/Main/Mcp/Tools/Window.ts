/**
 * MCP tools that read or mutate individual windows, bypassing the overlay's
 * screen-gated command state machine and calling `TilingManager`/`@sorrell/windows`
 * directly.
 *
 * @module @sorrell/wm/Main/Mcp/Tools/Window
 *
 * @file      Window.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Convert from "../Convert.ts";
import type * as TilingManagerModule from "../../Tiling/Manager.ts";
import * as TilingTree from "../../Tiling/Tree.ts";
import * as ToolResult from "../ToolResult.ts";
import { Box, IntPoint } from "@sorrell/math";
import { Effect, Option, Schema, pipe } from "effect";
import { Mouse as NativeMouse, Window as NativeWindow } from "@sorrell/windows";
import { Tiling as WmApiTiling, Window as WmApiWindow } from "@sorrell/wm-api";
import type { Handle } from "@sorrell/windows";
import type { ToolDefinition } from "../ToolDefinition.ts";
import { ToolName } from "../ToolName.ts";

/** How far below a window's top edge {@link DragWindow} grabs it, in pixels. */
const DragGrabOffsetY = 10;

/** The default duration, in milliseconds, {@link DragWindow} moves the cursor over. */
const DefaultDragDurationMilliseconds = 400;

const BuildWindowDetail = (
    WindowValue: Handle.HWND,
    Snapshot: TilingTree.State,
    Foreground: Option.Option<Handle.HWND>
): WmApiWindow.WindowDetail =>
{
    const Bounds = Option.getOrElse(
        NativeWindow.GetWindowRect(WindowValue),
        () => Box.Box(0, 0, 0, 0)
    );

    let WorkspaceId: string | undefined;
    let PathValue: TilingTree.Path | undefined;

    for (const Workspace of Snapshot.Workspaces)
    {
        if (TilingTree.HasWindow(Workspace.Root, WindowValue))
        {
            WorkspaceId = Workspace.Id;
            PathValue = TilingTree.FindWindowPath(Workspace.Root, WindowValue);
            break;
        }
    }

    return {
        ApplicationName: Option.getOrUndefined(NativeWindow.GetApplicationName(WindowValue)),
        Bounds: Convert.ToBox(Bounds),
        ExecutablePath: Option.getOrUndefined(NativeWindow.GetExecutablePath(WindowValue)),
        Id: Convert.ToWindowId(WindowValue),
        IsFocused: Option.isSome(Foreground) && Foreground.value === WindowValue,
        IsTiled: WorkspaceId !== undefined,
        Path: PathValue,
        Title: Option.getOrElse(NativeWindow.GetWindowText(WindowValue), () => ""),
        WorkspaceId
    };
};

const ListWindowsInputSchema = Schema.Struct({ });

const ListWindows = (
    TilingManagerService: TilingManagerModule.TilingManagerImpl
) => (): Effect.Effect<
    ReadonlyArray<WmApiWindow.WindowDetail>,
    { readonly Message: string; }
> => Effect.gen(function*()
{
    const Snapshot = yield* TilingManagerService.Snapshot;
    const Foreground = NativeWindow.GetForegroundWindow();
    const Handles = yield* pipe(
        Effect.sync(NativeWindow.GetManageableTopLevelWindows),
        Effect.flatMap(Effect.fromResult),
        Effect.mapError(ToolResult.ToMessageError)
    );

    return Handles.map((WindowValue: Handle.HWND) =>
        BuildWindowDetail(WindowValue, Snapshot, Foreground));
});

const WindowIdInputSchema = Schema.Struct({ WindowId: WmApiWindow.WindowIdSchema });

const GetWindow = (
    TilingManagerService: TilingManagerModule.TilingManagerImpl
) => (
    Input: typeof WindowIdInputSchema.Type
): Effect.Effect<WmApiWindow.WindowDetail, { readonly Message: string; }> => Effect.gen(function*()
{
    const Snapshot = yield* TilingManagerService.Snapshot;
    const WindowValue = Convert.FromWindowId(Input.WindowId);

    if (Option.isNone(NativeWindow.GetWindowRect(WindowValue)))
    {
        return yield* Effect.fail({ Message: `Window ${ Input.WindowId } could not be found.` });
    }

    return BuildWindowDetail(WindowValue, Snapshot, NativeWindow.GetForegroundWindow());
});

const FocusWindow = (
    Input: typeof WindowIdInputSchema.Type
): Effect.Effect<{ readonly WindowId: WmApiWindow.WindowId; }, { readonly Message: string; }> => pipe(
    Effect.sync(() => NativeWindow.SetForegroundWindow(Convert.FromWindowId(Input.WindowId))),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError(ToolResult.ToMessageError),
    Effect.as({ WindowId: Input.WindowId })
);

const TileWindowInputSchema = Schema.Struct({
    Orientation: Schema.optional(WmApiTiling.OrientationSchema),
    TargetWindowId: Schema.optional(WmApiWindow.WindowIdSchema),
    WindowId: WmApiWindow.WindowIdSchema
});

const TileWindow = (
    TilingManagerService: TilingManagerModule.TilingManagerImpl
) => (
    Input: typeof TileWindowInputSchema.Type
): Effect.Effect<{ readonly WindowId: WmApiWindow.WindowId; }, { readonly Message: string; }> => pipe(
    TilingManagerService.Tile(
        Convert.FromWindowId(Input.WindowId),
        Input.TargetWindowId === undefined
            ? undefined
            : Convert.FromWindowId(Input.TargetWindowId),
        Input.Orientation === undefined
            ? undefined
            : Convert.FromOrientation(Input.Orientation)
    ),
    Effect.mapError(ToolResult.ToMessageError),
    Effect.as({ WindowId: Input.WindowId })
);

const FloatWindowInputSchema = Schema.Struct({
    RestoreInitialBounds: Schema.optional(Schema.Boolean),
    WindowId: WmApiWindow.WindowIdSchema
});

const FloatWindow = (
    TilingManagerService: TilingManagerModule.TilingManagerImpl
) => (
    Input: typeof FloatWindowInputSchema.Type
): Effect.Effect<{ readonly WindowId: WmApiWindow.WindowId; }, { readonly Message: string; }> => pipe(
    TilingManagerService.Float(
        Convert.FromWindowId(Input.WindowId),
        Input.RestoreInitialBounds ?? false
    ),
    Effect.mapError(ToolResult.ToMessageError),
    Effect.as({ WindowId: Input.WindowId })
);

const SetWindowBoundsInputSchema = Schema.Struct({
    Bounds: WmApiWindow.BoxSchema,
    WindowId: WmApiWindow.WindowIdSchema
});

const SetWindowBounds = (
    Input: typeof SetWindowBoundsInputSchema.Type
): Effect.Effect<
    { readonly Bounds: WmApiWindow.Box; readonly WindowId: WmApiWindow.WindowId; },
    { readonly Message: string; }
> => pipe(
    Effect.sync(() => NativeWindow.SetWindowRect(
        Convert.FromWindowId(Input.WindowId),
        Convert.FromBox(Input.Bounds)
    )),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError(ToolResult.ToMessageError),
    Effect.as({ Bounds: Input.Bounds, WindowId: Input.WindowId })
);

const DragWindowInputSchema = Schema.Struct({
    DurationMilliseconds: Schema.optional(Schema.Int),
    ToX: Schema.Int,
    ToY: Schema.Int,
    WindowId: WmApiWindow.WindowIdSchema
});

const DragWindow = (
    Input: typeof DragWindowInputSchema.Type
): Effect.Effect<
    { readonly Bounds: WmApiWindow.Box; readonly WindowId: WmApiWindow.WindowId; },
    { readonly Message: string; }
> => Effect.gen(function*()
{
    const WindowValue = Convert.FromWindowId(Input.WindowId);
    const Bounds = NativeWindow.GetWindowRect(WindowValue);

    if (Option.isNone(Bounds))
    {
        return yield* Effect.fail({
            Message: `Window ${ Input.WindowId } could not be found.`
        });
    }

    const FromPoint = IntPoint.IntPoint(
        Bounds.value.Left + Math.floor(Box.Width(Bounds.value) / 2),
        Bounds.value.Top + DragGrabOffsetY
    );
    const ToPoint = IntPoint.IntPoint(Input.ToX, Input.ToY);

    yield* NativeMouse.Drag(
        FromPoint,
        ToPoint,
        Input.DurationMilliseconds ?? DefaultDragDurationMilliseconds
    );

    const NextBounds = Option.getOrElse(
        NativeWindow.GetWindowRect(WindowValue),
        () => Bounds.value
    );

    return { Bounds: Convert.ToBox(NextBounds), WindowId: Input.WindowId };
});

export/**
       * Build every window-level tool this MCP server advertises, closing over an
       * already-resolved `TilingManagerImpl` so handlers carry no further Effect
       * Context requirement.
       */
const MakeDefinitions = (
    TilingManagerService: TilingManagerModule.TilingManagerImpl
): ReadonlyArray<ToolDefinition> => [
    {
        Description: "List every manageable top-level window, tiled or floating, with "
            + "its title, owning application, bounds, tiled/focused state, and (when "
            + "tiled) its workspace and tree path.",
        Handle: ToolResult.HandleTool(ListWindowsInputSchema, ListWindows(TilingManagerService)),
        InputSchema: ListWindowsInputSchema,
        Name: ToolName.WindowList
    },
    {
        Description: "Get one window's detail by its window id (from window_list).",
        Handle: ToolResult.HandleTool(WindowIdInputSchema, GetWindow(TilingManagerService)),
        InputSchema: WindowIdInputSchema,
        Name: ToolName.WindowGet
    },
    {
        Description: "Focus a window, activating it and directing keyboard input to it.",
        Handle: ToolResult.HandleTool(WindowIdInputSchema, FocusWindow),
        InputSchema: WindowIdInputSchema,
        Name: ToolName.WindowFocus
    },
    {
        Description: "Add a floating window to the tiled layout on its monitor, "
            + "optionally beside a specific target window and with a specific split "
            + "orientation.",
        Handle: ToolResult.HandleTool(TileWindowInputSchema, TileWindow(TilingManagerService)),
        InputSchema: TileWindowInputSchema,
        Name: ToolName.WindowTile
    },
    {
        Description: "Remove a tiled window from the layout, making it a floating "
            + "window again.",
        Handle: ToolResult.HandleTool(FloatWindowInputSchema, FloatWindow(TilingManagerService)),
        InputSchema: FloatWindowInputSchema,
        Name: ToolName.WindowFloat
    },
    {
        Description: "Move and/or resize a floating window to an exact rectangle. Has "
            + "no effect on a tiled window's position; float it first.",
        Handle: ToolResult.HandleTool(SetWindowBoundsInputSchema, SetWindowBounds),
        InputSchema: SetWindowBoundsInputSchema,
        Name: ToolName.WindowSetBounds
    },
    {
        Description: "Simulate a real click-and-drag of a window by its title bar, "
            + "moving the grabbed point to the given destination over a duration. This "
            + "is the only way to trigger the app's native drag-to-float and "
            + "drag-to-insert behavior exactly as a human dragging the window would.",
        Handle: ToolResult.HandleTool(DragWindowInputSchema, DragWindow),
        InputSchema: DragWindowInputSchema,
        Name: ToolName.WindowDrag
    }
];
