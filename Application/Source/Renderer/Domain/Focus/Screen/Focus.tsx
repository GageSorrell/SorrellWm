/* File:      Focus.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Command, CompoundCommand } from "$/Common";
import { type MutableRefObject, type ReactNode, useEffect, useRef, useState } from "react";
import { Action } from "@/Action";
import type { FFocusChange } from "#/Tree.Types";
import type { FFocusData } from "?/Transaction.Types";

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

        window.electron.ipcRenderer.On("GetFocusData", (...Arguments: Array<unknown>): void =>
        {
            const NewFocusData: FFocusData | undefined = Arguments[0] as FFocusData | undefined;
            if (FocusData === undefined)
            {
                SetFocusData((_Old: FFocusData | undefined): FFocusData | undefined =>
                {
                    return NewFocusData;
                });
            }
            else
            {
                /* @TODO (This shouldn't happen!) */
            }
        });

        window.electron.ipcRenderer.Send("GetFocusData");
    }, [ FocusData, SetFocusData ]);

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
