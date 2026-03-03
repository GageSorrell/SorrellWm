/* File:      Tile.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Caption1, Title1 } from "@fluentui/react-components";
import { CommandContainer, type FCommand, GetPanelKey, Panel } from "$/Common";
import type { FAnnotatedPanel, FAnnotatedPanelScreenshot } from "#/Tree/Tree.Types";
import { type ReactElement, type ReactNode, useCallback, useMemo } from "react";
import { SendIpcEvent, UseSendIpcEventStrict } from "@/Event";
import { Action } from "@/Action";
import type { FSimpleCallback } from "../../../../Shared/Utility";
import { UseIndex } from "@/Utility/Hook";

// const Log: FLogger = GetLogger("Tile");

const UseAnnotatedPanels = (): Readonly<[ Array<FAnnotatedPanel> ]> =>
{
    const { Data: { AnnotatedPanels: AnnotatedPanelsBase } } =
        UseSendIpcEventStrict("GetAnnotatedPanels", undefined, { AnnotatedPanels: [ ] });

    const { Data: { Screenshots } } =
        UseSendIpcEventStrict("GetPanelScreenshots", undefined, { Screenshots: [ ] });

    const AnnotatedPanels: Array<FAnnotatedPanelScreenshot> = useMemo((): Array<FAnnotatedPanelScreenshot> =>
    {
        return AnnotatedPanelsBase.map(
            (AnnotatedPanel: FAnnotatedPanel, Index: number): FAnnotatedPanelScreenshot =>
            {
                const Screenshot: string | undefined = Screenshots?.[Index];
                return {
                    ...AnnotatedPanel,
                    Screenshot
                };
            }
        );
    }, [ AnnotatedPanelsBase, Screenshots ]);

    return [ AnnotatedPanels ] as const;
};

export const Tile = (): ReactElement =>
{
    const [ AnnotatedPanels ] = UseAnnotatedPanels();

    // @TODO Make default option be the root panel of the monitor to which the floating window belongs.
    // const [ MonitorFocusedWindow ] =
    //     UseSendIpcEventStrictSingle("GetMonitorFromFocusedWindow", undefined, { Monitor: { Handle: -1 } });
    // const [ DefaultIndex, SetDefaultIndex ] = useState<number>(0);
    // useEffect((): void =>
    // {
    //     const IndexMonitorPanelFocused: number =
    //         AnnotatedPanels.findIndex((AnnotatedPanel: FAnnotatedPanel): boolean =>
    //         {
    //             return AnnotatedPanel?.MonitorId === MonitorFocusedWindow;
    //         });

    //     if (IndexMonitorPanelFocused !== -1)
    //     {
    //         SetDefaultIndex((_Old: number) =>
    //         {
    //             return IndexMonitorPanelFocused;
    //         });
    //     }
    // }, [ AnnotatedPanels, MonitorFocusedWindow, SetDefaultIndex ]);

    // const [ SelectionIndex, IncrementSelectionIndex, DecrementSelectionIndex ] =
    //     UseIndex(DefaultIndex, 0, AnnotatedPanels.length - 1);
    const [ SelectionIndex, IncrementSelectionIndex, DecrementSelectionIndex ] =
        UseIndex(0, 0, AnnotatedPanels.length - 1);

    // useEffect((): void =>
    // {
    //     Log(`Index is now ${ SelectionIndex }.`);
    // }, [ SelectionIndex ]);

    const ConfirmSelection: FSimpleCallback = useCallback((): void =>
    {
        SendIpcEvent("BringIntoPanel", AnnotatedPanels[SelectionIndex]);
        SendIpcEvent("RequestTearDown", undefined);
    }, [ AnnotatedPanels, SelectionIndex ]);

    const PanelNodes: ReactNode = useMemo((): ReactNode =>
    {
        return AnnotatedPanels.map((AnnotatedPanel: FAnnotatedPanel, Index: number): ReactElement =>
        {
            return (
                <Panel
                    IsSelected={ Index === SelectionIndex }
                    key={ GetPanelKey(AnnotatedPanel) }
                    { ...AnnotatedPanel }
                />
            );
        });
    }, [ AnnotatedPanels, SelectionIndex ]);

    const Commands: Array<FCommand> =
    [
        {
            Description: "@TODO",
            Name: "Change Selection (Up / Down)",
            SubCommands:
            [
                {
                    Action: [ "Direction.Up" ],
                    Callback: DecrementSelectionIndex
                },
                {
                    Action: [ "Direction.Down" ],
                    Callback: IncrementSelectionIndex
                }
            ]
        },
        {
            Action: [ "Primary[0]" ],
            Callback: ConfirmSelection,
            Description: "@TODO",
            Name: "Confirm"
        }
    ];

    return (
        <Action>
            <Title1>
                Bring into Panel
            </Title1>
            <Caption1>
                Select the panel that you wish to insert this window into.
            </Caption1>
            <div style={ {
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            } }>
                <CommandContainer { ...{ Commands } } />
            </div>
            { PanelNodes }
        </Action>
    );
};
