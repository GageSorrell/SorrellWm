/**
 * Ink Box wrapper with a pixel-compact Sixel border.
 *
 * @module @sorrell/ink-ui/Box
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type { CornerShapeKeyword, CornerShapeValue } from "./CompactBorder.js";
export {
    type BoxElevation,
    type BoxShadowOptions,
    GetShadowInsets,
    type RenderedBoxShadow,
    RenderBoxShadow,
    type ShadowInsets
} from "./Shadow.js";
export type {
    BoxMouseBounds,
    BoxMouseDownEvent,
    BoxMouseDragEvent,
    BoxMouseEvent,
    BoxMouseHandlers,
    BoxMouseMoveEvent,
    BoxMousePosition,
    BoxMouseUpEvent,
    BoxWheelEvent
} from "./Mouse.js";
export * from "./Box.tsx";
