/**
 * A {@link Ink!Box | Box} that supports @todo.
 *
 * @module @sorrell/effect-ink/Component/Primitive/MouseBox
 *
 * @file      MouseBox.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Event } from "../../Internal/Mouse.tsx";

export interface MouseBoxProps
{
    readonly OnMouseDown?: (Event: Event) => void;
}
