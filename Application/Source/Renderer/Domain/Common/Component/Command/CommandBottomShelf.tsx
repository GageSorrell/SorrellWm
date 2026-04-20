/**
 * @file      CommandBottomShelf.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties, ReactElement } from "react";
import type { PCommandBottomShelf } from "./CommandBottomShelf.Types";
import { tokens } from "@fluentui/react-components";

export const CommandBottomShelf = ({ children }: PCommandBottomShelf): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: tokens.spacingVerticalL,
        position: "absolute",
        width: "100vw"
    };

    const InnerStyle: CSSProperties =
    {
        display: "flex",
        justifyContent: "center",
        width: 320
    };

    const InnerInnerStyle: CSSProperties =
    {
        display: "flex",
        justifyContent: "center"
    };

    return (
        <div style={ RootStyle }>
            <div style={ InnerStyle }>
                <div style={ InnerInnerStyle }>
                    { children }
                </div>
            </div>
        </div>
    );
};
