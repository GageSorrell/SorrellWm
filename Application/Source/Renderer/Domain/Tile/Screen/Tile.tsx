/* File:      Tile.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Caption1, Title1 } from "@fluentui/react-components";
import { CommandContainer, type FCommand, GetPanelKey, Panel } from "@/Domain/Common";
import { type ReactElement, type ReactNode, useCallback, useMemo } from "react";
import { UseSendIpcEventDeferred, UseSendIpcEventStrict } from "@/Event";
import { Action } from "@/Action";
import type { FAnnotatedPanel } from "../../../../Shared/Tree.Types";
import type { FLogger } from "../../../../Shared/Log.Types";
import type { FSimpleCallback } from "../../../../Shared/Utility";
import { GetLogger } from "@/Log";
import { UseIndex } from "@/Utility/Hook";

const Log: FLogger = GetLogger("Tile");

const UseAnnotatedPanels = (): Readonly<[ TArray<FAnnotatedPanel> ]> =>
{
    const { Data: { AnnotatedPanels: AnnotatedPanelsBase } } =
        UseSendIpcEventStrict("GetAnnotatedPanels", undefined, { AnnotatedPanels: [ ] });

    const { Data: { Screenshots } } =
        UseSendIpcEventStrict("GetPanelScreenshots", undefined, { Screenshots: [ ] });

    const AnnotatedPanels: TArray<FAnnotatedPanel> =
        useMemo((): TArray<FAnnotatedPanel> =>
        {
            return AnnotatedPanelsBase.map(
                (AnnotatedPanel: FAnnotatedPanel, Index: number): FAnnotatedPanel =>
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

    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

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

    const Foo = (): void =>
    {
        Log("Decrementing");
        DecrementSelectionIndex();
    };

    const Bar = (): void =>
    {
        Log("Incrementing");
        IncrementSelectionIndex();
    };

    const ConfirmSelection: FSimpleCallback = useCallback((): void =>
    {
        const Selection: FAnnotatedPanel | undefined = AnnotatedPanels[SelectionIndex];
        if (Selection !== undefined)
        {
            SendIpcEvent("BringIntoPanel", Selection);
            SendIpcEvent("RequestTearDown", undefined);
        }
    }, [ AnnotatedPanels, SelectionIndex, SendIpcEvent ]);

    Log(`AnnotatedPanels.length == ${ AnnotatedPanels.length }, SelectionIndex == ${ SelectionIndex }`);

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

    const Commands: TArray<FCommand> =
    [
        {
            Description: "@TODO",
            Name: "Change Selection (Up / Down)",
            SubCommands:
            [
                {
                    Action: [ "Direction.Up" ],
                    Callback: Foo
                },
                {
                    Action: [ "Direction.Down" ],
                    Callback: Bar
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
