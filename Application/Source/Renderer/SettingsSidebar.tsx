/**
 * The settings window's navigation sidebar, pinned alongside the content on wide windows
 * and toggle-able as an overlay panel otherwise.
 *
 * @module @sorrell/wm/Renderer/SettingsSidebar
 *
 * @file      SettingsSidebar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import {
    AppsColor,
    ArrowSquareColor,
    ChatRegular,
    ContentViewColor,
    type FluentIcon,
    GiftOpenRegular,
    HomeRegular,
    MegaphoneRegular,
    SettingsRegular,
    WrenchColor
} from "@fluentui/react-icons";
import { IsSettingsSectionId, SettingsSectionId } from "../Shared/SettingsPath.js";
import {
    NavCategory,
    NavCategoryItem,
    NavDivider,
    NavDrawer,
    NavDrawerBody,
    NavDrawerFooter,
    NavItem,
    NavSubItem,
    NavSubItemGroup,
    createMotionComponent,
    makeStyles,
    mergeClasses,
    motionTokens,
    tokens
} from "@fluentui/react-components";

const WindowingCategoryValue = "WindowingLayouts";

const Spin = createMotionComponent({
    duration: motionTokens.durationSlower,
    easing: motionTokens.curveEasyEase,
    keyframes: [
        { transform: "rotate(0deg)" },
        { transform: "rotate(360deg)" }
    ]
});

interface NavLeafDefinition
{
    readonly Icon: FluentIcon;
    readonly Label: string;
    readonly Section: SettingsSectionId;
}

const TopLevelLeaves: ReadonlyArray<NavLeafDefinition> =
    [
        {
            Icon: HomeRegular,
            Label: "Home",
            Section: SettingsSectionId.Home
        },
        {
            Icon: SettingsRegular,
            Label: "General",
            Section: SettingsSectionId.General
        }
    ] as const;

const WindowingLeaves: ReadonlyArray<NavLeafDefinition> =
    [
        {
            Icon: AppsColor,
            Label: "Per-App Settings",
            Section: SettingsSectionId.PerAppSettings
        },
        {
            Icon: ArrowSquareColor,
            Label: "Keybinds",
            Section: SettingsSectionId.Keybinds
        }
    ] as const;

const UseStyles = makeStyles({
    Base:
    {
        background: "none",
        userSelect: "none"
    },
    Branding:
    {
        alignItems: "center",
        display: "flex",
        gap: tokens.spacingHorizontalXS
    },
    NavDrawerBase:
    {
        minWidth: "20rem"
    },
    NavDrawerFooterBase:
    {
        padding: "0.25rem"
    },
    NavItem:
    {
        ":active":
        {
            backgroundColor: tokens.colorNeutralBackground1Pressed
        },

        ":hover":
        {
            backgroundColor: tokens.colorNeutralBackground3Hover
        },

        color: tokens.colorNeutralForeground1,
        fontWeight: "normal",
        gap: "0.75rem",
        padding: "8px"
    },
    NavItemSelected:
    {
        ":hover":
        {
            backgroundColor: tokens.colorNeutralBackground2Hover
        },

        backgroundColor: tokens.colorNeutralBackground1Selected
    },
    NavSubItemBase:
    {
        gap: "1rem",
        paddingLeft: "2.5rem"
    }
});

interface NavigationItemsProps
{
    readonly SelectedSection: SettingsSectionId;
}

const NavIcon = (Icon: FluentIcon): React.JSX.Element =>
{
    return <Icon fontSize="1.2rem" />;
};

const NavigationItems = ({ SelectedSection }: NavigationItemsProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    const NavItemStyleBase = mergeClasses(Styles.Base, Styles.NavItem);
    const NavItemStyleSelected = mergeClasses(NavItemStyleBase, Styles.NavItemSelected);
    const NavSubItemStyle = mergeClasses(NavItemStyleBase, Styles.NavSubItemBase);

    return (
        <>
            { TopLevelLeaves.map(({ Icon, Label, Section }: NavLeafDefinition) =>
            {
                const IconElement = NavIcon(Icon);
                const IsSpinning = Section === SettingsSectionId.General
                    && Section === SelectedSection;

                const NavItemStyle = Section === SelectedSection
                    ? NavItemStyleSelected
                    : NavItemStyleBase;

                return (
                    <NavItem
                        className={ NavItemStyle }
                        icon={ IsSpinning ? <Spin>{ IconElement }</Spin> : IconElement }
                        key={ Section }
                        value={ Section }>
                        { Label }
                    </NavItem>
                );
            }) }

            <NavDivider />
            <NavCategory value={ WindowingCategoryValue }>
                <NavCategoryItem
                    className={ NavItemStyleBase }
                    icon={ NavIcon(ContentViewColor) }>
                    Windowing &amp; Layouts
                </NavCategoryItem>

                <NavSubItemGroup>
                    { WindowingLeaves.map(({ Icon, Label, Section }: NavLeafDefinition) => (
                        <NavSubItem
                            className={ NavSubItemStyle }
                            key={ Section }
                            value={ Section }>
                            { NavIcon(Icon) }
                            { Label }
                        </NavSubItem>
                    )) }
                </NavSubItemGroup>
            </NavCategory>

            <NavItem
                className={ SelectedSection === "Advanced" ? NavItemStyleSelected : NavItemStyleBase }
                icon={ NavIcon(WrenchColor) }
                value={ SettingsSectionId.Advanced }>
                Advanced
            </NavItem>
        </>
    );
};

const NavigationFooter = (): React.JSX.Element =>
{
    const Styles = UseStyles();

    const NavDrawerStyle = mergeClasses(Styles.Base, Styles.NavDrawerBase, Styles.NavDrawerFooterBase);

    // @TODO Make these NavItems selectable, then use the nav item styles
    // based on the current selection, like with the other sidebar nav items.
    // const NavItemStyleBase = mergeClasses(Styles.Base, Styles.NavItem);
    // const NavItemStyleSelected = mergeClasses(NavItemStyleBase, Styles.NavItemSelected);

    return (
        <NavDrawerFooter className={ NavDrawerStyle }>
            <NavItem
                icon={ NavIcon(GiftOpenRegular) }
                value="__Welcome">
                Welcome to SorrellWm
            </NavItem>
            <NavItem
                className={ Styles.Base }
                icon={ NavIcon(MegaphoneRegular) }
                value="__WhatsNew">
                What&apos;s new
            </NavItem>
            <NavItem
                className={ Styles.Base }
                icon={ NavIcon(ChatRegular) }
                value="__GiveFeedback">
                Give feedback
            </NavItem>
        </NavDrawerFooter>
    );
};

const HandleNavItemSelect = (
    OnSelectSection: (Section: SettingsSectionId) => void
) => (_Event: unknown, Data: { value: string; }): void =>
{
    if (IsSettingsSectionId(Data.value))
    {
        OnSelectSection(Data.value);
    }
};

/** Props for {@link SettingsSidebar}. */
export interface SettingsSidebarProps
{
    readonly MountNode?: HTMLElement | undefined;
    readonly OnOpenChange: (Open: boolean) => void;
    readonly OnSelectSection: (Section: SettingsSectionId) => void;
    readonly Open: boolean;
    readonly SelectedSection: SettingsSectionId;
    readonly Type: "inline" | "overlay";
}

export/** Render the settings window's navigation sidebar. */
const SettingsSidebar = (
    { MountNode, OnOpenChange, OnSelectSection, Open, SelectedSection, Type }: SettingsSidebarProps
): React.JSX.Element =>
{
    const Styles = UseStyles();

    const NavDrawerStyle = mergeClasses(Styles.Base, Styles.NavDrawerBase);

    if (Type === "overlay")
    {
        return (
            <NavDrawer
                className={ NavDrawerStyle }
                mountNode={ MountNode }
                onNavItemSelect={ HandleNavItemSelect(OnSelectSection) }
                onOpenChange={ (_Event: unknown, Data: { open: boolean; }) => OnOpenChange(Data.open) }
                open={ Open }
                position="start"
                selectedValue={ SelectedSection }
                type="overlay">
                <NavDrawerBody>
                    <NavigationItems SelectedSection={ SelectedSection } />
                </NavDrawerBody>

                <NavigationFooter />
            </NavDrawer>
        );
    }

    return (
        <NavDrawer
            className={ NavDrawerStyle }
            onNavItemSelect={ HandleNavItemSelect(OnSelectSection) }
            open={ Open }
            position="start"
            selectedValue={ SelectedSection }
            type="inline">
            <NavDrawerBody>
                <NavigationItems SelectedSection={ SelectedSection } />
            </NavDrawerBody>

            <NavigationFooter />
        </NavDrawer>
    );
};
