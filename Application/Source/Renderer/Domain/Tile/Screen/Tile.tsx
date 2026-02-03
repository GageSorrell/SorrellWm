/* File:      Tile.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Caption1, Title1 } from "@fluentui/react-components";
import { Command, GetPanelKey, Panel } from "$/Common";
import type { FAnnotatedPanel, FAnnotatedPanelScreenshot } from "#/Tree/Tree.Types";
import { type ReactElement, useCallback, useEffect, useMemo } from "react";
import { SendIpcEvent, UseSendIpcEventStrict } from "@/Event";
import { Action } from "@/Action";
import { CompoundCommand } from "$/Common";
import type { FLogger } from "?/Log.Types";
import type { FSimpleCallbackAsync } from "?/Utility.Types";
import { GetLogger } from "@/Log";
import type { TGetDefaultRichResponseData } from "?/Event";
import { UseIndex } from "@/Utility/Hook";

const Log: FLogger = GetLogger("Tile");

const UseAnnotatedPanelsBase = (): Readonly<[ Array<FAnnotatedPanel> ]> =>
{
    const DefaultData: TGetDefaultRichResponseData<"GetAnnotatedPanels"> =
    {
        AnnotatedPanels: [ ]
    };

    const { Data: { AnnotatedPanels } } = UseSendIpcEventStrict("GetAnnotatedPanels", undefined, DefaultData);

    return [ AnnotatedPanels ] as const;
};

const UseGetPanelScreenshots = (): Readonly<[ Array<string> ]> =>
{
    const DefaultData: TGetDefaultRichResponseData<"GetPanelScreenshots"> =
    {
        Screenshots: [ ]
    };

    const { Data: { Screenshots } } = UseSendIpcEventStrict("GetPanelScreenshots", undefined, DefaultData);

    return [ Screenshots ] as const;
};

const UseAnnotatedPanels = (): Readonly<[ Array<FAnnotatedPanel> ]> =>
{
    const [ AnnotatedPanelsBase ] = UseAnnotatedPanelsBase();
    const [ Screenshots ] = UseGetPanelScreenshots();

    Log("AnnotatedPanelsBase", AnnotatedPanelsBase);
    Log("Screenshots", Screenshots);

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
    // @TODO Set default selection to be the root panel of the monitor in which the window resides.
    // const [ DefaultIndex, SetDefaultIndex ] = useState<number>(0);
    // useEffect((): void =>
    // {

    // }, [ AnnotatedPanels ]);

    const [ AnnotatedPanels ] = UseAnnotatedPanels();

    Log("AnnotatedPanels are ", AnnotatedPanels);

    const [ SelectionIndex, IncrementSelectionIndex, DecrementSelectionIndex ] =
        UseIndex(0, 0, AnnotatedPanels.length - 1);

    useEffect((): void =>
    {
        Log(`Index is now ${ SelectionIndex }.`);
    }, [ SelectionIndex ]);

    const ConfirmSelection: FSimpleCallbackAsync = useCallback(async (): Promise<void> =>
    {
        SendIpcEvent("BringIntoPanel", AnnotatedPanels[SelectionIndex]);
        SendIpcEvent("RequestTearDown", undefined);
    }, [ AnnotatedPanels, SelectionIndex ]);

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
