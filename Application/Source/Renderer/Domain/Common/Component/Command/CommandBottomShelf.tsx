/* File:      CommandBottomShelf.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { CSSProperties, ReactElement } from "react";
import type { PCommandBottomShelf } from "./CommandBottomShelf.Types";
import { tokens } from "@fluentui/react-components";

export const CommandBottomShelf = ({ children }: PCommandBottomShelf): ReactElement =>
{
    const style: CSSProperties =
    {
        alignItems: "center",
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        position: "absolute",
        marginBottom: tokens.spacingVerticalL,
        width: "100vw"
    };

    return (
        <div { ...{ style } }>
            <div style={ { width: 320, display: "flex", justifyContent: "center" } }>
                <div style={ { display: "flex", alignItems: "center" } }>
                    { children }
                </div>
            </div>
        </div>
    );
};
