/* File:      CommandContainer.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { type CSSProperties, type ReactElement } from "react";
import type { PCommandContainer } from "./CommandContainer.Types";

export const CommandContainer = ({ children }: PCommandContainer): ReactElement =>
{
    const style: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%"
    };

    return (
        <div { ...{ style } }>
            { children }
        </div>
    );
};
