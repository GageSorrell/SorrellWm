/* File:      Setting.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    Body1,
    Caption1,
    Checkbox,
    type CheckboxOnChangeData,
    makeStyles,
    tokens } from "@fluentui/react-components";
import { type CSSProperties, type ChangeEvent, type MouseEventHandler, type ReactNode } from "react";
import { ChevronDownRegular, type FluentIconsProps } from "@fluentui/react-icons";
import type {
    FSettingSegmentStyle,
    PSettingSegment,
    PSettingSegmentBody,
    PSettingSegmentHeader,
    PSettingSegmentInternal } from "./SettingSegment.Types";
import type { FLogger } from "Source/Shared";
import { GetFlexStyle } from "@/Utility";
import { GetLogger } from "@/Log";
import { Rotate } from "@fluentui/react-motion-components-preview";
import { UseCompoundContext } from "./CompoundSettingSegment";

const Log: FLogger = GetLogger("SettingSegment");

const UseSettingSegmentStyles: () => Record<FSettingSegmentStyle, string> = makeStyles({
    CompoundBody:
    {
        backgroundColor: tokens.colorNeutralBackground1,
        borderTopColor: "#00000000",
        borderTopStyle: "none",
        borderTopWidth: 0,
        marginTop: "-1px"
    },
    CompoundHeader:
    {
        backgroundColor: tokens.colorNeutralBackground1,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: tokens.borderRadiusMedium,
        borderTopRightRadius: tokens.borderRadiusMedium,
        transitionDuration: "120ms",
        transitionProperty: "background-color",
        transitionTimingFunction: "ease",
        zIndex: 9999,

        ":hover":
        {
            backgroundColor: tokens.colorNeutralBackground1Hover
        }
    },
    Regular:
    {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium
    }
});

const SettingSegmentBase = (
    { Control, Icon, Subtitle, Title, Type }: PSettingSegmentInternal
): ReactNode =>
{
    const Styles: Record<FSettingSegmentStyle, string> = UseSettingSegmentStyles();

    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        borderColor: "#DFE8DC",
        borderStyle: "solid",
        borderWidth: 1,
        gap: tokens.spacingHorizontalM,
        padding: tokens.spacingHorizontalM
    };

    const TitleContainerStyle: CSSProperties = GetFlexStyle("column", "flex-start", "flex-start");

    const Caption: ReactNode = (typeof Subtitle === "string")
        ? <Caption1 style={ { color: tokens.colorNeutralForeground4 } }>{ Subtitle }</Caption1>
        : Subtitle;

    const FillerStyle: CSSProperties =
    {
        flex: 1
    };

    const IconStyle: FluentIconsProps["style"] =
    {
        fontSize: "1.5rem"
    };

    const { IsExpanded, OnChangeExpanded } = UseCompoundContext();

    const CompoundChevron = (): ReactNode =>
    {
        return Type === "CompoundHeader" && (
            <Rotate
                animateOpacity={ false }
                appear
                inAngle={ 0 }
                outAngle={ 180 }
                visible={ IsExpanded }>
                <ChevronDownRegular
                    color="#000000"
                    fontSize="1.125rem"
                />
            </Rotate>
        );
    };

    const OnMouseDown: MouseEventHandler<HTMLDivElement> = (
        _Event: React.MouseEvent<unknown, MouseEvent>
    ): void =>
    {
        if (Type === "CompoundHeader")
        {
            OnChangeExpanded();
        }
    };

    return (
        <div
            className={ Styles[Type] }
            onMouseDown={ OnMouseDown }
            style={ RootStyle }>
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
            { Control }
            <CompoundChevron/>
        </div>
    );
};

export const CompoundSettingSegmentHeader = (Props: PSettingSegmentHeader): ReactNode =>
{
    return (
        <SettingSegmentBase
            Type="CompoundHeader"
            { ...Props }
        />
    );
};

/** @TODO Finish this. */
export const CompoundSettingSegmentBody = (
    { OnChangeValue, Subtitle, Title, Value }: PSettingSegmentBody
): ReactNode =>
{
    const Styles: Record<FSettingSegmentStyle, string> = UseSettingSegmentStyles();

    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        borderColor: "#DFE8DC",
        borderStyle: "solid",
        borderWidth: 1,
        gap: tokens.spacingHorizontalXXS,
        padding: tokens.spacingHorizontalM,
        paddingLeft: 42
    };

    const TitleContainerStyle: CSSProperties = GetFlexStyle("column", "flex-start", "flex-start");

    const Caption: ReactNode = (typeof Subtitle === "string")
        ? <Caption1 style={ { color: tokens.colorNeutralForeground4 } }>{ Subtitle }</Caption1>
        : Subtitle;

    const OnChange = (_Event: ChangeEvent<HTMLInputElement>, Data: CheckboxOnChangeData): void =>
    {
        Log(`Data.checked === ${ Data.checked }.`);
        OnChangeValue(typeof Data.checked === "boolean" && Data.checked);
    };

    return (
        <div
            className={ Styles.CompoundBody }
            style={ RootStyle }>
            <Checkbox
                checked={ Value }
                onChange={ OnChange }
            />
            <div style={ TitleContainerStyle }>
                <Body1>
                    { Title }
                </Body1>
                { Caption }
            </div>
        </div>
    );
};

export const SettingSegment = (Props: PSettingSegment): ReactNode =>
{
    return (
        <SettingSegmentBase
            Type="Regular"
            { ...Props }
        />
    );
};
