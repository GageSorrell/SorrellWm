/**
 * The settings window's custom titlebar: branding/navigation toggle, a centered search
 * box, and space reserved for the native window-control overlay.
 *
 * @module @sorrell/wm/Renderer/SettingsTitlebar
 *
 * @file      SettingsTitlebar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { DragRegion, NoDragRegion } from "./AppRegion.js";
import { Hamburger, SearchBox, Text, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { BoardColor } from "@fluentui/react-icons";
import { SettingsTitlebarHeight } from "../Shared/SettingsWindow.js";

/** The native window-control overlay's approximate reserved width, in pixels. */
const OverlayReservedWidth = 140;

const UseStyles = makeStyles({
    BrandTitleBase:
    {
        fontSize: tokens.fontSizeBase200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    BrandTitleBlurred:
    {
        color: tokens.colorNeutralForegroundDisabled
    },
    BrandTitleFocused:
    {
        color: tokens.colorNeutralForeground1
    },
    Branding:
    {
        alignItems: "center",
        display: "flex",
        gap: tokens.spacingHorizontalM,
        minWidth: 0,
        overflow: "hidden"
    },
    Center:
    {
        display: "flex",
        flex: "0 1 480px",
        justifyContent: "center",
        ...NoDragRegion
    },
    Hamburger:
    {
        flexShrink: 0,
        ...NoDragRegion
    },
    HamburgerActive:
    {
        backgroundColor: tokens.colorNeutralBackground1Selected
    },
    Left:
    {
        alignItems: "center",
        display: "flex",
        flex: "1 1 0",
        gap: tokens.spacingHorizontalS,
        minWidth: 0
    },
    Right:
    {
        flex: "1 1 0",
        minWidth: `${ OverlayReservedWidth }px`
    },
    Root:
    {
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        height: `${ SettingsTitlebarHeight }px`,
        paddingInlineStart: tokens.spacingHorizontalL,
        paddingTop: tokens.spacingVerticalS,
        width: "100%",
        ...DragRegion
    },
    SearchBox:
    {
        maxWidth: "100%",
        width: "100%"
    }
});

/** Props for {@link SettingsTitlebar}. */
export interface SettingsTitlebarProps
{
    readonly IsSidebarOpen: boolean;
    readonly IsSidebarPinned: boolean;
    readonly OnToggleSidebar: () => void;
}

export/** Render the settings window's custom titlebar. */
const SettingsTitlebar = (Props: SettingsTitlebarProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    const {
        IsSidebarOpen,
        IsSidebarPinned,
        OnToggleSidebar
    }: SettingsTitlebarProps = Props;

    const [ IsWindowFocused, SetIsWindowFocused ] = React.useState<boolean>(true);
    React.useEffect(() =>
    {
        const SetFocused = () => SetIsWindowFocused(true);
        const SetBlurred = () => SetIsWindowFocused(false);
        window.addEventListener("focus", SetFocused);
        window.addEventListener("blur", SetBlurred);

        return () =>
        {
            window.removeEventListener("focus", SetFocused);
            window.removeEventListener("blur", SetBlurred);
        };
    }, [ ]);

    const BrandTitleStyle = IsWindowFocused
        ? mergeClasses(Styles.BrandTitleBase, Styles.BrandTitleFocused)
        : mergeClasses(Styles.BrandTitleBase, Styles.BrandTitleBlurred);

    return (
        <header className={ Styles.Root }>
            <div className={ Styles.Left }>
                { !IsSidebarPinned && (
                    <Hamburger
                        aria-label={ IsSidebarOpen ? "Close navigation" : "Open navigation" }
                        className={ mergeClasses(
                            Styles.Hamburger,
                            IsSidebarOpen ? Styles.HamburgerActive : undefined
                        ) }
                        onClick={ OnToggleSidebar } />
                ) }

                <div className={ Styles.Branding }>
                    <BoardColor fontSize={ 20 } />

                    { IsSidebarPinned && (
                        <Text className={ BrandTitleStyle }>
                            SorrellWm Settings
                        </Text>
                    ) }
                </div>
            </div>

            <div className={ Styles.Center }>
                <SearchBox
                    className={ Styles.SearchBox }
                    placeholder="Search for settings" />
            </div>
            <div className={ Styles.Right } />
        </header>
    );
};
