/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* AUTO-GENERATED FILE. */

/* eslint-disable */

import { useEffect, useState } from "react";
import { type HWindow,type FHexColor } from "@sorrellwm/windows";

export const UseGetFocusedWindow = (InitialValue: HWindow): Readonly<[ HWindow ]> =>
{
    const [ ReturnValue, SetReturnValue ] = useState<HWindow>(InitialValue);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const Result: HWindow = await window.electron.GetFocusedWindow();
            SetReturnValue((_Old: HWindow): HWindow =>
            {
                return Result;
            });
        })();
    }, [ SetReturnValue, window.electron.GetFocusedWindow,  ]);

    return [ ReturnValue ] as const;
};

export const UseGetIsLightMode = (InitialValue: boolean): Readonly<[ boolean ]> =>
{
    const [ ReturnValue, SetReturnValue ] = useState<boolean>(InitialValue);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const Result: boolean = await window.electron.GetIsLightMode();
            SetReturnValue((_Old: boolean): boolean =>
            {
                return Result;
            });
        })();
    }, [ SetReturnValue, window.electron.GetIsLightMode,  ]);

    return [ ReturnValue ] as const;
};

export const UseGetThemeColor = (InitialValue: FHexColor): Readonly<[ FHexColor ]> =>
{
    const [ ReturnValue, SetReturnValue ] = useState<FHexColor>(InitialValue);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const Result: FHexColor = await window.electron.GetThemeColor();
            SetReturnValue((_Old: FHexColor): FHexColor =>
            {
                return Result;
            });
        })();
    }, [ SetReturnValue, window.electron.GetThemeColor,  ]);

    return [ ReturnValue ] as const;
};
