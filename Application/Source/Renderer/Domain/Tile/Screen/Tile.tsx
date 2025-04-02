/* File:      Tile.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Caption1, Title1 } from "@fluentui/react-components";
import { Command, GetPanelKey, Panel } from "$/Common";
import { type ReactElement, useEffect, useState } from "react";
import { Action } from "@/Action";
import { CompoundCommand } from "$/Common";
import type { FAnnotatedPanel } from "#/Tree.Types";
import { Log } from "@/Api";
import { UseIndex } from "@/Utility/Hook";

export const Tile = (): ReactElement =>
{
    const [ AnnotatedPanels, SetAnnotatedPanels ] = useState<Array<FAnnotatedPanel>>([ ]);
    useEffect((): void =>
    {
        window.electron.ipcRenderer.Send("GetAnnotatedPanels");
        window.electron.ipcRenderer.On("GetAnnotatedPanels", (...Arguments: Array<unknown>): void =>
        {
            SetAnnotatedPanels((_Old: Array<FAnnotatedPanel>): Array<FAnnotatedPanel> =>
            {
                return Arguments[0] as Array<FAnnotatedPanel>;
            });
        });

        window.electron.ipcRenderer.Send("GetPanelScreenshots");
        window.electron.ipcRenderer.On("GetPanelScreenshots", (...Arguments: Array<unknown>): void =>
        {
            const Screenshots: Array<string> = Arguments[0] as Array<string>;
            SetAnnotatedPanels((Old: Array<FAnnotatedPanel>): Array<FAnnotatedPanel> =>
            {
                const Out: Array<FAnnotatedPanel> =
                    Old.map((AnnotatedPanel: FAnnotatedPanel, Index: number): FAnnotatedPanel =>
                    {
                        return {
                            ...AnnotatedPanel,
                            Screenshot: Screenshots[Index]
                        };
                    });

                return Out;
            });
        });
    }, [ SetAnnotatedPanels ]);

    const [ SelectionIndex, IncrementSelectionIndex, DecrementSelectionIndex ] =
        UseIndex(0, 0, AnnotatedPanels.length - 1);

    useEffect((): void =>
    {
        Log(`Index is now ${ SelectionIndex }.`);
    }, [ SelectionIndex ]);

    const ConfirmSelection = (): void =>
    {
        window.electron.ipcRenderer.Send("BringIntoPanel", AnnotatedPanels[SelectionIndex]);
        window.electron.ipcRenderer.Send("TearDown");
    };

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
                <CompoundCommand
                    SubCommands={ [
                        {
                            Action: DecrementSelectionIndex,
                            Key: "H"
                        },
                        {
                            Action: IncrementSelectionIndex,
                            Key: "T"
                        }
                    ] }
                    Title="Change Selection (Up / Down)"
                />
                <Command
                    Action={ ConfirmSelection }
                    Key="G"
                    Title="Confirm"
                />
            </div>
            {
                AnnotatedPanels.map((AnnotatedPanel: FAnnotatedPanel, Index: number): ReactElement =>
                {
                    return (
                        <Panel
                            IsSelected={ Index === SelectionIndex }
                            key={ GetPanelKey(AnnotatedPanel) }
                            { ...AnnotatedPanel }
                        />
                    );
                })
            }
        </Action>
    );
};
