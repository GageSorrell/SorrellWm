/* File:      CommandContainer.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type ReactElement } from "react";
import type { PCommandContainer_DEPRECATED } from "./CommandContainer_DEPRECATED.Types";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const CommandContainer_DEPRECATED = ({ children }: PCommandContainer_DEPRECATED): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%"
    };

    return (
        <div style={ RootStyle }>
            { children }
        </div>
    );
};
