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

import * as React from "react";
import {
    AppsColor,
    ArrowSquareColor,
    ChatRegular,
    ContentViewColor,
    type FluentIcon,
    GiftOpenRegular,
    HomeRegular,
    ListBarColor,
    MegaphoneRegular,
    SettingsRegular,
    WindowAppsRegular,
    WrenchColor
} from "@fluentui/react-icons";
import { IsSettingsSectionId, SettingsSectionId } from "../../../Shared/SettingsPath.js";
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

const TopLevelTop: ReadonlyArray<NavLeafDefinition> =
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

const TopLevelHead: ReadonlyArray<NavLeafDefinition> =
    [
        {
            Icon: AppsColor,
            Label: "Per-App Settings",
            Section: SettingsSectionId.PerAppSettings
        },
        {
            Icon: ListBarColor,
            Label: "Overlay",
            Section: SettingsSectionId.Overlay
        }
    ] as const;

const TopLevelTail: ReadonlyArray<NavLeafDefinition> =
    [
        {
            Icon: WrenchColor,
            Label: "Advanced",
            Section: SettingsSectionId.Advanced
        }
    ] as const;

const WindowingLeaves: ReadonlyArray<NavLeafDefinition> =
    [
        {
            Icon: ArrowSquareColor,
            Label: "Keybinds",
            Section: SettingsSectionId.Keybinds
        },
        {
            Icon: WindowAppsRegular,
            Label: "Floating Windows",
            Section: SettingsSectionId.FloatingWindows
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
    },
    NavSubItemSelected:
    {
        "::before":
        {
            backgroundColor: tokens.colorCompoundBrandForeground1,
            borderRadius: tokens.borderRadiusCircular,
            content: "\"\"",
            height: "20px",
            insetInlineStart: "0",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "4px"
        },

        ":hover":
        {
            backgroundColor: tokens.colorNeutralBackground2Hover
        },

        backgroundColor: tokens.colorNeutralBackground1Selected
    }
});

interface NavigationItemsProps
{
    readonly SelectedSection: SettingsSectionId;
}

const NavIcon = (Icon: FluentIcon): React.JSX.Element =>
{
    // Fluent UI's NavItem only treats the click as a selection when
    // `event.target` is an HTMLElement (see `useNavItem_unstable`'s
    // `isHTMLElement(event.target)` guard). The icon renders as an inline
    // SVG, whose elements are SVGElements rather than HTMLElements, so a
    // click landing directly on the icon's SVG/path silently fails that
    // guard and the item never gets selected. Disabling pointer events on
    // the icon lets the click pass through to its enclosing (HTMLElement)
    // wrapper instead, so clicking the icon selects the nav item like
    // clicking anywhere else on the button does.
    return (
        <Icon
            fontSize="1.2rem"
            style={ { pointerEvents: "none" } } />
    );
};

const NavigationItems = ({ SelectedSection }: NavigationItemsProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    const NavItemStyleBase = mergeClasses(Styles.Base, Styles.NavItem);
    const NavItemStyleSelected = mergeClasses(NavItemStyleBase, Styles.NavItemSelected);
    const NavSubItemStyleBase = mergeClasses(NavItemStyleBase, Styles.NavSubItemBase);
    const NavSubItemStyleSelected = mergeClasses(NavSubItemStyleBase, Styles.NavSubItemSelected);

    return (
        <>
            { TopLevelTop.map(({ Icon, Label, Section }: NavLeafDefinition) =>
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
            {
                TopLevelHead.map(({ Icon, Label, Section }: NavLeafDefinition) =>
                {
                    const NavItemStyle = Section === SelectedSection
                        ? NavItemStyleSelected
                        : NavItemStyleBase;

                    return (
                        <NavItem
                            className={ NavItemStyle }
                            icon={ NavIcon(Icon) }
                            key={ Section }
                            value={ Section }>
                            { Label }
                        </NavItem>
                    );
                })
            }

            <NavCategory value={ WindowingCategoryValue }>
                <NavCategoryItem
                    className={ NavItemStyleBase }
                    icon={ NavIcon(ContentViewColor) }>
                    Windowing &amp; Layouts
                </NavCategoryItem>

                <NavSubItemGroup>
                    { WindowingLeaves.map(({ Icon, Label, Section }: NavLeafDefinition) => (
                        <NavSubItem
                            className={ Section === SelectedSection
                                ? NavSubItemStyleSelected
                                : NavSubItemStyleBase }
                            key={ Section }
                            value={ Section }>
                            { NavIcon(Icon) }
                            { Label }
                        </NavSubItem>
                    )) }
                </NavSubItemGroup>
            </NavCategory>

            {
                TopLevelTail.map(({ Icon, Label, Section }: NavLeafDefinition) =>
                {
                    const NavItemStyle = Section === SelectedSection
                        ? NavItemStyleSelected
                        : NavItemStyleBase;

                    return (
                        <NavItem
                            className={ NavItemStyle }
                            icon={ NavIcon(Icon) }
                            key={ Section }
                            value={ Section }>
                            { Label }
                        </NavItem>
                    );
                })
            }
        </>
    );
};

const FooterLeaves: ReadonlyArray<NavLeafDefinition> =
    [
        {
            Icon: GiftOpenRegular,
            Label: "Welcome to SorrellWm",
            Section: SettingsSectionId.Welcome
        },
        {
            Icon: MegaphoneRegular,
            Label: "What's new",
            Section: SettingsSectionId.WhatsNew
        },
        {
            Icon: ChatRegular,
            Label: "Give feedback",
            Section: SettingsSectionId.GiveFeedback
        }
    ] as const;

const NavigationFooter = ({ SelectedSection }: NavigationItemsProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    const NavDrawerStyle = mergeClasses(Styles.Base, Styles.NavDrawerBase, Styles.NavDrawerFooterBase);
    const NavItemStyleBase = mergeClasses(Styles.Base, Styles.NavItem);
    const NavItemStyleSelected = mergeClasses(NavItemStyleBase, Styles.NavItemSelected);

    return (
        <NavDrawerFooter className={ NavDrawerStyle }>
            { FooterLeaves.map(({ Icon, Label, Section }: NavLeafDefinition) =>
            {
                const NavItemStyle = Section === SelectedSection
                    ? NavItemStyleSelected
                    : NavItemStyleBase;

                return (
                    <NavItem
                        className={ NavItemStyle }
                        icon={ NavIcon(Icon) }
                        key={ Section }
                        value={ Section }>
                        { Label }
                    </NavItem>
                );
            }) }
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

/** {@inheritDoc SettingsSidebar} */
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
    const NavigationBody = React.useMemo(
        () => <NavigationItems SelectedSection={ SelectedSection } />,
        [ SelectedSection ]
    );

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
                    { NavigationBody }
                </NavDrawerBody>

                <NavigationFooter SelectedSection={ SelectedSection } />
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
                { NavigationBody }
            </NavDrawerBody>

            <NavigationFooter SelectedSection={ SelectedSection } />
        </NavDrawer>
    );
};
