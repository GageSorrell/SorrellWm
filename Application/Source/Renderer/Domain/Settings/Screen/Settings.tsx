/* File:      Settings.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type ReactElement, useState } from "react";
import {
    Divider,
    type SelectTabData,
    type SelectTabEvent,
    Tab,
    TabList,
    tokens } from "@fluentui/react-components";
import {
    type FluentIcon,
    InfoFilled,
    InfoRegular,
    KeyboardFilled,
    KeyboardRegular,
    StarFilled,
    StarRegular,
    bundleIcon } from "@fluentui/react-icons";
import { About } from "./About";
import { Basic } from "./Basic";
import { Keyboard } from "./Keyboard";

export const Settings = (): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        height: "100%",
        justifyContent: "flex-start",
        width: "100vw"
    };

    const BasicSettingsIcon: FluentIcon = bundleIcon(StarFilled, StarRegular);
    const KeyboardIcon: FluentIcon = bundleIcon(KeyboardFilled, KeyboardRegular);
    const AboutIcon: FluentIcon = bundleIcon(InfoFilled, InfoRegular);

    const TabListStyle: CSSProperties =
    {
        background: "none",
        marginBottom: tokens.spacingVerticalM,
        marginTop: tokens.spacingVerticalM,
        minHeight: "100vh",
        rowGap: tokens.spacingVerticalS,
        width: 256
    };

    const [ SelectedValue, SetSelectedValue ] = useState<string>("Basic");

    const OnTabSelect = (_Event: SelectTabEvent, { value: Value }: SelectTabData): void =>
    {
        SetSelectedValue(Value as string);
    };

    return (
        <div style={ RootStyle }>
            <TabList
                defaultSelectedValue="Basic"
                onTabSelect={ OnTabSelect }
                selectedValue={ SelectedValue }
                size="large"
                style={ TabListStyle }
                vertical>
                <Tab
                    icon={ <BasicSettingsIcon /> }
                    value="Basic">
                    Basic
                </Tab>
                <Tab
                    icon={ <KeyboardIcon /> }
                    value="Keyboard">
                    Keyboard
                </Tab>
                <Tab
                    icon={ <AboutIcon /> }
                    style={ { bottom: 0, position: "absolute" } }
                    value="About">
                    About
                </Tab>
            </TabList>
            <Divider
                style={ { height: "100vh" } }
                vertical
            />
            { SelectedValue === "Basic" && <Basic /> }
            { SelectedValue === "Keyboard" && <Keyboard /> }
            { SelectedValue === "About" && <About /> }
        </div>
    );
};
