/**
 * A single setting row: an icon, a title/subtitle, and a control slot. Optionally accepts
 * {@link SettingOption} children, in which case the row becomes an expandable accordion.
 *
 * @module @sorrell/settings-ui/Setting
 *
 * @file      Setting.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ChevronDownRegular, type FluentIcon } from "@fluentui/react-icons";
import { type ReactNode, useState } from "react";
import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { PulseMotion } from "./Internal/PulseMotion.js";
import { UseSettingControlRegistration } from "./Internal/UseSettingControlRegistration.js";

const UseStyles = makeStyles({
    Caret:
    {
        alignItems: "center",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: tokens.borderRadiusMedium,
        color: tokens.colorNeutralForeground2,
        cursor: "pointer",
        display: "flex",
        flexShrink: 0,
        fontSize: "1rem",
        justifyContent: "center",
        padding: tokens.spacingHorizontalXS,

        ":hover":
        {
            backgroundColor: tokens.colorSubtleBackgroundHover
        }
    },
    CaretIcon:
    {
        transitionDuration: tokens.durationFaster,
        transitionProperty: "transform",
        transitionTimingFunction: tokens.curveEasyEase
    },
    CaretIconOpen:
    {
        transform: "rotate(180deg)"
    },
    Children:
    {
        borderTop: `${ tokens.strokeWidthThin } solid ${ tokens.colorNeutralStroke2 }`,
        display: "flex",
        flexDirection: "column"
    },
    Control:
    {
        flexShrink: 0
    },
    Header:
    {
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: tokens.spacingHorizontalM,
        minHeight: "3.5rem",
        padding: `${ tokens.spacingVerticalM } ${ tokens.spacingHorizontalM }`
    },
    Icon:
    {
        alignSelf: "flex-start",
        color: tokens.colorNeutralForeground2,
        flexShrink: 0,
        fontSize: "1.25rem"
    },
    Root:
    {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        boxSizing: "border-box",
        overflow: "hidden",
        width: "100%"
    },
    RootDisabled:
    {
        opacity: 0.5,
        pointerEvents: "none"
    },
    Subtitle:
    {
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200
    },
    TextGroup:
    {
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        gap: tokens.spacingVerticalXXS,
        minWidth: 0
    },
    Title:
    {
        color: tokens.colorNeutralForeground1
    }
});

/** {@inheritDoc Setting} */
export interface SettingProps
{
    /**
     * {@link SettingOption} rows revealed when the setting is expanded. Providing any
     * children turns this into an accordion with a trailing caret.
     */
    readonly children?: ReactNode;

    /** The control element for this setting, e.g. a {@link SettingToggle} or a dropdown. */
    readonly Control?: ReactNode;

    /** Gray out and disable the entire row, including its control and any children. */
    readonly Disabled?: boolean;

    /**
     * An identifier making this setting addressable through `UseSettingControls`, which can
     * scroll to it and pulse its background. Omit for settings that never need to be jumped to.
     */
    readonly Id?: string;

    readonly Icon: FluentIcon;
    readonly Subtitle?: ReactNode;
    readonly Title: ReactNode;
}

export/** A single, card-styled setting row, optionally expandable into an accordion. */
const Setting = (
    { children, Control, Disabled, Icon, Id, Subtitle, Title }: SettingProps
): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ IsOpen, SetIsOpen ] = useState<boolean>(false);
    const HasChildren = children !== undefined;
    const { NodeRef, PulseHandleRef } =
        UseSettingControlRegistration<HTMLDivElement>({ Icon, Id, Subtitle, Title });

    const RootStyle = mergeClasses(Styles.Root, Disabled === true ? Styles.RootDisabled : undefined);

    return (
        <PulseMotion
            RestingColor={ tokens.colorNeutralBackground1 }
            imperativeRef={ PulseHandleRef }>
            <div
                aria-disabled={ Disabled }
                className={ RootStyle }
                ref={ NodeRef }>
                <div className={ Styles.Header }>
                    <Icon className={ Styles.Icon } />

                    <div className={ Styles.TextGroup }>
                        <span className={ Styles.Title }>{ Title }</span>

                        { Subtitle !== undefined && (
                            <span className={ Styles.Subtitle }>{ Subtitle }</span>
                        ) }
                    </div>

                    { Control !== undefined && (
                        <div className={ Styles.Control }>
                            { Control }
                        </div>
                    ) }

                    { HasChildren && (
                        <button
                            aria-expanded={ IsOpen }
                            className={ Styles.Caret }
                            disabled={ Disabled }
                            onClick={ () => SetIsOpen((Value: boolean) => !Value) }
                            type="button">
                            <ChevronDownRegular
                                className={ mergeClasses(
                                    Styles.CaretIcon,
                                    IsOpen ? Styles.CaretIconOpen : undefined
                                ) } />
                        </button>
                    ) }
                </div>

                { HasChildren && IsOpen && (
                    <div className={ Styles.Children }>
                        { children }
                    </div>
                ) }
            </div>
        </PulseMotion>
    );
};
