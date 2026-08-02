/**
 * Declarative Windows 11-style desktop animations for React and Fluent UI.
 *
 * @module @sorrell/desktop-animation
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

export {
    AnimationTeachingPopover,
    type AnimationTeachingPopoverProps
} from "./AnimationTeachingPopover.js";
export {
    DesktopAnimation,
    type DesktopAnimationProps
} from "./DesktopAnimation.js";
export type {
    ChangeCursorStep,
    CreateWindowStep,
    CursorType,
    DesktopAnimationDefinition,
    DesktopAnimationStep,
    DesktopCanvas,
    DesktopCursor,
    DesktopWindow,
    DestroyWindowStep,
    DragWindowStep,
    HideCursorStep,
    MoveCursorStep,
    MoveWindowStep,
    Point,
    ResizeWindowStep,
    ShowCursorStep,
    Size,
    WaitStep,
    WindowFrame
} from "./Model.js";
export {
    CursorStep,
    DefineAnimation,
    Wait,
    WindowStep
} from "./Timeline.js";
