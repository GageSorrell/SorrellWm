/* File:      Focus.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Command, CompoundCommand } from "$/Common";
import { type MutableRefObject, type ReactNode, useEffect, useRef, useState } from "react";
import { Action } from "@/Action";
import type { FFocusChange, FPanel } from "#/Tree.Types";

export const Focus = (): ReactNode =>
{
    const [ InterimPanel, SetInterimPanel ] = useState<FPanel | undefined>(undefined);
    useEffect((): void =>
    {
        window.electron.ipcRenderer.On("GetCurrentPanel", (...Arguments: Array<unknown>): void =>
        {
            const Panel: FPanel | undefined = Arguments[0] as FPanel | undefined;
            if (Panel !== undefined)
            {
                SetInterimPanel((_Old: FPanel | undefined): FPanel | undefined =>
                {
                    return Panel;
                });
            }
            else
            {
                // @TODO (This shouldn't happen!)
            }
        });

        window.electron.ipcRenderer.SendMessage("GetCurrentPanel");
    });

    const IsSelectionPristine: MutableRefObject<boolean> = useRef<boolean>(true);

    useEffect((): void =>
    {
        if (IsSelectionPristine.current)
        {
            IsSelectionPristine.current = false;
        }

        window.electron.ipcRenderer.SendMessage("ChangeFocus", );
    }, [ InterimPanel ]);

    /** @TODO Get whether the current vertex is a panel, and whether the current panel has a parent panel (to allow the "Step" commands to work). */

    const IsHorizontal: boolean = PanelDirection === "Horizontal";

    const MoveFocusPrevious = (): void =>
    {
        ChangeFocus("Previous");
    };

    const MoveFocusNext = (): void =>
    {
        ChangeFocus("Next");
    };

    const GetPreviousDirection = (): string =>
    {
        return IsHorizontal
            ? "Left"
            : "Up";
    };

    const GetNextDirection = (): string =>
    {
        return IsHorizontal
            ? "Right"
            : "Down";
    };

    const StepDownIntoPanel = (): void =>
    {
        ChangeFocus("Down");
    };

    const StepUpIntoPanel = (): void =>
    {
        ChangeFocus("Up");
    };

    const ChangeFocus = (FocusChange: FFocusChange): void =>
    {
        window.electron.ipcRenderer.SendMessage("OnChangeFocus", FocusChange);
    };

    return Panel !== undefined && (
        <Action>
            <CompoundCommand
                SubCommands={ [
                    {
                        Action: MoveFocusPrevious,
                        Key: IsHorizontal ? "D" : "H"
                    },
                    {
                        Action: MoveFocusNext,
                        Key: IsHorizontal ? "N" : "T"
                    }
                ] }
                Title={ `Move Focus (${ GetPreviousDirection() } / ${ GetNextDirection() })` }
            />
            <Command
                Action={ StepDownIntoPanel }
                Key="C"
                Title="Step Down into Panel"
            />
            <Command
                Action={ StepUpIntoPanel }
                Key="G"
                Title="Step Up into Panel"
            />
        </Action>
    );
};
