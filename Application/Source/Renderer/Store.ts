/* File:      Store.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import type { FStoreFunction, GGlobal, GGlobalDefault } from "./Store.Types";
import { type PropsWithChildren, type ReactNode, useEffect, useState } from "react";
import type { FHexColor } from "@sorrellwm/windows";
import { Log } from "./Api";
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

const UseInitializeStore = (): Readonly<[ CanPaint: boolean ]> =>
{
    const { SetThemeColor } = UseStore();
    const [ CanPaint, SetCanPaint ] = useState<boolean>(false);
    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            Log("Trying to get Theme Color");
            Log(Object.keys(window.electron), window.electron === undefined);
            const ThemeColor: FHexColor = await window.electron.GetThemeColor();
            SetThemeColor(ThemeColor);
            /** @TODO When more things are added to this hook, this will likely need to be moved. */
            SetCanPaint(true);
        })();
    }, [ SetCanPaint, SetThemeColor ]);

    return [ CanPaint ] as const;
};

export const StoreProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ CanPaint ] = UseInitializeStore();

    return !CanPaint
        ? undefined
        : children;
};
