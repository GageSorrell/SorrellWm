/**
 * @file      ReactiveEvent.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties, ReactNode } from "react";

export function ReactiveEvent(): ReactNode
{
    const RootStyle: CSSProperties =
        {
            background: "text linear-gradient(120deg, #0078D4, #B84DC6)",
            color: "transparent"
        };

    return (
        <span
            className="font-display text-2xl"
            style={ RootStyle }>
            Reactive Event
        </span>

    );
}
