/* File:      Focus.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Action } from "@/Action";
import { Command, CompoundCommand } from "$/Common";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import type { FPanel } from "#/Tree.Types";

type FPanelDirection =
    | "Vertical"
    | "Horizontal";

type FDirection =
    | "Left"
    | "Down"
    | "Up"
    | "Right";

export const Focus = (): ReactNode =>
{
    const [ PanelDirection, SetPanelDirection ] = useState<FPanelDirection | undefined>(undefined);
    useEffect((): void =>
    {
        window.electron.ipcRenderer.On("GetCurrentPanel", (...Arguments: Array<unknown>): void =>
        {
            const Panel: FPanel | undefined = Arguments[0] as FPanel | undefined;
            if (Panel !== undefined)
            {
                SetPanelDirection((_Old: FPanelDirection | undefined): FPanelDirection =>
                {
                    /* @TODO Support stack panels. */
                    return Panel.Type as FPanelDirection;
                });
            }
            else
            {
                // @TODO (This shouldn't happen!)
            }
        });

        window.electron.ipcRenderer.SendMessage("GetCurrentPanel");
    });

    /** @TODO Get whether the current vertex is a panel, and whether the current panel has a parent panel (to allow the "Step" commands to work). */

    const IsHorizontal: boolean = PanelDirection === "Horizontal";

    const MoveFocusPrevious = (): void =>
    {
        return;
    };

    const MoveFocusNext = (): void =>
    {
        return;
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
    };

    const StepUpIntoPanel = (): void =>
    {

    };

    return PanelDirection !== undefined && (
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
