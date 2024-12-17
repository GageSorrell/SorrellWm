/* File:      Store.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import { useEffect, useState } from "react";
import type { FStoreFunction, GGlobal, GGlobalDefault } from "./Store.Types";
import type { FHexColor } from "Windows";
import { create } from "zustand";

const DefaultStoreValues: GGlobalDefault =
{
    ThemeColor: "#0078D7"
};

/* eslint-disable-next-line @typescript-eslint/typedef */
export const UseStore: FStoreFunction = create<GGlobal>((Set) =>
    ({
        ...DefaultStoreValues,
        SetThemeColor: (Color: FHexColor): void =>
        {
            return Set(() =>
            {
                return {
                    ThemeColor: Color
                };
            });
        }
    }));

export const UseInitializeStore = (): Readonly<[ CanPaint: boolean ]> =>
{
    const { SetThemeColor } = UseStore();
    const [ CanPaint, SetCanPaint ] = useState<boolean>(false);
    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const ThemeColor: FHexColor = await window.electron.GetThemeColor();
            SetThemeColor(ThemeColor);
            /** @TODO When more things are added to this hook, this will likely need to be moved. */
            SetCanPaint(true);
        })();
    }, [ SetCanPaint, SetThemeColor ]);

    return [ CanPaint ] as const;
};
