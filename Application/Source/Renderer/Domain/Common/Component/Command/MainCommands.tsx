/* File:      MainCommands.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, ReactElement } from "react";
import type { PMainCommands } from "./MainCommands.Types";
import { tokens } from "@fluentui/react-components";

export const MainCommands = ({ children }: PMainCommands): ReactElement =>
{
    const style: CSSProperties =
    {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXXL,
        justifyContent: "flex-start"
    };

    return (
        <div { ...{ style } }>
            { children }
        </div>
    );
};
