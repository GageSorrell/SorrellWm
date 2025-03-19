/* File:      Settings.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { useState, type CSSProperties, type ReactElement } from "react";
import {
    type FluentIcon,
    InfoFilled,
    InfoRegular,
    KeyboardFilled,
    KeyboardRegular,
    StarFilled,
    StarRegular,
    bundleIcon } from "@fluentui/react-icons";
import { Divider, Tab, TabList, tokens, type SelectTabData, type SelectTabEvent } from "@fluentui/react-components";
import { Basic } from "./Basic";
import { Keyboard } from "./Keyboard";
import { About } from "./About";

export const Settings = (): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        backgroundColor: "white",
        flexDirection: "row",
        flexWrap: "nowrap",
        height: "100%",
        justifyContent: "flex-start",
        width: "100vw"
    };

    const BasicSettingsIcon: FluentIcon = bundleIcon(StarFilled, StarRegular);
    const KeyboardIcon: FluentIcon = bundleIcon(KeyboardFilled, KeyboardRegular);
    const AboutIcon: FluentIcon = bundleIcon(InfoFilled, InfoRegular);

    const TabStyle: CSSProperties =
    {
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
                style={ TabStyle }
                vertical>
                <Tab
                    icon={ <BasicSettingsIcon /> }
                    value="Basic">
                    Basic
                </Tab>
                <Tab
                    icon={ <KeyboardIcon /> }
                    value="tab2">
                    Keyboard
                </Tab>
                <Tab
                    icon={ <AboutIcon /> }
                    style={{ position: "absolute", bottom: 0 }}
                    value="tab3">
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
