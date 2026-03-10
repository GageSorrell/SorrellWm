/* File:      SettingsScreen.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, ReactNode } from "react";
import { GetFlexStyle } from "@/Utility";
import type { PSettingsScreen } from "./SettingsScreen.Types";
import { Slide } from "@fluentui/react-motion-components-preview";
import { Title1 } from "@fluentui/react-components";

export const SettingsScreen = ({ children, Title }: PSettingsScreen): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "flex-start"),
        flex: 1,
        height: "100%",
        marginRight: 16,
        marginTop: 0,
        maxWidth: "100%",
        minHeight: "100%",
        paddingTop: 0
        // minWidth: "100%",
        // visibility: Visible ? "visible" : "hidden"
        // position: "absolute",
        // top: 0
    };

    const BodyStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "flex-start"),
        gap: 16,
        height: "100%",
        maxWidth: "100%",
        minHeight: "100%",
        overflowY: "auto"
        // minWidth: "100%",
    };

    return (
        <div style={ RootStyle }>
            <Slide
                appear
                outY="50%"
                visible>
                <div style={ BodyStyle }>
                    <Title1>
                        { Title }
                    </Title1>
                    <br />
                    { children }
                </div>
            </Slide>
        </div>
    );
};
