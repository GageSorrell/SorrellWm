/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* AUTO-GENERATED FILE. */

/* eslint-disable */

import { useEffect, useState } from "react";
import { type HWindow,type FBox,type FHexColor } from "@sorrellwm/windows"

const UseGetFocusedWindow = (InitialValue: HWindow): Readonly<[ HWindow ]> =>
{
    const [ ReturnValue, SetReturnValue ] = useState<HWindow>(InitialValue);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const Result: HWindow = await window.electron.GetFocusedWindow();
            SetReturnValue((Old: HWindow): HWindow =>
            {
                return Result;
            });
        })();
    }, [ SetReturnValue, window.electron.GetFocusedWindow,  ]);

    return [ ReturnValue ] as const;
};

const UseSetForegroundWindowNode = (InitialValue: FBox, Handle: HWindow): Readonly<[ FBox ]> =>
{
    const [ ReturnValue, SetReturnValue ] = useState<FBox>(InitialValue);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const Result: FBox = await window.electron.SetForegroundWindow(Handle);
            SetReturnValue((Old: FBox): FBox =>
            {
                return Result;
            });
        })();
    }, [ SetReturnValue, window.electron.SetForegroundWindow, Handle ]);

    return [ ReturnValue ] as const;
};

const UseGetIsLightMode = (InitialValue: boolean): Readonly<[ boolean ]> =>
{
    const [ ReturnValue, SetReturnValue ] = useState<boolean>(InitialValue);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const Result: boolean = await window.electron.GetIsLightMode();
            SetReturnValue((Old: boolean): boolean =>
            {
                return Result;
            });
        })();
    }, [ SetReturnValue, window.electron.GetIsLightMode,  ]);

    return [ ReturnValue ] as const;
};

const UseGetThemeColor = (InitialValue: FHexColor): Readonly<[ FHexColor ]> =>
{
    const [ ReturnValue, SetReturnValue ] = useState<FHexColor>(InitialValue);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const Result: FHexColor = await window.electron.GetThemeColor();
            SetReturnValue((Old: FHexColor): FHexColor =>
            {
                return Result;
            });
        })();
    }, [ SetReturnValue, window.electron.GetThemeColor,  ]);

    return [ ReturnValue ] as const;
};