/* File:      HighlightedHalf.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, ReactElement } from "react";
import type { PHighlightedHalf } from "./HighlightedHalf.Types";
import { Pulse } from "@/Domain/Common/Component/Pulse";
import { UseThemeColors } from "@/Utility";

export const HighlightedHalf = ({ Position }: PHighlightedHalf): ReactElement =>
{
    const [ Background ] = UseThemeColors();

    const RootStyle: CSSProperties =
    {
        backgroundColor: Background + "55",
        height: Position === "Up" || Position === "Down"
            ? "50%"
            : "100%",
        left: Position !== "Right"
            ? "0"
            : "50%",
        position: "absolute",
        top: Position === "Down"
            ? "50%"
            : "0",
        width: Position === "Up" || Position === "Down"
            ? "100%"
            : "50%"
    };

    return (
        <Pulse>
            <div style={ RootStyle }></div>
        </Pulse>
    );
};
