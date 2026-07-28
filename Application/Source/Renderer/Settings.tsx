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

import { DecodeSettingsPath, type SettingsPath, SettingsSectionId } from "../Shared/SettingsPath.js";
import { Text, Title2, makeStyles, tokens } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Boolean } from "effect";
import { SettingsSidebar } from "./SettingsSidebar.js";
import { SettingsTitlebar } from "./SettingsTitlebar.js";

/** Below this content width, the sidebar collapses into a toggle-able overlay. */
const PinnedSidebarMinWidth = 720;

const SectionLabel: Readonly<Record<SettingsSectionId, string>> =
    {
        [ SettingsSectionId.Advanced ]: "Advanced" as const,
        [ SettingsSectionId.General ]: "General" as const,
        [ SettingsSectionId.Home ]: "Home" as const,
        [ SettingsSectionId.Keybinds ]: "Keybinds" as const,
        [ SettingsSectionId.PerAppSettings ]: "Per-App Settings"
    } as const;

const UseStyles = makeStyles({
    Body: {
        boxSizing: "border-box",
        display: "flex",
        flex: "1 1 auto",
        minHeight: 0,
        position: "relative",
        transform: "translateZ(0)"
    },
    Content: {
        boxSizing: "border-box",
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
        minWidth: 0,
        overflow: "auto",
        padding: "clamp(1.5rem, 5vw, 3rem)"
    },
    Description: {
        color: tokens.colorNeutralForeground2
    },
    Shell: {
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
const SettingsApplication = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const IsSidebarPinned = UseIsSidebarPinned();
    const [ IsSidebarOpen, SetIsSidebarOpen ] = useState<boolean>(false);
    const [ Path, SetPath ] = useState<SettingsPath | null>(null);
    const [ BodyNode, SetBodyNode ] = useState<HTMLDivElement | null>(null);

    useEffect(
        () => window.sorrell.settings.onNavigate((Value: string | null) =>
        {
            SetPath(Value === null ? null : DecodeSettingsPath(Value));
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

    const OnToggleSidebar = () => SetIsSidebarOpen(Boolean.not);

    return (
        <div className={ Styles.Shell }>
            <SettingsTitlebar { ...{ IsSidebarOpen, IsSidebarPinned, OnToggleSidebar } } />
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
                </main>
            </div>
        </div>
    );
};
