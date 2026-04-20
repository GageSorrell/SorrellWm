/**
 * @file      ActionBase.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties, ReactElement } from "react";
import type { PAction } from "./Action.Types";
import { tokens } from "@fluentui/react-components";

/** The base for most action pages. */
export const Action = ({ children }: PAction): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingHorizontalXL,
        justifyContent: "flex-start"
    };

    return (
        <div style={ RootStyle }>
            { children }
        </div>
    );
};
