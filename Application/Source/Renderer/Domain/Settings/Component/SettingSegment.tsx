/**
 * @file      Setting.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Body1,
    Caption1,
    Caption1Strong,
    Checkbox,
    type CheckboxOnChangeData,
    type CheckboxProps,
    Link,
    makeStyles,
    mergeClasses,
    tokens } from "@fluentui/react-components";
import { type CSSProperties, type ChangeEvent, type MouseEventHandler, type ReactNode } from "react";
import { ChevronDownRegular, type FluentIconsProps, WarningFilled } from "@fluentui/react-icons";
import type {
    FSettingSegmentStyle,
    PSettingSegment,
    PSettingSegmentBody,
    PSettingSegmentHeader,
    PSettingSegmentInternal } from "./SettingSegment.Types";
import type { FLogger } from "../../../../Shared";
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
    Disabled:
    {
        backgroundColor: tokens.colorStatusWarningBackground1
    },
    Regular:
    {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium
    }
});

const SettingSegmentBase = (
    {
        Disabled: InDisabled,
        DisabledAction,
        DisabledActionLabel,
        DisabledMessage,
        Control,
        Icon,
        Subtitle,
        Title,
        Type
    }: PSettingSegmentInternal
): ReactNode =>
{
    const Styles: Record<FSettingSegmentStyle, string> = UseSettingSegmentStyles();

    const Disabled: boolean = InDisabled !== undefined ? InDisabled : false;

    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        borderColor: "#DFE8DC",
        borderStyle: "solid",
        borderWidth: 1,
        gap: tokens.spacingHorizontalM,
        padding: tokens.spacingHorizontalM
    };

    const InnerStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "flex-start"),
        gap: tokens.spacingVerticalXS,
        width: "100%"
    };

    const InnerRow: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        gap: tokens.spacingHorizontalM,
        width: "100%"
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

    const RootClass: string = mergeClasses(Styles[Type], Disabled ? Styles.Disabled : undefined);

    const DisabledNotification = (): ReactNode =>
    {
        const OutDisabledMessage = (): ReactNode =>
        {
            return typeof DisabledMessage === "string"
                ? (
                    <Caption1Strong color={ tokens.colorStatusWarningForeground1 }>
                        { DisabledMessage }
                    </Caption1Strong>
                )
                : DisabledMessage;
        };

        const MessageRootStyle: CSSProperties =
        {
            ...GetFlexStyle("row", "flex-start", "center"),
            gap: tokens.spacingHorizontalS,
            width: "100%"
        };

        const LinkStyle: CSSProperties =
        {
            fontSize: "0.75rem",
            fontWeight: "bold"
        };

        return (
            <div style={ MessageRootStyle }>
                <WarningFilled
                    color={ tokens.colorStatusWarningForeground1 }
                    fontSize="1rem"
                />
                <OutDisabledMessage />
                <div style={ { flex: 1 } }></div>
                { DisabledActionLabel && (
                    <Link
                        onMouseDown={ DisabledAction }
                        style={ LinkStyle }>
                        { DisabledActionLabel }
                    </Link>
                )}
            </div>
        );
    };

    return (
        <div
            className={ RootClass }
            onMouseDown={ OnMouseDown }
            style={ RootStyle }>
            <div style={ InnerStyle }>
                <div style={ InnerRow }>
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
                { Disabled && (
                    <div style={ InnerRow }>
                        { Icon && <Icon style={ { ...IconStyle, ...{ visibility: "hidden" } } } /> }
                        <DisabledNotification />
                    </div>
                ) }
            </div>
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

    const CheckboxLabel: CheckboxProps["label"] =
    (
        <div style={ TitleContainerStyle }>
            <Body1>
                { Title }
            </Body1>
            { Caption }
        </div>
    );

    return (
        <div
            className={ Styles.CompoundBody }
            style={ RootStyle }>
            <Checkbox
                checked={ Value }
                label={ CheckboxLabel }
                onChange={ OnChange }
            />
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
