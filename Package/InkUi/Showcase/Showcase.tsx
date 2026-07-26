/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Showcase
 *
 * @file      Showcase.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { FocusScope, useFocusManager, useRoutedInput } from "../Source/Interaction/index.js";
import { ComponentPage } from "./Documentation/Page.js";
import type { ComponentStory } from "./Story.js";
import { Navigation } from "./Navigation.js";
import { Stories } from "./Stories/index.js";
import { useTheme } from "../Source/Theme.js";

const NavigationFocusId = "showcase-navigation";
const NavigationScopeId = "showcase-navigation-pane";
const PageFocusId = "showcase-page";
const PageScopeId = "showcase-page-pane";

export const Showcase = (): React.ReactElement =>
{
    const Theme = useTheme();
    const Focus = useFocusManager();
    const { exit } = Ink.useApp();
    const { columns, rows } = Ink.useWindowSize();
    const TerminalColumns = Number.isFinite(columns) && columns > 0 ? columns : 80;
    const TerminalRows = Number.isFinite(rows) && rows > 0 ? rows : 24;
    const [ Collapsed, SetCollapsed ] = React.useState(false);
    const [ Search, SetSearch ] = React.useState("");
    const [ SearchActive, SetSearchActive ] = React.useState(false);
    const [ Selected, SetSelected ] = React.useState(0);
    const Filtered = React.useMemo(() => Stories.filter((Story: ComponentStory) =>
        Story.Name.toLowerCase().includes(Search.toLowerCase())
    ), [ Search ]);
    const [ Story, SetStory ] = React.useState<ComponentStory>(Stories[0]!);
    const PendingPageFocus = React.useRef(false);
    const Select = React.useCallback((Value: ComponentStory): void =>
    {
        SetStory(Value);
        SetSearchActive(false);
        PendingPageFocus.current = true;
    }, [ ]);

    React.useLayoutEffect(() =>
    {
        if (!PendingPageFocus.current)
        {
            return;
        }
        PendingPageFocus.current = false;
        if (!Focus.Focus(PageFocusId))
        {
            Focus.FocusFirst(PageScopeId);

        }
    }, [ Focus, Story ]);

    useRoutedInput((Input: string, Key: Ink.Key): boolean =>
    {
        if (Key.ctrl && Input === "b")
        {
            SetCollapsed((Value: boolean) => !Value);
            return true;
        }
        if (Input === "/" && !SearchActive)
        {
            if (Collapsed)
            {
                SetCollapsed(false);
            }
            Focus.Focus(NavigationFocusId);
            SetSearchActive(true);
            return true;
        }
        if (Key.escape && !SearchActive)
        {
            exit();
            return true;
        }
        return false;
    }, { Priority: 10 });

    React.useEffect(() =>
    {
        if (Selected >= Filtered.length)
        {
            SetSelected(Math.max(0, Filtered.length - 1));
        }
    }, [ Filtered.length, Selected ]);

    const SidebarWidth = Collapsed ? 4 : 30;
    const ContentWidth = Math.max(20, TerminalColumns - SidebarWidth);
    const BodyHeight = Math.max(4, TerminalRows - 1);
    const Pane: "navigation" | "content" = Focus.IsFocusWithin(PageScopeId)
        ? "content"
        : "navigation";
    return (
        <Ink.Box flexDirection="column"
            height={ TerminalRows }
            width={ TerminalColumns }>
            <Ink.Box flexGrow={ 1 }>
                <FocusScope Id={ NavigationScopeId }
                    RestoreFocus={ false }>
                    <Navigation
                        AutoFocus
                        Collapsed={ Collapsed }
                        Height={ BodyHeight }
                        Id={ NavigationFocusId }
                        Items={ Filtered }
                        OnCollapse={ () => SetCollapsed((Value: boolean) => !Value) }
                        OnExit={ exit }
                        OnSearchActiveChange={ SetSearchActive }
                        OnSearchChange={ SetSearch }
                        OnSelect={ Select }
                        OnSelectedChange={ SetSelected }
                        Order={ -1000 }
                        Search={ Search }
                        SearchActive={ SearchActive }
                        Selected={ Selected } />
                </FocusScope>
                <Ink.Box flexDirection="column"
                    height={ BodyHeight }
                    width={ ContentWidth }>
                    <FocusScope Id={ PageScopeId }
                        RestoreFocus={ false }>
                        <ComponentPage
                            AvailableWidth={ ContentWidth - 4 }
                            BasicExample={ Story.Basic }
                            Description={ Story.Description }
                            Examples={ Story.Examples }
                            Height={ BodyHeight }
                            Id={ PageFocusId }
                            Name={ Story.Name }
                            Order={ -500 }
                            Props={ Story.Props }
                            key={ Story.Name } />
                    </FocusScope>
                </Ink.Box>
            </Ink.Box>
            <Ink.Box
                borderColor={ Theme.Border }
                borderTop
                justifyContent="space-between">
                <Ink.Text color={ Theme.TextMuted }>
                    Tab switch pane · / search · Ctrl+B sidebar · Esc quit
                </Ink.Text>
                <Ink.Text color={ Pane === "navigation" ? Theme.Primary : Theme.Info }>
                    { Pane }
                </Ink.Text>
            </Ink.Box>
        </Ink.Box>
    );
};
