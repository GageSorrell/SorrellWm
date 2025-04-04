/* File:      Focus.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Command, CompoundCommand } from "$/Common";
import { type MutableRefObject, type ReactNode, useEffect, useRef, useState } from "react";
import { Action } from "@/Action";
import type { FFocusChange } from "#/Tree.Types";
import { Log } from "@/Api";

export type FFocusData =
{
    Direction: "Horizontal" | "Vertical";
    CanStepUp: boolean;
    CanStepDown: boolean;
};

export const Focus = (): ReactNode =>
{
    const [ FocusData, SetFocusData ] = useState<FFocusData | undefined>(undefined);
    const HasRun: MutableRefObject<boolean> = useRef<boolean>(false);
    useEffect((): void =>
    {
        if (!HasRun.current)
        {
            HasRun.current = true;
        }
        else
        {
            return;
        }

        Log("Logging ogging");
        window.electron.ipcRenderer.On("GetFocusData", (...Arguments: Array<unknown>): void =>
        {
            Log("Received FOCUS DATA");
            const NewFocusData: FFocusData | undefined = Arguments[0] as FFocusData | undefined;
            if (FocusData === undefined)
            {
                Log("SETTING FOCUS DATA");
                SetFocusData((_Old: FFocusData | undefined): FFocusData | undefined =>
                {
                    return NewFocusData;
                });
            }
            else
            {
                // @TODO (This shouldn't happen!)
            }
        });

        window.electron.ipcRenderer.Send("GetFocusData");
    }, [ FocusData, SetFocusData ]);

    // const IsSelectionPristine: MutableRefObject<boolean> = useRef<boolean>(true);

    // useEffect((): void =>
    // {
    //     if (IsSelectionPristine.current)
    //     {
    //         IsSelectionPristine.current = false;
    //     }

    //     window.electron.ipcRenderer.Send("ChangeFocus", );
    // }, [ InterimPanel ]);

    const IsHorizontal: boolean = FocusData?.Direction === "Horizontal";

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
        window.electron.ipcRenderer.Send("OnChangeFocus", FocusChange);
        window.electron.ipcRenderer.Send("OnChangeFocus", FocusChange);
    };

    return FocusData !== undefined && (
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
