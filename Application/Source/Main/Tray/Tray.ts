/**
 * @file      Tray.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FTray } from "./Tray.Types";

let Tray: FTray | undefined = undefined;

export const InitializeTrayValue = (In: FTray): FTray =>
{
    Tray = In;
    return In;
};

export const GetTray = (): FTray =>
{
    /* Since this function will never be called before the `InitializeTray` *
     * side effect is loaded, we can safely cast away `undefined`.          */
    return Tray as FTray;
};
