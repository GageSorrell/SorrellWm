/* File:      Keybind.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { Body1, Caption1, makeStyles, tokens } from "@fluentui/react-components";
import type { CSSProperties, ReactNode } from "react";
import { EditRegular, type FluentIconsProps } from "@fluentui/react-icons";
import { GetFlexStyle, type TUseClasses } from "@/Utility";
import { Key } from "@/Domain/Common";
import type { PKeybind } from "./KeybindSet.Types";

export const UseKeybindClasses: TUseClasses<"KeyContainerStyle"> = makeStyles({
    KeyContainerStyle:
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        flexWrap: "nowrap",
        gap: tokens.spacingHorizontalS,
        paddingBottom: tokens.spacingVerticalS,
        paddingTop: tokens.spacingVerticalS,
        transitionDuration: "120ms",
        transitionProperty: "background-color",
        transitionTimingFunction: "ease",

        ":hover":
        {
            backgroundColor: tokens.colorNeutralBackground1Hover
        }
    }
});

/** @deprecated Use KeybindSet. */
// export const Keybind = ({ ActionKey, Icon, KeyId, Subtitle, Title }: PKeybind): ReactNode =>
export const Keybind = ({ Icon, Subtitle, Title }: PKeybind): ReactNode =>
{
    const { KeyContainerStyle } = UseKeybindClasses();
    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        backgroundColor: tokens.colorNeutralBackground1,
        borderColor: "#DFE8DC",
        borderRadius: tokens.borderRadiusMedium,
        borderStyle: "solid",
        borderWidth: 1,
        gap: tokens.spacingHorizontalM,
        padding: tokens.spacingHorizontalM
    };

    const Caption: ReactNode = (typeof Subtitle === "string")
        ? <Caption1 style={ { color: tokens.colorNeutralForeground4 } }>{ Subtitle }</Caption1>
        : Subtitle;

    const IconStyle: FluentIconsProps["style"] =
    {
        fontSize: "1.5rem"
    };

    const TitleContainerStyle: CSSProperties = GetFlexStyle("column", "flex-start", "flex-start");

    const FillerStyle: CSSProperties =
    {
        flex: 1
    };

    return (
        <div style={ RootStyle }>
            {
                Icon && <Icon style={ IconStyle }/>
            }
            <div style={ TitleContainerStyle }>
                <Body1>
                    { Title }
                </Body1>
                { Caption }
            </div>
            <div style={ FillerStyle }></div>
            <div className={ KeyContainerStyle }>
                <Key KeyId="F"/>
                <EditRegular
                    color={ tokens.colorNeutralForeground4 }
                    fontSize="1rem"/>
            </div>
        </div>
    );
};
