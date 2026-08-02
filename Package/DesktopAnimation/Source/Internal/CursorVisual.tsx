/**
 * SVG cursor shapes used by desktop animations.
 *
 * @module @sorrell/desktop-animation/Internal/CursorVisual
 *
 * @file      CursorVisual.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CursorType } from "../Model.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/Internal/CursorVisual" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Props for an SVG cursor shape.
 *
 * @category Model
 * @since 1.0.0
 */
export interface CursorVisualProps
{
    readonly Type: CursorType;
}

const PointerPath = [
    "M8.1 11.2V5.1a1.45 1.45 0 0 1 2.9 0v4.3-1.55a1.35 1.35 0 0 1 2.7 0",
    "v1.6-1.05a1.3 1.3 0 0 1 2.6 0v1.75-.65a1.25 1.25 0 0 1 2.5 0v4.05",
    "c0 4.5-2.6 7.2-6.45 7.2-2.15 0-3.45-.7-4.55-2.05l-3.05-3.8a1.55 1.55 0 0 1 2.2-2.15z"
].join("");

const MovePath = [
    "M12 2v20M2 12h20M12 2 9 5m3-3 3 3M22 12l-3-3m3 3-3 3",
    "M12 22l-3-3m3 3 3-3M2 12l3-3m-3 3 3 3"
].join("");

const GrabPath = [
    "M7.1 10.2V7.8a1.3 1.3 0 0 1 2.6 0v1-3a1.35 1.35 0 0 1 2.7 0v3-2.15",
    "a1.3 1.3 0 0 1 2.6 0v2.4-1.25a1.25 1.25 0 0 1 2.5 0v5.5",
    "c0 4.8-2.3 7.2-6.2 7.2-2.05 0-3.4-.75-4.5-2.15l-2.25-2.9",
    "a1.5 1.5 0 0 1 2.15-2.05l.4.3z"
].join("");

const GrabbingPath = [
    "M6.8 9.8V7.5a1.25 1.25 0 0 1 2.5 0v1.1-2.9a1.3 1.3 0 0 1 2.6 0v2.9-2",
    "a1.25 1.25 0 0 1 2.5 0v2.3-1.05a1.2 1.2 0 0 1 2.4 0v5.55",
    "c0 4.65-2.15 6.95-5.9 6.95-1.9 0-3.15-.65-4.2-1.95l-2.45-3",
    "a1.45 1.45 0 0 1 2.05-2l.5.35z"
].join("");

/**
 * Renders one of the cursor shapes supported by a desktop animation.
 *
 * @category Component
 * @since 1.0.0
 */
export const CursorVisual = ({ Type }: CursorVisualProps): React.JSX.Element =>
{
    const SharedProps = {
        "aria-hidden": true,
        fill: "white",
        height: 24,
        stroke: "#111",
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        strokeWidth: 1.5,
        viewBox: "0 0 24 24",
        width: 24
    };

    switch (Type)
    {
        case "Arrow":
            return (
                <svg { ...SharedProps }>
                    <path d="M3.25 2.5v15.8l4.35-4.1 3.2 6.4 3.15-1.55-3.15-6.25h6.05z" />
                </svg>
            );

        case "Pointer":
            return (
                <svg { ...SharedProps }>
                    <path d={ PointerPath } />
                </svg>
            );

        case "Move":
            return (
                <svg { ...SharedProps }
                    fill="none"
                    strokeWidth={ 2 }>
                    <path d={ MovePath } />
                </svg>
            );

        case "Text":
            return (
                <svg { ...SharedProps }
                    fill="none"
                    strokeWidth={ 2 }>
                    <path d="M8 3h8M8 21h8M12 3v18M9.5 7H12m-2.5 10H12" />
                </svg>
            );

        case "Crosshair":
            return (
                <svg { ...SharedProps }
                    fill="none"
                    strokeWidth={ 1.8 }>
                    <circle cx="12"
                        cy="12"
                        r="4" />
                    <path d="M12 2v6m0 8v6M2 12h6m8 0h6" />
                </svg>
            );

        case "Grab":
            return (
                <svg { ...SharedProps }>
                    <path d={ GrabPath } />
                </svg>
            );

        case "Grabbing":
            return (
                <svg { ...SharedProps }>
                    <path d={ GrabbingPath } />
                </svg>
            );
    }
};
