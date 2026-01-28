/* File:      Focus.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Command, CompoundCommand } from "$/Common";
import { type ReactNode, useEffect } from "react";
import { Action } from "@/Action";
import type { FFocusChange } from "#/Tree.Types";
import { Log } from "@/Api";
import { UseSendIpcEvent } from "@/Event";

export const Focus = (): ReactNode =>
{
    const { Data: FocusData } = UseSendIpcEvent("GetFocusData", undefined);
    // const HasRun: MutableRefObject<boolean> = useRef<boolean>(false);
    // useEffect((): void =>
    // {
    //     if (!HasRun.current)
    //     {
    //         HasRun.current = true;
    //     }
    //     else
    //     {
    //         return;
    //     }

    //     window.electron.ipcRenderer.On("GetFocusData", (...Arguments: Array<unknown>): void =>
    //     {
    //         const NewFocusData: FFocusData | undefined = Arguments[0] as FFocusData | undefined;
    //         if (FocusData === undefined)
    //         {
    //             SetFocusData((_Old: FFocusData | undefined): FFocusData | undefined =>
    //             {
    //                 return NewFocusData;
    //             });
    //         }
    //         else
    //         {
    //             /* @TODO (This shouldn't happen!) */
    //         }
    //     });

    //     window.electron.ipcRenderer.Send("GetFocusData");
    // }, [ FocusData, SetFocusData ]);

    const IsHorizontal: boolean = FocusData !== undefined
        ? FocusData.Direction === "Horizontal"
        : true;

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
        // @TODO Replace with `SendIpcEvent` function.
        window.electron.ipcRenderer.Send("OnChangeFocus", FocusChange);
    };

    useEffect((): void =>
    {
        Log("FocusData is", FocusData);
    }, [ FocusData ]);

    return (
        <Action>
            <p style={{ "fontSize": 16 }}>
                FocusData is { JSON.stringify(FocusData) }
            </p>
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
