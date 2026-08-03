/**
 * The settings window's custom titlebar: branding/navigation toggle, a centered fuzzy-search
 * combobox over every registered setting, and space reserved for the native window-control
 * overlay.
 *
 * @module @sorrell/wm/Renderer/SettingsTitlebar
 *
 * @file      SettingsTitlebar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import {
    Combobox,
    Hamburger,
    Option,
    type OptionOnSelectData,
    type SelectionEvents,
    Text,
    makeStyles,
    mergeClasses,
    tokens
} from "@fluentui/react-components";
import { DragRegion, NoDragRegion } from "./AppRegion.js";
import { SearchSettingControls, type SettingSearchResult } from "./SettingsSearch.js";
import { BoardColor } from "@fluentui/react-icons";
import type { SettingControlEntry } from "@sorrell/settings-ui";
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
    OptionIcon:
    {
        color: tokens.colorNeutralForeground2,
        flexShrink: 0,
        fontSize: "1.25rem"
    },
    OptionRow:
    {
        alignItems: "center",
        display: "flex",
        gap: tokens.spacingHorizontalM
    },
    OptionSubtitle:
    {
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200
    },
    OptionText:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXXS,
        minWidth: 0
    },
    OptionTitle:
    {
        color: tokens.colorNeutralForeground1
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
    /** Every registered `Setting`/`SettingGroup`, from `UseSettingControls`, to search over. */
    readonly Controls: Readonly<Record<string, SettingControlEntry>>;

    readonly IsSidebarOpen: boolean;
    readonly IsSidebarPinned: boolean;

    /** Called with a search result's `Id` when it's selected from the dropdown. */
    readonly OnSelectResult: (Id: string) => void;

    readonly OnToggleSidebar: () => void;
}

export/** Render the settings window's custom titlebar. */
const SettingsTitlebar = (Props: SettingsTitlebarProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    const {
        Controls,
        IsSidebarOpen,
        IsSidebarPinned,
        OnSelectResult,
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

    const [ Query, SetQuery ] = React.useState<string>("");
    const [ IsSearchFocused, SetIsSearchFocused ] = React.useState<boolean>(false);
    const Results = React.useMemo(
        () => SearchSettingControls(Query, Controls),
        [ Query, Controls ]
    );
    const IsDropdownOpen = IsSearchFocused && Query.trim().length > 0 && Results.length > 0;

    const OnSelectOption = (_Event: SelectionEvents, Data: OptionOnSelectData): void =>
    {
        if (Data.optionValue === undefined)
        {
            return;
        }

        OnSelectResult(Data.optionValue);
        SetQuery("");
        SetIsSearchFocused(false);
    };

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
                <Combobox
                    className={ Styles.SearchBox }
                    freeform
                    onBlur={ () => SetIsSearchFocused(false) }
                    onChange={ (Event: React.ChangeEvent<HTMLInputElement>) =>
                    {
                        SetQuery(Event.target.value);
                        SetIsSearchFocused(true);
                    } }
                    onFocus={ () => SetIsSearchFocused(true) }
                    onOptionSelect={ OnSelectOption }
                    open={ IsDropdownOpen }
                    placeholder="Search for settings"
                    value={ Query }>
                    { Results.map(({ Entry, Id }: SettingSearchResult) => (
                        <Option
                            checkIcon={ null }
                            key={ Id }
                            text={ typeof Entry.Title === "string" ? Entry.Title : Id }
                            value={ Id }>
                            <div className={ Styles.OptionRow }>
                                { Entry.Icon !== undefined && <Entry.Icon className={ Styles.OptionIcon } /> }

                                <div className={ Styles.OptionText }>
                                    <span className={ Styles.OptionTitle }>{ Entry.Title }</span>

                                    { Entry.Subtitle !== undefined && (
                                        <span className={ Styles.OptionSubtitle }>{ Entry.Subtitle }</span>
                                    ) }
                                </div>
                            </div>
                        </Option>
                    )) }
                </Combobox>
            </div>
            <div className={ Styles.Right } />
        </header>
    );
};
