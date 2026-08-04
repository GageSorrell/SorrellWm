/**
 * Guards a hover-change callback against activating when the pointer ends up over an
 * element only because the element (or the overlay window containing it) moved
 * underneath a stationary cursor, rather than because the user moved the cursor onto it.
 *
 * @module @sorrell/wm/Renderer/UseGuardedHover
 *
 * @file      UseGuardedHover.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { MouseEvent as ReactMouseEvent } from "react";
import type { Thunk } from "@sorrell/utility/Function";
import { useRef } from "react";

/** Mouse handlers to spread onto an element in place of raw `onMouseEnter`/`onMouseLeave`. */
export interface GuardedHoverHandlers
{
    readonly onMouseEnter: (Event: ReactMouseEvent) => void;
    readonly onMouseLeave: Thunk;
}

export/**
       * Wrap a hover-change callback so a `mouseenter` is only treated as a real hover
       * when it is accompanied by genuine cursor movement (`movementX`/`movementY`
       * non-zero). A `mouseenter` fired by the browser re-evaluating what is under a
       * stationary cursor after the underlying element/window moved reports zero
       * movement and is ignored; normal hover resumes as soon as the cursor actually
       * leaves the element's bounds.
       */
const UseGuardedHover = (
    OnHoverChange: ((Hovered: boolean) => void) | undefined
): GuardedHoverHandlers =>
{
    const IsSuppressedRef = useRef(false);

    const onMouseEnter = (Event: ReactMouseEvent): void =>
    {
        if (Event.movementX === 0 && Event.movementY === 0)
        {
            IsSuppressedRef.current = true;
            return;
        }

        IsSuppressedRef.current = false;
        OnHoverChange?.(true);
    };

    const onMouseLeave = (): void =>
    {
        IsSuppressedRef.current = false;
        OnHoverChange?.(false);
    };

    return { onMouseEnter, onMouseLeave };
};
