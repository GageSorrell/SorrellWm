/* File:      Tile.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Caption1, makeStyles, Title1 } from "@fluentui/react-components";
import { GetPanelKey, Panel } from "$/Common";
import { type ReactElement, useEffect, useState } from "react";
import { Action } from "@/Action";
import { CompoundCommand } from "$/Common";
import type { FAnnotatedPanel } from "#/Tree.Types";
import { UseIndex } from "@/Utility/Hook";

export const Tile = (): ReactElement =>
{
    const [ AnnotatedPanels, SetAnnotatedPanels ] = useState<Array<FAnnotatedPanel>>([ ]);
    useEffect((): void =>
    {
        window.electron.ipcRenderer.sendMessage("GetAnnotatedPanels");
        window.electron.ipcRenderer.on("GetAnnotatedPanels", (...Arguments: Array<unknown>): void =>
        {
            SetAnnotatedPanels((_Old: Array<FAnnotatedPanel>): Array<FAnnotatedPanel> =>
            {
                return Arguments[0] as Array<FAnnotatedPanel>;
            });
        });
    }, [ SetAnnotatedPanels ]);

    const [ SelectionIndex, IncrementSelectionIndex, DecrementSelectionIndex ] = UseIndex();

    return (
        <Action>
            <Title1>
                Bring into Panel
            </Title1>
            <Caption1>
                Select the panel that you wish to insert this window into.
            </Caption1>
            <CompoundCommand
                SubCommands={[
                    {
                        Action: IncrementSelectionIndex,
                        Key: "H"
                    },
                    {
                        Action: () => DecrementSelectionIndex,
                        Key: "T"
                    }
                ]}
                Title="Change Selection (Up / Down)"
            />
            {
                AnnotatedPanels.map((AnnotatedPanel: FAnnotatedPanel): ReactElement =>
                {
                    return <Panel
                        key={ GetPanelKey(AnnotatedPanel) }
                        { ...AnnotatedPanel }
                    />;
                })
            }
        </Action>
    );
};
