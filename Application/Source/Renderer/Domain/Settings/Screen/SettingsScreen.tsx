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
        flex: 1,
        height: "100%",
        marginTop: 0,
        maxHeight: "100%",
        minHeight: "100%",
        overflowY: "hidden",
        paddingBottom: 32,
        paddingTop: 0
    };

    const BodyStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "stretch"),
        gap: 16,
        height: "100%",
        maxWidth: "100%",
        // marginBottom: Tokens.TitlebarHeight,
        paddingRight: 16
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
