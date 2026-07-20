/**
 * @file      Style.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties } from "react";
import type { FFlexStyle } from "./Style.Types.js";

/**
 * Conveniently create {@link CSSProperties} objects that define `flex` styles.
 *
 * @param Direction - The `flex-direction` property of the returned {@link CSSProperties}.
 * @param JustifyContent - The `justify-content` property of the returned {@link CSSProperties}.
 * @param AlignItems - The `align-items` property of the returned {@link CSSProperties}.
 * @param Rest - A {@link CSSProperties} that the given `flex` styles will be applied to, then returned.
 *
 * @returns {FFlexStyle} A {@link CSSProperties} with `flex` properties certainly defined.
 */
export function GetFlexStyle(
    Direction: NonNullable<CSSProperties["flexDirection"]>,
    JustifyContent: NonNullable<CSSProperties["justifyContent"]>,
    AlignItems: NonNullable<CSSProperties["alignItems"]>,
    Rest: CSSProperties = { }
): FFlexStyle
{
    return {
        alignItems: AlignItems,
        display: "flex",
        flexDirection: Direction,
        justifyContent: JustifyContent,
        ...Rest
    } as FFlexStyle;
};
