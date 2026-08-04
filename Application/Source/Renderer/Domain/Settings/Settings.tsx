/**
 * The renderer surface for the normal, persistent settings window.
 *
 * @module @sorrell/wm/Renderer/Settings
 *
 * @file      Settings.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { DecodeSettingsPath, type SettingsPath, SettingsSectionId } from "../../../Shared/SettingsPath.js";
import { MakeSettingControlId, ParseSettingControlId } from "./SettingControlId.js";
import { SettingControlsProvider, UseSettingControls } from "@sorrell/settings-ui";
import { Text, Title2, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Boolean } from "effect";
import { SettingsFloatingWindows } from "./SettingsFloatingWindows.js";
import { SettingsGeneral } from "./SettingsGeneral.js";
import { SettingsHome } from "./SettingsHome.js";
import { SettingsOverlay } from "./SettingsOverlay.js";
import { SettingsPerApp } from "./SettingsPerApp.js";
import { SettingsSidebar } from "./SettingsSidebar.js";
import { SettingsTitlebar } from "./SettingsTitlebar.js";

/** Below this content width, the sidebar collapses into a toggle-able overlay. */
const PinnedSidebarMinWidth = 720 as const;

const SectionLabel: Readonly<Record<SettingsSectionId, string>> =
    {
        [ SettingsSectionId.Advanced ]: "Advanced" as const,
        [ SettingsSectionId.FloatingWindows ]: "Floating Windows" as const,
        [ SettingsSectionId.General ]: "General" as const,
        [ SettingsSectionId.Home ]: "Home" as const,
        [ SettingsSectionId.Keybinds ]: "Keybinds" as const,
        [ SettingsSectionId.Overlay ]: "Overlay" as const,
        [ SettingsSectionId.PerAppSettings ]: "Per-App Settings" as const
    } as const;

const UseStyles = makeStyles({
    Body:
    {
        boxSizing: "border-box",
        display: "flex",
        flex: "1 1 auto",
        minHeight: 0,
        position: "relative",
        transform: "translateZ(0)"
    },
    Content:
    {
        boxSizing: "border-box",
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
        minWidth: 0,
        overflow: "auto",
        padding: "clamp(1.5rem, 5vw, 3rem)",
        userSelect: "none"
    },
    Description:
    {
        color: tokens.colorNeutralForeground2
    },
    Hidden:
    {
        display: "none"
    },
    SettingGroups:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalL
    },
    Shell:
    {
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden"
    }
});

const UseIsSidebarPinned = (): boolean =>
{
    const [ IsPinned, SetIsPinned ] = useState<boolean>(
        () => window.matchMedia(`(min-width: ${ PinnedSidebarMinWidth }px)`).matches
    );

    useEffect(() =>
    {
        const Query = window.matchMedia(`(min-width: ${ PinnedSidebarMinWidth }px)`);
        const OnChange = (Event: MediaQueryListEvent): void => SetIsPinned(Event.matches);

        SetIsPinned(Query.matches);
        Query.addEventListener("change", OnChange);

        return (): void => Query.removeEventListener("change", OnChange);
    }, [ ]);

    return IsPinned;
};

export/** Render the settings window's titlebar, navigation sidebar, and content area. */
const SettingsApplication = (): React.JSX.Element => (
    <SettingControlsProvider>
        <SettingsShell />
    </SettingControlsProvider>
);

/**
 * The actual settings window content, split out from {@link SettingsApplication} so it can
 * sit beneath the `SettingControlsProvider` and call `UseSettingControls`.
 */
const SettingsShell = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const IsSidebarPinned = UseIsSidebarPinned();
    const [ IsSidebarOpen, SetIsSidebarOpen ] = useState<boolean>(false);
    const [ Path, SetPath ] = useState<SettingsPath | null>(null);
    const [ BodyNode, SetBodyNode ] = useState<HTMLDivElement | null>(null);
    const [ PendingScrollId, SetPendingScrollId ] = useState<string | null>(null);
    const { Controls, ScrollToAndPulse } = UseSettingControls();

    useEffect(
        () => window.sorrell.settings.onNavigate((Value: string | null) =>
        {
            const NextPath = Value === null ? null : DecodeSettingsPath(Value);
            SetPath(NextPath);

            const Highlight = NextPath?.Params.Highlight;
            if (NextPath !== null && Highlight !== undefined)
            {
                SetPendingScrollId(MakeSettingControlId(
                    NextPath.Section,
                    Highlight
                ));
            }
        }),
        [ ]
    );

    useEffect(() =>
    {
        if (IsSidebarPinned)
        {
            SetIsSidebarOpen(false);
        }
    }, [ IsSidebarPinned ]);

    const SelectedSection = Path?.Section ?? SettingsSectionId.Home;
    const ApplicationName = Path?.Params.Name;
    const TargetExecutablePath = Path?.Params.Source === "Overlay"
        ? Path.Params.ExecutablePath
        : undefined;

    // Wait one frame for the just-selected section's "display: none" to lift and its layout
    // to settle, so `scrollIntoView` has real geometry to scroll to.
    useEffect(() =>
    {
        if (PendingScrollId === null)
        {
            return undefined;
        }

        const Parsed = ParseSettingControlId(PendingScrollId);

        if (Parsed === null || Parsed.Section !== SelectedSection)
        {
            return undefined;
        }

        if (!Object.hasOwn(Controls, PendingScrollId))
        {
            return undefined;
        }

        const Frame = requestAnimationFrame(() =>
        {
            ScrollToAndPulse(PendingScrollId);
            SetPendingScrollId(null);
        });

        return (): void => cancelAnimationFrame(Frame);
    }, [ Controls, PendingScrollId, SelectedSection, ScrollToAndPulse ]);

    const OnToggleSidebar = () => SetIsSidebarOpen(Boolean.not);

    const OnSelectSearchResult = (Id: string): void =>
    {
        const Parsed = ParseSettingControlId(Id);

        if (Parsed === null)
        {
            return;
        }

        SetIsSidebarOpen(false);
        SetPath({ Params: { }, Section: Parsed.Section });
        SetPendingScrollId(Id);
    };

    return (
        <div className={ Styles.Shell }>
            <SettingsTitlebar
                Controls={ Controls }
                IsSidebarOpen={ IsSidebarOpen }
                IsSidebarPinned={ IsSidebarPinned }
                OnSelectResult={ OnSelectSearchResult }
                OnToggleSidebar={ OnToggleSidebar } />
            <div
                className={ Styles.Body }
                ref={ SetBodyNode }>
                <SettingsSidebar
                    MountNode={ BodyNode ?? undefined }
                    OnOpenChange={ SetIsSidebarOpen }
                    OnSelectSection={ (Section: SettingsSectionId) =>
                    {
                        SetIsSidebarOpen(false);
                        SetPath({ Params: { }, Section });
                    } }
                    Open={ IsSidebarPinned || IsSidebarOpen }
                    SelectedSection={ SelectedSection }
                    Type={ IsSidebarPinned ? "inline" : "overlay" } />

                <main className={ Styles.Content }>
                    <Title2>{ SectionLabel[SelectedSection] }</Title2>

                    { ApplicationName !== undefined && (
                        <Text className={ Styles.Description }>
                            Configure how SorrellWm manages { ApplicationName }
                        </Text>
                    ) }

                    { /*
                        General, Overlay, and Floating Windows stay mounted (just hidden) rather
                        than swapping in and out, so their Setting/SettingGroup Ids stay
                        registered for search no matter which section is on screen. Per-App
                        Settings is left conditionally mounted: it has no addressable Ids
                        (SettingOption/SettingToggle rows aren't registrable), so there's nothing
                        for search to lose by unmounting it.
                    */ }
                    <div
                        className={ mergeClasses(
                            Styles.SettingGroups,
                            SelectedSection === SettingsSectionId.General
                                ? undefined
                                : Styles.Hidden
                        ) }>
                        <SettingsGeneral />
                    </div>

                    <div
                        className={ mergeClasses(
                            Styles.SettingGroups,
                            SelectedSection === SettingsSectionId.Overlay
                                ? undefined
                                : Styles.Hidden
                        ) }>
                        <SettingsOverlay />
                    </div>

                    <div
                        className={ mergeClasses(
                            Styles.SettingGroups,
                            SelectedSection === SettingsSectionId.FloatingWindows
                                ? undefined
                                : Styles.Hidden
                        ) }>
                        <SettingsFloatingWindows />
                    </div>

                    { SelectedSection === SettingsSectionId.PerAppSettings && (
                        <SettingsPerApp
                            TargetApplicationName={ ApplicationName }
                            TargetExecutablePath={ TargetExecutablePath } />
                    ) }

                    { SelectedSection === SettingsSectionId.Home && (
                        <SettingsHome />
                    ) }
                </main>
            </div>
        </div>
    );
};
