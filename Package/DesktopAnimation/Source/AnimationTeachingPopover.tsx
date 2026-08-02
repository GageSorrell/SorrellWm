/**
 * Fluent UI teaching popover whose media is a desktop animation.
 *
 * @module @sorrell/desktop-animation/AnimationTeachingPopover
 *
 * @file      AnimationTeachingPopover.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    TeachingPopover,
    TeachingPopoverBody,
    TeachingPopoverSurface,
    TeachingPopoverTitle
} from "@fluentui/react-components";
import type { ReactNode } from "react";
import { DesktopAnimation } from "./DesktopAnimation.js";
import type { DesktopAnimationDefinition } from "./Model.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/AnimationTeachingPopover" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Props for a teaching popover with animated desktop media.
 *
 * @category Model
 * @since 1.0.0
 */
export interface AnimationTeachingPopoverProps
{
    readonly Animation: DesktopAnimationDefinition;
    readonly SurfaceChild: ReactNode;
    readonly Title: ReactNode;
}

/**
 * Renders an open Fluent UI teaching popover with desktop animation media.
 *
 * # Details
 *
 * `Title` is the child of `TeachingPopoverTitle`.  `SurfaceChild` is inserted after the
 * body as the last child of `TeachingPopoverSurface`.
 *
 * @category Component
 * @since 1.0.0
 */
export const AnimationTeachingPopover = (
    { Animation, SurfaceChild, Title }: AnimationTeachingPopoverProps
): React.JSX.Element =>
    (
        <TeachingPopover defaultOpen>
            <TeachingPopoverSurface>
                <TeachingPopoverBody
                    media={ <DesktopAnimation Animation={ Animation } /> }
                    mediaLength="medium">
                    <TeachingPopoverTitle>{ Title }</TeachingPopoverTitle>
                </TeachingPopoverBody>
                { SurfaceChild }
            </TeachingPopoverSurface>
        </TeachingPopover>
    );
