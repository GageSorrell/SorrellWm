/* File:      Settings.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type FC, type ReactElement, type ReactNode, useState } from "react";
import {
    Caption1,
    type SelectTabData,
    type SelectTabEvent,
    Tab,
    TabList,
    tokens } from "@fluentui/react-components";
import {
    type FluentIcon,
    type FluentIconsProps,
    InfoFilled,
    InfoRegular,
    KeyboardFilled,
    KeyboardRegular,
    StarFilled,
    StarRegular,
    bundleIcon } from "@fluentui/react-icons";
import { About } from "./About";
import type { FLogger } from "../../../../Shared/Log.Types";
import { General } from "./General/General";
import { GetFlexStyle } from "@/Utility";
import { GetLogger } from "@/Log";
import { Keyboard } from "./Keyboard";
import { Tokens } from "../../../../Shared/Tokens";
import { VerticalDivider } from "@/Utility/Component";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Settings");

const Titlebar = (): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        gap: 12,
        height: Tokens.TitlebarHeight,
        minHeight: Tokens.TitlebarHeight,
        minWidth: "100%",
        paddingLeft: 32,
        width: "100%"
    };

    return (
        <div
            className="Titlebar"
            style={ RootStyle }>
            <div style={ { paddingBottom: 4 } }>
                <p style={ { fontSize: "1.25rem" } }>◱</p>
            </div>
            <Caption1>
                SorrellWm Settings
            </Caption1>
        </div>
    );
};

export const Settings = (): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "center"),
        minHeight: "100vh",
        overflow: "hidden",
        width: "100vw"
    };

    const BodyStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "stretch"),
        flex: 1,
        gap: 16,
        height: "100%",
        minHeight: "100%",
        paddingBottom: 16,
        width: "100%"
    };

    const GetBundledIcon = (
        Value: FPanel,
        FilledIcon: FluentIcon,
        RegularIcon: FluentIcon
    ): FC<FluentIconsProps> =>
    {
        const BundledIcon: FluentIcon = bundleIcon(FilledIcon, RegularIcon);
        return (Props: FluentIconsProps): ReactNode =>
        {
            const color: string | undefined = SelectedValue === Value
                ? tokens.colorBrandForeground1
                : undefined;

            return <BundledIcon { ...{ ...Props, color } }/>;
        };
    };

    const GeneralSettingsIcon: FluentIcon = GetBundledIcon("General", StarFilled, StarRegular);
    const KeyboardIcon: FluentIcon = GetBundledIcon("Keyboard", KeyboardFilled, KeyboardRegular);
    const AboutIcon: FluentIcon = GetBundledIcon("About", InfoFilled, InfoRegular);

    const TabListStyle: CSSProperties =
    {
        background: "none",
        marginBottom: tokens.spacingVerticalM,
        // marginTop: tokens.spacingVerticalM,
        padding: 4,
        paddingTop: 0,
        rowGap: tokens.spacingVerticalS,
        width: 192
    };

    const TabListContainerStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "center"),
        background: "none",
        height: "100%",
        marginBottom: tokens.spacingVerticalM,
        // marginTop: tokens.spacingVerticalM,
        minHeight: "100%",
        padding: 4,
        paddingTop: 0,
        rowGap: tokens.spacingVerticalS,
        width: 192
    };

    type FPanel =
        | "General"
        | "Keyboard"
        | "About";

    const [ SelectedValue, SetSelectedValue ] = useState<FPanel>("General");

    const OnTabSelect = (_Event: SelectTabEvent, { value: Value }: SelectTabData): void =>
    {
        SetSelectedValue(Value as FPanel);
    };

    const AboutTabListStyle: CSSProperties =
    {
        ...TabListStyle,
        bottom: 0,
        position: "absolute"
    };

    return (
        <div style={ RootStyle }>
            <Titlebar />
            <div style={ BodyStyle }>
                <div style={ TabListContainerStyle }>
                    <TabList
                        defaultSelectedValue="General"
                        onTabSelect={ OnTabSelect }
                        selectedValue={ SelectedValue }
                        size="medium"
                        style={ TabListStyle }
                        vertical>
                        <Tab
                            icon={ <GeneralSettingsIcon /> }
                            value="General">
                            General
                        </Tab>
                        <Tab
                            icon={ <KeyboardIcon /> }
                            value="Keyboard">
                            Keyboard
                        </Tab>
                    </TabList>
                    <TabList
                        onTabSelect={ OnTabSelect }
                        selectedValue={ SelectedValue }
                        size="medium"
                        style={ AboutTabListStyle }
                        vertical>
                        <Tab
                            icon={ <AboutIcon /> }
                            value="About">
                            About
                        </Tab>
                    </TabList>
                </div>
                <VerticalDivider />
                <div style={ { flex: 1, maxHeight: "100%", width: "100%" } }>
                    { SelectedValue === "General" && <General /> }
                    { SelectedValue === "Keyboard" && <Keyboard /> }
                    { SelectedValue === "About" && <About /> }
                </div>
            </div>
        </div>
    );
};
