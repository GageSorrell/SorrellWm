/* File:      SettingSegmentContainer.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { Body1Strong, tokens } from "@fluentui/react-components";
import type { CSSProperties, ReactNode } from "react";
import { GetFlexStyle } from "@/Utility";
import type { PSettingSegmentContainer } from "./SettingSegmentContainer.Types";

export const SettingSegmentContainer = ({ Title, children }: PSettingSegmentContainer): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "stretch"),
        gap: tokens.spacingVerticalXS
    };

    const TitleStyle: CSSProperties =
    {
        marginBottom: tokens.spacingVerticalXS
    };

    return (
        <div style={ RootStyle }>
            <Body1Strong style={ TitleStyle }>
                { Title }
            </Body1Strong>
            { children }
        </div>
    );
};
