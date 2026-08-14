/**
 * Stable identifiers for every tool this MCP server advertises. Underscore-only, no
 * dots/colons, for maximum MCP-host compatibility.
 *
 * @module @sorrell/wm/Main/Mcp/ToolName
 *
 * @file      ToolName.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/** The stable identifier of every tool this MCP server advertises. */
const ToolName = Object.freeze({
    CursorGetPosition: "cursor_get_position",
    CursorMove: "cursor_move",
    CursorSetPosition: "cursor_set_position",
    MonitorList: "monitor_list",
    MouseButtonDown: "mouse_button_down",
    MouseButtonUp: "mouse_button_up",
    MouseClick: "mouse_click",
    MouseDrag: "mouse_drag",
    TilingBringStackWindowToFront: "tiling_bring_stack_window_to_front",
    TilingInsert: "tiling_insert",
    TilingMove: "tiling_move",
    TilingMoveIntoPanel: "tiling_move_into_panel",
    TilingMoveToContainingPanel: "tiling_move_to_containing_panel",
    TilingMoveToIndex: "tiling_move_to_index",
    TilingPreviewInsert: "tiling_preview_insert",
    TilingReconcile: "tiling_reconcile",
    TilingRefresh: "tiling_refresh",
    TilingResize: "tiling_resize",
    TilingSetGap: "tiling_set_gap",
    TilingSetPanelOrientation: "tiling_set_panel_orientation",
    TilingSetPanelRatio: "tiling_set_panel_ratio",
    TilingSnapshot: "tiling_snapshot",
    TilingTileAll: "tiling_tile_all",
    WindowDrag: "window_drag",
    WindowFloat: "window_float",
    WindowFocus: "window_focus",
    WindowGet: "window_get",
    WindowList: "window_list",
    WindowSetBounds: "window_set_bounds",
    WindowTile: "window_tile"
} as const);

/** One of this MCP server's advertised tool identifiers. */
export type ToolName = typeof ToolName[keyof typeof ToolName];
